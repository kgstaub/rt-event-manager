<?php
/**
 * PDF receipt / invoice generator for customer orders.
 *
 * Mirrors the DOMPDF approach used by the badge generator
 * (class-rt-event-manager-badge-generator.php): build an HTML string, render it
 * with DOMPDF and return the raw bytes via output() so the caller controls the
 * HTTP headers. Ownership/nonce checks live in the AJAX handler that calls this
 * (RT_Event_Manager_Account::ajax_receipt()).
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

use Dompdf\Dompdf;
use Dompdf\Options;

class RT_Event_Manager_Receipt {

    /** @var RT_Event_Manager_Receipt|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Generate a receipt PDF for an order.
     *
     * @param int $order_id
     * @return string|false Raw PDF bytes, or false on failure.
     */
    public function generate_receipt_pdf($order_id, $doc_type = 'receipt') {
        $order = wc_get_order($order_id);
        if (!$order) {
            return false;
        }
        $doc_type = ('invoice' === $doc_type) ? 'invoice' : 'receipt';
        return $this->render_pdf($this->wrap_html($this->build_body($order, $doc_type)));
    }

    /**
     * Combined PDF for several orders — one order per page.
     *
     * @param int[]       $order_ids
     * @param string|null $doc_type  Force a type, or null to pick per order
     *                               (receipt when paid, invoice otherwise).
     * @return string|false PDF bytes or false.
     */
    public function generate_combined_pdf($order_ids, $doc_type = null) {
        $bodies = array();
        foreach ((array) $order_ids as $oid) {
            $order = wc_get_order(absint($oid));
            if (!$order) {
                continue;
            }
            $dt = $doc_type ? $doc_type : ($order->is_paid() ? 'receipt' : 'invoice');
            $bodies[] = $this->build_body($order, $dt);
        }
        if (empty($bodies)) {
            return false;
        }
        $html = $this->wrap_html(implode('<div style="page-break-before: always;"></div>', $bodies));
        return $this->render_pdf($html);
    }

    /** Human date range (compact when start/end share a day). */
    private function fmt_range($start, $end) {
        $s = $start ? strtotime($start) : 0;
        $e = $end ? strtotime($end) : 0;
        if ($s && $e) {
            if (date('Y-m-d', $s) === date('Y-m-d', $e)) {
                return date_i18n('j M Y', $s);
            }
            return date_i18n('j M Y', $s) . ' – ' . date_i18n('j M Y', $e);
        }
        $ts = $s ? $s : $e;
        return $ts ? date_i18n('j M Y', $ts) : '';
    }

    /** Render an HTML string to A4 PDF bytes via DomPDF. */
    private function render_pdf($html) {
        if (!class_exists('Dompdf\\Dompdf')) {
            return false;
        }
        try {
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('defaultFont', 'DejaVu Sans');
            $options->set('chroot', array(ABSPATH, wp_upload_dir()['basedir']));

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return $dompdf->output();
        } catch (\Exception $e) {
            error_log('RT Event Manager receipt generation failed: ' . $e->getMessage());
            return false;
        }
    }

    /** Wrap body content in the document shell (doctype, head, styles). */
    private function wrap_html($body) {
        // Optional full-page A4 letterhead background (shared visa/receipt setting).
        $bg_html = '';
        $bg_img  = absint(get_option('rt_event_manager_receipt_bg_img', 0));
        if ($bg_img) {
            $bg_path = get_attached_file($bg_img);
            if ($bg_path && file_exists($bg_path)) {
                // position:fixed repeats on every page; the negative offsets cancel
                // the @page margins so the letterhead bleeds full A4 edge-to-edge.
                $bg_html = '<div style="position:fixed;top:-45mm;left:-30mm;width:210mm;height:297mm;z-index:0;"><img src="' . esc_attr($bg_path) . '" style="width:210mm;height:297mm;" /></div>';
            }
        }

        // Fixed footer in the lower page margin (shop address + generated date),
        // repeated on every page like the letterhead.
        $shop_address = '';
        if (function_exists('WC') && WC()->countries) {
            $c     = WC()->countries;
            $ccode = $c->get_base_country();
            $parts = array_filter(array(
                get_bloginfo('name'),
                $c->get_base_address(),
                $c->get_base_address_2(),
                trim($c->get_base_postcode() . ' ' . $c->get_base_city()),
                isset($c->countries[$ccode]) ? $c->countries[$ccode] : $ccode,
            ));
            if ($parts) {
                $shop_address = implode(' · ', $parts);
            }
        }
        $footer_html = '<div class="rti-doc-footer">';
        if ('' !== $shop_address) {
            $footer_html .= '<div class="footer-address">' . esc_html($shop_address) . '</div>';
        }
        $footer_html .= esc_html(sprintf(__('Generated on %s', 'rt-event-manager'), wc_format_datetime(new WC_DateTime())));
        $footer_html .= '</div>';

        $styles = '
            @page { margin: 45mm 15mm 20mm 30mm; }
            body { font-family: \'DejaVu Sans\', sans-serif; font-size: 12px; color: #222; }
            .rti-doc-body { position: relative; z-index: 1; }
            h1 { font-size: 20px; margin: 0 0 4px; }
            .muted { color: #666; }
            .header { border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 16px; }
            .meta { width: 100%; margin-bottom: 16px; }
            .meta td { vertical-align: top; padding: 2px 0; }
            .meta .label { color: #666; width: 120px; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 8px; }
            table.items th, table.items td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
            table.items th { background: #f2f2f2; }
            table.items .item-dates { font-size: 10px; color: #666; margin-top: 2px; }
            table.items .item-tickets { margin-top: 3px; font-size: 10px; color: #666; }
            table.items .item-ticket-link { color: #888; }
            table.items td.num, table.items th.num { text-align: right; }
            .totals { width: 40%; margin-left: 60%; margin-top: 12px; }
            .totals td { padding: 3px 8px; }
            .totals td.num { text-align: right; }
            .totals tr.grand td { font-weight: bold; border-top: 2px solid #333; }
            .rti-doc-footer { position: fixed; left: -30mm; right: -15mm; bottom: -12mm; text-align: center; font-size: 10px; color: #888; z-index: 1; }
            .rti-doc-footer .footer-address { margin-bottom: 4px; }
        ';
        return '<!DOCTYPE html><html><head><meta charset="utf-8" /><style>' . $styles . '</style></head><body>' . $bg_html . $footer_html . '<div class="rti-doc-body">' . $body . '</div></body></html>';
    }

    /**
     * Build the inner receipt/invoice body for one order.
     *
     * @param WC_Order $order
     * @param string   $doc_type
     * @return string
     */
    private function build_body($order, $doc_type = 'receipt') {
        $is_invoice = ('invoice' === $doc_type);
        $doc_title  = $is_invoice ? __('Order Invoice', 'rt-event-manager') : __('Order Receipt', 'rt-event-manager');
        $doc_for    = $is_invoice ? __('Invoice for order', 'rt-event-manager') : __('Receipt for order', 'rt-event-manager');
        $store_name = get_bloginfo('name');
        $order_no   = $order->get_order_number();
        $date       = wc_format_datetime($order->get_date_created());
        $status     = wc_get_order_status_name($order->get_status());
        $payment    = $order->get_payment_method_title();

        // Billed-to: Name / Family Club, then the postal address. Function/role
        // is intentionally omitted (it was duplicated by the formatted address).
        $name    = trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name());
        $family  = class_exists('RT_Event_Manager') ? RT_Event_Manager::get_family_label($order->get_meta('_rti_family')) : '';
        $club    = (string) $order->get_meta('_rti_club');
        $famclub = trim($family . ' ' . $club);

        $country = '';
        if (function_exists('WC') && WC()->countries) {
            $cc = $order->get_billing_country();
            $country = isset(WC()->countries->countries[$cc]) ? WC()->countries->countries[$cc] : $cc;
        }

        $group_id   = array_filter(array($name, $famclub));
        $group_addr = array_filter(array(
            $order->get_billing_address_1(),
            $order->get_billing_address_2(),
            trim($order->get_billing_postcode() . ' ' . $order->get_billing_city()),
            $country,
        ));
        $billing_address = implode('<br>', array_map('esc_html', $group_id));
        if ($group_id && $group_addr) {
            $billing_address .= '<br><br>';
        }
        $billing_address .= implode('<br>', array_map('esc_html', $group_addr));
        if ('' === $billing_address) {
            $billing_address = '&mdash;';
        }

        // Tickets on this order, to list the holder + number under each line item.
        $order_tickets = class_exists('RT_Event_Manager') ? RT_Event_Manager::get_tickets_for_order($order->get_id()) : array();
        $used_tickets  = array();

        ob_start();
        ?>
            <div class="header">
                <h1><?php echo esc_html($store_name); ?></h1>
                <div class="muted"><?php echo esc_html($doc_title); ?></div>
            </div>

            <table class="meta">
                <tr>
                    <td class="label"><?php echo esc_html($doc_for); ?></td>
                    <td>#<?php echo esc_html($order_no); ?></td>
                    <td class="label"><?php echo esc_html__('Date', 'rt-event-manager'); ?></td>
                    <td><?php echo esc_html($date); ?></td>
                </tr>
                <tr>
                    <td class="label"><?php echo esc_html__('Status', 'rt-event-manager'); ?></td>
                    <td><?php echo esc_html($status); ?></td>
                    <td class="label"><?php echo esc_html__('Payment', 'rt-event-manager'); ?></td>
                    <td><?php echo esc_html($payment ?: '—'); ?></td>
                </tr>
                <tr>
                    <td class="label"><?php echo esc_html__('Billed to', 'rt-event-manager'); ?></td>
                    <td colspan="3"><?php echo wp_kses_post($billing_address); ?></td>
                </tr>
            </table>

            <table class="items">
                <thead>
                    <tr>
                        <th><?php echo esc_html__('Item', 'rt-event-manager'); ?></th>
                        <th class="num"><?php echo esc_html__('Qty', 'rt-event-manager'); ?></th>
                        <th class="num"><?php echo esc_html__('Total', 'rt-event-manager'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($order->get_items() as $item) :
                        $pid = absint($item->get_product_id());
                        $qty = (int) $item->get_quantity();
                        $tk_lines = array();
                        $item_is_event = false;
                        foreach ($order_tickets as $t) {
                            if (in_array($t['id'], $used_tickets, true) || absint($t['product_id']) !== $pid) {
                                continue;
                            }
                            $num    = '#' . absint($t['order_id']) . ' · ' . (absint($t['ticket_index']) + 1);
                            $holder = ('' !== $t['holder_name']) ? $t['holder_name'] : __('Unassigned', 'rt-event-manager');
                            $line   = esc_html($num . ' — ' . $holder);
                            // Pretours / day tours: also show the event ticket they
                            // are linked to (may be from a different order).
                            $kind = class_exists('RT_Event_Manager') ? RT_Event_Manager::get_ticket_kind($t) : '';
                            if (in_array($kind, array('event', 'minor'), true)) {
                                $item_is_event = true;
                            }
                            $ppid = absint($t['parent_ticket_id']);
                            if ($ppid && in_array($kind, array('pretour', 'daytour'), true)) {
                                $p = RT_Event_Manager::get_ticket_by_id($ppid);
                                if ($p) {
                                    $pnum  = '#' . absint($p['order_id']) . ' · ' . (absint($p['ticket_index']) + 1);
                                    $line .= ' <span class="item-ticket-link">' . esc_html(sprintf(__('→ Event ticket %s', 'rt-event-manager'), $pnum)) . '</span>';
                                }
                            }
                            $tk_lines[]     = $line;
                            $used_tickets[] = $t['id'];
                            if (count($tk_lines) >= $qty) {
                                break;
                            }
                        }
                        // Start / end date of the ticket (event options for the
                        // main ticket; product meta for tours).
                        $d_start = get_post_meta($pid, '_rti_start', true);
                        $d_end   = get_post_meta($pid, '_rti_end', true);
                        if ('' === $d_start && $item_is_event) {
                            $d_start = get_option('rt_event_manager_event_start', '');
                            $d_end   = get_option('rt_event_manager_event_end', '');
                        }
                        $date_range = $this->fmt_range($d_start, $d_end);
                    ?>
                        <tr>
                            <td>
                                <?php echo esc_html($item->get_name()); ?>
                                <?php if ('' !== $date_range) : ?>
                                    <div class="item-dates"><?php echo esc_html($date_range); ?></div>
                                <?php endif; ?>
                                <?php if (!empty($tk_lines)) : ?>
                                    <div class="item-tickets">
                                        <?php foreach ($tk_lines as $l) : ?>
                                            <div><?php echo wp_kses_post($l); ?></div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </td>
                            <td class="num"><?php echo esc_html($item->get_quantity()); ?></td>
                            <td class="num"><?php echo wp_kses_post(wc_price($item->get_total(), array('currency' => $order->get_currency()))); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <table class="totals">
                <?php foreach ($order->get_order_item_totals() as $key => $total) : ?>
                    <tr class="<?php echo ('order_total' === $key) ? 'grand' : ''; ?>">
                        <td><?php echo esc_html($total['label']); ?></td>
                        <td class="num"><?php echo wp_kses_post($total['value']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>

        <?php
        return ob_get_clean();
    }
}
