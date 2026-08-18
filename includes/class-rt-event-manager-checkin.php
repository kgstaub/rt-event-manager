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
    }

    /** Whether the given user may run check-in. */
    public static function user_can_checkin($user_id = 0) {
        return $user_id ? user_can($user_id, self::CAP) : current_user_can(self::CAP);
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
            'i18n'        => array(
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

        wp_send_json_success($this->ticket_payload($ticket));
    }

    /** Mark a ticket checked in (idempotent; refuses cancelled/refunded). */
    public function ajax_do() {
        $this->guard();

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
            $st     = isset($t['status']) ? $t['status'] : '';
            $holder = ('' !== $t['holder_name']) ? $t['holder_name'] : ('#' . $id);
            if (in_array($st, array('cancelled', 'refunded'), true)) {
                $results[] = array('holder' => $holder, 'outcome' => 'refused', 'status' => $st);
                continue;
            }
            if ('checked_in' === $st) {
                $results[] = array('holder' => $holder, 'outcome' => 'already', 'status' => $st);
                continue;
            }
            RT_Event_Manager::instance()->update_ticket($id, array(
                'status'        => 'checked_in',
                'checked_in_at' => current_time('mysql'),
                'checked_in_by' => get_current_user_id(),
            ));
            $results[] = array('holder' => $holder, 'outcome' => 'checked_in', 'status' => 'checked_in');
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

        wp_send_json_success(array(
            'attendee' => $this->attendee_payload($ticket),
            'account'  => $owner ? $this->account_payload($owner) : null,
        ));
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
                $out[] = $p ? $p->get_name() : ('#' . absint($r['product_id']));
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
            'product'  => $product ? $product->get_name() : RT_Event_Manager::ticket_kind_label($ticket),
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
                'product' => $p ? $p->get_name() : RT_Event_Manager::ticket_kind_label($r),
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
        $pname   = $product ? $product->get_name() : RT_Event_Manager::ticket_kind_label($ticket);

        $names = function ($rows) {
            $out = array();
            foreach ($rows as $r) {
                $p = wc_get_product($r['product_id']);
                $out[] = $p ? $p->get_name() : ('#' . absint($r['product_id']));
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
