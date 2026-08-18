<?php
/**
 * RT Event Manager — Google Wallet event tickets.
 *
 * Produces an "Add to Google Wallet" save link: a JWT (signed RS256 with the
 * service-account key) that carries an EventTicketClass + EventTicketObject
 * inline, so no server-to-server API call is needed at issue time. The QR
 * barcode is the same signed check-in token used by the PDF and Apple passes,
 * so check-in is identical across all three.
 *
 * Branding (organization/event name, venue, event dates, colours) is shared
 * with the Apple Wallet settings — the same rt_event_manager_wallet_* options.
 * Only the Google-specific credentials live here: the Issuer ID and the service
 * account (its email plus private key). The private key is stored AES-encrypted
 * (reusing the visa crypto) and never written to the web root.
 */

if (!defined('ABSPATH')) {
    exit;
}

class RT_Event_Manager_Google_Wallet {

    const CAP = 'manage_woocommerce';

    /** @var RT_Event_Manager_Google_Wallet|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'), 22);
        add_action('wp_ajax_rt_event_manager_google_pass', array($this, 'ajax_redirect'));
    }

    /* ---------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------- */

    /** Google-specific options. */
    private static function opt($key, $default = '') {
        return get_option('rt_event_manager_google_' . $key, $default);
    }

    /** Shared branding options (same store as the Apple Wallet page). */
    private static function wopt($key, $default = '') {
        return get_option('rt_event_manager_wallet_' . $key, $default);
    }

    /** Whether Google Wallet save links can be issued (all credentials present). */
    public static function is_configured() {
        return '' !== self::opt('issuer_id')
            && '' !== self::opt('sa_email')
            && '' !== self::opt('sa_key_enc');
    }

