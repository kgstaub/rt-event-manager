<?php
/**
 * RT Event Manager — Visa Letter of Invitation.
 *
 * Generates a per-event-ticket German "Einladungsschreiben" (letter of
 * invitation) as an A4 PDF. Applicant PII (date of birth, nationality, address)
 * and the generated PDF are stored AES-256 encrypted in a dedicated,
 * append-only table (letters can never be deleted).
 *
 * The letter body is authored in the backend as HTML with {variables}. A real
 * .docx → PDF conversion is intentionally not attempted (it requires LibreOffice
 * on the server); DomPDF renders the HTML template to PDF.
 */

if (!defined('ABSPATH')) {
    exit;
}

use Dompdf\Dompdf;
use Dompdf\Options;

class RT_Event_Manager_Visa {

    /** @var RT_Event_Manager_Visa|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'), 20);
        add_action('wp_ajax_rt_event_manager_generate_visa', array($this, 'ajax_generate'));
        add_action('wp_ajax_rt_event_manager_visa_pdf', array($this, 'ajax_download'));
        // Ensure the storage table exists.
        add_action('init', array($this, 'maybe_install_table'));
    }

    /* ---------------------------------------------------------------------
     * Storage table (append-only; no delete path is ever provided)
     * ------------------------------------------------------------------- */

    public static function table() {
        global $wpdb;
        return $wpdb->prefix . 'rti_visa_letters';
    }

