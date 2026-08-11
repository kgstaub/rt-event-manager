<?php
/**
 * RTI Badge Generator
 *
 * Handles QR code generation and PDF badge creation for attendee badges.
 * Uses endroid/qr-code for QR code generation and DOMPDF for PDF output.
 *
 * @package RT_Event_Manager
 * @since 1.3.0
 */

defined('ABSPATH') || exit;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;
use Dompdf\Dompdf;
use Dompdf\Options;

class RT_Event_Manager_Badge_Generator {

    /**
     * Singleton instance
     *
     * @var RT_Event_Manager_Badge_Generator|null
     */
    private static $instance = null;

    /**
     * DIN A6 width in points (1mm = 2.834645669pt)
     */
    const BADGE_WIDTH_PT = 297.64;

    /**
     * DIN A6 height in points
     */
    const BADGE_HEIGHT_PT = 419.53;

    /**
     * Get singleton instance
     *
     * @return RT_Event_Manager_Badge_Generator
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        add_action('wp_ajax_rti_print_badge', array($this, 'ajax_print_badge'));
    }

    /**
     * Generate QR code image from data string
     *
     * @param string $data The data to encode (qr_code_url field content)
     * @param int    $size Size in pixels
     * @return string|false Base64 encoded PNG data URI or false on failure
     */
    public function generate_qr_code($data, $size = 200) {
        if (empty($data)) {
            return false;
        }

        try {
            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($data)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size($size)
                ->margin(0)
                ->build();

            return 'data:image/png;base64,' . base64_encode($result->getString());

        } catch (Exception $e) {
            error_log('RTI Badge Generator - QR Code Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate badge PDF for a ticket
     *
     * @param int $ticket_id Ticket ID from rti_tickets table
     * @return string|false PDF binary content or false on failure
     */
    public function generate_badge_pdf($ticket_id) {
        global $wpdb;
        $tickets_table = $wpdb->prefix . 'rti_tickets';

        // Get ticket data
        $ticket = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $tickets_table WHERE id = %d",
            $ticket_id
        ), ARRAY_A);

        if (!$ticket) {
            return false;
        }

        // Get order for billing country
        $order = wc_get_order($ticket['order_id']);
        $billing_country = $order ? $order->get_billing_country() : '';

        // Get settings
        $settings = RT_Event_Manager_Badge_Template::get_settings();

        // Build HTML for the badge
        $html = $this->build_badge_html($ticket, $settings, $billing_country);

        // Generate PDF
        try {
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('defaultFont', 'DejaVu Sans'); // Unicode support for checkmarks
            $options->set('chroot', array(
                ABSPATH,
                wp_upload_dir()['basedir'],
            ));

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);

            // DIN A6 size in points
            $dompdf->setPaper(array(0, 0, self::BADGE_WIDTH_PT, self::BADGE_HEIGHT_PT), 'portrait');

            $dompdf->render();

            return $dompdf->output();

        } catch (Exception $e) {
            error_log('RTI Badge Generator - PDF Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Build HTML template for badge
     *
     * @param array  $ticket          Ticket data from database
     * @param array  $settings        Badge template settings
     * @param string $billing_country Billing country code from order
     * @return string HTML content for PDF generation
     */
    private function build_badge_html($ticket, $settings, $billing_country = '') {
        // Background handling
        $background_css = '#ffffff';
        if (!empty($settings['background_image_id'])) {
            $bg_path = get_attached_file($settings['background_image_id']);
            if ($bg_path && file_exists($bg_path)) {
                // Use file path for DOMPDF
                $background_css = "url('" . $bg_path . "') no-repeat center center / cover";
            }
        }

        // Generate QR code if enabled and has data
        $qr_code_base64 = '';
        if (!empty($settings['fields']['qr_code']['enabled']) && !empty($ticket['qr_code_url'])) {
            $qr_size_px = ($settings['fields']['qr_code']['size'] ?? 35) * 8; // Scale for quality
            $qr_code_base64 = $this->generate_qr_code($ticket['qr_code_url'], $qr_size_px);
        }

        // Get family label from the main plugin class (uses ticket's rti_family field)
        $family_label = '';
        if (isset($ticket['rti_family']) && $ticket['rti_family'] !== '') {
            $family_label = RT_Event_Manager::get_family_label(absint($ticket['rti_family']));
        }

        // Get combination display
        $combination_display = $this->get_combination_display($ticket);

        // Start building HTML
        // Use DejaVu Sans font for proper Unicode support (checkmarks, etc.)
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0;
            size: 105mm 148mm;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
            width: 105mm;
            height: 148mm;
            position: relative;
            background: ' . $background_css . ';
            overflow: hidden;
        }
        .badge-field {
            position: absolute;
            white-space: nowrap;
        }
        .align-left { text-align: left; }
        .align-center { text-align: center; transform: translateX(-50%); }
        .align-right { text-align: right; transform: translateX(-100%); }
    </style>
</head>
<body>';

        // Holder Name
        if (!empty($settings['fields']['holder_name']['enabled']) && !empty($ticket['holder_name'])) {
            $html .= $this->render_text_field(
                $ticket['holder_name'],
                $settings['fields']['holder_name']
            );
        }

        // Country (from order billing address)
        if (!empty($settings['fields']['country']['enabled']) && !empty($billing_country)) {
            // Convert country code to full name
            $countries = WC()->countries->get_countries();
            $country_name = isset($countries[$billing_country]) ? $countries[$billing_country] : $billing_country;
            $html .= $this->render_text_field(
                $country_name,
                $settings['fields']['country']
            );
        }

        // RTI Family
        if (!empty($settings['fields']['rti_family']['enabled']) && $family_label) {
            $html .= $this->render_text_field(
                $family_label,
                $settings['fields']['rti_family']
            );
        }

        // Club
        if (!empty($settings['fields']['rti_club']['enabled']) && !empty($ticket['rti_club'])) {
            $html .= $this->render_text_field(
                $ticket['rti_club'],
                $settings['fields']['rti_club']
            );
        }

        // QR Code
        if (!empty($settings['fields']['qr_code']['enabled']) && $qr_code_base64) {
            $qr_settings = $settings['fields']['qr_code'];
            $qr_size = $qr_settings['size'] ?? 35;
            $html .= '<div class="badge-field" style="
                left: ' . esc_attr($qr_settings['x']) . 'mm;
                top: ' . esc_attr($qr_settings['y']) . 'mm;
            ">
                <img src="' . esc_attr($qr_code_base64) . '"
                     style="width: ' . esc_attr($qr_size) . 'mm; height: ' . esc_attr($qr_size) . 'mm;" />
            </div>';
        }

        // Combination
        if (!empty($settings['fields']['combination']['enabled']) && $combination_display) {
            $html .= $this->render_text_field(
                $combination_display,
                $settings['fields']['combination']
            );
        }

        $html .= '</body></html>';

        return $html;
    }

    /**
     * Render a text field as HTML
     *
     * @param string $text Field text content
     * @param array  $field_settings Field position and style settings
     * @return string HTML for the field
     */
    private function render_text_field($text, $field_settings) {
        $alignment = $field_settings['alignment'] ?? 'center';
        $align_class = 'align-' . $alignment;

        $styles = array(
            'left: ' . esc_attr($field_settings['x']) . 'mm',
            'top: ' . esc_attr($field_settings['y']) . 'mm',
            'font-size: ' . esc_attr($field_settings['font_size']) . 'pt',
            'font-weight: ' . esc_attr($field_settings['font_weight'] ?? 'normal'),
        );

        return '<div class="badge-field ' . esc_attr($align_class) . '" style="' . implode('; ', $styles) . '">'
            . esc_html($text)
            . '</div>';
    }

    /**
     * Get combination display string for a ticket
     *
     * Generates the checkmark/dash pattern matching the overview table format.
     * Example output: "FW: ✓ | Fr: ✓ | Sa: ✓ | PT: —"
     *
     * @param array $ticket Ticket data from database
     * @return string Combination display string or empty if no combination
     */
    private function get_combination_display($ticket) {
        if (empty($ticket['combination_id']) || empty($ticket['product_id'])) {
            return '';
        }

        global $wpdb;
        $combo_id = absint($ticket['combination_id']);
        $product_id = absint($ticket['product_id']);

        // Check if MTO tables exist
        $combo_items_table = $wpdb->prefix . 'mto_combination_items';
        $options_table = $wpdb->prefix . 'mto_attribute_options';
        $attrs_table = $wpdb->prefix . 'mto_attributes';

        // Verify tables exist
        $table_exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $combo_items_table));
        if (!$table_exists) {
            return '';
        }

        // Get combination items with attribute info
        $combo_items = $wpdb->get_results($wpdb->prepare(
            "SELECT ci.option_id, ao.attribute_id, ao.name as option_name, a.name as attribute_name
             FROM $combo_items_table ci
             INNER JOIN $options_table ao ON ci.option_id = ao.option_id
             INNER JOIN $attrs_table a ON ao.attribute_id = a.attribute_id
             WHERE ci.combination_id = %d
             ORDER BY a.sort_order ASC, a.attribute_id ASC",
            $combo_id
        ));

        if (empty($combo_items)) {
            return '';
        }

        // Get first option for each attribute (to determine Yes/No)
        // The first option in the list is typically "Yes"
        $first_options = array();
        foreach ($combo_items as $item) {
            $aid = absint($item->attribute_id);
            if (!isset($first_options[$aid])) {
                // Get the first option_id for this attribute
                $first_opt = $wpdb->get_var($wpdb->prepare(
                    "SELECT option_id FROM $options_table
                     WHERE attribute_id = %d
                     ORDER BY sort_order ASC, option_id ASC
                     LIMIT 1",
                    $aid
                ));
                if ($first_opt) {
                    $first_options[$aid] = absint($first_opt);
                }
            }
        }

        // Abbreviation map for common attribute names
        $attr_abbrev_map = array(
            'full weekend'      => 'FW',
            'friday'            => 'Fr',
            'saturday'          => 'Sa',
            'pretour'           => 'PT',
            'pre-tour'          => 'PT',
            'pre tour'          => 'PT',
            'friday + saturday' => 'Fr+Sa',
        );

        // Build display parts
        $parts = array();
        foreach ($combo_items as $item) {
            $aid = absint($item->attribute_id);
            $oid = absint($item->option_id);

            // Get short label
            $label = strtolower(trim($item->attribute_name));
            $short = isset($attr_abbrev_map[$label])
                ? $attr_abbrev_map[$label]
                : mb_substr($item->attribute_name, 0, 2);

            // Check if this is the first option (typically "Yes")
            $is_yes = isset($first_options[$aid]) && $oid === $first_options[$aid];

            $parts[] = $short . ': ' . ($is_yes ? '✓' : '—');
        }

        return implode(' | ', $parts);
    }

    /**
     * AJAX handler for printing a badge
     *
     * Generates and outputs PDF directly to browser for printing/downloading.
     */
    public function ajax_print_badge() {
        // Check nonce
        if (!isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rti_print_badge')) {
            wp_die(__('Security check failed.', 'rt-event-manager'));
        }

        // Check capability
        if (!current_user_can('manage_options')) {
            wp_die(__('Permission denied.', 'rt-event-manager'));
        }

        $ticket_id = isset($_GET['ticket_id']) ? absint($_GET['ticket_id']) : 0;

        if (!$ticket_id) {
            wp_die(__('Invalid ticket ID.', 'rt-event-manager'));
        }

        $pdf = $this->generate_badge_pdf($ticket_id);

        if (!$pdf) {
            wp_die(__('Failed to generate badge PDF.', 'rt-event-manager'));
        }

        // Output PDF
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="badge-' . $ticket_id . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        header('Cache-Control: private, max-age=0, must-revalidate');
        header('Pragma: public');

        echo $pdf;
        exit;
    }
}

// Initialize the badge generator
add_action('init', function() {
    RT_Event_Manager_Badge_Generator::instance();
});
