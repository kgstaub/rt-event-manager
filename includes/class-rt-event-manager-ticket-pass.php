<?php
/**
 * RT Event Manager — Ticket pass (QR check-in ticket).
 *
 * Generates a per-attendee PDF ticket carrying a signed check-in QR code
 * (encoding the holder name, order id and ticket number), the ticket details,
 * any attached pretours / day tours, and — for Future members — their guardian.
 *
 * True Apple Wallet (.pkpass) and Google Wallet passes require the
 * organisation's signing credentials (an Apple Pass Type ID certificate and a
 * Google Wallet service account) and are added once those are configured.
 */

if (!defined('ABSPATH')) {
    exit;
}

use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;

class RT_Event_Manager_Ticket_Pass {

    /** @var RT_Event_Manager_Ticket_Pass|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_ajax_rt_event_manager_ticket_pass', array($this, 'ajax_pass'));
    }

    /**
     * Signed check-in payload encoded in the QR code. Built from the holder
     * name, order id and ticket number, with an HMAC so a future check-in
     * scanner can verify the ticket was issued by this site.
     *
     * @param array $ticket Ticket row (ARRAY_A).
     * @return string
     */
    public static function checkin_token($ticket) {
        $order = absint($ticket['order_id']);
        $num   = absint($ticket['ticket_index']) + 1;
        $name  = isset($ticket['holder_name']) ? (string) $ticket['holder_name'] : '';
        $base  = $order . '|' . $num . '|' . $name;
        $sig   = substr(hash_hmac('sha256', $base, wp_salt('auth')), 0, 16);
        return 'RTIHYM|order:' . $order . '|ticket:' . $num . '|name:' . rawurlencode($name) . '|sig:' . $sig;
    }

    /** Verify a scanned check-in token (for the future check-in tool). */
    public static function verify_checkin_token($token) {
        if (!preg_match('/^RTIHYM\|order:(\d+)\|ticket:(\d+)\|name:([^|]*)\|sig:([a-f0-9]{16})$/', (string) $token, $m)) {
            return false;
        }
        $name = rawurldecode($m[3]);
        $base = $m[1] . '|' . $m[2] . '|' . $name;
        $sig  = substr(hash_hmac('sha256', $base, wp_salt('auth')), 0, 16);
        if (!hash_equals($sig, $m[4])) {
            return false;
        }
        return array('order_id' => (int) $m[1], 'ticket_number' => (int) $m[2], 'name' => $name);
    }

    /** Stream the ticket PDF for one of the current user's tickets. */
    public function ajax_pass() {
        if (!is_user_logged_in()) {
            wp_die(esc_html__('You must be logged in.', 'rt-event-manager'));
        }
        $ticket_id = isset($_GET['ticket_id']) ? absint($_GET['ticket_id']) : 0;
        if (!$ticket_id || !isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rt_event_manager_ticket_pass_' . $ticket_id)) {
            wp_die(esc_html__('Invalid request.', 'rt-event-manager'));
        }
        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        if (!$ticket || !RT_Event_Manager_Account::instance()->user_owns_ticket($ticket, get_current_user_id())) {
            wp_die(esc_html__('Ticket not found.', 'rt-event-manager'));
        }

        $pdf = $this->build_pdf($ticket);
        if (false === $pdf) {
            wp_die(esc_html__('Could not generate the ticket.', 'rt-event-manager'));
        }

        $ref = 'ticket-' . absint($ticket['order_id']) . '-' . (absint($ticket['ticket_index']) + 1);
        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . sanitize_file_name($ref) . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf; // phpcs:ignore
        exit;
    }

    /** Build a QR code PNG as a data: URI, or '' on failure. */
    private function qr_data_uri($data, $size = 320) {
        try {
            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($data)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size($size)
                ->margin(4)
                ->build();
            return 'data:image/png;base64,' . base64_encode($result->getString());
        } catch (\Exception $e) {
            error_log('RT Event Manager ticket QR failed: ' . $e->getMessage());
            return '';
        }
    }

    /**
     * Build the ticket PDF (QR + details + tours + guardian).
     *
     * @param array $ticket Ticket row.
     * @return string|false PDF bytes or false on failure.
     */
    private function build_pdf($ticket) {
        $ticket_id = absint($ticket['id']);
        $kind      = RT_Event_Manager::get_ticket_kind($ticket);
        $product   = wc_get_product($ticket['product_id']);
        $pname     = $product ? $product->get_name() : RT_Event_Manager::ticket_kind_label($ticket);
        $holder    = ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : __('Unassigned', 'rt-event-manager');
        $number    = absint($ticket['ticket_index']) + 1;
        $status    = isset($ticket['status']) ? $ticket['status'] : 'draft';

        // QR code with the signed check-in token.
        $qr_img = $this->qr_data_uri(self::checkin_token($ticket), 360);

        // Attached tours (event / minor host tickets carry these).
        $pretours = RT_Event_Manager::get_child_pretours($ticket_id);
        $daytours = RT_Event_Manager::get_child_daytours($ticket_id);

        // Guardian, for Future members.
        $guardian = '';
        if ('minor' === $kind) {
            $parent = absint($ticket['parent_ticket_id']);
            if ($parent) {
                $prow = RT_Event_Manager::get_ticket_by_id($parent);
                if ($prow) {
                    $guardian = ('' !== $prow['holder_name']) ? $prow['holder_name'] : ('#' . $parent);
                }
            }
        }

        $event_from = (string) get_option('rt_event_manager_event_start', '');
        $event_to   = (string) get_option('rt_event_manager_event_end', '');
        $event_dates = '';
        if ('' !== $event_from) {
            $event_dates = date_i18n('d.m.Y', strtotime($event_from));
            if ('' !== $event_to) {
                $event_dates .= ' – ' . date_i18n('d.m.Y', strtotime($event_to));
            }
        }

        $status_labels = array(
            'valid'      => __('Confirmed', 'rt-event-manager'),
            'draft'      => __('Pending Confirmation', 'rt-event-manager'),
            'invalid'    => __('Invalid', 'rt-event-manager'),
            'checked_in' => __('Checked In', 'rt-event-manager'),
            'cancelled'  => __('Cancelled', 'rt-event-manager'),
            'refunded'   => __('Refunded', 'rt-event-manager'),
        );
        $status_label = isset($status_labels[$status]) ? $status_labels[$status] : ucfirst($status);

        $tour_row = function ($rows, $label) {
            if (empty($rows)) {
                return '';
            }
            $names = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $names[] = $p ? $p->get_name() : ('#' . absint($r['product_id']));
            }
            return '<tr><td class="lbl">' . esc_html($label) . '</td><td>' . esc_html(implode(', ', $names)) . '</td></tr>';
        };