    public function maybe_install_table() {
        global $wpdb;
        $table = self::table();
        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table) {
            return;
        }
        $charset = $wpdb->get_charset_collate();
        // Not using dbDelta on every load — a plain guarded CREATE is enough.
        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS $table (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                ticket_id bigint(20) unsigned NOT NULL DEFAULT 0,
                order_id bigint(20) unsigned NOT NULL DEFAULT 0,
                user_id bigint(20) unsigned NOT NULL DEFAULT 0,
                reference varchar(40) NOT NULL DEFAULT '',
                applicant_enc longtext NULL,
                pdf_enc longtext NULL,
                eu_efta tinyint(1) NOT NULL DEFAULT 0,
                created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                KEY ticket_id (ticket_id),
                KEY user_id (user_id)
            ) $charset;"
        );
    }

    /* ---------------------------------------------------------------------
     * Encryption (AES-256-CBC)
     * ------------------------------------------------------------------- */

    private static function key() {
        if (defined('RT_VISA_ENC_KEY') && RT_VISA_ENC_KEY) {
            return hash('sha256', (string) RT_VISA_ENC_KEY, true);
        }
        // Fall back to a site-specific secret derived from the WordPress salts.
        return hash('sha256', wp_salt('secure_auth') . '|rt-event-visa', true);
    }

    public static function encrypt($plaintext) {
        $plaintext = (string) $plaintext;
        if ('' === $plaintext || !function_exists('openssl_encrypt')) {
            return $plaintext;
        }
        $iv = openssl_random_pseudo_bytes(16);
        $ct = openssl_encrypt($plaintext, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv);
        if (false === $ct) {
            return '';
        }
        return base64_encode($iv . $ct);
    }

    public static function decrypt($b64) {
        $b64 = (string) $b64;
        if ('' === $b64 || !function_exists('openssl_decrypt')) {
            return $b64;
        }
        $raw = base64_decode($b64, true);
        if (false === $raw || strlen($raw) < 17) {
            return '';
        }
        $iv = substr($raw, 0, 16);
        $ct = substr($raw, 16);
        $pt = openssl_decrypt($ct, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv);
        return (false === $pt) ? '' : $pt;
    }

    /* ---------------------------------------------------------------------
     * Countries & EU/EFTA
     * ------------------------------------------------------------------- */

    /** ISO-3166 alpha-2 codes for EU + EFTA states (no visa letter needed). */
    public static function eu_efta_codes() {
        return array(
            // EU-27
            'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
            'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
            'SI', 'ES', 'SE',
            // EFTA
            'CH', 'IS', 'LI', 'NO',
        );
    }

    public static function is_eu_efta($code) {
        return in_array(strtoupper((string) $code), self::eu_efta_codes(), true);
    }

    /** Accompanying-child letters are only for children younger than this age. */
    public static function child_letter_max_age() {
        return (int) apply_filters('rt_event_manager_child_letter_max_age', 6);
    }

    /** ISO2 => country name, from WooCommerce. */
    private function country_options() {
        if (function_exists('WC') && WC() && WC()->countries) {
            return WC()->countries->get_countries();
        }
        return array();
    }

    private function country_name($code) {
        $all = $this->country_options();
        $code = strtoupper((string) $code);
        return isset($all[$code]) ? $all[$code] : $code;
    }

    private function country_select($name, $selected, $classes = 'uk-select') {
        $out = '<select name="' . esc_attr($name) . '" class="' . esc_attr($classes) . '" required>';
        $out .= '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
        foreach ($this->country_options() as $code => $label) {
            $out .= '<option value="' . esc_attr($code) . '" ' . selected($selected, $code, false) . '>' . esc_html($label) . '</option>';
        }
        $out .= '</select>';
        return $out;
    }

    /* ---------------------------------------------------------------------
     * Settings (host, stay, template, signatories) — options
     * ------------------------------------------------------------------- */

    public static function get_option($key, $default = '') {
        return get_option('rt_event_manager_visa_' . $key, $default);
    }

    public static function default_template() {
        return '<p>Sehr geehrte Damen und Herren</p>'
            . '<p>Hiermit bestätigen wir, {host_name}, dass wir die untenstehende Person zum Anlass in der Schweiz erwarten.</p>'
            . '<h4>Gastgeber</h4>'
            . '<table class="details">'
            . '<tr><td class="lbl">Name</td><td>{host_name}</td></tr>'
            . '<tr><td class="lbl">Adresse</td><td>{host_address}</td></tr>'
            . '<tr><td class="lbl">Telefon</td><td>{host_phone}</td></tr>'
            . '<tr><td class="lbl">E-Mail</td><td>{host_email}</td></tr>'
            . '<tr><td class="lbl">Staatsangehörigkeit</td><td>{host_nationality}</td></tr>'
            . '</table>'
            . '<h4>Antragsteller / Gast</h4>'
            . '<table class="details">'
            . '<tr><td class="lbl">Name</td><td>{applicant_name}</td></tr>'
            . '<tr><td class="lbl">Geburtsdatum</td><td>{applicant_dob}</td></tr>'
            . '<tr><td class="lbl">Staatsangehörigkeit</td><td>{applicant_nationality}</td></tr>'
            . '<tr><td class="lbl">Adresse</td><td>{applicant_address}</td></tr>'
            . '{applicant_contact}'
            . '</table>'
            . '{guardian_note}'
            . '<p>Zeitraum des Aufenthalts: {stay_from} bis {stay_to}.</p>'
            . '<p>Wir freuen uns auf den Besuch. Für Rückfragen stehen wir gerne zur Verfügung.</p>'
            . '<p>Ausstellungsdatum: {issue_date}</p>';
    }

    /* ---------------------------------------------------------------------
     * Admin menu: Visa Settings + Visa Letters
     * ------------------------------------------------------------------- */

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Visa Settings', 'rt-event-manager'),
            __('Visa Settings', 'rt-event-manager'),
            'manage_options',
            'rt-event-manager-visa-settings',
            array($this, 'render_settings_page')
        );
        add_submenu_page(
            'rt-event-manager',
            __('Visa Letters', 'rt-event-manager'),
            __('Visa Letters', 'rt-event-manager'),
            'edit_shop_orders',
            'rt-event-manager-visa-letters',
            array($this, 'render_letters_page')
        );
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }

        if (isset($_POST['rt_visa_settings_nonce']) && wp_verify_nonce($_POST['rt_visa_settings_nonce'], 'rt_visa_settings')) {
            $text_fields = array('host_type', 'host_name', 'host_first_name', 'host_dob', 'host_phone', 'host_email', 'host_nationality', 'stay_from', 'stay_to', 'sig1_name', 'sig2_name');
            foreach ($text_fields as $f) {
                update_option('rt_event_manager_visa_' . $f, sanitize_text_field(wp_unslash($_POST['visa_' . $f] ?? '')));
            }
            update_option('rt_event_manager_visa_host_address', sanitize_textarea_field(wp_unslash($_POST['visa_host_address'] ?? '')));
            update_option('rt_event_manager_visa_template', wp_kses_post(wp_unslash($_POST['visa_template'] ?? '')));
            update_option('rt_event_manager_visa_sig1_img', absint($_POST['visa_sig1_img'] ?? 0));
            update_option('rt_event_manager_visa_sig2_img', absint($_POST['visa_sig2_img'] ?? 0));
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Visa settings saved.', 'rt-event-manager') . '</p></div>';
        }

        wp_enqueue_media();

        $template = self::get_option('template');
        if ('' === $template) {
            $template = self::default_template();
        }

        echo '<div class="wrap"><h1>' . esc_html__('Visa Settings', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Configure the host details and the German letter template. Variables in curly braces are replaced when a letter is generated.', 'rt-event-manager') . '</p>';
        echo '<form method="post">';
        wp_nonce_field('rt_visa_settings', 'rt_visa_settings_nonce');
        echo '<table class="form-table" role="presentation">';

        $row = function ($label, $html, $desc = '') {
            echo '<tr><th scope="row">' . esc_html($label) . '</th><td>' . $html . ($desc ? '<p class="description">' . esc_html($desc) . '</p>' : '') . '</td></tr>';
        };

        $ht = self::get_option('host_type', 'company');
        $row(__('Host type', 'rt-event-manager'),
            '<select name="visa_host_type"><option value="company" ' . selected($ht, 'company', false) . '>' . esc_html__('Company', 'rt-event-manager') . '</option><option value="private" ' . selected($ht, 'private', false) . '>' . esc_html__('Private person', 'rt-event-manager') . '</option></select>');
        $row(__('Host name', 'rt-event-manager'), '<input type="text" class="regular-text" name="visa_host_name" value="' . esc_attr(self::get_option('host_name')) . '" />');
        $row(__('Host first name (private)', 'rt-event-manager'), '<input type="text" class="regular-text" name="visa_host_first_name" value="' . esc_attr(self::get_option('host_first_name')) . '" />');
        $row(__('Host date of birth (private)', 'rt-event-manager'), '<input type="date" name="visa_host_dob" value="' . esc_attr(self::get_option('host_dob')) . '" />');
        $row(__('Host address', 'rt-event-manager'), '<textarea name="visa_host_address" rows="3" class="large-text">' . esc_textarea(self::get_option('host_address')) . '</textarea>');
        $row(__('Host phone', 'rt-event-manager'), '<input type="text" class="regular-text" name="visa_host_phone" value="' . esc_attr(self::get_option('host_phone')) . '" />');
        $row(__('Host e-mail', 'rt-event-manager'), '<input type="email" class="regular-text" name="visa_host_email" value="' . esc_attr(self::get_option('host_email')) . '" />');
        $row(__('Host nationality / country', 'rt-event-manager'), '<input type="text" class="regular-text" name="visa_host_nationality" value="' . esc_attr(self::get_option('host_nationality', 'Schweiz')) . '" />');
        $row(__('Stay from', 'rt-event-manager'), '<input type="date" name="visa_stay_from" value="' . esc_attr(self::get_option('stay_from')) . '" />');
        $row(__('Stay to', 'rt-event-manager'), '<input type="date" name="visa_stay_to" value="' . esc_attr(self::get_option('stay_to')) . '" />');

        // Two signatories with PNG signature uploads.
        for ($i = 1; $i <= 2; $i++) {
            $name = self::get_option('sig' . $i . '_name');
            $img  = absint(self::get_option('sig' . $i . '_img'));
            $src  = $img ? wp_get_attachment_image_url($img, 'medium') : '';
            $preview = '<div class="rt-visa-sig-preview" style="margin:6px 0;">' . ($src ? '<img src="' . esc_url($src) . '" style="max-height:80px;background:#fff;padding:4px;border:1px solid #ddd;" />' : '') . '</div>';
            $html = '<input type="text" class="regular-text" name="visa_sig' . $i . '_name" value="' . esc_attr($name) . '" placeholder="' . esc_attr__('Signatory name', 'rt-event-manager') . '" /><br>'
                . $preview
                . '<input type="hidden" name="visa_sig' . $i . '_img" id="visa_sig' . $i . '_img" value="' . esc_attr($img) . '" /> '
                . '<button type="button" class="button rt-visa-upload" data-target="visa_sig' . $i . '_img">' . esc_html__('Select PNG signature', 'rt-event-manager') . '</button> '
                . '<button type="button" class="button rt-visa-clear" data-target="visa_sig' . $i . '_img">' . esc_html__('Remove', 'rt-event-manager') . '</button>';
            $row(sprintf(__('Signatory %d', 'rt-event-manager'), $i), $html);
        }

        echo '</table>';

        echo '<h2>' . esc_html__('Letter template (German)', 'rt-event-manager') . '</h2>';
        echo '<p class="description">' . esc_html__('Available variables:', 'rt-event-manager') . ' <code>{host_name}</code> <code>{host_address}</code> <code>{host_phone}</code> <code>{host_email}</code> <code>{host_nationality}</code> <code>{applicant_name}</code> <code>{applicant_dob}</code> <code>{applicant_nationality}</code> <code>{applicant_address}</code> <code>{applicant_phone}</code> <code>{applicant_email}</code> <code>{stay_from}</code> <code>{stay_to}</code> <code>{issue_date}</code></p>';
        wp_editor($template, 'visa_template', array('textarea_name' => 'visa_template', 'media_buttons' => false, 'textarea_rows' => 16));

        echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__('Save visa settings', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        // Media uploader wiring.
        ?>
        <script>
        jQuery(function ($) {
            var frame;
            $('.rt-visa-upload').on('click', function (e) {
                e.preventDefault();
                var target = $(this).data('target');
                frame = wp.media({ title: 'Signature (PNG)', library: { type: 'image' }, button: { text: 'Use image' }, multiple: false });
                frame.on('select', function () {
                    var att = frame.state().get('selection').first().toJSON();
                    $('#' + target).val(att.id);
                    var url = (att.sizes && att.sizes.medium) ? att.sizes.medium.url : att.url;
                    $('#' + target).closest('td').find('.rt-visa-sig-preview').html('<img src="' + url + '" style="max-height:80px;background:#fff;padding:4px;border:1px solid #ddd;" />');
                });
                frame.open();
            });
            $('.rt-visa-clear').on('click', function (e) {
                e.preventDefault();
                var target = $(this).data('target');
                $('#' + target).val('');
                $('#' + target).closest('td').find('.rt-visa-sig-preview').empty();
            });
        });
        </script>
        <?php
        echo '</div>';
    }

    public function render_letters_page() {
        if (!current_user_can('edit_shop_orders')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        global $wpdb;
        $table = self::table();
        $rows = $wpdb->get_results("SELECT id, ticket_id, order_id, user_id, reference, eu_efta, created_at FROM $table ORDER BY created_at DESC", ARRAY_A);

        echo '<div class="wrap"><h1>' . esc_html(sprintf(__('Visa Letters (%d)', 'rt-event-manager'), is_array($rows) ? count($rows) : 0)) . '</h1>';
        echo '<p class="description">' . esc_html__('Generated letters are stored encrypted and cannot be deleted.', 'rt-event-manager') . '</p>';

        if (empty($rows)) {
            echo '<p>' . esc_html__('No visa letters generated yet.', 'rt-event-manager') . '</p></div>';
            return;
        }

        echo '<table class="wp-list-table widefat fixed striped"><thead><tr>';
        echo '<th>' . esc_html__('Reference', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Applicant', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Created', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('EU/EFTA', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Document', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';
        foreach ($rows as $r) {
            $applicant = json_decode(self::decrypt($this->get_field($r['id'], 'applicant_enc')), true);
            $who = is_array($applicant) && !empty($applicant['name']) ? $applicant['name'] : ('#' . $r['ticket_id']);
            $order = wc_get_order(absint($r['order_id']));
            $order_link = $order ? $order->get_edit_order_url() : '';
            $dl = $this->download_url($r['id']);
            echo '<tr>';
            echo '<td>' . esc_html($r['reference']) . '</td>';
            echo '<td>' . ($order_link ? '<a href="' . esc_url($order_link) . '">#' . esc_html($r['order_id']) . '</a>' : ('#' . esc_html($r['order_id']))) . '</td>';
            echo '<td>' . esc_html($who) . '</td>';
            echo '<td>' . esc_html($r['created_at']) . '</td>';
            echo '<td>' . ($r['eu_efta'] ? esc_html__('Yes (no letter required)', 'rt-event-manager') : esc_html__('No', 'rt-event-manager')) . '</td>';
            echo '<td><a class="button" href="' . esc_url($dl) . '" target="_blank" rel="noopener">' . esc_html__('Download PDF', 'rt-event-manager') . '</a></td>';
            echo '</tr>';
        }
        echo '</tbody></table></div>';
    }

    private function get_field($id, $column) {
        global $wpdb;
        $table = self::table();
        $allowed = array('applicant_enc', 'pdf_enc');
        if (!in_array($column, $allowed, true)) {
            return '';
        }
        return (string) $wpdb->get_var($wpdb->prepare("SELECT $column FROM $table WHERE id = %d", absint($id)));
    }

    /* ---------------------------------------------------------------------
     * Account "Travel and Visa" tab
     * ------------------------------------------------------------------- */

    public function render_account_tab() {
        $user_id = get_current_user_id();
        $tickets = RT_Event_Manager::get_tickets_for_user($user_id);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Travel and Visa', 'rt-event-manager') . '</h2>';
        echo '<div class="uk-alert-primary" uk-alert><p>' . esc_html__('If you need a visa for Switzerland, generate a letter of invitation for each attendee below. Citizens of EU/EFTA countries do not need a visa or a letter.', 'rt-event-manager') . '</p></div>';

        $visa_tickets = array_filter($tickets, function ($t) {
            return in_array(RT_Event_Manager::get_ticket_kind($t), array('event', 'minor'), true);
        });

        if (empty($visa_tickets)) {
            echo '<p>' . esc_html__('You have no tickets yet.', 'rt-event-manager') . '</p>';
            return;
        }

        foreach ($visa_tickets as $t) {
            $this->render_ticket_visa_card($t);
        }
    }

    /**
     * Field set shared by the attendee and accompanying-child forms.
     *
     * @param bool $include_contact Whether to include phone + e-mail (dropped
     *                              for children / Future members).
     */
    private function visa_fields_html($b, $dob_prefill = '', $include_contact = true) {
        $h  = '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Date of birth', 'rt-event-manager') . '</label><input type="date" class="uk-input" name="dob" value="' . esc_attr($dob_prefill) . '" required /></p>';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Nationality', 'rt-event-manager') . '</label>' . $this->country_select('nationality', $b['country']) . '</p>';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Street and number', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="addr1" value="' . esc_attr($b['addr1']) . '" required /></p>';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Address line 2', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="addr2" value="' . esc_attr($b['addr2']) . '" /></p>';
        $h .= '<div class="rtacc-visa-row">';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Postcode', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="postcode" value="' . esc_attr($b['postcode']) . '" required /></p>';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('City', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="city" value="' . esc_attr($b['city']) . '" required /></p>';
        $h .= '</div>';
        $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Country of residence', 'rt-event-manager') . '</label>' . $this->country_select('country', $b['country']) . '</p>';
        if ($include_contact) {
            $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Phone', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="phone" value="' . esc_attr($b['phone']) . '" /></p>';
            $h .= '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('E-mail', 'rt-event-manager') . '</label><input type="email" class="uk-input" name="email" value="' . esc_attr($b['email']) . '" /></p>';
        }
        return $h;
    }

    private function render_ticket_visa_card($t) {
        $ticket_id = absint($t['id']);
        $order     = wc_get_order(absint($t['order_id']));
        $kind      = RT_Event_Manager::get_ticket_kind($t);
        $holder    = ($t['holder_name'] !== '') ? $t['holder_name'] : ('#' . $ticket_id);
        $dob_prefill = ('minor' === $kind && !empty($t['dob'])) ? $t['dob'] : '';

        // Prefill from the order billing address.
        $b = array('addr1' => '', 'addr2' => '', 'postcode' => '', 'city' => '', 'country' => '', 'phone' => isset($t['phone']) ? $t['phone'] : '', 'email' => '');
        if ($order) {
            $b['addr1']    = $order->get_billing_address_1();
            $b['addr2']    = $order->get_billing_address_2();
            $b['postcode'] = $order->get_billing_postcode();
            $b['city']     = $order->get_billing_city();
            $b['country']  = $order->get_billing_country();
            if ('' === $b['phone']) { $b['phone'] = $order->get_billing_phone(); }
            $b['email']    = $order->get_billing_email();
        }

        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html($holder) . '</h3>';

        // Existing letters for this ticket.
        $letters = $this->letters_for_ticket($ticket_id, get_current_user_id());
        if (!empty($letters)) {
            echo '<table class="rtacc-table rtacc-tickets uk-table uk-table-divider uk-table-middle uk-table-small">';
            echo '<thead><tr>';
            echo '<th>' . esc_html__('Reference', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Generated', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Document', 'rt-event-manager') . '</th>';
            echo '</tr></thead><tbody>';
            foreach ($letters as $l) {
                $dl = $this->download_url($l['id']);
                echo '<tr>';
                echo '<td data-title="' . esc_attr__('Reference', 'rt-event-manager') . '">' . esc_html($l['reference']) . '</td>';
                echo '<td data-title="' . esc_attr__('Generated', 'rt-event-manager') . '">' . esc_html($l['created_at']) . '</td>';
                echo '<td data-title="' . esc_attr__('Document', 'rt-event-manager') . '"><a class="uk-button uk-button-default uk-button-small" href="' . esc_url($dl) . '" target="_blank" rel="noopener">' . esc_html__('Download PDF', 'rt-event-manager') . '</a></td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        }

        $has_attendee = $this->person_has_letter($ticket_id, get_current_user_id(), false, '');
        $is_event     = ('event' === $kind);
        $child_max    = self::child_letter_max_age();

        // Toggle buttons, inline on one row.
        echo '<div class="rtacc-visa-actions">';
        if ($has_attendee) {
            echo '<p class="rtacc-muted" style="margin:0;">' . esc_html__('A letter of invitation has already been generated for this person.', 'rt-event-manager') . '</p>';
        } else {
            echo '<button type="button" class="uk-button uk-button-secondary uk-button-small rtacc-visa-toggle" data-visa-form="visa-attendee-' . esc_attr($ticket_id) . '">' . esc_html__('Request a letter of invitation', 'rt-event-manager') . '</button>';
        }
        if ($is_event) {
            echo '<button type="button" class="uk-button uk-button-secondary uk-button-small rtacc-visa-toggle" data-visa-form="visa-child-' . esc_attr($ticket_id) . '">' . esc_html(sprintf(__('Request a letter for an accompanying child (under %d)', 'rt-event-manager'), $child_max)) . '</button>';
        }
        echo '</div>';

        // Attendee letter form — only when they don't already have one (one per person).
        if (!$has_attendee) {
            echo '<form id="visa-attendee-' . esc_attr($ticket_id) . '" class="rtacc-form uk-form-stacked rtacc-visa-form" style="display:none;margin-top:12px;" data-ticket="' . esc_attr($ticket_id) . '">';
            echo '<div class="rtacc-visa-result uk-alert" uk-alert style="display:none;"></div>';
            echo $this->visa_fields_html($b, $dob_prefill, $is_event);
            echo '<p class="rtacc-modal-error uk-text-danger" style="display:none;"></p>';
            echo '<p class="rtacc-actions"><button type="submit" class="uk-button uk-button-primary">' . esc_html__('Generate letter', 'rt-event-manager') . '</button><span class="rtacc-status" aria-live="polite"></span></p>';
            echo '</form>';
        }

        // Accompanying-child letter (under the Future member minimum age), only
        // offered from an adult event ticket (the child's guardian).
        if ($is_event) {
            echo '<form id="visa-child-' . esc_attr($ticket_id) . '" class="rtacc-form uk-form-stacked rtacc-visa-form" style="display:none;margin-top:12px;" data-ticket="' . esc_attr($ticket_id) . '">';
            echo '<input type="hidden" name="for_child" value="1" />';
            echo '<div class="rtacc-visa-result uk-alert" uk-alert style="display:none;"></div>';
            echo '<p class="rtacc-hint">' . esc_html(sprintf(__('The letter will state that the child is accompanying their guardian, %s.', 'rt-event-manager'), $holder)) . '</p>';
            echo '<div class="rtacc-visa-child-warn uk-alert-primary" uk-alert style="display:none;"><p></p></div>';
            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Child\'s name', 'rt-event-manager') . '</label><input type="text" class="uk-input" name="child_name" required /></p>';
            echo $this->visa_fields_html($b, '', false);
            echo '<p class="rtacc-modal-error uk-text-danger" style="display:none;"></p>';
            echo '<p class="rtacc-actions"><button type="submit" class="uk-button uk-button-primary">' . esc_html__('Generate letter', 'rt-event-manager') . '</button><span class="rtacc-status" aria-live="polite"></span></p>';
            echo '</form>';
        }

        echo '</section>';
    }

    private function letters_for_ticket($ticket_id, $user_id) {
        global $wpdb;
        $table = self::table();
        return $wpdb->get_results($wpdb->prepare(
            "SELECT id, reference, created_at, eu_efta FROM $table WHERE ticket_id = %d AND user_id = %d ORDER BY created_at DESC",
            absint($ticket_id),
            absint($user_id)
        ), ARRAY_A);
    }

    /**
     * Whether a letter already exists for a given person under a ticket — the
     * attendee themselves (for_child=false), or a specific accompanying child by
     * name (for_child=true). Enforces one letter per person.
     */
    private function person_has_letter($ticket_id, $user_id, $for_child, $name) {
        global $wpdb;
        $table = self::table();
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT applicant_enc FROM $table WHERE ticket_id = %d AND user_id = %d",
            absint($ticket_id),
            absint($user_id)
        ), ARRAY_A);
        foreach ($rows as $r) {
            $a = json_decode(self::decrypt($r['applicant_enc']), true);
            if (!is_array($a)) {
                continue;
            }
            $is_ad_hoc = !empty($a['ad_hoc_child']);
            if ($for_child) {
                if ($is_ad_hoc && isset($a['name']) && $this->norm($a['name']) === $this->norm($name)) {
                    return true;
                }
            } elseif (!$is_ad_hoc) {
                return true; // the ticket's own attendee already has a letter
            }
        }
        return false;
    }

    private function norm($s) {
        $s = trim((string) $s);
        return function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s);
    }

    /* ---------------------------------------------------------------------
     * AJAX: generate + download
     * ------------------------------------------------------------------- */

    public function ajax_generate() {
        check_ajax_referer('rt_event_manager_visa', 'nonce');
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }
        $user_id   = get_current_user_id();
        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;

        $t = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$t || !RT_Event_Manager::user_owns_ticket($t, $user_id)) {
            wp_send_json_error(__('Ticket not found.', 'rt-event-manager'));
        }
        $kind = RT_Event_Manager::get_ticket_kind($t);
        if (!in_array($kind, array('event', 'minor'), true)) {
            wp_send_json_error(__('Letters of invitation are issued per event or Future member ticket.', 'rt-event-manager'));
        }

        $for_child   = !empty($_POST['for_child']);
        $dob         = sanitize_text_field(wp_unslash($_POST['dob'] ?? ''));
        $nationality = strtoupper(sanitize_text_field(wp_unslash($_POST['nationality'] ?? '')));
        $country     = strtoupper(sanitize_text_field(wp_unslash($_POST['country'] ?? '')));
        if ('' === $dob || '' === $nationality) {
            wp_send_json_error(__('Please provide date of birth and nationality.', 'rt-event-manager'));
        }

        // Resolve applicant name + guardian reference.
        $guardian_name = '';
        $is_child      = false;
        if ($for_child) {
            $applicant_name = sanitize_text_field(wp_unslash($_POST['child_name'] ?? ''));
            if ('' === $applicant_name) {
                wp_send_json_error(__('Please enter the child\'s name.', 'rt-event-manager'));
            }
            $max = self::child_letter_max_age();
            if ($this->age_at_event($dob) >= $max) {
                wp_send_json_error(sprintf(__('This child is %d or older and needs their own Future Tabler / Future Circler ticket. Please register them for a ticket instead.', 'rt-event-manager'), $max));
            }
            $guardian_name = ($t['holder_name'] !== '') ? $t['holder_name'] : '';
            $is_child      = true;
        } else {
            $applicant_name = ($t['holder_name'] !== '') ? $t['holder_name'] : '';
            if ('minor' === $kind) {
                $guardian_name = $this->guardian_name_for($t);
                $is_child      = true;
            }
        }

        // One letter per person.
        if ($this->person_has_letter($ticket_id, $user_id, $for_child, $applicant_name)) {
            wp_send_json_error($for_child
                ? __('A letter has already been generated for this child.', 'rt-event-manager')
                : __('A letter has already been generated for this person. Only one letter per person is allowed.', 'rt-event-manager'));
        }

        $applicant = array(
            'name'          => $applicant_name,
            'dob'           => $dob,
            'nationality'   => $nationality,
            'addr1'         => sanitize_text_field(wp_unslash($_POST['addr1'] ?? '')),
            'addr2'         => sanitize_text_field(wp_unslash($_POST['addr2'] ?? '')),
            'postcode'      => sanitize_text_field(wp_unslash($_POST['postcode'] ?? '')),
            'city'          => sanitize_text_field(wp_unslash($_POST['city'] ?? '')),
            'country'       => $country,
            'phone'         => sanitize_text_field(wp_unslash($_POST['phone'] ?? '')),
            'email'         => sanitize_email(wp_unslash($_POST['email'] ?? '')),
            'guardian_name' => $guardian_name,
            'is_child'      => $is_child ? 1 : 0,
            'ad_hoc_child'  => $for_child ? 1 : 0,
        );

        $eu_efta = self::is_eu_efta($nationality) || ($country && self::is_eu_efta($country));

        $pdf = $this->build_pdf($applicant, absint($t['order_id']));
        if (!$pdf) {
            wp_send_json_error(__('Could not generate the PDF.', 'rt-event-manager'));
        }

        global $wpdb;
        $reference = 'VISA-' . absint($t['order_id']) . '-' . $ticket_id . '-' . strtoupper(wp_generate_password(4, false));
        $wpdb->insert(self::table(), array(
            'ticket_id'     => $ticket_id,
            'order_id'      => absint($t['order_id']),
            'user_id'       => $user_id,
            'reference'     => $reference,
            'applicant_enc' => self::encrypt(wp_json_encode($applicant)),
            'pdf_enc'       => self::encrypt($pdf),
            'eu_efta'       => $eu_efta ? 1 : 0,
        ), array('%d', '%d', '%d', '%s', '%s', '%s', '%d'));
        $letter_id = (int) $wpdb->insert_id;

        wp_send_json_success(array(
            'download_url' => $this->download_url($letter_id),
            'eu_efta'      => $eu_efta,
            'message'      => $eu_efta
                ? __('Your nationality/country is in the EU/EFTA, so a visa (and this letter) is normally not required. The letter has still been generated — you can download it below.', 'rt-event-manager')
                : __('Your letter of invitation has been generated — you can download it below.', 'rt-event-manager'),
        ));
    }

    /** Clean (non-HTML-encoded) nonce'd download URL, safe for JSON/JS. */
    private function download_url($letter_id) {
        $letter_id = absint($letter_id);
        return add_query_arg(array(
            'action'    => 'rt_event_manager_visa_pdf',
            'letter_id' => $letter_id,
            'nonce'     => wp_create_nonce('rt_visa_pdf_' . $letter_id),
        ), admin_url('admin-ajax.php'));
    }

    /** Age in whole years at the event date (or today if unset). */
    private function age_at_event($dob) {
        $ref = RT_Event_Manager::get_event_date();
        if ('' === $ref) {
            $ref = current_time('Y-m-d');
        }
        $d = strtotime($dob);
        $r = strtotime($ref);
        if (!$d || !$r || $d > $r) {
            return 0;
        }
        return (int) floor(($r - $d) / (365.25 * 86400));
    }

    /** Guardian holder name for a Future member ticket (resolves one level up). */
    private function guardian_name_for($t) {
        $pid = absint(isset($t['parent_ticket_id']) ? $t['parent_ticket_id'] : 0);
        if (!$pid) {
            return '';
        }
        $p = RT_Event_Manager::get_ticket_by_id($pid);
        if (!$p) {
            return '';
        }
        if ('minor' === RT_Event_Manager::get_ticket_kind($p)) {
            $gp = absint(isset($p['parent_ticket_id']) ? $p['parent_ticket_id'] : 0);
            if ($gp) {
                $g = RT_Event_Manager::get_ticket_by_id($gp);
                if ($g) {
                    $p = $g;
                }
            }
        }
        return ($p['holder_name'] !== '') ? $p['holder_name'] : '';
    }

    public function ajax_download() {
        $letter_id = isset($_GET['letter_id']) ? absint($_GET['letter_id']) : 0;
        if (!$letter_id || !isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rt_visa_pdf_' . $letter_id)) {
            wp_die(esc_html__('Invalid request.', 'rt-event-manager'));
        }
        global $wpdb;
        $table = self::table();
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $letter_id), ARRAY_A);
        if (!$row) {
            wp_die(esc_html__('Letter not found.', 'rt-event-manager'));
        }
        $is_owner = is_user_logged_in() && absint($row['user_id']) === get_current_user_id();
        if (!$is_owner && !current_user_can('edit_shop_orders')) {
            wp_die(esc_html__('Permission denied.', 'rt-event-manager'));
        }

        $pdf = self::decrypt($row['pdf_enc']);
        if ('' === $pdf) {
            wp_die(esc_html__('Could not read the document.', 'rt-event-manager'));
        }

        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . sanitize_file_name($row['reference']) . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf; // phpcs:ignore
        exit;
    }

    /* ---------------------------------------------------------------------
     * PDF build
     * ------------------------------------------------------------------- */

    private function build_pdf($applicant, $order_id) {
        if (!class_exists('Dompdf\\Dompdf')) {
            return false;
        }

        $addr_parts = array_filter(array(
            trim($applicant['addr1'] . ' ' . $applicant['addr2']),
            trim($applicant['postcode'] . ' ' . $applicant['city']),
            $this->country_name($applicant['country']),
        ));
        $applicant_address = implode('<br>', array_map('esc_html', $addr_parts));

        $vars = array(
            '{host_name}'             => esc_html(self::get_option('host_name')),
            '{host_first_name}'       => esc_html(self::get_option('host_first_name')),
            '{host_dob}'              => esc_html($this->fmt_date(self::get_option('host_dob'))),
            '{host_address}'          => nl2br(esc_html(self::get_option('host_address'))),
            '{host_phone}'            => esc_html(self::get_option('host_phone')),
            '{host_email}'            => esc_html(self::get_option('host_email')),
            '{host_nationality}'      => esc_html(self::get_option('host_nationality', 'Schweiz')),
            '{applicant_name}'        => esc_html($applicant['name']),
            '{applicant_dob}'         => esc_html($this->fmt_date($applicant['dob'])),
            '{applicant_nationality}' => esc_html($this->country_name($applicant['nationality'])),
            '{applicant_address}'     => $applicant_address,
            '{applicant_phone}'       => esc_html($applicant['phone']),
            '{applicant_email}'       => esc_html($applicant['email']),
            '{stay_from}'             => esc_html($this->fmt_date(self::get_option('stay_from'))),
            '{stay_to}'               => esc_html($this->fmt_date(self::get_option('stay_to'))),
            '{issue_date}'            => esc_html($this->fmt_date(current_time('Y-m-d'))),
            '{guardian_name}'         => esc_html(isset($applicant['guardian_name']) ? $applicant['guardian_name'] : ''),
        );

        // Contact rows (phone + e-mail) are omitted for children / Future members.
        if (empty($applicant['is_child'])) {
            $vars['{applicant_contact}'] = '<tr><td class="lbl">Telefon</td><td>' . esc_html($applicant['phone']) . '</td></tr>'
                . '<tr><td class="lbl">E-Mail</td><td>' . esc_html($applicant['email']) . '</td></tr>';
        } else {
            $vars['{applicant_contact}'] = '';
        }

        // Guardian note for a child / Future member accompanying their guardian.
        $guardian_note = '';
        if (!empty($applicant['is_child']) && !empty($applicant['guardian_name'])) {
            $guardian_note = '<p>' . esc_html(sprintf(
                'Das Kind %1$s reist in Begleitung der/des Erziehungsberechtigten %2$s.',
                $applicant['name'],
                $applicant['guardian_name']
            )) . '</p>';
        }
        $vars['{guardian_note}'] = $guardian_note;

        $template = self::get_option('template');
        if ('' === $template) {
            $template = self::default_template();
        }
        $body = strtr($template, $vars);

        $sigs = '';
        for ($i = 1; $i <= 2; $i++) {
            $name = self::get_option('sig' . $i . '_name');
            $img  = absint(self::get_option('sig' . $i . '_img'));
            if ('' === $name && !$img) {
                continue;
            }
            $img_html = '';
            if ($img) {
                $path = get_attached_file($img);
                if ($path && file_exists($path)) {
                    $img_html = '<img src="' . esc_attr($path) . '" style="max-height:60px;" /><br>';
                }
            }
            $sigs .= '<td style="padding:0 20px;">' . $img_html . '<span style="border-top:1px solid #333;display:block;padding-top:4px;">' . esc_html($name) . '</span></td>';
        }
        $signature_block = $sigs ? '<table style="margin-top:40px;"><tr>' . $sigs . '</tr></table>' : '';

        ob_start();
        ?>
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" />
        <style>
            @page { margin: 25mm 20mm; }
            body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.5; }
            h1 { font-size: 18px; margin: 0 0 16px; }
            h4 { margin: 16px 0 4px; font-size: 13px; }
            p { margin: 0 0 10px; }
            table.details { width: 100%; border-collapse: collapse; margin: 4px 0 12px; }
            table.details td { padding: 3px 6px; vertical-align: top; border-bottom: 1px solid #eee; }
            table.details td.lbl { width: 170px; color: #555; }
        </style></head><body>
            <h1><?php echo esc_html__('Einladungsschreiben', 'rt-event-manager'); ?></h1>
            <?php echo wp_kses_post($body); ?>
            <?php echo wp_kses_post($signature_block); ?>
        </body></html>
        <?php
        $html = ob_get_clean();

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
            error_log('RT Event Manager visa PDF failed: ' . $e->getMessage());
            return false;
        }
    }

    private function fmt_date($ymd) {
        $ymd = trim((string) $ymd);
        if ('' === $ymd) {
            return '';
        }
        $ts = strtotime($ymd);
        return $ts ? date_i18n('d.m.Y', $ts) : $ymd;
    }
}
