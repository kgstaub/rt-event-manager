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
    }

    /* ---------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------- */

    private static function opt($key, $default = '') {
        return get_option('rt_event_manager_wallet_' . $key, $default);
    }

    /** Whether Apple Wallet passes can be issued (all credentials present). */
    public static function is_configured() {
        return '' !== self::opt('team_id')
            && '' !== self::opt('pass_type_id')
            && '' !== self::opt('org_name')
            && '' !== self::opt('p12_enc')
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

        echo '<tr><th scope="row">' . esc_html__('Pass certificate (.p12)', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_p12" accept=".p12,.pfx" />';
        echo '<p class="description">' . ($has_p12 ? esc_html__('A certificate is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('Upload your Pass Type ID .p12 export.', 'rt-event-manager')) . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('.p12 password', 'rt-event-manager') . '</th><td>';
        echo '<input type="password" class="regular-text" name="wallet_p12_pass" autocomplete="new-password" placeholder="' . ($has_pass ? '••••••••' : '') . '" />';
        echo '<p class="description">' . esc_html__('Leave blank to keep the stored password.', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Apple WWDR certificate', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="wallet_wwdr" accept=".cer,.pem,.crt" />';
        echo '<p class="description">' . ($has_wwdr ? esc_html__('A WWDR certificate is stored. Upload a new one to replace it.', 'rt-event-manager') : esc_html__('Upload the Apple WWDR intermediate certificate (.cer).', 'rt-event-manager')) . '</p></td></tr>';

        echo '</table>';
        echo '<p class="submit"><button type="submit" class="button button-primary">' . esc_html__('Save Apple Wallet settings', 'rt-event-manager') . '</button></p>';
        echo '</form></div>';
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
        $p12  = RT_Event_Manager_Visa::decrypt(self::opt('p12_enc'));
        $pass = RT_Event_Manager_Visa::decrypt(self::opt('p12_pass_enc'));
        $wwdr = RT_Event_Manager_Visa::decrypt(self::opt('wwdr_enc'));
        if ('' === $p12 || '' === $wwdr) {
            return new WP_Error('bad_certs', __('Could not read the stored certificates.', 'rt-event-manager'));
        }

        $certs = array();
        if (!openssl_pkcs12_read($p12, $certs, $pass)) {
            return new WP_Error('p12', __('Could not open the .p12 — check the password and file.', 'rt-event-manager'));
        }
        if (empty($certs['cert']) || empty($certs['pkey'])) {
            return new WP_Error('p12_contents', __('The .p12 is missing the certificate or private key.', 'rt-event-manager'));
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

        return array('cert' => $certs['cert'], 'pkey' => $certs['pkey'], 'wwdr' => $wwdr_pem);
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
            array($material['pkey'], null),
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

        $pass = array(
            'formatVersion'      => 1,
            'passTypeIdentifier' => self::opt('pass_type_id'),
            'serialNumber'       => absint($ticket['order_id']) . '-' . $number,
            'teamIdentifier'     => self::opt('team_id'),
            'organizationName'   => self::opt('org_name'),
            'description'        => $pname,
            'foregroundColor'    => 'rgb(255,255,255)',
            'backgroundColor'    => 'rgb(204,11,36)',
            'labelColor'         => 'rgb(255,240,196)',
            'barcodes'           => array(array(
                'format'          => 'PKBarcodeFormatQR',
                'message'         => RT_Event_Manager_Ticket_Pass::checkin_token($ticket),
                'messageEncoding' => 'iso-8859-1',
            )),
            'eventTicket'        => array(
                'primaryFields'   => array(array('key' => 'event', 'label' => __('EVENT', 'rt-event-manager'), 'value' => self::opt('event_name', 'RTI Half-Year Meeting 2027'))),
                'secondaryFields' => array(
                    array('key' => 'name', 'label' => __('ATTENDEE', 'rt-event-manager'), 'value' => $holder),
                    array('key' => 'type', 'label' => __('TYPE', 'rt-event-manager'), 'value' => RT_Event_Manager::ticket_kind_label($ticket)),
                ),
                'auxiliaryFields' => array(
                    array('key' => 'ticket', 'label' => __('TICKET', 'rt-event-manager'), 'value' => '#' . absint($ticket['order_id']) . ' · ' . $number),
                ),
                'backFields'      => $back,
            ),
        );

        return array(
            'pass.json'      => wp_json_encode($pass),
            'icon.png'       => $this->icon_png(29),
            'icon@2x.png'    => $this->icon_png(58),
            'icon@3x.png'    => $this->icon_png(87),
            'logo.png'       => $this->icon_png(50),
            'logo@2x.png'    => $this->icon_png(100),
        );
    }

    /** A solid brand-colour PNG icon of the given size. */
    private function icon_png($size) {
        $im = imagecreatetruecolor($size, $size);
        $c  = imagecolorallocate($im, 204, 11, 36);
        imagefill($im, 0, 0, $c);
        ob_start();
        imagepng($im);
        $data = ob_get_clean();
        imagedestroy($im);
        return $data;
    }
}
