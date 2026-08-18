<?php
/**
 * RT Event Manager — Apple Wallet (.pkpass) passes.
 *
 * Builds and signs an Apple Wallet event ticket whose QR barcode is the same
 * signed check-in token used by the PDF ticket, so check-in is identical.
 *
 * The signing credentials — the Pass Type ID certificate (.p12), its password
 * and the Apple WWDR intermediate — are configured in wp-admin and stored
 * AES-encrypted (reusing the visa crypto). They are never written to the web
 * root; at sign time they are materialised into private temp files and removed.
 */

if (!defined('ABSPATH')) {
    exit;
}

class RT_Event_Manager_Apple_Wallet {

    const CAP = 'manage_woocommerce';

    /** @var RT_Event_Manager_Apple_Wallet|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'), 21);
        add_action('wp_ajax_rt_event_manager_apple_pass', array($this, 'ajax_download'));
        // Pass Update Web Service (device registration + pass fetch).
        add_action('init', array($this, 'maybe_install_registrations_table'));
        add_action('rest_api_init', array($this, 'register_web_service_routes'));
    }

    /**
     * REST base Apple appends /v1/... to for the pass update web service.
     * A configured override (or the RT_EVENT_MANAGER_WALLET_WS_URL constant)
     * lets you point passes at a public HTTPS tunnel while developing on a
     * local, non-public domain. Must be the base ending in /wp-json/rtem-wallet.
     */
    public static function web_service_url() {
        if (defined('RT_EVENT_MANAGER_WALLET_WS_URL') && RT_EVENT_MANAGER_WALLET_WS_URL) {
            return untrailingslashit(RT_EVENT_MANAGER_WALLET_WS_URL);
        }
        $override = (string) self::opt('ws_url');
        if ('' !== $override) {
            return untrailingslashit($override);
        }
        return rest_url('rtem-wallet');
    }

    /** Per-pass authentication token Apple sends back as "ApplePass <token>". */
    public static function auth_token($serial) {
        return substr(hash_hmac('sha256', 'apple-pass|' . $serial, wp_salt('auth')), 0, 32);
    }

    private static function registrations_table() {
        global $wpdb;
        return $wpdb->prefix . 'rti_pass_registrations';
    }