        ob_start();
        ?>
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" />
        <style>
            @page { margin: 14mm; }
            body { font-family: 'DejaVu Sans', sans-serif; font-size: 11pt; color: #1a1a1a; }
            .card { border: 2px solid #CC0B24; border-radius: 8px; padding: 18px 20px; }
            h1 { font-size: 17pt; color: #CC0B24; margin: 0 0 2px; }
            .sub { color: #555; margin: 0 0 14px; font-size: 10pt; }
            .row { width: 100%; }
            .row td { vertical-align: top; }
            .qr { text-align: center; width: 190px; }
            .qr img { width: 170px; height: 170px; }
            .qr .hint { font-size: 8pt; color: #777; margin-top: 4px; }
            .qrwrap { position: relative; display: inline-block; width: 170px; height: 170px; }
            .qrbadges { position: absolute; top: -7px; right: -7px; width: 90px; text-align: right; }
            .qrbadge { display: block; margin: 0 0 3px auto; padding: 2px 8px; border-radius: 8px; font-size: 7.5pt; font-weight: bold; color: #fff; }
            .qrbadge--pt { background: #1f6feb; }
            .qrbadge--dt { background: #d97706; }
            table.details { width: 100%; border-collapse: collapse; margin: 0; }
            table.details td { padding: 4px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
            table.details td.lbl { width: 130px; color: #555; }
            h3 { font-size: 11pt; margin: 16px 0 4px; color: #CC0B24; }
            .status { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 9pt; font-weight: bold; color: #fff; background: #1a8a34; }
        </style></head><body>
            <div class="card">
                <h1><?php echo esc_html__('Round Table International — Half-Year Meeting 2027', 'rt-event-manager'); ?></h1>
                <p class="sub"><?php echo esc_html($pname); echo $event_dates ? ' · ' . esc_html($event_dates) : ''; ?></p>
                <table class="row"><tr>
                    <td>
                        <table class="details">
                            <tr><td class="lbl"><?php esc_html_e('Attendee', 'rt-event-manager'); ?></td><td><strong><?php echo esc_html($holder); ?></strong></td></tr>
                            <tr><td class="lbl"><?php esc_html_e('Ticket type', 'rt-event-manager'); ?></td><td><?php echo esc_html(RT_Event_Manager::ticket_kind_label($ticket)); ?></td></tr>
                            <tr><td class="lbl"><?php esc_html_e('Order / ticket', 'rt-event-manager'); ?></td><td>#<?php echo esc_html(absint($ticket['order_id'])); ?> · <?php echo esc_html($number); ?></td></tr>
                            <?php if ('' !== $guardian) : ?>
                            <tr><td class="lbl"><?php esc_html_e('Guardian', 'rt-event-manager'); ?></td><td><?php echo esc_html($guardian); ?></td></tr>
                            <?php endif; ?>
                            <tr><td class="lbl"><?php esc_html_e('Status', 'rt-event-manager'); ?></td><td><span class="status"><?php echo esc_html($status_label); ?></span></td></tr>
                            <?php echo $tour_row($pretours, __('Pretours', 'rt-event-manager')); // phpcs:ignore ?>
                            <?php echo $tour_row($daytours, __('Day tours', 'rt-event-manager')); // phpcs:ignore ?>
                        </table>
                    </td>
                    <td class="qr">
                        <div class="qrwrap">
                            <?php if ($qr_img) : ?><img src="<?php echo esc_attr($qr_img); ?>" alt="QR" /><?php endif; ?>
                            <?php if (!empty($pretours) || !empty($daytours)) : ?>
                            <div class="qrbadges">
                                <?php if (!empty($pretours)) : ?><span class="qrbadge qrbadge--pt"><?php esc_html_e('Pretour', 'rt-event-manager'); ?></span><?php endif; ?>
                                <?php if (!empty($daytours)) : ?><span class="qrbadge qrbadge--dt"><?php esc_html_e('Day tour', 'rt-event-manager'); ?></span><?php endif; ?>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="hint"><?php esc_html_e('Present this code at check-in', 'rt-event-manager'); ?></div>
                    </td>
                </tr></table>
            </div>
        </body></html>
        <?php
        $html = ob_get_clean();

        try {
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('defaultFont', 'DejaVu Sans');
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            return $dompdf->output();
        } catch (\Exception $e) {
            error_log('RT Event Manager ticket pass failed: ' . $e->getMessage());
            return false;
        }
    }
}
