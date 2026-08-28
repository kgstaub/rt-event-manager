<?php
/**
 * RT Event Manager — staff check-in (installable PWA).
 *
 * A shortcode-driven, staff-only page that scans a ticket's QR code (the signed
 * check-in token from RT_Event_Manager_Ticket_Pass), shows the ticket details,
 * and marks the ticket checked_in. Served as a Progressive Web App (manifest +
 * service worker) so staff can "Add to Home Screen" without installing anything.
 *
 * Access is limited to users who can edit shop orders (shop managers + admins).
 */

if (!defined('ABSPATH')) {
    exit;
}

class RT_Event_Manager_Checkin {

    const CAP = 'edit_shop_orders';
    const SESSION_MAIN = 'main';

    /** @var RT_Event_Manager_Checkin|null */
    private static $instance = null;

    /** @var bool Whether the current request renders the check-in page. */
    private $is_checkin_page = false;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('rt_event_manager_checkin', array($this, 'render_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'maybe_enqueue'));
        add_action('wp_head', array($this, 'head_tags'));
        add_action('template_redirect', array($this, 'serve_pwa'), 1);
        add_action('wp_ajax_rt_event_manager_checkin_lookup', array($this, 'ajax_lookup'));
        add_action('wp_ajax_rt_event_manager_checkin_do', array($this, 'ajax_do'));
        add_action('wp_ajax_rt_event_manager_checkin_profile', array($this, 'ajax_profile'));
        add_action('wp_ajax_rt_event_manager_checkin_reset', array($this, 'ajax_reset'));
        add_action('wp_ajax_rt_event_manager_checkin_sessions', array($this, 'ajax_sessions'));
        add_action('wp_ajax_rt_event_manager_checkin_toggle', array($this, 'ajax_toggle'));
        add_action('wp_ajax_rt_event_manager_checkin_set_status', array($this, 'ajax_set_tour_status'));
    }

    /* ---------------------------------------------------------------------
     * Access — WordPress shop managers/admins have everything; otherwise the
     * user's event-staff role decides which sessions they may work.
     * ------------------------------------------------------------------- */

    /** True if the user has a given staff capability (or is a shop manager). */
    private static function staff_cap($user_id, $cap) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id) {
            return false;
        }
        if (user_can($user_id, self::CAP)) {
            return true;
        }
        return class_exists('RT_Event_Manager_Staff') && RT_Event_Manager_Staff::user_can_staff($user_id, $cap);
    }

    public static function can_main($user_id = 0) {
        return self::staff_cap($user_id, class_exists('RT_Event_Manager_Staff') ? RT_Event_Manager_Staff::CAP_CHECKIN_MAIN : '');
    }
    public static function can_tours($user_id = 0) {
        return self::staff_cap($user_id, class_exists('RT_Event_Manager_Staff') ? RT_Event_Manager_Staff::CAP_CHECKIN_TOURS : '');
    }
    public static function can_open_close($user_id = 0) {
        return self::staff_cap($user_id, class_exists('RT_Event_Manager_Staff') ? RT_Event_Manager_Staff::CAP_OPEN_CLOSE : '');
    }
    public static function can_view_profiles($user_id = 0) {
        return self::staff_cap($user_id, class_exists('RT_Event_Manager_Staff') ? RT_Event_Manager_Staff::CAP_VIEW_PROFILES : '');
    }

    /** Whether the given user may open the check-in page at all. */
    public static function user_can_checkin($user_id = 0) {
        return self::can_main($user_id) || self::can_tours($user_id) || self::is_tour_guide($user_id);
    }

    /** Whether the user is assigned as guide/supervisor to at least one tour. */
    public static function is_tour_guide($user_id = 0) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id || !class_exists('RT_Event_Manager_Staff')) {
            return false;
        }
        return !empty(RT_Event_Manager_Staff::operator_tour_products($user_id));
    }

    /** Whether the user guides/supervises a specific tour product. */
    public static function is_guide_of($product_id, $user_id = 0) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id || !class_exists('RT_Event_Manager_Staff')) {
            return false;
        }
        return in_array((int) $product_id, array_map('intval', RT_Event_Manager_Staff::operator_tour_products($user_id)), true);
    }

    /** May the user open/close a specific tour? (open/close role, or its guide.) */
    public static function can_manage_tour($product_id, $user_id = 0) {
        return self::can_open_close($user_id) || self::is_guide_of($product_id, $user_id);
    }

    /**
     * May the user open a tour outside the normal "2 hours before" window?
     * Managers and shop managers/admins can (for overrides and testing).
     */
    public static function can_bypass_tour_window($user_id = 0) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id) {
            return false;
        }
        if (user_can($user_id, self::CAP) || user_can($user_id, 'manage_options')) {
            return true;
        }
        return class_exists('RT_Event_Manager_Staff')
            && RT_Event_Manager_Staff::ROLE_MANAGER === RT_Event_Manager_Staff::get_user_staff_role($user_id);
    }

    /** May the user scan boardings for a specific tour? (tours role, or its guide.) */
    public static function can_scan_tour($product_id, $user_id = 0) {
        return self::can_tours($user_id) || self::is_guide_of($product_id, $user_id);
    }

    /* ---------------------------------------------------------------------
     * Assets + PWA head tags
     * ------------------------------------------------------------------- */

    public function maybe_enqueue() {
        if (!is_singular()) {
            return;
        }
        $post = get_post();
        if (!$post || !has_shortcode($post->post_content, 'rt_event_manager_checkin')) {
            return;
        }
        $this->is_checkin_page = true;

        // Remember the page URL so the PWA manifest can use it as start_url.
        $url = get_permalink($post);
        if ($url && get_option('rt_event_manager_checkin_url') !== $url) {
            update_option('rt_event_manager_checkin_url', $url);
        }

        $this->enqueue_assets();
    }

    /**
     * Enqueue the check-in CSS/JS and localize its config. Public so the account
     * portal can embed the scanner as a tab (keeping the portal nav visible).
     */
    public function enqueue_assets() {
        $ver = defined('RT_EVENT_MANAGER_VERSION') ? RT_EVENT_MANAGER_VERSION : '1.0';
        $css = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/css/checkin.css';
        $js  = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/checkin.js';
        $jsq = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/jsqr.min.js';

        wp_enqueue_style('rt-event-manager-checkin', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/checkin.css', array(), file_exists($css) ? filemtime($css) : $ver);
        wp_enqueue_script('rt-event-manager-jsqr', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/jsqr.min.js', array(), file_exists($jsq) ? filemtime($jsq) : $ver, true);
        wp_enqueue_script('rt-event-manager-checkin', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/checkin.js', array('rt-event-manager-jsqr'), file_exists($js) ? filemtime($js) : $ver, true);

        wp_localize_script('rt-event-manager-checkin', 'rtEventManagerCheckin', array(
            'ajaxUrl'     => admin_url('admin-ajax.php'),
            'lookupNonce' => wp_create_nonce('rt_event_manager_checkin'),
            'swUrl'       => home_url('/?rtem_checkin=sw'),
            'canReset'    => current_user_can(self::reset_cap()),
            'canOpenClose'=> self::can_open_close(),
            'i18n'        => array(
                'session'      => __('Event', 'rt-event-manager'),
                'board'        => __('Board', 'rt-event-manager'),
                'boarded'      => __('Boarded', 'rt-event-manager'),
                'openEvent'    => __('Open event', 'rt-event-manager'),
                'closeEvent'   => __('Close event', 'rt-event-manager'),
                'eventOpen'    => __('Open', 'rt-event-manager'),
                'eventClosed'  => __('Closed', 'rt-event-manager'),
                'closedScan'   => __('This event is closed — open it before scanning.', 'rt-event-manager'),
                'confirmClose' => __('Close this event? Everyone not scanned will be marked as not attended.', 'rt-event-manager'),
                'boardedOf'    => __('%1$d of %2$d boarded', 'rt-event-manager'),
                'cameraError'  => __('Could not access the camera. Check permissions, or use manual entry.', 'rt-event-manager'),
                'scanning'     => __('Point the camera at the ticket QR code…', 'rt-event-manager'),
                'invalidCode'  => __('Unrecognised code — this is not a valid ticket QR.', 'rt-event-manager'),
                'notFound'     => __('Ticket not found.', 'rt-event-manager'),
                'networkError' => __('Network error. Please try again.', 'rt-event-manager'),
                'checkIn'      => __('Check in', 'rt-event-manager'),
                'checkedIn'    => __('Checked in', 'rt-event-manager'),
                'alreadyIn'    => __('Already checked in', 'rt-event-manager'),
                'checkedInBy'  => __('Checked in by', 'rt-event-manager'),
                'at'           => __('at', 'rt-event-manager'),
                'viewProfile'  => __('View profile', 'rt-event-manager'),
                'guardianProfile' => __('Guardian profile', 'rt-event-manager'),
                'mainProfile'  => __('Main account profile', 'rt-event-manager'),
                'resetCheckin' => __('Reset check-in', 'rt-event-manager'),
                'resetTogether' => __('Reset together', 'rt-event-manager'),
                'confirmReset' => __('Reset the check-in for this ticket?', 'rt-event-manager'),
                'profile'      => __('Member profile', 'rt-event-manager'),
                'phone'        => __('Phone', 'rt-event-manager'),
                'emergency'    => __('Emergency contacts', 'rt-event-manager'),
                'bookings'     => __('Booked tickets & tours', 'rt-event-manager'),
                'close'        => __('Close', 'rt-event-manager'),
            ),
        ));
    }

    public function head_tags() {
        if (!$this->is_checkin_page) {
            return;
        }
        echo '<link rel="manifest" href="' . esc_url(home_url('/?rtem_checkin=manifest')) . '">' . "\n";
        echo '<meta name="theme-color" content="#CC0B24">' . "\n";
        echo '<meta name="mobile-web-app-capable" content="yes">' . "\n";
        echo '<meta name="apple-mobile-web-app-capable" content="yes">' . "\n";
        echo '<meta name="apple-mobile-web-app-title" content="' . esc_attr__('Check-in', 'rt-event-manager') . '">' . "\n";
    }

    /* ---------------------------------------------------------------------
     * PWA endpoints (manifest + service worker), served from the site root so
     * the service worker scope covers the whole site.
     * ------------------------------------------------------------------- */

    public function serve_pwa() {
        if (empty($_GET['rtem_checkin'])) {
            return;
        }
        $what = sanitize_key(wp_unslash($_GET['rtem_checkin']));

        if ('manifest' === $what) {
            $start = get_option('rt_event_manager_checkin_url');
            if (!$start) {
                $start = home_url('/');
            }
            $manifest = array(
                'name'             => __('RTI Check-in', 'rt-event-manager'),
                'short_name'       => __('Check-in', 'rt-event-manager'),
                'description'      => __('Staff ticket check-in', 'rt-event-manager'),
                'start_url'        => $start,
                'scope'            => '/',
                'display'          => 'standalone',
                'orientation'      => 'portrait',
                'background_color' => '#ffffff',
                'theme_color'      => '#CC0B24',
                'icons'            => array(
                    array(
                        'src'     => RT_EVENT_MANAGER_PLUGIN_URL . 'assets/icon.svg',
                        'sizes'   => 'any',
                        'type'    => 'image/svg+xml',
                        'purpose' => 'any maskable',
                    ),
                ),
            );
            nocache_headers();
            header('Content-Type: application/manifest+json; charset=utf-8');
            echo wp_json_encode($manifest);
            exit;
        }

        if ('sw' === $what) {
            $shell   = get_option('rt_event_manager_checkin_url') ?: home_url('/');
            $css     = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/css/checkin.css';
            $js      = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/checkin.js';
            $jsq     = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/jsqr.min.js';
            // Version query so cached copies match the page's enqueued URLs and
            // change whenever an asset is edited.
            $vcss = file_exists($css) ? filemtime($css) : '1';
            $vjs  = file_exists($js) ? filemtime($js) : '1';
            $vjsq = file_exists($jsq) ? filemtime($jsq) : '1';
            $assets = array(
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/checkin.css?ver=' . $vcss,
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/checkin.js?ver=' . $vjs,
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/jsqr.min.js?ver=' . $vjsq,
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/icon.svg',
            );
            // Cache name embeds the asset versions → any edit rolls the cache, so
            // the new service worker purges the old assets on activate.
            $cache_name = 'rtem-checkin-' . $vcss . '-' . $vjs . '-' . $vjsq;
            nocache_headers();
            header('Content-Type: application/javascript; charset=utf-8');
            header('Service-Worker-Allowed: /');
            $precache = wp_json_encode(array_merge(array($shell), $assets));
            echo "var CACHE = " . wp_json_encode($cache_name) . ";\n";
            echo "var PRECACHE = " . $precache . ";\n";
            echo <<<'JS'
self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE).catch(function(){}); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
    var req = e.request;
    if (req.method !== 'GET') { return; }
    var url = new URL(req.url);
    // Never cache admin-ajax (dynamic check-in calls).
    if (url.pathname.indexOf('admin-ajax.php') !== -1) { return; }
    // App shell / navigations: network first, fall back to cache.
    if (req.mode === 'navigate') {
        e.respondWith(fetch(req).then(function (res) {
            var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
        }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match(PRECACHE[0]); }); }));
        return;
    }
    // Static assets: cache first.
    e.respondWith(caches.match(req).then(function (m) {
        return m || fetch(req).then(function (res) {
            if (res && res.status === 200 && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
            return res;
        });
    }));
});
JS;
            exit;
        }
    }

    /* ---------------------------------------------------------------------
     * Shortcode UI
     * ------------------------------------------------------------------- */

    public function render_shortcode() {
        if (!is_user_logged_in() || !self::user_can_checkin()) {
            $login = wp_login_url(get_permalink());
            return '<div class="rtem-checkin"><p>' . esc_html__('You must be signed in as event staff to use check-in.', 'rt-event-manager')
                . ' <a href="' . esc_url($login) . '">' . esc_html__('Sign in', 'rt-event-manager') . '</a></p></div>';
        }

        ob_start();
        ?>
        <div class="rtem-checkin" id="rtem-checkin">
            <header class="rtem-checkin-head">
                <h1><?php esc_html_e('Ticket Check-in', 'rt-event-manager'); ?></h1>
                <p class="rtem-checkin-user"><?php echo esc_html(wp_get_current_user()->display_name); ?></p>
            </header>

            <div class="rtem-session-bar" id="rtem-session-bar" hidden>
                <label class="rtem-session-pick"><?php esc_html_e('Event', 'rt-event-manager'); ?>
                    <select id="rtem-session"></select>
                </label>
                <div class="rtem-session-meta">
                    <span class="rtem-session-state" id="rtem-session-state"></span>
                    <span class="rtem-session-count" id="rtem-session-count"></span>
                    <button type="button" class="rtem-btn rtem-session-toggle" id="rtem-session-toggle" hidden></button>
                </div>
            </div>

            <div class="rtem-scan">
                <video id="rtem-video" playsinline muted></video>
                <div class="rtem-scan-overlay"></div>
            </div>
            <p class="rtem-hint" id="rtem-hint"><?php esc_html_e('Point the camera at the ticket QR code…', 'rt-event-manager'); ?></p>

            <div class="rtem-controls">
                <button type="button" class="rtem-btn rtem-btn-primary" id="rtem-start"><?php esc_html_e('Start camera', 'rt-event-manager'); ?></button>
                <button type="button" class="rtem-btn" id="rtem-manual-toggle"><?php esc_html_e('Enter code manually', 'rt-event-manager'); ?></button>
            </div>

            <form class="rtem-manual" id="rtem-manual" hidden>
                <label><?php esc_html_e('Order #', 'rt-event-manager'); ?> <input type="number" id="rtem-order" min="1" inputmode="numeric" /></label>
                <label><?php esc_html_e('Ticket #', 'rt-event-manager'); ?> <input type="number" id="rtem-number" min="1" inputmode="numeric" value="1" /></label>
                <button type="submit" class="rtem-btn rtem-btn-primary"><?php esc_html_e('Look up', 'rt-event-manager'); ?></button>
            </form>

            <div class="rtem-result" id="rtem-result" hidden></div>

            <div class="rtem-modal" id="rtem-profile" hidden>
                <div class="rtem-modal-backdrop" data-rtem-close></div>
                <div class="rtem-modal-dialog" id="rtem-profile-body"></div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /* ---------------------------------------------------------------------
     * AJAX
     * ------------------------------------------------------------------- */

    private function guard() {
        check_ajax_referer('rt_event_manager_checkin', 'nonce');
        if (!self::user_can_checkin()) {
            wp_send_json_error(array('message' => __('Not authorised.', 'rt-event-manager')));
        }
    }

    /** Resolve a scanned token or an explicit order/number to a ticket payload. */
    public function ajax_lookup() {
        $this->guard();

        $ticket = null;
        // Note: do NOT run the token through sanitize_text_field() — it strips
        // %XX octets and would corrupt the rawurlencoded name inside the token.
        // verify_checkin_token() strictly regex-validates the whole string.
        $token = isset($_POST['token']) ? trim((string) wp_unslash($_POST['token'])) : '';
        if ('' !== $token) {
            $data = RT_Event_Manager_Ticket_Pass::verify_checkin_token($token);
            if (!$data) {
                wp_send_json_error(array('message' => __('Unrecognised code — this is not a valid ticket QR.', 'rt-event-manager')));
            }
            $ticket = RT_Event_Manager::get_ticket_by_order_and_number($data['order_id'], $data['ticket_number']);
        } else {
            $order  = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;
            $number = isset($_POST['number']) ? absint($_POST['number']) : 0;
            if ($order && $number) {
                $ticket = RT_Event_Manager::get_ticket_by_order_and_number($order, $number);
            }
        }

        if (!$ticket) {
            wp_send_json_error(array('message' => __('Ticket not found.', 'rt-event-manager')));
        }

        // Which session are we scanning for? A tour session resolves the scan to
        // the person's tour ticket; otherwise it's the main registration desk.
        $session = isset($_POST['session']) ? sanitize_text_field(wp_unslash($_POST['session'])) : self::SESSION_MAIN;
        $tour    = self::parse_tour_session($session);
        if ($tour) {
            if (!self::can_scan_tour($tour['product_id'])) {
                wp_send_json_error(array('message' => __('You cannot check in tours.', 'rt-event-manager')));
            }
            $payload = $this->tour_lookup_payload($ticket, $session, $tour['product_id']);
            if (is_wp_error($payload)) {
                wp_send_json_error(array('message' => $payload->get_error_message()));
            }
            wp_send_json_success($payload);
        }

        if (!self::can_main()) {
            wp_send_json_error(array('message' => __('You cannot run main-event check-in.', 'rt-event-manager')));
        }

        // Reconcile the stored status against the live order before showing it:
        // an order cancelled/refunded/failed outside the normal sync would leave
        // the ticket row stale ('valid'), which must not read as Confirmed here.
        // recalculate_order_ticket_statuses() never touches deliberate terminal
        // states (checked_in/cancelled/refunded), so those are preserved.
        $mgr = RT_Event_Manager::instance();
        if (method_exists($mgr, 'recalculate_order_ticket_statuses')) {
            $mgr->recalculate_order_ticket_statuses(absint($ticket['order_id']));
            $fresh = RT_Event_Manager::get_ticket_by_id(absint($ticket['id']));
            if ($fresh) {
                $ticket = $fresh;
            }
        }

        wp_send_json_success($this->ticket_payload($ticket));
    }

    /**
     * Build the tour-session payload for a scanned ticket: resolve the person's
     * tour ticket for this tour product and report their booking/boarding state.
     *
     * @return array|WP_Error
     */
    private function tour_lookup_payload($scanned, $session, $product_id) {
        global $wpdb;
        $tk = $wpdb->prefix . 'rti_tickets';

        // The scanned code may already be the tour ticket, or (usually) the
        // attendee's main ticket whose child tour ticket we look up.
        $tour_ticket = null;
        if (in_array(RT_Event_Manager::get_ticket_kind($scanned), array('pretour', 'daytour'), true)
            && absint($scanned['product_id']) === absint($product_id)) {
            $tour_ticket = $scanned;
        } else {
            $tour_ticket = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM $tk WHERE parent_ticket_id = %d AND product_id = %d AND ticket_kind IN ('pretour','daytour') LIMIT 1",
                absint($scanned['id']), absint($product_id)
            ), ARRAY_A);
        }

        if (!$tour_ticket) {
            $who = ('' !== $scanned['holder_name']) ? $scanned['holder_name'] : __('This attendee', 'rt-event-manager');
            return new WP_Error('not_booked', sprintf(__('%s is not booked on this tour.', 'rt-event-manager'), $who));
        }
        $status = isset($tour_ticket['status']) ? $tour_ticket['status'] : '';
        if (in_array($status, array('cancelled', 'refunded'), true)) {
            return new WP_Error('cancelled', __('This tour booking has been cancelled.', 'rt-event-manager'));
        }

        $state   = self::session_state($session);
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT attended, boarded_at FROM $wpdb->prefix" . "rti_checkins WHERE session_key = %s AND ticket_id = %d",
            $session, absint($tour_ticket['id'])
        ), ARRAY_A);
        $counts  = self::session_counts($session, $product_id);
        $product = function_exists('wc_get_product') ? wc_get_product($product_id) : null;

        return array(
            'tour'               => true,
            'session'            => $session,
            'session_open'       => (isset($state['status']) && 'open' === $state['status']),
            'tour_ticket_id'     => absint($tour_ticket['id']),
            'attendee_ticket_id' => absint($tour_ticket['parent_ticket_id']),
            'holder'             => ('' !== $tour_ticket['holder_name']) ? $tour_ticket['holder_name'] : $scanned['holder_name'],
            'product'            => $product ? RT_Event_Manager::product_title($product->get_id()) : RT_Event_Manager::ticket_kind_label($tour_ticket),
            'boarded'            => ($existing && (int) $existing['attended'] === 1),
            'counts'             => $counts,
            'can_profile'        => self::can_view_profiles(),
            'profile_ticket_id'  => absint($scanned['id']),
        );
    }

    /** Mark a ticket checked in (idempotent; refuses cancelled/refunded). */
    public function ajax_do() {
        $this->guard();

        // Tour session: record a boarding rather than a main check-in.
        $session = isset($_POST['session']) ? sanitize_text_field(wp_unslash($_POST['session'])) : self::SESSION_MAIN;
        $tour    = self::parse_tour_session($session);
        if ($tour) {
            if (!self::can_scan_tour($tour['product_id'])) {
                wp_send_json_error(array('message' => __('You cannot check in tours.', 'rt-event-manager')));
            }
            $state = self::session_state($session);
            if (!isset($state['status']) || 'open' !== $state['status']) {
                wp_send_json_error(array('message' => __('This event is closed. Open it before scanning.', 'rt-event-manager')));
            }
            $tour_ticket_id = isset($_POST['tour_ticket_id']) ? absint($_POST['tour_ticket_id']) : 0;
            $tt = $tour_ticket_id ? RT_Event_Manager::get_ticket_by_id($tour_ticket_id) : null;
            if (!$tt || absint($tt['product_id']) !== absint($tour['product_id'])) {
                wp_send_json_error(array('message' => __('Tour ticket not found for this event.', 'rt-event-manager')));
            }
            $undo = !empty($_POST['undo']);
            if ($undo) {
                // Off-board: remove the boarding and revert the ticket, and
                // cascade to any boarded minors (they cannot stay without a guardian).
                self::record_unboarding($session, $tour_ticket_id);
                self::cascade_offboard_minors($session, absint($tt['parent_ticket_id']), $tour['product_id']);
            } else {
                if (in_array($tt['status'], array('cancelled', 'refunded'), true)) {
                    wp_send_json_error(array('message' => __('This tour booking has been cancelled.', 'rt-event-manager')));
                }
                // A minor can only board once their guardian is boarded.
                list($is_minor, $guardian_ok, $guardian_name) = self::guardian_boarding_status($session, $tt);
                if ($is_minor && !$guardian_ok) {
                    wp_send_json_error(array('message' => self::guardian_required_message($guardian_name)));
                }
                self::record_boarding($session, $tour_ticket_id, absint($tt['parent_ticket_id']));
            }
            $counts = self::session_counts($session, $tour['product_id']);
            wp_send_json_success(array(
                'boarded' => !$undo,
                'holder'  => ('' !== $tt['holder_name']) ? $tt['holder_name'] : ('#' . $tour_ticket_id),
                'counts'  => $counts,
            ));
        }

        if (!self::can_main()) {
            wp_send_json_error(array('message' => __('You cannot run main-event check-in.', 'rt-event-manager')));
        }

        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;
        $ticket    = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$ticket) {
            wp_send_json_error(array('message' => __('Ticket not found.', 'rt-event-manager')));
        }

        // The primary ticket plus any related tickets (guardian ⇄ minors) the
        // operator opted to check in at the same time.
        $ids = array($ticket_id);
        if (isset($_POST['also']) && is_array($_POST['also'])) {
            foreach ($_POST['also'] as $aid) {
                $aid = absint($aid);
                if ($aid && !in_array($aid, $ids, true)) {
                    $ids[] = $aid;
                }
            }
        }

        $results = array();
        foreach ($ids as $id) {
            $t = RT_Event_Manager::get_ticket_by_id($id);
            if (!$t) {
                continue;
            }
            // Reconcile against the live order first (a cancelled/refunded order
            // can leave a stale 'valid' row) so we never check in a dead ticket.
            $mgr = RT_Event_Manager::instance();
            if (method_exists($mgr, 'recalculate_order_ticket_statuses')) {
                $mgr->recalculate_order_ticket_statuses(absint($t['order_id']));
                $fresh = RT_Event_Manager::get_ticket_by_id($id);
                if ($fresh) {
                    $t = $fresh;
                }
            }
            $st     = isset($t['status']) ? $t['status'] : '';
            $holder = ('' !== $t['holder_name']) ? $t['holder_name'] : ('#' . $id);
            if ('checked_in' === $st) {
                $results[] = array('holder' => $holder, 'outcome' => 'already', 'status' => $st);
                continue;
            }
            // Only a confirmed ticket may be checked in — refuse anything else
            // (cancelled, refunded, invalid, draft/unpaid).
            if ('valid' !== $st) {
                $results[] = array('holder' => $holder, 'outcome' => 'refused', 'status' => $st);
                continue;
            }
            RT_Event_Manager::instance()->update_ticket($id, array(
                'status'        => 'checked_in',
                'checked_in_at' => current_time('mysql'),
                'checked_in_by' => get_current_user_id(),
            ));
            $results[] = array('holder' => $holder, 'outcome' => 'checked_in', 'status' => 'checked_in');
            // Refresh the attendee's saved wallet pass to show the checked-in state.
            if (function_exists('rt_event_manager_notify_wallets')) {
                rt_event_manager_notify_wallets($id);
            }
        }

        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        wp_send_json_success(array(
            'ticket'  => $this->ticket_payload($ticket),
            'results' => $results,
        ));
    }

    /** Capability required to reset (undo) a check-in — admins by default. */
    public static function reset_cap() {
        return apply_filters('rt_event_manager_checkin_reset_cap', 'manage_options');
    }

    /** Admin-only: undo a check-in and return the ticket to its normal status. */
    public function ajax_reset() {
        check_ajax_referer('rt_event_manager_checkin', 'nonce');
        if (!current_user_can(self::reset_cap())) {
            wp_send_json_error(array('message' => __('Only administrators can reset a check-in.', 'rt-event-manager')));
        }
        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;
        $ticket    = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$ticket) {
            wp_send_json_error(array('message' => __('Ticket not found.', 'rt-event-manager')));
        }
        if ('checked_in' !== $ticket['status']) {
            wp_send_json_error(array('message' => __('This ticket is not checked in.', 'rt-event-manager')));
        }

        // Reset the primary plus any related (guardian ⇄ minor) tickets the admin
        // opted to reset at the same time — the mirror of combined check-in.
        $ids = array($ticket_id);
        if (isset($_POST['also']) && is_array($_POST['also'])) {
            foreach ($_POST['also'] as $aid) {
                $aid = absint($aid);
                if ($aid && !in_array($aid, $ids, true)) {
                    $ids[] = $aid;
                }
            }
        }

        global $wpdb;
        $table  = $wpdb->prefix . 'rti_tickets';
        $orders = array();
        foreach ($ids as $id) {
            $t = RT_Event_Manager::get_ticket_by_id($id);
            if (!$t || 'checked_in' !== $t['status']) {
                continue;
            }
            $wpdb->query($wpdb->prepare(
                "UPDATE $table SET status = 'valid', checked_in_at = NULL, checked_in_by = 0 WHERE id = %d",
                $id
            ));
            $orders[absint($t['order_id'])] = true;
        }
        // Normalise statuses against the order(s) (paid → valid, unpaid → draft).
        if (method_exists(RT_Event_Manager::instance(), 'recalculate_order_ticket_statuses')) {
            foreach (array_keys($orders) as $oid) {
                RT_Event_Manager::instance()->recalculate_order_ticket_statuses($oid);
            }
        }

        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        wp_send_json_success(array('ticket' => $this->ticket_payload($ticket)));
    }

    /* ---------------------------------------------------------------------
     * Per-event check-in sessions (main registration desk + one per tour).
     * ------------------------------------------------------------------- */

    /** Parse a "tour:<product_id>:<Y-m-d>" key, or null. */
    private static function parse_tour_session($key) {
        if (preg_match('/^tour:(\d+):(\d{4}-\d{2}-\d{2}|)$/', (string) $key, $m)) {
            return array('product_id' => (int) $m[1], 'date' => $m[2]);
        }
        return null;
    }

    /** Stored open/closed state for a session key. */
    public static function session_state($key) {
        global $wpdb;
        $t = $wpdb->prefix . 'rti_checkin_sessions';
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $t WHERE session_key = %s", $key), ARRAY_A);
        return $row ?: array('session_key' => $key, 'status' => 'closed');
    }

    /** All tour check-in sessions (one per tour product + date). */
    public static function tour_sessions() {
        global $wpdb;
        $tk = $wpdb->prefix . 'rti_tickets';
        $pids = $wpdb->get_col("SELECT DISTINCT product_id FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id > 0");
        $out = array();
        foreach ($pids as $pid) {
            $pid = absint($pid);
            list($s) = RT_Event_Manager::tour_product_range($pid);
            $date    = $s ? gmdate('Y-m-d', $s) : '';
            $key     = 'tour:' . $pid . ':' . $date;
            $product = function_exists('wc_get_product') ? wc_get_product($pid) : null;
            $name    = $product ? RT_Event_Manager::product_title($product->get_id()) : ('#' . $pid);
            $label   = $name . ($s ? ' — ' . date_i18n('j M Y', $s) : '');
            $counts  = self::session_counts($key, $pid);
            $state   = self::session_state($key);
            $out[]   = array(
                'key'     => $key,
                'kind'    => 'tour',
                'label'   => $label,
                'status'  => isset($state['status']) ? $state['status'] : 'closed',
                'boarded' => $counts['boarded'],
                'total'   => $counts['total'],
            );
        }
        usort($out, function ($a, $b) { return strcmp($a['label'], $b['label']); });
        return $out;
    }

    /** Boarded (attended) count and expected-holder total for a tour session. */
    public static function session_counts($session_key, $product_id) {
        global $wpdb;
        $c  = $wpdb->prefix . 'rti_checkins';
        $tk = $wpdb->prefix . 'rti_tickets';
        $boarded = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $c c JOIN $tk t ON t.id = c.ticket_id
             WHERE c.session_key = %s AND c.attended = 1 AND t.staff_role = ''",
            $session_key
        ));
        // Expected attendees only — guide/supervisor duty rows are not counted.
        $total = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d AND status IN ('valid','checked_in','on_tour','attended','no_show') AND staff_role = ''",
            $product_id
        ));
        return array('boarded' => $boarded, 'total' => $total);
    }

    /**
     * Attendees expected on a tour session, each with their boarding state.
     * `attended`: 1 = boarded, 0 = marked not-attended (on close), null = not
     * yet scanned. Guide/supervisor duty rows are excluded.
     *
     * @param string $session_key
     * @param int    $product_id
     * @return array[]
     */
    public static function session_attendees($session_key, $product_id) {
        global $wpdb;
        $tk = $wpdb->prefix . 'rti_tickets';
        $c  = $wpdb->prefix . 'rti_checkins';
        // Same attendee set as session_counts()'s total, so the roster and the
        // count never disagree.
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT id, holder_name, phone, status, ticket_kind, parent_ticket_id FROM $tk
             WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d
               AND staff_role = '' AND status IN ('valid','checked_in','on_tour','attended','no_show')
             ORDER BY holder_name ASC",
            $product_id
        ), ARRAY_A);
        if (empty($rows)) {
            return array();
        }
        // Attach each attendee's boarding state for this session (separate query
        // to avoid any JOIN/bind pitfalls).
        $states = array();
        $cr = $wpdb->get_results($wpdb->prepare(
            "SELECT ticket_id, attended FROM $c WHERE session_key = %s", $session_key
        ), ARRAY_A);
        foreach ((array) $cr as $x) {
            $states[absint($x['ticket_id'])] = $x['attended'];
        }
        foreach ($rows as &$r) {
            $r['attended'] = array_key_exists(absint($r['id']), $states) ? $states[absint($r['id'])] : null;
        }
        unset($r);
        return $rows;
    }

    private static function open_session($key) {
        global $wpdb;
        $t   = $wpdb->prefix . 'rti_checkin_sessions';
        $now = current_time('mysql');
        $uid = get_current_user_id();
        $was_open = ('open' === (self::session_state($key)['status'] ?? ''));
        $wpdb->query($wpdb->prepare(
            "INSERT INTO $t (session_key, status, opened_by, opened_at) VALUES (%s, 'open', %d, %s)
             ON DUPLICATE KEY UPDATE status = 'open', opened_by = %d, opened_at = %s, closed_at = NULL",
            $key, $uid, $now, $uid, $now
        ));
        // On the transition to open, reconcile the roster + notify wallets.
        if (!$was_open) {
            $tour = self::parse_tour_session($key);
            if ($tour) {
                self::reconcile_open($key, $tour['product_id']);
                try {
                    self::notify_tour_departing($tour['product_id']);
                } catch (\Throwable $e) {
                    error_log('RT Event Manager: tour-open wallet notify failed: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Reconcile a tour's roster when it (re)opens: clear stale "not attended"
     * marks and set each ticket's status from its actual boarding — boarded →
     * on_tour, otherwise → valid. Keeps the three views in sync and lets a
     * reopened tour start clean. (cancelled/refunded are left untouched.)
     */
    private static function reconcile_open($key, $product_id) {
        global $wpdb;
        $c  = $wpdb->prefix . 'rti_checkins';
        $tk = $wpdb->prefix . 'rti_tickets';
        // Drop not-attended records so unboarded holders show "awaiting" again.
        $wpdb->query($wpdb->prepare("DELETE FROM $c WHERE session_key = %s AND attended = 0", $key));
        $holders = $wpdb->get_col($wpdb->prepare(
            "SELECT id FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d AND status NOT IN ('cancelled','refunded') AND staff_role = ''",
            $product_id
        ));
        foreach ($holders as $hid) {
            $hid     = absint($hid);
            $boarded = (int) $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $c WHERE session_key = %s AND ticket_id = %d AND attended = 1",
                $key, $hid
            )) > 0;
            $wpdb->query($wpdb->prepare(
                "UPDATE $tk SET status = %s WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status NOT IN ('cancelled','refunded')",
                $boarded ? 'on_tour' : 'valid',
                $hid
            ));
        }
    }

    /** Push a "tour departing" message to every booked guest's wallet pass. */
    private static function notify_tour_departing($product_id) {
        global $wpdb;
        $tk = $wpdb->prefix . 'rti_tickets';
        $parents = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT parent_ticket_id FROM $tk
             WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d
               AND staff_role = '' AND status IN ('valid','checked_in','on_tour','attended','no_show') AND parent_ticket_id > 0",
            $product_id
        ));
        if (empty($parents)) {
            return;
        }
        $product = function_exists('wc_get_product') ? wc_get_product($product_id) : null;
        $header  = $product ? RT_Event_Manager::product_title($product->get_id()) : __('Your tour', 'rt-event-manager');
        $body    = __('Your tour is soon ready to depart!', 'rt-event-manager');
        foreach ($parents as $pid) {
            $ticket = RT_Event_Manager::get_ticket_by_id(absint($pid));
            if (!$ticket) {
                continue;
            }
            if (class_exists('RT_Event_Manager_Google_Wallet')) {
                RT_Event_Manager_Google_Wallet::instance()->push_message($ticket, $header, $body);
            }
            // Apple passes have no arbitrary push text; refresh so the device
            // re-fetches the pass (the change surfaces via its field messages).
            if (class_exists('RT_Event_Manager_Apple_Wallet')) {
                RT_Event_Manager_Apple_Wallet::instance()->notify($ticket);
            }
        }
    }

    /** Close a tour session and confirm attendance (unscanned holders → absent). */
    private static function close_session($key, $product_id) {
        global $wpdb;
        $t   = $wpdb->prefix . 'rti_checkin_sessions';
        $c   = $wpdb->prefix . 'rti_checkins';
        $tk  = $wpdb->prefix . 'rti_tickets';
        $now = current_time('mysql');
        $uid = get_current_user_id();

        // Completing the tour is authoritative: each expected attendee's status is
        // set from whether they actually boarded this session — boarded → attended,
        // otherwise → no_show. (Guide/supervisor duty rows are staff, so excluded;
        // cancelled/refunded are left untouched.)
        $holders = $wpdb->get_results($wpdb->prepare(
            "SELECT id, parent_ticket_id FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d AND status NOT IN ('cancelled','refunded') AND staff_role = ''",
            $product_id
        ), ARRAY_A);
        foreach ($holders as $h) {
            $hid     = absint($h['id']);
            $boarded = (int) $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $c WHERE session_key = %s AND ticket_id = %d AND attended = 1",
                $key, $hid
            )) > 0;
            if ($boarded) {
                $wpdb->query($wpdb->prepare(
                    "UPDATE $tk SET status = 'attended' WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status NOT IN ('cancelled','refunded')",
                    $hid
                ));
            } else {
                // Ensure a not-attended record exists for the roster.
                $has = $wpdb->get_var($wpdb->prepare("SELECT id FROM $c WHERE session_key = %s AND ticket_id = %d", $key, $hid));
                if (!$has) {
                    $wpdb->insert($c, array(
                        'session_key'        => $key,
                        'ticket_id'          => $hid,
                        'attendee_ticket_id' => absint($h['parent_ticket_id']),
                        'attended'           => 0,
                        'checked_in_by'      => $uid,
                    ), array('%s', '%d', '%d', '%d', '%d'));
                }
                $wpdb->query($wpdb->prepare(
                    "UPDATE $tk SET status = 'no_show' WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status NOT IN ('cancelled','refunded')",
                    $hid
                ));
            }
        }

        $wpdb->query($wpdb->prepare(
            "INSERT INTO $t (session_key, status, closed_by, closed_at) VALUES (%s, 'closed', %d, %s)
             ON DUPLICATE KEY UPDATE status = 'closed', closed_by = %d, closed_at = %s",
            $key, $uid, $now, $uid, $now
        ));
    }

    /**
     * Manager override: manually set a tour ticket's attendance status, keeping
     * the boarding record (and therefore the roster count) in sync. Managers =
     * open/close-capable staff, plus shop-managers/admins/the Manager role.
     */
    public function ajax_set_tour_status() {
        check_ajax_referer('rt_event_manager_checkin', 'nonce');
        $key  = isset($_POST['session']) ? sanitize_text_field(wp_unslash($_POST['session'])) : '';
        $tour = self::parse_tour_session($key);
        if (!$tour) {
            wp_send_json_error(array('message' => __('Only tour events have attendance.', 'rt-event-manager')));
        }
        if (!self::can_open_close() && !self::can_bypass_tour_window() && !self::is_guide_of($tour['product_id'])) {
            wp_send_json_error(array('message' => __('You cannot set attendance for this tour.', 'rt-event-manager')));
        }
        $status  = isset($_POST['status']) ? sanitize_key(wp_unslash($_POST['status'])) : '';
        $allowed = array('valid', 'on_tour', 'attended', 'no_show');
        if (!in_array($status, $allowed, true)) {
            wp_send_json_error(array('message' => __('Invalid status.', 'rt-event-manager')));
        }
        $tid = isset($_POST['tour_ticket_id']) ? absint($_POST['tour_ticket_id']) : 0;
        $tt  = $tid ? RT_Event_Manager::get_ticket_by_id($tid) : null;
        if (!$tt || absint($tt['product_id']) !== absint($tour['product_id'])
            || !in_array($tt['ticket_kind'], array('pretour', 'daytour'), true)) {
            wp_send_json_error(array('message' => __('Tour ticket not found for this event.', 'rt-event-manager')));
        }
        if (in_array($tt['status'], array('cancelled', 'refunded'), true)) {
            wp_send_json_error(array('message' => __('This tour booking has been cancelled.', 'rt-event-manager')));
        }
        // Boarding a minor requires the guardian to be boarded first.
        if (in_array($status, array('on_tour', 'attended'), true)) {
            list($is_minor, $guardian_ok, $guardian_name) = self::guardian_boarding_status($key, $tt);
            if ($is_minor && !$guardian_ok) {
                wp_send_json_error(array('message' => self::guardian_required_message($guardian_name)));
            }
        }
        self::set_tour_status($key, $tid, absint($tt['parent_ticket_id']), $status);
        // Setting a guardian to a non-boarded status off-boards their minors too.
        if (in_array($status, array('valid', 'no_show'), true)) {
            self::cascade_offboard_minors($key, absint($tt['parent_ticket_id']), $tour['product_id']);
        }
        $counts = self::session_counts($key, $tour['product_id']);
        wp_send_json_success(array('status' => $status, 'counts' => $counts));
    }

    /** Set a tour ticket's status + keep its boarding record consistent. */
    private static function set_tour_status($key, $tid, $attendee_ticket_id, $status) {
        global $wpdb;
        $c   = $wpdb->prefix . 'rti_checkins';
        $tk  = $wpdb->prefix . 'rti_tickets';
        $now = current_time('mysql');
        $uid = get_current_user_id();
        $boarded = ('on_tour' === $status || 'attended' === $status);
        if ($boarded) {
            $wpdb->query($wpdb->prepare(
                "INSERT INTO $c (session_key, ticket_id, attendee_ticket_id, attended, boarded_at, checked_in_by)
                 VALUES (%s, %d, %d, 1, %s, %d)
                 ON DUPLICATE KEY UPDATE attended = 1, boarded_at = %s, checked_in_by = %d",
                $key, $tid, $attendee_ticket_id, $now, $uid, $now, $uid
            ));
            $wpdb->query($wpdb->prepare(
                "UPDATE $tk SET status = %s, checked_in_at = %s, checked_in_by = %d
                 WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status NOT IN ('cancelled','refunded')",
                $status, $now, $uid, $tid
            ));
        } else {
            if ('no_show' === $status) {
                $wpdb->query($wpdb->prepare(
                    "INSERT INTO $c (session_key, ticket_id, attendee_ticket_id, attended, checked_in_by)
                     VALUES (%s, %d, %d, 0, %d)
                     ON DUPLICATE KEY UPDATE attended = 0, checked_in_by = %d",
                    $key, $tid, $attendee_ticket_id, $uid, $uid
                ));
            } else {
                // 'valid' = awaiting: drop any boarding record.
                $wpdb->query($wpdb->prepare("DELETE FROM $c WHERE session_key = %s AND ticket_id = %d", $key, $tid));
            }
            $wpdb->query($wpdb->prepare(
                "UPDATE $tk SET status = %s, checked_in_at = NULL, checked_in_by = 0
                 WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status NOT IN ('cancelled','refunded')",
                $status, $tid
            ));
        }
    }

    /**
     * Whether a minor's guardian is boarded on the same tour. Returns
     * array($is_minor, $guardian_ok, $guardian_name). Non-minors are always OK.
     */
    private static function guardian_boarding_status($key, $tour_ticket) {
        global $wpdb;
        $main_id = absint($tour_ticket['parent_ticket_id']);
        $main    = $main_id ? RT_Event_Manager::get_ticket_by_id($main_id) : null;
        if (!$main || 'minor' !== RT_Event_Manager::get_ticket_kind($main)) {
            return array(false, true, '');
        }
        // Guardian's main ticket (climb one level if the parent is also a minor).
        $guardian_main_id = absint($main['parent_ticket_id']);
        $guardian_name    = '';
        if ($guardian_main_id) {
            $gm = RT_Event_Manager::get_ticket_by_id($guardian_main_id);
            if ($gm && 'minor' === RT_Event_Manager::get_ticket_kind($gm) && absint($gm['parent_ticket_id'])) {
                $guardian_main_id = absint($gm['parent_ticket_id']);
                $gm = RT_Event_Manager::get_ticket_by_id($guardian_main_id);
            }
            if ($gm && '' !== $gm['holder_name']) {
                $guardian_name = $gm['holder_name'];
            }
        }
        if (!$guardian_main_id) {
            return array(true, false, ''); // minor with no guardian recorded
        }
        $tk    = $wpdb->prefix . 'rti_tickets';
        $gtour = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d AND parent_ticket_id = %d LIMIT 1",
            absint($tour_ticket['product_id']), $guardian_main_id
        ));
        if (!$gtour) {
            return array(true, false, $guardian_name); // guardian not on this tour
        }
        $c       = $wpdb->prefix . 'rti_checkins';
        $boarded = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $c WHERE session_key = %s AND ticket_id = %d AND attended = 1",
            $key, absint($gtour)
        )) > 0;
        return array(true, $boarded, $guardian_name);
    }

    /**
     * When a guardian is off-boarded, off-board any of their boarded minors on
     * the same tour (a minor may not stay boarded without its guardian).
     *
     * @param string $key             session key
     * @param int    $guardian_main_id the guardian's main (event) ticket id
     * @param int    $product_id       the tour product id
     */
    private static function cascade_offboard_minors($key, $guardian_main_id, $product_id) {
        global $wpdb;
        $guardian_main_id = absint($guardian_main_id);
        if (!$guardian_main_id) {
            return;
        }
        $tk = $wpdb->prefix . 'rti_tickets';
        // The guardian's minors (main tickets of kind 'minor').
        $minor_mains = $wpdb->get_col($wpdb->prepare(
            "SELECT id FROM $tk WHERE ticket_kind = 'minor' AND parent_ticket_id = %d",
            $guardian_main_id
        ));
        if (empty($minor_mains)) {
            return;
        }
        $in     = implode(',', array_fill(0, count($minor_mains), '%d'));
        $params = array_merge(array(absint($product_id)), array_map('absint', $minor_mains));
        $rows   = $wpdb->get_results($wpdb->prepare(
            "SELECT id, parent_ticket_id FROM $tk WHERE ticket_kind IN ('pretour','daytour') AND product_id = %d AND parent_ticket_id IN ($in)",
            $params
        ), ARRAY_A);
        foreach ((array) $rows as $m) {
            self::set_tour_status($key, absint($m['id']), absint($m['parent_ticket_id']), 'valid');
        }
    }

    /** Error message shown when a minor is boarded before their guardian. */
    private static function guardian_required_message($guardian_name) {
        return $guardian_name
            /* translators: %s: guardian's name */
            ? sprintf(__('%s (guardian) must board first — board the guardian, then this minor.', 'rt-event-manager'), $guardian_name)
            : __('This attendee is a minor whose guardian must board first.', 'rt-event-manager');
    }

    /** Record (or refresh) a boarding for a tour ticket in a session. */
    private static function record_boarding($key, $tour_ticket_id, $attendee_ticket_id) {
        global $wpdb;
        $c   = $wpdb->prefix . 'rti_checkins';
        $tk  = $wpdb->prefix . 'rti_tickets';
        $now = current_time('mysql');
        $uid = get_current_user_id();
        $wpdb->query($wpdb->prepare(
            "INSERT INTO $c (session_key, ticket_id, attendee_ticket_id, attended, boarded_at, checked_in_by)
             VALUES (%s, %d, %d, 1, %s, %d)
             ON DUPLICATE KEY UPDATE attended = 1, boarded_at = %s, checked_in_by = %d",
            $key, $tour_ticket_id, $attendee_ticket_id, $now, $uid, $now, $uid
        ));
        // Mark the tour ticket as "on tour" while boarded (tour tickets only);
        // it becomes "attended" when the operator completes the tour.
        $wpdb->query($wpdb->prepare(
            "UPDATE $tk SET status = 'on_tour', checked_in_at = %s, checked_in_by = %d
             WHERE id = %d AND ticket_kind IN ('pretour','daytour')
               AND status NOT IN ('cancelled','refunded')",
            $now, $uid, $tour_ticket_id
        ));
    }

    /** Undo a boarding (operator off-board): remove it and revert the ticket. */
    private static function record_unboarding($key, $tour_ticket_id) {
        global $wpdb;
        $c  = $wpdb->prefix . 'rti_checkins';
        $tk = $wpdb->prefix . 'rti_tickets';
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $c WHERE session_key = %s AND ticket_id = %d",
            $key, $tour_ticket_id
        ));
        // Revert the tour ticket to booked (only if it was on tour).
        $wpdb->query($wpdb->prepare(
            "UPDATE $tk SET status = 'valid', checked_in_at = NULL, checked_in_by = 0
             WHERE id = %d AND ticket_kind IN ('pretour','daytour') AND status = 'on_tour'",
            $tour_ticket_id
        ));
    }

    /** List the sessions the current user may work, for the session selector. */
    public function ajax_sessions() {
        $this->guard();
        $sessions = array();
        if (self::can_main()) {
            $sessions[] = array(
                'key'    => self::SESSION_MAIN,
                'kind'   => 'main',
                'label'  => __('Main event — registration desk', 'rt-event-manager'),
                'status' => 'open', // always-on
            );
        }
        if (self::can_tours()) {
            foreach (self::tour_sessions() as $s) {
                $sessions[] = $s;
            }
        } elseif (self::is_tour_guide()) {
            // A guide (without the tours role) sees only their assigned tours.
            $mine = class_exists('RT_Event_Manager_Staff') ? array_map('intval', RT_Event_Manager_Staff::operator_tour_products(get_current_user_id())) : array();
            foreach (self::tour_sessions() as $s) {
                $t = self::parse_tour_session($s['key']);
                if ($t && in_array((int) $t['product_id'], $mine, true)) {
                    $sessions[] = $s;
                }
            }
        }
        wp_send_json_success(array(
            'sessions'    => $sessions,
            'canOpenClose'=> self::can_open_close() || self::is_tour_guide(),
        ));
    }

    /** Open or close a tour session (event operators / managers only). */
    public function ajax_toggle() {
        check_ajax_referer('rt_event_manager_checkin', 'nonce');
        $key  = isset($_POST['session']) ? sanitize_text_field(wp_unslash($_POST['session'])) : '';
        $open = !empty($_POST['open']);
        $tour = self::parse_tour_session($key);
        if (!$tour) {
            wp_send_json_error(array('message' => __('Only tour events can be opened or closed.', 'rt-event-manager')));
        }
        if (!self::can_manage_tour($tour['product_id'])) {
            wp_send_json_error(array('message' => __('You cannot open or close this tour.', 'rt-event-manager')));
        }
        global $wpdb;
        // Guard: the session table must exist, or writes fail silently.
        $sess_table = $wpdb->prefix . 'rti_checkin_sessions';
        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $sess_table)) !== $sess_table) {
            wp_send_json_error(array('message' => sprintf(
                /* translators: %s: database table name */
                __('The check-in table (%s) is missing — deactivate and reactivate the plugin to create it.', 'rt-event-manager'),
                $sess_table
            )));
        }

        if ($open) {
            // A tour may only be opened from 2 hours before it departs.
            // Managers/admins may override this window.
            $start = RT_Event_Manager::tour_start_timestamp($tour['product_id']);
            if ($start && !self::can_bypass_tour_window() && time() < ($start - 2 * HOUR_IN_SECONDS)) {
                try {
                    $dt = (new DateTime('@' . ($start - 2 * HOUR_IN_SECONDS)))->setTimezone(RT_Event_Manager::event_timezone());
                    $when = $dt->format('j M Y, H:i');
                } catch (\Exception $e) {
                    $when = '';
                }
                wp_send_json_error(array('message' => $when
                    ? sprintf(__('This tour can be opened from 2 hours before it departs (from %s).', 'rt-event-manager'), $when)
                    : __('This tour can be opened from 2 hours before it departs.', 'rt-event-manager')));
            }
            self::open_session($key);
        } else {
            self::close_session($key, $tour['product_id']);
        }

        // Verify the write actually took effect; surface the DB error if not.
        $state    = self::session_state($key);
        $now_open = (isset($state['status']) && 'open' === $state['status']);
        if ($open !== $now_open) {
            wp_send_json_error(array('message' => sprintf(
                /* translators: %s: database error message */
                __('The tour status could not be saved. %s', 'rt-event-manager'),
                $wpdb->last_error ? $wpdb->last_error : __('Please try again.', 'rt-event-manager')
            )));
        }

        $counts = self::session_counts($key, $tour['product_id']);
        wp_send_json_success(array(
            'status'  => isset($state['status']) ? $state['status'] : 'closed',
            'boarded' => $counts['boarded'],
            'total'   => $counts['total'],
        ));
    }

    /**
     * Staff: the scanned attendee's own details, plus the main account profile
     * (the person who booked) behind a link.
     */
    public function ajax_profile() {
        $this->guard();
        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;
        $ticket    = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$ticket) {
            wp_send_json_error(array('message' => __('Ticket not found.', 'rt-event-manager')));
        }
        $owner = absint($ticket['owner_user_id']);
        if (!$owner) {
            $order = wc_get_order(absint($ticket['order_id']));
            $owner = $order ? absint($order->get_customer_id()) : 0;
        }

        wp_send_json_success($this->build_guest_profile($ticket));
    }

    /**
     * Public: the assembled read-only guest profile (attendee + account holder)
     * for a ticket. Reused by the account portal's "Find Guest" tool.
     *
     * @param array $ticket Ticket row.
     * @return array{attendee:array,account:?array}
     */
    public function build_guest_profile($ticket) {
        $owner = absint($ticket['owner_user_id']);
        if (!$owner) {
            $order = wc_get_order(absint($ticket['order_id']));
            $owner = $order ? absint($order->get_customer_id()) : 0;
        }
        return array(
            'attendee' => $this->attendee_payload($ticket),
            'account'  => $owner ? $this->account_payload($owner) : null,
        );
    }

    /** The scanned ticket's own attendee data (not the account holder's). */
    private function attendee_payload($ticket) {
        $kind         = RT_Event_Manager::get_ticket_kind($ticket);
        $product      = wc_get_product($ticket['product_id']);
        $dietary_opts = RT_Event_Manager::get_dietary_options(true);

        $diet = isset($ticket['dietary']) ? $ticket['dietary'] : '';
        $diet_label = isset($dietary_opts[$diet]) ? $dietary_opts[$diet] : '';
        if ('allergies' === $diet && !empty($ticket['allergy_details'])) {
            $diet_label .= ' (' . $ticket['allergy_details'] . ')';
        }

        $names = function ($rows) {
            $out = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $out[] = $p ? RT_Event_Manager::product_title($p->get_id()) : ('#' . absint($r['product_id']));
            }
            return $out;
        };

        $guardian = '';
        if ('minor' === $kind && absint($ticket['parent_ticket_id'])) {
            $g = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
            if ($g) {
                $guardian = ('' !== $g['holder_name']) ? $g['holder_name'] : ('#' . absint($ticket['parent_ticket_id']));
            }
        }

        return array(
            'holder'   => ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : __('Unassigned', 'rt-event-manager'),
            'product'  => $product ? RT_Event_Manager::product_title($product->get_id()) : RT_Event_Manager::ticket_kind_label($ticket),
            'type'     => RT_Event_Manager::ticket_kind_label($ticket),
            'status'   => isset($ticket['status']) ? $ticket['status'] : 'draft',
            'phone'    => isset($ticket['phone']) ? $ticket['phone'] : '',
            'dietary'  => ('none' === $diet || '' === $diet) ? '' : $diet_label,
            'family'   => ('' !== $ticket['rti_family']) ? RT_Event_Manager::get_family_label($ticket['rti_family']) : '',
            'guardian' => $guardian,
            'pretours' => $names(RT_Event_Manager::get_child_pretours(absint($ticket['id']))),
            'daytours' => $names(RT_Event_Manager::get_child_daytours(absint($ticket['id']))),
        );
    }

    /** Assemble the main account profile for the staff view. */
    private function account_payload($owner_id) {
        $user  = get_userdata($owner_id);
        $name  = $user ? trim($user->first_name . ' ' . $user->last_name) : '';
        if ('' === $name && $user) {
            $name = $user->display_name;
        }

        $dietary_opts = RT_Event_Manager::get_dietary_options(true);
        $rel_labels   = array(
            'spouse'   => __('Spouse / Partner', 'rt-event-manager'),
            'sibling'  => __('Sibling', 'rt-event-manager'),
            'parent'   => __('Parent', 'rt-event-manager'),
            'employer' => __('Employer', 'rt-event-manager'),
            'other'    => __('Other', 'rt-event-manager'),
        );

        // Emergency contacts (up to two).
        $emergency = array();
        foreach (array(1, 2) as $n) {
            $c = array();
            foreach (array('name', 'relationship', 'email', 'phone') as $k) {
                $c[$k] = (string) get_user_meta($owner_id, 'rti_emergency' . $n . '_' . $k, true);
            }
            if ('' !== trim($c['name'] . $c['email'] . $c['phone'])) {
                $c['relationship'] = isset($rel_labels[$c['relationship']]) ? $rel_labels[$c['relationship']] : $c['relationship'];
                $emergency[] = $c;
            }
        }

        // All booked tickets / tours for this member (including terminal, so
        // cancellations are visible to staff).
        $rows    = RT_Event_Manager::get_tickets_for_user($owner_id, true);
        $tickets = array();
        $phone   = '';
        foreach ($rows as $r) {
            $kind = RT_Event_Manager::get_ticket_kind($r);
            $p    = wc_get_product($r['product_id']);
            $diet = isset($r['dietary']) ? $r['dietary'] : '';
            $diet_label = isset($dietary_opts[$diet]) ? $dietary_opts[$diet] : '';
            if ('allergies' === $diet && !empty($r['allergy_details'])) {
                $diet_label .= ' (' . $r['allergy_details'] . ')';
            }
            $tickets[] = array(
                'holder'  => ('' !== $r['holder_name']) ? $r['holder_name'] : __('Unassigned', 'rt-event-manager'),
                'product' => $p ? RT_Event_Manager::product_title($p->get_id()) : RT_Event_Manager::ticket_kind_label($r),
                'type'    => RT_Event_Manager::ticket_kind_label($r),
                'kind'    => $kind,
                'status'  => isset($r['status']) ? $r['status'] : 'draft',
                'dietary' => ('none' === $diet || '' === $diet) ? '' : $diet_label,
            );
            if ('' === $phone && 'event' === $kind && !empty($r['phone'])) {
                $phone = $r['phone'];
            }
        }
        if ('' === $phone) {
            $phone = (string) get_user_meta($owner_id, 'billing_phone', true);
        }

        return array(
            'name'      => $name,
            'photo'     => get_avatar_url($owner_id, array('size' => 160)),
            'phone'     => $phone,
            'club'      => (string) get_user_meta($owner_id, 'rti_club', true),
            'emergency' => $emergency,
            'tickets'   => $tickets,
        );
    }

    /** Shape a ticket for the check-in UI. */
    private function ticket_payload($ticket) {
        $kind    = RT_Event_Manager::get_ticket_kind($ticket);
        $product = wc_get_product($ticket['product_id']);
        $pname   = $product ? RT_Event_Manager::product_title($product->get_id()) : RT_Event_Manager::ticket_kind_label($ticket);

        $names = function ($rows) {
            $out = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $out[] = $p ? RT_Event_Manager::product_title($p->get_id()) : ('#' . absint($r['product_id']));
            }
            return $out;
        };

        // Related tickets to offer for a combined check-in: a Future member's
        // guardian, or a guardian's Future members.
        $guardian   = '';
        $companions = array();
        if ('minor' === $kind && absint($ticket['parent_ticket_id'])) {
            $prow = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
            if ($prow) {
                $guardian = ('' !== $prow['holder_name']) ? $prow['holder_name'] : ('#' . absint($ticket['parent_ticket_id']));
                if (!in_array($prow['status'], array('cancelled', 'refunded'), true)) {
                    $companions[] = $this->companion_payload($prow, __('Guardian', 'rt-event-manager'));
                }
            }
        } elseif ('event' === $kind) {
            foreach (RT_Event_Manager::get_child_tours(absint($ticket['id']), 'minor') as $m) {
                if (!in_array($m['status'], array('cancelled', 'refunded'), true)) {
                    // "Future Tabler" / "Future Circler" per the minor's type.
                    $companions[] = $this->companion_payload($m, RT_Event_Manager::ticket_kind_label($m));
                }
            }
        }

        $checked_by = '';
        if (!empty($ticket['checked_in_by'])) {
            $u = get_userdata(absint($ticket['checked_in_by']));
            $checked_by = $u ? $u->display_name : '';
        }
        $checked_at = '';
        if (!empty($ticket['checked_in_at'])) {
            $ts = strtotime($ticket['checked_in_at']);
            $checked_at = $ts ? date_i18n('d.m.Y H:i', $ts) : '';
        }

        return array(
            'id'         => absint($ticket['id']),
            'holder'     => ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : __('Unassigned', 'rt-event-manager'),
            'product'    => $pname,
            'type'       => RT_Event_Manager::ticket_kind_label($ticket),
            'kind'       => $kind,
            'order_id'   => absint($ticket['order_id']),
            'number'     => absint($ticket['ticket_index']) + 1,
            'status'     => isset($ticket['status']) ? $ticket['status'] : 'draft',
            'guardian'   => $guardian,
            'guardian_id' => ('minor' === $kind) ? absint($ticket['parent_ticket_id']) : 0,
            'pretours'   => $names(RT_Event_Manager::get_child_pretours(absint($ticket['id']))),
            'daytours'   => $names(RT_Event_Manager::get_child_daytours(absint($ticket['id']))),
            'dietary'    => isset($ticket['dietary']) ? $ticket['dietary'] : '',
            'checked_at' => $checked_at,
            'checked_by' => $checked_by,
            'companions' => $companions,
        );
    }

    /** Compact payload for a related ticket offered in a combined check-in. */
    private function companion_payload($ticket, $relation) {
        return array(
            'id'       => absint($ticket['id']),
            'holder'   => ('' !== $ticket['holder_name']) ? $ticket['holder_name'] : sprintf(__('Ticket #%d', 'rt-event-manager'), absint($ticket['id'])),
            'relation' => $relation,
            'status'   => isset($ticket['status']) ? $ticket['status'] : 'draft',
        );
    }
}