    public function maybe_install_registrations_table() {
        global $wpdb;
        $table   = self::registrations_table();
        $collate = $wpdb->get_charset_collate();
        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS $table (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                device_lib_id varchar(255) NOT NULL DEFAULT '',
                push_token varchar(255) NOT NULL DEFAULT '',
                pass_type_id varchar(255) NOT NULL DEFAULT '',
                serial_number varchar(64) NOT NULL DEFAULT '',
                updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY device_serial (device_lib_id, serial_number),
                KEY serial_number (serial_number)
            ) $collate;"
        );
    }

    /* ---------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------- */

    private static function opt($key, $default = '') {
        return get_option('rt_event_manager_wallet_' . $key, $default);
    }

    /** Human-readable ticket status shown on the pass. */
    public static function status_label($ticket) {
        $map = array(
            'valid'      => __('Confirmed', 'rt-event-manager'),
            'draft'      => __('Pending', 'rt-event-manager'),
            'invalid'    => __('Invalid', 'rt-event-manager'),
            'checked_in' => __('Checked in', 'rt-event-manager'),
            'cancelled'  => __('Cancelled', 'rt-event-manager'),
            'refunded'   => __('Refunded', 'rt-event-manager'),
        );
        $s = isset($ticket['status']) ? $ticket['status'] : 'draft';
        return isset($map[$s]) ? $map[$s] : $s;
    }

    /** "<Family> <Club>" line for a ticket; family defaults to "Guest" if unset. */
    public static function org_line($ticket) {
        $family = (!empty($ticket['rti_family']) && absint($ticket['rti_family']))
            ? RT_Event_Manager::get_family_label($ticket['rti_family'])
            : __('Guest', 'rt-event-manager');
        $club = isset($ticket['rti_club']) ? trim((string) $ticket['rti_club']) : '';
        return trim($family . ' ' . $club);
    }

    /** Whether Apple Wallet passes can be issued (all credentials present). */
    public static function is_configured() {
        $has_signcert = ('' !== self::opt('p12_enc'))
            || ('' !== self::opt('cert_enc') && '' !== self::opt('key_enc'));
        return '' !== self::opt('team_id')
            && '' !== self::opt('pass_type_id')
            && '' !== self::opt('org_name')
            && $has_signcert
            && '' !== self::opt('wwdr_enc');
    }

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Apple Wallet', 'rt-event-manager'),
            __('Apple Wallet', 'rt-event-manager'),
            self::CAP,
            'rt-event-manager-apple-wallet',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }

        if (isset($_POST['rt_wallet_nonce']) && wp_verify_nonce($_POST['rt_wallet_nonce'], 'rt_wallet_save')) {
            update_option('rt_event_manager_wallet_team_id', sanitize_text_field(wp_unslash($_POST['wallet_team_id'] ?? '')));
            update_option('rt_event_manager_wallet_pass_type_id', sanitize_text_field(wp_unslash($_POST['wallet_pass_type_id'] ?? '')));
            update_option('rt_event_manager_wallet_org_name', sanitize_text_field(wp_unslash($_POST['wallet_org_name'] ?? '')));
            update_option('rt_event_manager_wallet_event_name', sanitize_text_field(wp_unslash($_POST['wallet_event_name'] ?? '')));
            update_option('rt_event_manager_wallet_header_label', sanitize_text_field(wp_unslash($_POST['wallet_header_label'] ?? '')));
            update_option('rt_event_manager_wallet_header_value', sanitize_text_field(wp_unslash($_POST['wallet_header_value'] ?? '')));
            update_option('rt_event_manager_wallet_event_type', sanitize_text_field(wp_unslash($_POST['wallet_event_type'] ?? '')));
            update_option('rt_event_manager_wallet_venue_name', sanitize_text_field(wp_unslash($_POST['wallet_venue_name'] ?? '')));
            update_option('rt_event_manager_wallet_venue_lat', sanitize_text_field(wp_unslash($_POST['wallet_venue_lat'] ?? '')));
            update_option('rt_event_manager_wallet_venue_lng', sanitize_text_field(wp_unslash($_POST['wallet_venue_lng'] ?? '')));
            update_option('rt_event_manager_wallet_ws_url', esc_url_raw(trim((string) wp_unslash($_POST['wallet_ws_url'] ?? ''))));

            // Password: only overwrite when a new value is entered.
            $pass = (string) wp_unslash($_POST['wallet_p12_pass'] ?? '');
            if ('' !== $pass) {
                update_option('rt_event_manager_wallet_p12_pass_enc', RT_Event_Manager_Visa::encrypt($pass));
            }
            // Certificate uploads: read bytes, store encrypted, keep existing if none.
            if (!empty($_FILES['wallet_p12']['tmp_name']) && is_uploaded_file($_FILES['wallet_p12']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_p12']['tmp_name']);
                if (false !== $bytes) {
                    update_option('rt_event_manager_wallet_p12_enc', RT_Event_Manager_Visa::encrypt($bytes));
                }
            }
            if (!empty($_FILES['wallet_cert']['tmp_name']) && is_uploaded_file($_FILES['wallet_cert']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_cert']['tmp_name']);
                if (false !== $bytes) {
                    update_option('rt_event_manager_wallet_cert_enc', RT_Event_Manager_Visa::encrypt($bytes));
                }
            }
            if (!empty($_FILES['wallet_key']['tmp_name']) && is_uploaded_file($_FILES['wallet_key']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_key']['tmp_name']);
                if (false !== $bytes) {
                    update_option('rt_event_manager_wallet_key_enc', RT_Event_Manager_Visa::encrypt($bytes));
                }
            }
            if (!empty($_FILES['wallet_logo']['tmp_name']) && is_uploaded_file($_FILES['wallet_logo']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_logo']['tmp_name']);
                if (false !== $bytes && false !== @getimagesizefromstring($bytes)) {
                    update_option('rt_event_manager_wallet_logo', base64_encode($bytes));
                } else {
                    echo '<div class="notice notice-error"><p>' . esc_html__('The logo could not be read as an image.', 'rt-event-manager') . '</p></div>';
                }
            }
            if (!empty($_FILES['wallet_icon']['tmp_name']) && is_uploaded_file($_FILES['wallet_icon']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_icon']['tmp_name']);
                if (false !== $bytes && false !== @getimagesizefromstring($bytes)) {
                    update_option('rt_event_manager_wallet_icon', base64_encode($bytes));
                } else {
                    echo '<div class="notice notice-error"><p>' . esc_html__('The icon could not be read as an image.', 'rt-event-manager') . '</p></div>';
                }
            }
            if (!empty($_FILES['wallet_wwdr']['tmp_name']) && is_uploaded_file($_FILES['wallet_wwdr']['tmp_name'])) {
                $bytes = file_get_contents($_FILES['wallet_wwdr']['tmp_name']);
                if (false !== $bytes) {
                    update_option('rt_event_manager_wallet_wwdr_enc', RT_Event_Manager_Visa::encrypt($bytes));
                }
            }
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Apple Wallet settings saved.', 'rt-event-manager') . '</p></div>';

            // Validate the certificate now so misconfiguration is caught early.
            $check = $this->load_signing_material();
            if (is_wp_error($check)) {
                echo '<div class="notice notice-error"><p>' . esc_html($check->get_error_message()) . '</p></div>';
            } elseif (self::is_configured()) {
                echo '<div class="notice notice-success"><p>' . esc_html__('Certificate loaded successfully — Apple Wallet passes are ready.', 'rt-event-manager') . '</p></div>';
            }
        }

        // Test push: send an update to every device registered for a serial.
        if (isset($_POST['rt_wallet_test_nonce']) && wp_verify_nonce($_POST['rt_wallet_test_nonce'], 'rt_wallet_test')) {
            $order  = absint($_POST['test_order'] ?? 0);
            $number = absint($_POST['test_number'] ?? 0);
            $ticket = ($order && $number) ? RT_Event_Manager::get_ticket_by_order_and_number($order, $number) : null;
            if (!$ticket) {
                echo '<div class="notice notice-error"><p>' . esc_html__('No ticket found for that order and number.', 'rt-event-manager') . '</p></div>';
            } else {
                $this->notify($ticket);
                $last = get_option('rt_event_manager_wallet_apns_last', array());
                $msg  = !empty($last['summary']) ? $last['summary'] : __('No devices are registered for this pass yet (open the pass on a device first).', 'rt-event-manager');
                echo '<div class="notice notice-info"><p><strong>' . esc_html__('Test push result:', 'rt-event-manager') . '</strong> ' . esc_html($msg) . '</p></div>';
            }
        }

        $has_p12  = '' !== self::opt('p12_enc');
        $has_wwdr = '' !== self::opt('wwdr_enc');
        $has_pass = '' !== self::opt('p12_pass_enc');

        echo '<div class="wrap"><h1>' . esc_html__('Apple Wallet', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Configure the Pass Type ID certificate so attendees can add their ticket to Apple Wallet. Certificates are stored encrypted.', 'rt-event-manager') . '</p>';
        echo '<form method="post" enctype="multipart/form-data">';
        wp_nonce_field('rt_wallet_save', 'rt_wallet_nonce');
        echo '<table class="form-table">';

        $text = function ($label, $name, $val, $desc = '') {
            echo '<tr><th scope="row">' . esc_html($label) . '</th><td>';
            echo '<input type="text" class="regular-text" name="' . esc_attr($name) . '" value="' . esc_attr($val) . '" />';
            if ($desc) {
                echo '<p class="description">' . esc_html($desc) . '</p>';
            }
            echo '</td></tr>';
        };
        $text(__('Team ID', 'rt-event-manager'), 'wallet_team_id', self::opt('team_id'), __('Your 10-character Apple Team ID.', 'rt-event-manager'));
        $text(__('Pass Type Identifier', 'rt-event-manager'), 'wallet_pass_type_id', self::opt('pass_type_id'), 'pass.…');
        $text(__('Organization name', 'rt-event-manager'), 'wallet_org_name', self::opt('org_name'));
        $text(__('Event name (shown on pass)', 'rt-event-manager'), 'wallet_event_name', self::opt('event_name', 'RTI Half-Year Meeting 2027'));

        $has_cert = '' !== self::opt('cert_enc');
        $has_key  = '' !== self::opt('key_enc');

        echo '<tr><td colspan="2"><p class="description"><strong>' . esc_html__('Signing certificate — provide EITHER a PEM certificate + key (recommended) OR a .p12.', 'rt-event-manager') . '</strong> ' . esc_html__('macOS Keychain .p12 files often fail on OpenSSL 3 servers, so PEM is the reliable option.', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Certificate (PEM)', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_cert" accept=".pem,.crt,.cer" />';
        echo '<p class="description">' . ($has_cert ? esc_html__('A PEM certificate is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('pass.pem — your Pass Type ID certificate in PEM.', 'rt-event-manager')) . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Private key (PEM)', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_key" accept=".pem,.key" />';
        echo '<p class="description">' . ($has_key ? esc_html__('A PEM key is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('pass.key — the matching private key (unencrypted, or set its passphrase below).', 'rt-event-manager')) . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Pass certificate (.p12)', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_p12" accept=".p12,.pfx" />';
        echo '<p class="description">' . ($has_p12 ? esc_html__('A .p12 is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('Alternative to PEM. Upload your Pass Type ID .p12 export.', 'rt-event-manager')) . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('.p12 / key password', 'rt-event-manager') . '</th><td>';
        echo '<input type="password" class="regular-text" name="wallet_p12_pass" autocomplete="new-password" placeholder="' . ($has_pass ? '••••••••' : '') . '" />';
        echo '<p class="description">' . esc_html__('Leave blank to keep the stored password.', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Apple WWDR certificate', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_wwdr" accept=".cer,.pem,.crt" />';
        echo '<p class="description">' . ($has_wwdr ? esc_html__('A WWDR certificate is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('Upload the Apple WWDR intermediate certificate (.cer).', 'rt-event-manager')) . '</p></td></tr>';

        // Pass logo (shown on the wallet ticket face).
        $logo = self::opt('logo');
        echo '<tr><th scope="row">' . esc_html__('Pass logo', 'rt-event-manager') . '</th><td>';
        if ('' !== $logo) {
            echo '<div style="margin:0 0 8px;"><img src="data:image/png;base64,' . esc_attr($logo) . '" alt="" style="max-height:50px;background:#CC0B24;padding:6px;border-radius:4px;" /></div>';
        }
        echo '<input type="file" name="wallet_logo" accept="image/png,image/jpeg" />';
        echo '<p class="description">' . esc_html__('PNG with transparency recommended. Shown top-left on the Wallet ticket; also used for the pass icon. Left blank uses a plain brand-colour block.', 'rt-event-manager') . '</p></td></tr>';

        // Notification / pass icon (icon.png). Shown in notifications and the Wallet list.
        $icon = self::opt('icon');
        echo '<tr><th scope="row">' . esc_html__('Notification icon', 'rt-event-manager') . '</th><td>';
        if ('' !== $icon) {
            echo '<div style="margin:0 0 8px;"><img src="data:image/png;base64,' . esc_attr($icon) . '" alt="" style="max-height:58px;background:#CC0B24;padding:6px;border-radius:4px;" /></div>';
        }
        echo '<input type="file" name="wallet_icon" accept="image/png,image/jpeg" />';
        echo '<p class="description">' . esc_html__('Square PNG shown in push notifications and the Wallet pass list (Apple “icon”). Left blank falls back to the pass logo.', 'rt-event-manager') . '</p></td></tr>';

        // Top-right header title (Apple headerFields).
        $text(__('Top-right label', 'rt-event-manager'), 'wallet_header_label', self::opt('header_label'), __('Small caption above the top-right title (optional).', 'rt-event-manager'));
        $text(__('Top-right title', 'rt-event-manager'), 'wallet_header_value', self::opt('header_value'), __('Shown in the top-right corner of the pass (e.g. the year or a short code).', 'rt-event-manager'));

        // Event semantic tags (drive Apple's modern event-pass layout).
        $event_types = array(
            'PKEventTypeGeneric'        => __('Generic', 'rt-event-manager'),
            'PKEventTypeConference'     => __('Conference', 'rt-event-manager'),
            'PKEventTypeConvention'     => __('Convention', 'rt-event-manager'),
            'PKEventTypeWorkshop'       => __('Workshop', 'rt-event-manager'),
            'PKEventTypeSocialGathering' => __('Social gathering', 'rt-event-manager'),
            'PKEventTypeLivePerformance' => __('Live performance', 'rt-event-manager'),
            'PKEventTypeSports'         => __('Sports', 'rt-event-manager'),
        );
        $cur_type = self::opt('event_type', 'PKEventTypeGeneric');
        echo '<tr><th scope="row">' . esc_html__('Event type', 'rt-event-manager') . '</th><td><select name="wallet_event_type">';
        foreach ($event_types as $val => $label) {
            echo '<option value="' . esc_attr($val) . '" ' . selected($cur_type, $val, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select><p class="description">' . esc_html__('Used for the pass semantic tags (Apple event-pass layout).', 'rt-event-manager') . '</p></td></tr>';

        $text(
            __('Pass update URL override', 'rt-event-manager'),
            'wallet_ws_url',
            self::opt('ws_url'),
            sprintf(
                /* translators: %s: default REST base URL. */
                __('Optional. Base URL for pass updates that the phone can reach — set this to a public HTTPS tunnel when developing on a local domain. Leave blank to use the site default (%s).', 'rt-event-manager'),
                rest_url('rtem-wallet')
            )
        );

        $text(__('Venue name', 'rt-event-manager'), 'wallet_venue_name', self::opt('venue_name'), __('Shown on the event pass and used for the venue semantic tag.', 'rt-event-manager'));
        $text(__('Venue latitude', 'rt-event-manager'), 'wallet_venue_lat', self::opt('venue_lat'), __('Optional — enables the map/location on the pass.', 'rt-event-manager'));
        $text(__('Venue longitude', 'rt-event-manager'), 'wallet_venue_lng', self::opt('venue_lng'));

        echo '</table>';
        echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__('Save Apple Wallet settings', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        $this->render_push_diagnostics();

        echo '</div>';
    }

    /** Diagnostics panel for pass updates: registrations, last APNs result, test push. */
    private function render_push_diagnostics() {
        global $wpdb;
        $table = self::registrations_table();
        $count = 0;
        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table))) {
            $count = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");
        }
        $last = get_option('rt_event_manager_wallet_apns_last', array());

        echo '<hr /><h2>' . esc_html__('Pass updates (push)', 'rt-event-manager') . '</h2>';
        echo '<p class="description">' . esc_html__('Devices register automatically when an attendee adds a pass that includes the update web service. A push is sent whenever a ticket changes.', 'rt-event-manager') . '</p>';
        echo '<table class="form-table">';
        echo '<tr><th scope="row">' . esc_html__('Web service URL', 'rt-event-manager') . '</th><td><code>' . esc_html(self::web_service_url()) . '</code>';
        if (0 !== strpos(self::web_service_url(), 'https://')) {
            echo '<p class="description" style="color:#b32d2e;">' . esc_html__('Apple requires HTTPS — device registration will fail over plain HTTP.', 'rt-event-manager') . '</p>';
        }
        echo '</td></tr>';
        echo '<tr><th scope="row">' . esc_html__('Registered devices', 'rt-event-manager') . '</th><td>' . esc_html($count) . '</td></tr>';
        if (!empty($last['summary'])) {
            echo '<tr><th scope="row">' . esc_html__('Last push result', 'rt-event-manager') . '</th><td><code>' . esc_html($last['summary']) . '</code><br><span class="description">' . esc_html($last['when'] ?? '') . '</span></td></tr>';
        }
        $ws_log = get_option('rt_event_manager_wallet_ws_log', array());
        echo '<tr><th scope="row">' . esc_html__('Web service log', 'rt-event-manager') . '</th><td>';
        if (empty($ws_log) || !is_array($ws_log)) {
            echo '<span class="description">' . esc_html__('No web-service requests received yet. If devices still do not register, Apple is not reaching this URL — check that it is HTTPS, uses pretty permalinks, and the REST API is publicly reachable.', 'rt-event-manager') . '</span>';
        } else {
            echo '<pre style="max-height:160px;overflow:auto;margin:0;padding:8px;background:#f6f7f7;border:1px solid #dcdcde;">' . esc_html(implode("\n", $ws_log)) . '</pre>';
        }
        echo '</td></tr>';
        echo '</table>';

        echo '<form method="post" style="margin-top:8px;">';
        wp_nonce_field('rt_wallet_test', 'rt_wallet_test_nonce');
        echo '<input type="number" name="test_order" placeholder="' . esc_attr__('Order #', 'rt-event-manager') . '" style="width:120px;" /> ';
        echo '<input type="number" name="test_number" placeholder="' . esc_attr__('Ticket #', 'rt-event-manager') . '" style="width:100px;" /> ';
        echo '<button type="submit" class="button">' . esc_html__('Send test update', 'rt-event-manager') . '</button>';
        echo '<p class="description">' . esc_html__('Sends a push to every device registered for that pass and reports the APNs response above.', 'rt-event-manager') . '</p>';
        echo '</form>';
    }

    /* ---------------------------------------------------------------------
     * Download
     * ------------------------------------------------------------------- */

    public function ajax_download() {
        if (!is_user_logged_in()) {
            wp_die(esc_html__('You must be logged in.', 'rt-event-manager'));
        }
        $ticket_id = isset($_GET['ticket_id']) ? absint($_GET['ticket_id']) : 0;
        if (!$ticket_id || !isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rt_event_manager_apple_pass_' . $ticket_id)) {
            wp_die(esc_html__('Invalid request.', 'rt-event-manager'));
        }
        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        if (!$ticket || !RT_Event_Manager_Account::instance()->user_owns_ticket($ticket, get_current_user_id())) {
            wp_die(esc_html__('Ticket not found.', 'rt-event-manager'));
        }

        $pkpass = $this->build_pkpass($ticket);
        if (is_wp_error($pkpass)) {
            wp_die(esc_html($pkpass->get_error_message()));
        }

        $ref = 'ticket-' . absint($ticket['order_id']) . '-' . (absint($ticket['ticket_index']) + 1);
        nocache_headers();
        header('Content-Type: application/vnd.apple.pkpass');
        header('Content-Disposition: attachment; filename="' . sanitize_file_name($ref) . '.pkpass"');
        header('Content-Length: ' . strlen($pkpass));
        echo $pkpass; // phpcs:ignore
        exit;
    }

    /* ---------------------------------------------------------------------
     * Pass building + signing
     * ------------------------------------------------------------------- */

    /** Decrypt and validate the signing material. Returns array or WP_Error. */
    private function load_signing_material() {
        if (!self::is_configured()) {
            return new WP_Error('not_configured', __('Apple Wallet is not fully configured.', 'rt-event-manager'));
        }
        $pass = RT_Event_Manager_Visa::decrypt(self::opt('p12_pass_enc'));
        $wwdr = RT_Event_Manager_Visa::decrypt(self::opt('wwdr_enc'));
        if ('' === $wwdr) {
            return new WP_Error('bad_certs', __('Could not read the stored WWDR certificate.', 'rt-event-manager'));
        }

        // Prefer an explicit PEM certificate + key (avoids the OpenSSL 3 vs
        // macOS-Keychain .p12 legacy-cipher incompatibility). Fall back to .p12.
        $cert_pem = RT_Event_Manager_Visa::decrypt(self::opt('cert_enc'));
        $key_pem  = RT_Event_Manager_Visa::decrypt(self::opt('key_enc'));
        $cert = '';
        $pkey = '';
        $pkey_pass = null;
        if ('' !== $cert_pem && '' !== $key_pem) {
            $cert = $cert_pem;
            $pkey = $key_pem;
            // A PEM key may be passphrase-protected; reuse the password field.
            $pkey_pass = ('' !== $pass) ? $pass : null;
        } else {
            $p12 = RT_Event_Manager_Visa::decrypt(self::opt('p12_enc'));
            if ('' === $p12) {
                return new WP_Error('bad_certs', __('No signing certificate is stored.', 'rt-event-manager'));
            }
            $certs = array();
            if (!openssl_pkcs12_read($p12, $certs, $pass)) {
                return new WP_Error('p12', __('Could not open the .p12. If it was exported from macOS Keychain and your server runs OpenSSL 3, its legacy encryption cannot be read — upload a PEM certificate + key instead (see the note below), or re-export the .p12 with modern encryption.', 'rt-event-manager'));
            }
            if (empty($certs['cert']) || empty($certs['pkey'])) {
                return new WP_Error('p12_contents', __('The .p12 is missing the certificate or private key.', 'rt-event-manager'));
            }
            $cert = $certs['cert'];
            $pkey = $certs['pkey'];
        }

        // WWDR to PEM (accept DER or PEM input).
        $wwdr_pem = '';
        $x = @openssl_x509_read($wwdr);
        if (!$x) {
            $pem = "-----BEGIN CERTIFICATE-----\n" . chunk_split(base64_encode($wwdr), 64, "\n") . "-----END CERTIFICATE-----\n";
            $x = @openssl_x509_read($pem);
        }
        if (!$x || !openssl_x509_export($x, $wwdr_pem)) {
            return new WP_Error('wwdr', __('Could not read the WWDR certificate.', 'rt-event-manager'));
        }

        return array('cert' => $cert, 'pkey' => $pkey, 'pkey_pass' => $pkey_pass, 'wwdr' => $wwdr_pem);
    }

    /** Build a signed .pkpass for a ticket. Returns bytes or WP_Error. */
    public function build_pkpass($ticket) {
        $material = $this->load_signing_material();
        if (is_wp_error($material)) {
            return $material;
        }

        $files = $this->pass_files($ticket);

        // manifest.json = SHA-1 of every file.
        $manifest = array();
        foreach ($files as $name => $data) {
            $manifest[$name] = sha1($data);
        }
        $files['manifest.json'] = wp_json_encode($manifest);

        // Sign manifest.json (detached PKCS#7, extract DER from the S/MIME output).
        $tmp = trailingslashit(get_temp_dir()) . 'rtem-pkpass-' . wp_generate_password(8, false);
        if (!wp_mkdir_p($tmp)) {
            return new WP_Error('tmp', __('Could not create a temp directory.', 'rt-event-manager'));
        }
        $manifest_path = $tmp . '/manifest.json';
        $wwdr_path     = $tmp . '/wwdr.pem';
        $sig_smime     = $tmp . '/signature.smime';
        file_put_contents($manifest_path, $files['manifest.json']);
        file_put_contents($wwdr_path, $material['wwdr']);

        $signed = openssl_pkcs7_sign(
            $manifest_path,
            $sig_smime,
            $material['cert'],
            array($material['pkey'], $material['pkey_pass']),
            array(),
            PKCS7_BINARY | PKCS7_DETACHED,
            $wwdr_path
        );
        $signature = '';
        if ($signed && file_exists($sig_smime)) {
            $smime = file_get_contents($sig_smime);
            if (preg_match('/filename="smime\.p7s".*?\r?\n\r?\n(.*?)\r?\n\r?\n?--/s', $smime, $m)) {
                $signature = base64_decode(preg_replace('/\s+/', '', $m[1]));
            }
        }
        // Clean up temp files.
        foreach (array($manifest_path, $wwdr_path, $sig_smime) as $f) {
            if (file_exists($f)) {
                @unlink($f);
            }
        }
        @rmdir($tmp);

        if ('' === $signature) {
            return new WP_Error('sign', __('Could not sign the pass.', 'rt-event-manager'));
        }
        $files['signature'] = $signature;

        // Zip everything into the .pkpass.
        $zip_path = trailingslashit(get_temp_dir()) . 'rtem-' . wp_generate_password(8, false) . '.pkpass';
        $zip = new ZipArchive();
        if (true !== $zip->open($zip_path, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
            return new WP_Error('zip', __('Could not create the pass archive.', 'rt-event-manager'));
        }
        foreach ($files as $name => $data) {
            $zip->addFromString($name, $data);
        }
        $zip->close();
        $bytes = file_get_contents($zip_path);
        @unlink($zip_path);

        return (false !== $bytes) ? $bytes : new WP_Error('read', __('Could not read the pass archive.', 'rt-event-manager'));
    }

    /** The pass.json + icon assets (name => bytes). */
    private function pass_files($ticket) {
        $kind    = RT_Event_Manager::get_ticket_kind($ticket);
        $product = wc_get_product($ticket['product_id']);
        $pname   = $product ? $product->get_name() : RT_Event_Manager::ticket_kind_label($ticket);
        $holder  = ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : __('Attendee', 'rt-event-manager');
        $number  = absint($ticket['ticket_index']) + 1;

        $back = array();
        $add_back = function ($label, $rows) use (&$back) {
            $names = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $names[] = $p ? $p->get_name() : ('#' . absint($r['product_id']));
            }
            if ($names) {
                $back[] = array('key' => sanitize_key($label), 'label' => $label, 'value' => implode(', ', $names));
            }
        };
        $add_back(__('Pretours', 'rt-event-manager'), RT_Event_Manager::get_child_pretours(absint($ticket['id'])));
        $add_back(__('Day tours', 'rt-event-manager'), RT_Event_Manager::get_child_daytours(absint($ticket['id'])));
        if ('minor' === $kind && absint($ticket['parent_ticket_id'])) {
            $g = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
            if ($g && '' !== $g['holder_name']) {
                $back[] = array('key' => 'guardian', 'label' => __('Guardian', 'rt-event-manager'), 'value' => $g['holder_name']);
            }
        }

        // Family + club line, shown directly under the attendee (leftmost
        // auxiliary field aligns under the leftmost secondary field).
        $org = self::org_line($ticket);
        $aux = array();
        if ('' !== $org) {
            $aux[] = array('key' => 'org', 'label' => __('CLUB', 'rt-event-manager'), 'value' => $org);
        }
        $aux[] = array('key' => 'ticket', 'label' => __('TICKET', 'rt-event-manager'), 'value' => '#' . absint($ticket['order_id']) . ' · ' . $number);
        $aux[] = array('key' => 'status', 'label' => __('STATUS', 'rt-event-manager'), 'value' => self::status_label($ticket));

        $pass = array(
            'formatVersion'      => 1,
            'passTypeIdentifier' => self::opt('pass_type_id'),
            'serialNumber'       => absint($ticket['order_id']) . '-' . $number,
            'teamIdentifier'     => self::opt('team_id'),
            'organizationName'   => self::opt('org_name'),
            'description'        => $pname,
            'webServiceURL'      => self::web_service_url(),
            'authenticationToken' => self::auth_token(absint($ticket['order_id']) . '-' . $number),
            'foregroundColor'    => 'rgb(255,255,255)',
            'backgroundColor'    => 'rgb(204,11,36)',
            'labelColor'         => 'rgb(255,240,196)',
            'barcodes'           => array(array(
                'format'          => 'PKBarcodeFormatQR',
                'message'         => RT_Event_Manager_Ticket_Pass::checkin_token($ticket),
                'messageEncoding' => 'iso-8859-1',
            )),
            'eventTicket'        => array(
                'headerFields'    => array(),
                'primaryFields'   => array(array('key' => 'event', 'label' => __('EVENT', 'rt-event-manager'), 'value' => self::opt('event_name', 'RTI Half-Year Meeting 2027'))),
                'secondaryFields' => array(
                    array('key' => 'name', 'label' => __('ATTENDEE', 'rt-event-manager'), 'value' => $holder),
                    array('key' => 'type', 'label' => __('TYPE', 'rt-event-manager'), 'value' => RT_Event_Manager::ticket_kind_label($ticket)),
                ),
                'auxiliaryFields' => $aux,
                'backFields'      => $back,
            ),
        );

        // Top-right header title (Apple headerFields).
        $header_value = (string) self::opt('header_value');
        if ('' !== $header_value) {
            $pass['eventTicket']['headerFields'][] = array(
                'key'   => 'header',
                'label' => (string) self::opt('header_label'),
                'value' => $header_value,
            );
        }

        // Semantic tags → makes this a proper Apple "event pass".
        // https://developer.apple.com/documentation/walletpasses/creating-an-event-pass-using-semantic-tags
        $event_name = (string) self::opt('event_name', 'RTI Half-Year Meeting 2027');
        $semantics  = array(
            'eventType' => (string) self::opt('event_type', 'PKEventTypeGeneric'),
            'eventName' => $event_name,
        );

        // Event dates (stored as Y-m-d) → ISO-8601 with the site's timezone offset.
        $start = (string) get_option('rt_event_manager_event_start', '');
        $end   = (string) get_option('rt_event_manager_event_end', '');
        if ('' !== $start) {
            $ts = strtotime($start . ' 09:00:00');
            if ($ts) {
                $semantics['eventStartDate'] = wp_date('c', $ts);
            }
        }
        if ('' !== $end) {
            $ts = strtotime($end . ' 18:00:00');
            if ($ts) {
                $semantics['eventEndDate'] = wp_date('c', $ts);
            }
        }

        // Venue name + optional coordinates.
        $venue = (string) self::opt('venue_name');
        if ('' !== $venue) {
            $semantics['venueName'] = $venue;
        }
        $lat = self::opt('venue_lat');
        $lng = self::opt('venue_lng');
        if ('' !== (string) $lat && '' !== (string) $lng && is_numeric($lat) && is_numeric($lng)) {
            $semantics['venueLocation'] = array(
                'latitude'  => (float) $lat,
                'longitude' => (float) $lng,
            );
            // Surface the pass on the lock screen when near the venue.
            $pass['locations'] = array(array(
                'latitude'         => (float) $lat,
                'longitude'        => (float) $lng,
                'relevantText'     => $event_name,
            ));
        }

        $pass['semantics'] = $semantics;
        // Attach the event window to the whole pass so it can surface at the right time.
        if (isset($semantics['eventStartDate'])) {
            $pass['relevantDate'] = $semantics['eventStartDate'];
        }
        // Opt into the modern event-ticket presentation.
        $pass['preferredStyleSchemes'] = array('posterEventTicket');

        $logo_src = base64_decode((string) self::opt('logo'), true);
        $logo = function ($w, $h) use ($logo_src) {
            if ($logo_src) {
                $png = $this->resized_png($logo_src, $w, $h);
                if (null !== $png) {
                    return $png;
                }
            }
            return $this->solid_png($w, $h);
        };
        $icon_src = base64_decode((string) self::opt('icon'), true);
        $icon = function ($size) use ($icon_src, $logo_src) {
            foreach (array($icon_src, $logo_src) as $src) {
                if ($src) {
                    $png = $this->resized_png($src, $size, $size);
                    if (null !== $png) {
                        return $png;
                    }
                }
            }
            return $this->solid_png($size, $size);
        };

        $files = array(
            'pass.json'      => wp_json_encode($pass),
            'icon.png'       => $icon(29),
            'icon@2x.png'    => $icon(58),
            'icon@3x.png'    => $icon(87),
            'logo.png'       => $logo(160, 50),
            'logo@2x.png'    => $logo(320, 100),
            'logo@3x.png'    => $logo(480, 150),
        );

        return $files;
    }

    /** A solid brand-colour PNG of the given size. */
    private function solid_png($w, $h) {
        $im = imagecreatetruecolor($w, $h);
        $c  = imagecolorallocate($im, 204, 11, 36);
        imagefill($im, 0, 0, $c);
        ob_start();
        imagepng($im);
        $data = ob_get_clean();
        imagedestroy($im);
        return $data;
    }

    /**
     * Resize source image bytes to fit within w×h (aspect preserved, transparent
     * padding), returning PNG bytes or null on failure.
     */
    private function resized_png($src_bytes, $w, $h) {
        $src = @imagecreatefromstring($src_bytes);
        if (!$src) {
            return null;
        }
        $sw = imagesx($src);
        $sh = imagesy($src);
        if ($sw < 1 || $sh < 1) {
            imagedestroy($src);
            return null;
        }
        $ratio = min($w / $sw, $h / $sh);
        $tw    = max(1, (int) round($sw * $ratio));
        $th    = max(1, (int) round($sh * $ratio));
        $dst   = imagecreatetruecolor($w, $h);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefilledrectangle($dst, 0, 0, $w, $h, $transparent);
        imagecopyresampled($dst, $src, (int) (($w - $tw) / 2), (int) (($h - $th) / 2), 0, 0, $tw, $th, $sw, $sh);
        ob_start();
        imagepng($dst);
        $out = ob_get_clean();
        imagedestroy($src);
        imagedestroy($dst);
        return $out;
    }

    /* ---------------------------------------------------------------------
     * Pass Update Web Service — device registration + pass fetch + APNs push.
     * https://developer.apple.com/documentation/walletpasses
     * ------------------------------------------------------------------- */

    public function register_web_service_routes() {
        $ns = 'rtem-wallet';
        // Register / unregister a device for a pass.
        register_rest_route($ns, '/v1/devices/(?P<device>[^/]+)/registrations/(?P<ptid>[^/]+)/(?P<serial>[^/]+)', array(
            array('methods' => 'POST',   'callback' => array($this, 'ws_register'),   'permission_callback' => '__return_true'),
            array('methods' => 'DELETE', 'callback' => array($this, 'ws_unregister'), 'permission_callback' => '__return_true'),
        ));
        // Serials of passes registered to a device that changed since a tag.
        register_rest_route($ns, '/v1/devices/(?P<device>[^/]+)/registrations/(?P<ptid>[^/]+)', array(
            'methods' => 'GET', 'callback' => array($this, 'ws_serials'), 'permission_callback' => '__return_true',
        ));
        // Fetch the latest pass.
        register_rest_route($ns, '/v1/passes/(?P<ptid>[^/]+)/(?P<serial>[^/]+)', array(
            'methods' => 'GET', 'callback' => array($this, 'ws_get_pass'), 'permission_callback' => '__return_true',
        ));
        // Device logs (accept and ignore).
        register_rest_route($ns, '/v1/log', array(
            'methods' => 'POST', 'callback' => '__return_empty_array', 'permission_callback' => '__return_true',
        ));
    }

    /** Validate the "Authorization: ApplePass <token>" header for a serial. */
    private function ws_authed($request, $serial) {
        $header = (string) $request->get_header('authorization');
        // Some servers strip Authorization before it reaches PHP/WP — fall back
        // to the raw $_SERVER variants and apache_request_headers().
        if ('' === $header) {
            if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
                $header = (string) $_SERVER['HTTP_AUTHORIZATION'];
            } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
                $header = (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
            } elseif (function_exists('apache_request_headers')) {
                $h = apache_request_headers();
                foreach ($h as $k => $v) {
                    if (0 === strcasecmp($k, 'Authorization')) {
                        $header = (string) $v;
                        break;
                    }
                }
            }
        }
        if (0 === stripos($header, 'ApplePass ')) {
            $token = trim(substr($header, strlen('ApplePass ')));
            return hash_equals(self::auth_token($serial), $token);
        }
        return false;
    }

    /** Ring buffer of the last web-service hits, for settings-page diagnostics. */
    private function ws_log($line) {
        $log = get_option('rt_event_manager_wallet_ws_log', array());
        if (!is_array($log)) {
            $log = array();
        }
        array_unshift($log, current_time('mysql') . ' — ' . $line);
        update_option('rt_event_manager_wallet_ws_log', array_slice($log, 0, 12), false);
    }

    public function ws_register($request) {
        $serial   = sanitize_text_field($request['serial']);
        $has_auth = '' !== (string) $request->get_header('authorization')
            || !empty($_SERVER['HTTP_AUTHORIZATION']) || !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        if (!$this->ws_authed($request, $serial)) {
            $this->ws_log('register REJECTED (401) serial=' . $serial . ' auth-header=' . ($has_auth ? 'present' : 'MISSING'));
            return new WP_REST_Response(null, 401);
        }
        $body  = json_decode($request->get_body(), true);
        $token = is_array($body) && !empty($body['pushToken']) ? sanitize_text_field($body['pushToken']) : '';
        if ('' === $token) {
            $this->ws_log('register bad request (400, no pushToken) serial=' . $serial);
            return new WP_REST_Response(null, 400);
        }
        global $wpdb;
        $table  = self::registrations_table();
        $device = sanitize_text_field($request['device']);
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE device_lib_id = %s AND serial_number = %s",
            $device, $serial
        ));
        $wpdb->replace($table, array(
            'device_lib_id' => $device,
            'push_token'    => $token,
            'pass_type_id'  => sanitize_text_field($request['ptid']),
            'serial_number' => $serial,
            'updated_at'    => current_time('mysql'),
        ), array('%s', '%s', '%s', '%s', '%s'));
        $this->ws_log('register OK serial=' . $serial . ' device=' . substr($device, 0, 8) . '…');
        return new WP_REST_Response(null, $exists ? 200 : 201);
    }

    public function ws_unregister($request) {
        $serial = sanitize_text_field($request['serial']);
        if (!$this->ws_authed($request, $serial)) {
            return new WP_REST_Response(null, 401);
        }
        global $wpdb;
        $wpdb->delete(self::registrations_table(), array(
            'device_lib_id' => sanitize_text_field($request['device']),
            'serial_number' => $serial,
        ), array('%s', '%s'));
        return new WP_REST_Response(null, 200);
    }

    public function ws_serials($request) {
        global $wpdb;
        $table  = self::registrations_table();
        $device = sanitize_text_field($request['device']);
        $serials = $wpdb->get_col($wpdb->prepare(
            "SELECT serial_number FROM $table WHERE device_lib_id = %s AND pass_type_id = %s",
            $device, sanitize_text_field($request['ptid'])
        ));
        // Filter by the ticket's own updated_at against the passesUpdatedSince tag.
        $since = $request->get_param('passesUpdatedSince');
        $out   = array();
        $last  = 0;
        foreach ($serials as $serial) {
            $mtime = $this->serial_modified_ts($serial);
            if ($mtime > $last) {
                $last = $mtime;
            }
            if (!$since || $mtime > (int) $since) {
                $out[] = $serial;
            }
        }
        if (empty($out)) {
            return new WP_REST_Response(null, 204);
        }
        return new WP_REST_Response(array(
            'serialNumbers' => $out,
            'lastUpdated'   => (string) ($last ?: time()),
        ), 200);
    }

    public function ws_get_pass($request) {
        $serial = sanitize_text_field($request['serial']);
        if (!$this->ws_authed($request, $serial)) {
            return new WP_REST_Response(null, 401);
        }
        $ticket = $this->ticket_from_serial($serial);
        if (!$ticket) {
            return new WP_REST_Response(null, 404);
        }
        $pkpass = $this->build_pkpass($ticket);
        if (is_wp_error($pkpass)) {
            return new WP_REST_Response(null, 500);
        }
        nocache_headers();
        header('Content-Type: application/vnd.apple.pkpass');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $this->serial_modified_ts($serial)) . ' GMT');
        header('Content-Length: ' . strlen($pkpass));
        echo $pkpass; // phpcs:ignore
        exit;
    }

    /** Resolve "order-number" serial back to the ticket row. */
    private function ticket_from_serial($serial) {
        if (!preg_match('/^(\d+)-(\d+)$/', (string) $serial, $m)) {
            return null;
        }
        return RT_Event_Manager::get_ticket_by_order_and_number((int) $m[1], (int) $m[2]);
    }

    /** Unix timestamp the pass content last changed (the ticket's updated_at). */
    private function serial_modified_ts($serial) {
        $ticket = $this->ticket_from_serial($serial);
        if ($ticket && !empty($ticket['updated_at'])) {
            $ts = strtotime($ticket['updated_at']);
            if ($ts) {
                return $ts;
            }
        }
        return time();
    }

    /**
     * Notify Apple Wallet that a ticket changed: send a background APNs push to
     * every device registered for the pass; the device then re-fetches it.
     */
    public function notify($ticket) {
        if (!self::is_configured() || !is_array($ticket)) {
            return;
        }
        $serial = absint($ticket['order_id']) . '-' . (absint($ticket['ticket_index']) + 1);
        global $wpdb;
        $tokens = $wpdb->get_col($wpdb->prepare(
            'SELECT push_token FROM ' . self::registrations_table() . ' WHERE serial_number = %s',
            $serial
        ));
        if (empty($tokens)) {
            return;
        }
        $this->apns_push(array_unique(array_filter($tokens)));
    }

    /**
     * Send an empty background push to each APNs device token (HTTP/2 + cert).
     * Returns an array of per-token result strings and records the last outcome
     * for the settings-page diagnostics.
     */
    private function apns_push($tokens) {
        $material = $this->load_signing_material();
        if (is_wp_error($material)) {
            $this->record_apns_result('Certificate error: ' . $material->get_error_message());
            return array('error' => $material->get_error_message());
        }
        $tmp = trailingslashit(get_temp_dir()) . 'rtem-apns-' . wp_generate_password(8, false);
        if (!wp_mkdir_p($tmp)) {
            return array('error' => 'temp dir');
        }
        $cert_path = $tmp . '/cert.pem';
        $key_path  = $tmp . '/key.pem';
        file_put_contents($cert_path, $material['cert']);
        file_put_contents($key_path, $material['pkey']);

        $topic   = self::opt('pass_type_id');
        $results = array();
        foreach ($tokens as $token) {
            $resp_headers = array();
            $ch = curl_init('https://api.push.apple.com/3/device/' . $token);
            curl_setopt_array($ch, array(
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => '{}',
                CURLOPT_HTTPHEADER     => array('apns-topic: ' . $topic, 'apns-push-type: background', 'content-type: application/json'),
                CURLOPT_SSLCERT        => $cert_path,
                CURLOPT_SSLKEY         => $key_path,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HEADER         => false,
                CURLOPT_HTTP_VERSION   => defined('CURL_HTTP_VERSION_2_0') ? CURL_HTTP_VERSION_2_0 : 2,
                CURLOPT_TIMEOUT        => 10,
            ));
            if (!empty($material['pkey_pass'])) {
                curl_setopt($ch, CURLOPT_SSLKEYPASSWD, $material['pkey_pass']);
            }
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $err    = curl_error($ch);
            curl_close($ch);

            $short = substr($token, 0, 8) . '…';
            if ($err) {
                $results[] = $short . ': cURL error — ' . $err;
            } elseif (200 === (int) $status) {
                $results[] = $short . ': OK';
            } else {
                $results[] = $short . ': HTTP ' . $status . ' ' . trim((string) $body);
            }
        }

        foreach (array($cert_path, $key_path) as $f) {
            if (file_exists($f)) {
                @unlink($f);
            }
        }
        @rmdir($tmp);

        $this->record_apns_result(implode(' | ', $results));
        return $results;
    }

    /** Store the most recent APNs outcome for the settings-page diagnostics. */
    private function record_apns_result($summary) {
        update_option('rt_event_manager_wallet_apns_last', array(
            'when'    => current_time('mysql'),
            'summary' => (string) $summary,
        ), false);
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[RT Wallet APNs] ' . $summary);
        }
    }
}
