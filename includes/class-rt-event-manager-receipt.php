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
        $styles = '
            @page { margin: 24mm 18mm; }
            body { font-family: \'DejaVu Sans\', sans-serif; font-size: 12px; color: #222; }
            h1 { font-size: 20px; margin: 0 0 4px; }
            .muted { color: #666; }
            .header { border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 16px; }
            .meta { width: 100%; margin-bottom: 16px; }
            .meta td { vertical-align: top; padding: 2px 0; }
            .meta .label { color: #666; width: 120px; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 8px; }
            table.items th, table.items td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; }
            table.items th { background: #f2f2f2; }
            table.items td.num, table.items th.num { text-align: right; }
            .totals { width: 40%; margin-left: 60%; margin-top: 12px; }
            .totals td { padding: 3px 8px; }
            .totals td.num { text-align: right; }
            .totals tr.grand td { font-weight: bold; border-top: 2px solid #333; }
            .footer { margin-top: 28px; font-size: 10px; color: #888; text-align: center; }
        ';
        return '<!DOCTYPE html><html><head><meta charset="utf-8" /><style>' . $styles . '</style></head><body>' . $body . '</body></html>';
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

        $billing_address = $order->get_formatted_billing_address();
        if (!$billing_address) {
            $billing_address = '&mdash;';
        }

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
                    <?php foreach ($order->get_items() as $item) : ?>
                        <tr>
                            <td><?php echo esc_html($item->get_name()); ?></td>
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

            <div class="footer">
                <?php echo esc_html(sprintf(__('Generated on %s', 'rt-event-manager'), wc_format_datetime(new WC_DateTime()))); ?>
            </div>
        <?php
        return ob_get_clean();
    }
}