    /* ---------------------------------------------------------------------
     * Admin settings
     * ------------------------------------------------------------------- */

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Google Wallet', 'rt-event-manager'),
            __('Google Wallet', 'rt-event-manager'),
            self::CAP,
            'rt-event-manager-google-wallet',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }

        if (isset($_POST['rt_gwallet_nonce']) && wp_verify_nonce($_POST['rt_gwallet_nonce'], 'rt_gwallet_save')) {
            update_option('rt_event_manager_google_issuer_id', sanitize_text_field(wp_unslash($_POST['google_issuer_id'] ?? '')));
            update_option('rt_event_manager_google_class_suffix', sanitize_text_field(wp_unslash($_POST['google_class_suffix'] ?? '')));
            update_option('rt_event_manager_google_logo_url', esc_url_raw(wp_unslash($_POST['google_logo_url'] ?? '')));

            // Service account JSON upload: parse client_email + private_key.
            if (!empty($_FILES['google_sa_json']['tmp_name']) && is_uploaded_file($_FILES['google_sa_json']['tmp_name'])) {
                $raw = file_get_contents($_FILES['google_sa_json']['tmp_name']);
                $sa  = json_decode((string) $raw, true);
                if (is_array($sa) && !empty($sa['client_email']) && !empty($sa['private_key'])) {
                    update_option('rt_event_manager_google_sa_email', sanitize_email($sa['client_email']));
                    update_option('rt_event_manager_google_sa_key_enc', RT_Event_Manager_Visa::encrypt($sa['private_key']));
                } else {
                    echo '<div class="notice notice-error"><p>' . esc_html__('That file is not a valid service-account JSON key (missing client_email or private_key).', 'rt-event-manager') . '</p></div>';
                }
            }

            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Google Wallet settings saved.', 'rt-event-manager') . '</p></div>';

            if (self::is_configured()) {
                // Validate that the stored key is usable for signing.
                $key = RT_Event_Manager_Visa::decrypt(self::opt('sa_key_enc'));
                if ('' === $key || false === @openssl_pkey_get_private($key)) {
                    echo '<div class="notice notice-error"><p>' . esc_html__('The stored service-account private key could not be read. Re-upload the JSON key file.', 'rt-event-manager') . '</p></div>';
                } else {
                    echo '<div class="notice notice-success"><p>' . esc_html__('Service account loaded successfully — Google Wallet save links are ready.', 'rt-event-manager') . '</p></div>';
                }
            }
        }

        $has_key = '' !== self::opt('sa_key_enc');
        $email   = self::opt('sa_email');
        $suffix  = self::opt('class_suffix', 'rt_event');

        echo '<div class="wrap"><h1>' . esc_html__('Google Wallet', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Configure a Google Wallet Issuer account so attendees can add their ticket to Google Wallet. The service-account key is stored encrypted.', 'rt-event-manager') . '</p>';
        echo '<p class="description">' . wp_kses(
            __('Branding (organization name, event name, venue, event dates and colours) is <strong>shared with the Apple Wallet settings</strong>. Set those on the Apple Wallet page; event dates come from the plugin event settings.', 'rt-event-manager'),
            array('strong' => array())
        ) . '</p>';

        echo '<form method="post" enctype="multipart/form-data">';
        wp_nonce_field('rt_gwallet_save', 'rt_gwallet_nonce');
        echo '<table class="form-table">';

        echo '<tr><th scope="row">' . esc_html__('Issuer ID', 'rt-event-manager') . '</th><td>';
        echo '<input type="text" class="regular-text" name="google_issuer_id" value="' . esc_attr(self::opt('issuer_id')) . '" />';
        echo '<p class="description">' . esc_html__('Your numeric Google Wallet Issuer ID (from the Google Pay & Wallet Console).', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Event class suffix', 'rt-event-manager') . '</th><td>';
        echo '<input type="text" class="regular-text" name="google_class_suffix" value="' . esc_attr($suffix) . '" />';
        echo '<p class="description">' . esc_html__('Identifier for this event’s ticket class (letters, numbers, dot, underscore, hyphen). The full class ID is issuerId.suffix.', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Logo URL', 'rt-event-manager') . '</th><td>';
        echo '<input type="url" class="regular-text" name="google_logo_url" value="' . esc_attr(self::opt('logo_url')) . '" placeholder="https://…/logo.png" />';
        echo '<p class="description">' . esc_html__('Publicly reachable, HTTPS square image (Google fetches it — no upload). Shown on the Google Wallet pass. Recommended around 660×660px.', 'rt-event-manager') . '</p></td></tr>';

        echo '<tr><th scope="row">' . esc_html__('Service account key (JSON)', 'rt-event-manager') . '</th><td>';
        echo '<input type="file" name="google_sa_json" accept=".json,application/json" />';
        $key_note = $has_key
            ? sprintf(__('A key is stored for %s. Upload a new JSON key to replace it.', 'rt-event-manager'), $email ? $email : __('the service account', 'rt-event-manager'))
            : __('Upload the service-account JSON key that has the Wallet Object Issuer role.', 'rt-event-manager');
        echo '<p class="description">' . esc_html($key_note) . '</p></td></tr>';

        echo '</table>';
        submit_button(__('Save Google Wallet settings', 'rt-event-manager'));
        echo '</form></div>';
    }

    /* ---------------------------------------------------------------------
     * Save link (signed JWT)
     * ------------------------------------------------------------------- */

    /** URL-safe base64 without padding, per JWT spec. */
    private static function b64url($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function loc($value) {
        return array('defaultValue' => array('language' => 'en-US', 'value' => (string) $value));
    }

    /** Event dates (Y-m-d options) → ISO-8601 with the site's timezone offset. */
    private static function iso_dates() {
        $out   = array();
        $start = (string) get_option('rt_event_manager_event_start', '');
        $end   = (string) get_option('rt_event_manager_event_end', '');
        if ('' !== $start && ($ts = strtotime($start . ' 09:00:00'))) {
            $out['start'] = wp_date('c', $ts);
        }
        if ('' !== $end && ($ts = strtotime($end . ' 18:00:00'))) {
            $out['end'] = wp_date('c', $ts);
        }
        return $out;
    }

    /** Full class ID for this event. */
    private static function class_id() {
        return self::opt('issuer_id') . '.' . (self::opt('class_suffix', 'rt_event') ?: 'rt_event');
    }

    /** The inline EventTicketClass definition. */
    private function ticket_class() {
        $class = array(
            'id'           => self::class_id(),
            'issuerName'   => self::wopt('org_name', get_bloginfo('name')),
            'reviewStatus' => 'UNDER_REVIEW',
            'eventName'    => self::loc(self::wopt('event_name', 'RTI Half-Year Meeting 2027')),
            'hexBackgroundColor' => '#CC0B24',
            // Pin the ticket holder (and type) to the front of the card.
            'classTemplateInfo' => array(
                'cardTemplateOverride' => array(
                    'cardRowTemplateInfos' => array(
                        array(
                            'twoItems' => array(
                                'startItem' => array('firstValue' => array('fields' => array(
                                    array('fieldPath' => "object.textModulesData['attendee']"),
                                ))),
                                'endItem'   => array('firstValue' => array('fields' => array(
                                    array('fieldPath' => "object.textModulesData['ticket']"),
                                ))),
                            ),
                        ),
                        // Second row under the attendee: family + club.
                        array(
                            'oneItem' => array(
                                'item' => array('firstValue' => array('fields' => array(
                                    array('fieldPath' => "object.textModulesData['org']"),
                                ))),
                            ),
                        ),
                    ),
                ),
            ),
        );

        $logo_url = (string) self::opt('logo_url');
        if ('' !== $logo_url) {
            $class['logo'] = array(
                'sourceUri'         => array('uri' => $logo_url),
                'contentDescription' => self::loc(self::wopt('event_name', 'RTI Half-Year Meeting 2027')),
            );
        }

        $venue = (string) self::wopt('venue_name');
        if ('' !== $venue) {
            $class['venue'] = array(
                'name'    => self::loc($venue),
                'address' => self::loc($venue),
            );
        }

        $dates = self::iso_dates();
        if (!empty($dates['start']) || !empty($dates['end'])) {
            $dt = array();
            if (!empty($dates['start'])) {
                $dt['start'] = $dates['start'];
            }
            if (!empty($dates['end'])) {
                $dt['end'] = $dates['end'];
            }
            $class['dateTime'] = $dt;
        }

        return $class;
    }

    /** The inline EventTicketObject for one ticket. */
    private function ticket_object($ticket) {
        $number = absint($ticket['ticket_index']) + 1;
        $holder = ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : __('Attendee', 'rt-event-manager');
        $uid    = 'rtem-' . absint($ticket['order_id']) . '-' . $number;

        $status = isset($ticket['status']) ? $ticket['status'] : 'draft';
        // Map the ticket status to a Google Wallet object state.
        if ('checked_in' === $status) {
            $state = 'COMPLETED';
        } elseif ('valid' === $status) {
            $state = 'ACTIVE';
        } else { // cancelled, refunded, invalid, draft
            $state = 'INACTIVE';
        }

        $obj = array(
            'id'               => self::opt('issuer_id') . '.' . $uid,
            'classId'          => self::class_id(),
            'state'            => $state,
            'ticketHolderName' => $holder,
            'ticketNumber'     => '#' . absint($ticket['order_id']) . ' · ' . $number,
            'barcode'          => array(
                'type'  => 'QR_CODE',
                'value' => RT_Event_Manager_Ticket_Pass::checkin_token($ticket),
            ),
            'hexBackgroundColor' => '#CC0B24',
        );

        // Ticket holder (shown on the front of the pass) + type.
        $obj['textModulesData'] = array(
            array(
                'id'     => 'attendee',
                'header' => __('Ticket holder', 'rt-event-manager'),
                'body'   => $holder,
            ),
            array(
                'id'     => 'ticket',
                'header' => __('Ticket', 'rt-event-manager'),
                'body'   => '#' . absint($ticket['order_id']) . ' · ' . $number,
            ),
            array(
                'id'     => 'status',
                'header' => __('Status', 'rt-event-manager'),
                'body'   => RT_Event_Manager_Apple_Wallet::status_label($ticket),
            ),
        );

        // Minors are identified by their Future Circler / Future Tabler category.
        if ('minor' === RT_Event_Manager::get_ticket_kind($ticket)) {
            $obj['textModulesData'][] = array(
                'id'     => 'category',
                'header' => __('Category', 'rt-event-manager'),
                'body'   => RT_Event_Manager::ticket_kind_label($ticket),
            );
        }

        // Family + club line (shown under the attendee on the card front).
        $org = RT_Event_Manager_Apple_Wallet::org_line($ticket);
        if ('' !== $org) {
            $obj['textModulesData'][] = array(
                'id'     => 'org',
                'header' => __('Club', 'rt-event-manager'),
                'body'   => $org,
            );
        }

        // Attached tours + guardian (mirrors the Apple pass back fields).
        $add = function ($label, $rows) use (&$obj) {
            $names = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $names[] = $p ? $p->get_name() : ('#' . absint($r['product_id']));
            }
            if ($names) {
                $obj['textModulesData'][] = array(
                    'id'     => sanitize_key($label),
                    'header' => $label,
                    'body'   => implode(', ', $names),
                );
            }
        };
        $add(__('Pretours', 'rt-event-manager'), RT_Event_Manager::get_child_pretours(absint($ticket['id'])));
        $add(__('Day tours', 'rt-event-manager'), RT_Event_Manager::get_child_daytours(absint($ticket['id'])));

        $kind = RT_Event_Manager::get_ticket_kind($ticket);
        if ('minor' === $kind && absint($ticket['parent_ticket_id'])) {
            $g = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
            if ($g && '' !== $g['holder_name']) {
                $obj['textModulesData'][] = array(
                    'id'     => 'guardian',
                    'header' => __('Guardian', 'rt-event-manager'),
                    'body'   => $g['holder_name'],
                );
            }
        }

        return $obj;
    }

    /** Build the "Add to Google Wallet" URL for a ticket. Returns string or WP_Error. */
    public function save_link($ticket) {
        if (!self::is_configured()) {
            return new WP_Error('not_configured', __('Google Wallet is not fully configured.', 'rt-event-manager'));
        }
        $key = RT_Event_Manager_Visa::decrypt(self::opt('sa_key_enc'));
        if ('' === $key) {
            return new WP_Error('bad_key', __('Could not read the stored service-account key.', 'rt-event-manager'));
        }

        $claims = array(
            'iss'     => self::opt('sa_email'),
            'aud'     => 'google',
            'typ'     => 'savetowallet',
            'iat'     => (int) current_time('timestamp', true),
            'origins' => array(home_url()),
            'payload' => array(
                'eventTicketClasses'  => array($this->ticket_class()),
                'eventTicketObjects'  => array($this->ticket_object($ticket)),
            ),
        );

        $header  = array('alg' => 'RS256', 'typ' => 'JWT');
        $signing = self::b64url(wp_json_encode($header)) . '.' . self::b64url(wp_json_encode($claims));

        $sig = '';
        if (!openssl_sign($signing, $sig, $key, OPENSSL_ALGO_SHA256)) {
            return new WP_Error('sign', __('Could not sign the Google Wallet token.', 'rt-event-manager'));
        }

        $jwt = $signing . '.' . self::b64url($sig);
        return 'https://pay.google.com/gp/v/save/' . $jwt;
    }

    /** Owner-gated endpoint that redirects to the Google Wallet save link. */
    public function ajax_redirect() {
        if (!is_user_logged_in()) {
            wp_die(esc_html__('You must be logged in.', 'rt-event-manager'));
        }
        $ticket_id = isset($_GET['ticket_id']) ? absint($_GET['ticket_id']) : 0;
        if (!$ticket_id || !isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rt_event_manager_google_pass_' . $ticket_id)) {
            wp_die(esc_html__('Invalid request.', 'rt-event-manager'));
        }
        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        if (!$ticket || !RT_Event_Manager_Account::instance()->user_owns_ticket($ticket, get_current_user_id())) {
            wp_die(esc_html__('Ticket not found.', 'rt-event-manager'));
        }

        $link = $this->save_link($ticket);
        if (is_wp_error($link)) {
            wp_die(esc_html($link->get_error_message()));
        }

        nocache_headers();
        wp_redirect($link);
        exit;
    }

    /* ---------------------------------------------------------------------
     * Live updates — PATCH the EventTicketObject via the Wallet REST API.
     * ------------------------------------------------------------------- */

    /** Exchange the service-account key for an OAuth access token. Returns '' on failure. */
    private function access_token() {
        $key = RT_Event_Manager_Visa::decrypt(self::opt('sa_key_enc'));
        if ('' === $key) {
            return '';
        }
        $now    = (int) current_time('timestamp', true);
        $claims = array(
            'iss'   => self::opt('sa_email'),
            'scope' => 'https://www.googleapis.com/auth/wallet_object.issuer',
            'aud'   => 'https://oauth2.googleapis.com/token',
            'iat'   => $now,
            'exp'   => $now + 3600,
        );
        $header  = array('alg' => 'RS256', 'typ' => 'JWT');
        $signing = self::b64url(wp_json_encode($header)) . '.' . self::b64url(wp_json_encode($claims));
        $sig     = '';
        if (!openssl_sign($signing, $sig, $key, OPENSSL_ALGO_SHA256)) {
            return '';
        }
        $assertion = $signing . '.' . self::b64url($sig);

        $res = wp_remote_post('https://oauth2.googleapis.com/token', array(
            'timeout' => 15,
            'body'    => array(
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $assertion,
            ),
        ));
        if (is_wp_error($res)) {
            return '';
        }
        $data = json_decode(wp_remote_retrieve_body($res), true);
        return (is_array($data) && !empty($data['access_token'])) ? $data['access_token'] : '';
    }

    /**
     * Push an updated EventTicketObject to Google Wallet. The change propagates
     * to saved passes automatically — no device registration needed.
     */
    public function notify($ticket) {
        if (!self::is_configured() || !is_array($ticket)) {
            return;
        }
        $token = $this->access_token();
        if ('' === $token) {
            return;
        }
        $object    = $this->ticket_object($ticket);
        $object_id = $object['id'];

        wp_remote_request(
            'https://walletobjects.googleapis.com/walletobjects/v1/eventTicketObject/' . rawurlencode($object_id),
            array(
                'method'  => 'PATCH',
                'timeout' => 15,
                'headers' => array(
                    'Authorization' => 'Bearer ' . $token,
                    'Content-Type'  => 'application/json',
                ),
                'body'    => wp_json_encode($object),
            )
        );
    }
}
