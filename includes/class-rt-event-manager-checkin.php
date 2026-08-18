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
            'i18n'        => array(
                'cameraError'  => __('Could not access the camera. Check permissions, or use manual entry.', 'rt-event-manager'),
                'scanning'     => __('Point the camera at the ticket QR code…', 'rt-event-manager'),
                'invalidCode'  => __('Unrecognised code — this is not a valid ticket QR.', 'rt-event-manager'),
                'notFound'     => __('Ticket not found.', 'rt-event-manager'),
                'networkError' => __('Network error. Please try again.', 'rt-event-manager'),
                'checkedIn'    => __('Checked in', 'rt-event-manager'),
                'alreadyIn'    => __('Already checked in', 'rt-event-manager'),
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
            $shell = get_option('rt_event_manager_checkin_url') ?: home_url('/');
            $assets = array(
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/checkin.css',
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/checkin.js',
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/jsqr.min.js',
                RT_EVENT_MANAGER_PLUGIN_URL . 'assets/icon.svg',
            );
            $cache_name = 'rtem-checkin-v1';
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

        $status = isset($ticket['status']) ? $ticket['status'] : '';
        if (in_array($status, array('cancelled', 'refunded'), true)) {
            /* translators: %s: ticket status */
            wp_send_json_error(array('message' => sprintf(__('This ticket is %s and cannot be checked in.', 'rt-event-manager'), $status)));
        }

        if ('checked_in' === $status) {
            $ticket['_already'] = true;
            wp_send_json_success(array('already' => true, 'ticket' => $this->ticket_payload($ticket)));
        }

        RT_Event_Manager::instance()->update_ticket($ticket_id, array(
            'status'        => 'checked_in',
            'checked_in_at' => current_time('mysql'),
            'checked_in_by' => get_current_user_id(),
        ));

        $ticket = RT_Event_Manager::get_ticket_by_id($ticket_id);
        wp_send_json_success(array('already' => false, 'ticket' => $this->ticket_payload($ticket)));
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

        $guardian = '';
        if ('minor' === $kind && absint($ticket['parent_ticket_id'])) {
            $prow = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
            if ($prow) {
                $guardian = ('' !== $prow['holder_name']) ? $prow['holder_name'] : ('#' . absint($ticket['parent_ticket_id']));
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
            'pretours'   => $names(RT_Event_Manager::get_child_pretours(absint($ticket['id']))),
            'daytours'   => $names(RT_Event_Manager::get_child_daytours(absint($ticket['id']))),
            'dietary'    => isset($ticket['dietary']) ? $ticket['dietary'] : '',
            'checked_at' => $checked_at,
            'checked_by' => $checked_by,
        );
    }
}
