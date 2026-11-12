<?php
/**
 * RT Event Manager — Parking permits.
 *
 * Parking is sold as ordinary WooCommerce products flagged with
 * `_rti_is_parking`. Each purchased spot becomes a permit row carrying the
 * vehicle's licence plate. Members manage their permits in the account portal's
 * *Parking* tab and print a windscreen permit (PDF) whose QR code is a signed,
 * parking-only token — deliberately different from the event-ticket QR. Staff
 * verify permits by scanning them in the check-in app (spot checks; nothing
 * is recorded).
 *
 * Rules:
 * - Only members holding an event (or staff) ticket — or buying one in the same
 *   order — may buy parking.
 * - A licence plate is required per permit; members may change it until
 *   30 minutes before the permit becomes valid (event start, 00:00).
 * - A permit is valid for the whole event (Settings → event start/end dates).
 * - Capacity is the product's WooCommerce stock.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;

class RT_Event_Manager_Parking {

    /** @var RT_Event_Manager_Parking|null */
    private static $instance = null;

    const META_IS_PARKING = '_rti_is_parking';
    const CART_KEY        = 'rti_parking_plate';
    const ITEM_META       = '_rti_parking_plate';
    const TOKEN_PREFIX    = 'RTIPARK';
    const SESSION_KEY     = 'parking';
    const PAGE_SLUG       = 'rt-event-manager-parking';

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Product editor flag.
        add_action('woocommerce_product_options_general_product_data', array($this, 'product_fields'));
        add_action('woocommerce_process_product_meta', array($this, 'save_product_fields'));

        // Product page / cart / checkout.
        add_action('woocommerce_before_add_to_cart_button', array($this, 'render_plate_field'));
        add_filter('woocommerce_add_to_cart_validation', array($this, 'validate_add_to_cart'), 10, 3);
        add_filter('woocommerce_add_cart_item_data', array($this, 'add_cart_item_data'), 10, 2);
        add_filter('woocommerce_get_item_data', array($this, 'cart_item_display'), 10, 2);
        add_filter('woocommerce_is_sold_individually', array($this, 'sold_individually'), 10, 2);
        add_action('woocommerce_check_cart_items', array($this, 'check_cart_eligibility'));
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'order_line_item_meta'), 10, 4);

        // Permit lifecycle follows the order.
        add_action('woocommerce_checkout_order_processed', array($this, 'on_order_processed'), 20, 1);
        add_action('woocommerce_store_api_checkout_order_processed', array($this, 'on_order_processed_obj'), 20, 1);
        add_action('woocommerce_order_status_changed', array($this, 'on_order_status_changed'), 20, 3);

        // Member actions.
        add_action('wp_ajax_rt_event_manager_parking_plate', array($this, 'ajax_update_plate'));
        add_action('wp_ajax_rt_event_manager_parking_permit', array($this, 'ajax_permit_pdf'));
        add_action('wp_enqueue_scripts', array($this, 'maybe_enqueue'));

        // Admin overview.
        add_action('admin_menu', array($this, 'add_admin_menu'), 60);
        add_action('admin_init', array($this, 'handle_admin_post'));
    }

    /* ---------------------------------------------------------------------
     * Storage
     * ------------------------------------------------------------------- */

    public static function table() {
        global $wpdb;
        return $wpdb->prefix . 'rti_parking_permits';
    }

    /** Create the permit table when missing (called from the installer). */
    public static function install_tables() {
        global $wpdb;
        $charset = $wpdb->get_charset_collate();
        $permits = self::table();

        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $permits)) !== $permits) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
            dbDelta("CREATE TABLE $permits (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                product_id bigint(20) unsigned NOT NULL DEFAULT 0,
                order_id bigint(20) unsigned NOT NULL DEFAULT 0,
                order_item_id bigint(20) unsigned NOT NULL DEFAULT 0,
                permit_index int(10) unsigned NOT NULL DEFAULT 0,
                user_id bigint(20) unsigned NOT NULL DEFAULT 0,
                holder_name varchar(191) NOT NULL DEFAULT '',
                plate varchar(20) NOT NULL DEFAULT '',
                plate_norm varchar(20) NOT NULL DEFAULT '',
                permit_key varchar(32) NOT NULL DEFAULT '',
                permit_no varchar(16) NOT NULL DEFAULT '',
                status varchar(12) NOT NULL DEFAULT 'draft',
                created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at datetime NULL DEFAULT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY item_index (order_item_id, permit_index),
                KEY order_id (order_id),
                KEY user_id (user_id),
                KEY plate_norm (plate_norm),
                KEY permit_no (permit_no)
            ) $charset;");
        }

        // Schema 2: random public permit numbers (replacing the sequential id).
        if ((int) get_option('rt_event_manager_parking_schema', 1) < 2) {
            $has_col = $wpdb->get_var($wpdb->prepare("SHOW COLUMNS FROM $permits LIKE %s", 'permit_no'));
            if (!$has_col) {
                $wpdb->query("ALTER TABLE $permits ADD COLUMN permit_no varchar(16) NOT NULL DEFAULT '' AFTER permit_key, ADD KEY permit_no (permit_no)");
            }
            $ids = $wpdb->get_col("SELECT id FROM $permits WHERE permit_no = ''");
            foreach ((array) $ids as $id) {
                $wpdb->update($permits, array('permit_no' => self::generate_permit_no()), array('id' => absint($id)));
            }
            update_option('rt_event_manager_parking_schema', 2, false);
        }
    }

    /** A random, unused six-digit permit number (not guessable from sales volume). */
    public static function generate_permit_no() {
        global $wpdb;
        $table = self::table();
        for ($i = 0; $i < 20; $i++) {
            $no = (string) random_int(100000, 999999);
            if (!$wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE permit_no = %s LIMIT 1", $no))) {
                return $no;
            }
        }
        return (string) random_int(10000000, 99999999); // practically never reached
    }

    public static function get_permit($id) {
        global $wpdb;
        return $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE id = %d', absint($id)), ARRAY_A);
    }

    public static function get_permits_for_user($user_id) {
        global $wpdb;
        $user_id = absint($user_id);
        if (!$user_id) {
            return array();
        }
        return (array) $wpdb->get_results($wpdb->prepare(
            'SELECT * FROM ' . self::table() . ' WHERE user_id = %d ORDER BY id ASC',
            $user_id
        ), ARRAY_A);
    }

    /** Statuses that count as "holding" a permit (one per account). */
    public static function holding_statuses() {
        return array('valid', 'draft', 'revoked');
    }

    /** The account's current permit (confirmed first), or null. */
    public static function user_active_permit($user_id, $ignore_order_id = 0) {
        $user_id = absint($user_id);
        if (!$user_id) {
            return null;
        }
        self::backfill_user($user_id);
        $best = null;
        foreach (self::get_permits_for_user($user_id) as $p) {
            if (!in_array($p['status'], self::holding_statuses(), true)) {
                continue;
            }
            // The unpaid order being retried at checkout is not "another" permit.
            if ($ignore_order_id && 'draft' === $p['status'] && absint($p['order_id']) === absint($ignore_order_id)) {
                continue;
            }
            if (!$best || ('valid' === $p['status'] && 'valid' !== $best['status'])) {
                $best = $p;
            }
        }
        return $best;
    }

    /**
     * Create missing permit rows from the user's own orders (covers orders
     * placed before the permit tables existed). Runs once per request.
     */
    public static function backfill_user($user_id) {
        static $done = array();
        $user_id = absint($user_id);
        if (!$user_id || isset($done[$user_id]) || !function_exists('wc_get_orders')) {
            return;
        }
        $done[$user_id] = true;
        $orders = wc_get_orders(array('customer_id' => $user_id, 'limit' => 100));
        foreach ((array) $orders as $order) {
            foreach ($order->get_items() as $item) {
                if (self::is_parking_product($item->get_product_id())) {
                    self::instance()->sync_order($order);
                    break;
                }
            }
        }
    }

    /** One-time backfill across recent orders (run from the admin page). */
    private function backfill_all_once() {
        if ('yes' === get_option('rt_event_manager_parking_backfilled_v1') || !function_exists('wc_get_orders')) {
            return;
        }
        $orders = wc_get_orders(array('limit' => 1000, 'orderby' => 'date', 'order' => 'DESC'));
        foreach ((array) $orders as $order) {
            if (!$order instanceof WC_Order) {
                continue;
            }
            foreach ($order->get_items() as $item) {
                if (self::is_parking_product($item->get_product_id())) {
                    $this->sync_order($order);
                    break;
                }
            }
        }
        update_option('rt_event_manager_parking_backfilled_v1', 'yes', false);
    }

    /* ---------------------------------------------------------------------
     * Products
     * ------------------------------------------------------------------- */

    public static function is_parking_product($product_id) {
        return 'yes' === get_post_meta(absint($product_id), self::META_IS_PARKING, true);
    }

    /** Published, purchasable parking products. */
    public static function parking_products() {
        if (!function_exists('wc_get_products')) {
            return array();
        }
        $ids = get_posts(array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'orderby'        => array('menu_order' => 'ASC', 'title' => 'ASC'),
            'meta_query'     => array(array('key' => self::META_IS_PARKING, 'value' => 'yes')),
        ));
        return array_values(array_filter(array_map('wc_get_product', (array) $ids)));
    }

    public function product_fields() {
        echo '<div class="options_group show_if_simple">';
        woocommerce_wp_checkbox(array(
            'id'          => self::META_IS_PARKING,
            'label'       => __('Parking permit', 'rt-event-manager'),
            'description' => __('Sell this product as an event parking permit. Each spot needs a licence plate and gets a printable windscreen permit with its own QR code. Use stock to limit the number of spots.', 'rt-event-manager'),
        ));
        echo '</div>';
    }

    public function save_product_fields($product_id) {
        update_post_meta($product_id, self::META_IS_PARKING, isset($_POST[self::META_IS_PARKING]) ? 'yes' : 'no');
    }

    /* ---------------------------------------------------------------------
     * Plates
     * ------------------------------------------------------------------- */

    /** Tidy a plate for display: upper-case, single spaces, allowed chars only. */
    public static function clean_plate($plate) {
        $plate = function_exists('mb_strtoupper') ? mb_strtoupper((string) $plate, 'UTF-8') : strtoupper((string) $plate);
        $plate = preg_replace('/[^A-Z0-9ÄÖÜ\- ]/u', '', $plate);
        $plate = preg_replace('/\s+/', ' ', trim($plate));
        return function_exists('mb_substr') ? mb_substr($plate, 0, 20, 'UTF-8') : substr($plate, 0, 20);
    }

    /** Comparison form of a plate: letters and digits only. */
    public static function normalize_plate($plate) {
        return preg_replace('/[^A-Z0-9ÄÖÜ]/u', '', self::clean_plate($plate));
    }

    public static function plate_is_valid($plate) {
        $norm = self::normalize_plate($plate);
        $len  = function_exists('mb_strlen') ? mb_strlen($norm, 'UTF-8') : strlen($norm);
        return $len >= 2 && $len <= 15;
    }

    /* ---------------------------------------------------------------------
     * Eligibility: an event (or staff) ticket on the account or in the cart
     * ------------------------------------------------------------------- */

    public static function user_is_eligible($user_id) {
        $user_id = absint($user_id);
        if (!$user_id || !class_exists('RT_Event_Manager')) {
            return false;
        }
        foreach (RT_Event_Manager::get_tickets_for_user($user_id) as $t) {
            $kind   = RT_Event_Manager::get_ticket_kind($t);
            $status = isset($t['status']) ? $t['status'] : '';
            if (in_array($kind, array('event', 'staff'), true) && !in_array($status, array('cancelled', 'refunded', 'invalid'), true)) {
                return true;
            }
        }
        return false;
    }

    private static function cart_has_event_ticket() {
        if (!function_exists('WC') || !WC()->cart || !class_exists('RT_Event_Manager')) {
            return false;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            if ($pid && RT_Event_Manager::is_ticket_product($pid) && 'event' === RT_Event_Manager::get_ticket_kind_for_product($pid)) {
                return true;
            }
        }
        return false;
    }

    public static function current_user_may_buy() {
        return self::user_is_eligible(get_current_user_id()) || self::cart_has_event_ticket();
    }

    private static function eligibility_message() {
        return __('Parking can only be booked by event ticket holders. Please add an event ticket first.', 'rt-event-manager');
    }

    /* ---------------------------------------------------------------------
     * Event window & editing cutoff
     * ------------------------------------------------------------------- */

    /** [start Y-m-d, end Y-m-d] from Settings ('' when not configured). */
    public static function event_window() {
        $from = (string) get_option('rt_event_manager_event_start', '');
        $to   = (string) get_option('rt_event_manager_event_end', '');
        if ('' === $to) {
            $to = $from;
        }
        return array($from, $to);
    }

    public static function event_window_label() {
        list($from, $to) = self::event_window();
        if ('' === $from) {
            return __('Whole event', 'rt-event-manager');
        }
        $a = date_i18n('d.m.Y', strtotime($from));
        $b = date_i18n('d.m.Y', strtotime($to));
        return ($a === $b) ? $a : ($a . ' – ' . $b);
    }

    private static function today() {
        try {
            $tz = class_exists('RT_Event_Manager') ? RT_Event_Manager::event_timezone() : wp_timezone();
            return (new DateTime('now', $tz))->format('Y-m-d');
        } catch (\Exception $e) {
            return current_time('Y-m-d');
        }
    }

    /** Minutes before validity starts after which members can no longer change the plate. */
    const PLATE_LOCK_MINUTES = 30;

    /**
     * Last moment (Unix timestamp) a member may change their plate: 30 minutes
     * before the permit becomes valid (00:00 on the event start date, event
     * timezone). 0 when no event start date is configured (no limit).
     */
    public static function plate_edit_deadline() {
        list($from) = self::event_window();
        if ('' === $from) {
            return 0;
        }
        try {
            $tz    = class_exists('RT_Event_Manager') ? RT_Event_Manager::event_timezone() : wp_timezone();
            $start = (new DateTime($from . ' 00:00:00', $tz))->getTimestamp();
        } catch (\Exception $e) {
            return 0;
        }
        return $start - self::PLATE_LOCK_MINUTES * MINUTE_IN_SECONDS;
    }

    public static function plate_editing_allowed() {
        $deadline = self::plate_edit_deadline();
        return !$deadline || time() < $deadline;
    }

    /** The plate-change deadline formatted in the event timezone, or ''. */
    public static function plate_edit_deadline_label() {
        $deadline = self::plate_edit_deadline();
        if (!$deadline) {
            return '';
        }
        try {
            $tz = class_exists('RT_Event_Manager') ? RT_Event_Manager::event_timezone() : wp_timezone();
            return (new DateTime('@' . $deadline))->setTimezone($tz)->format('d.m.Y H:i');
        } catch (\Exception $e) {
            return '';
        }
    }

    /* ---------------------------------------------------------------------
     * Product page & cart
     * ------------------------------------------------------------------- */

    public function render_plate_field() {
        global $product;
        if (!$product || !self::is_parking_product($product->get_id())) {
            return;
        }
        $blocked = self::one_per_account_message();
        if ('' !== $blocked) {
            echo '<div class="rti-parking-plate"><p class="woocommerce-info">' . esc_html($blocked) . '</p>';
            echo '<style>.rti-parking-plate ~ .single_add_to_cart_button, .rti-parking-plate ~ .quantity { display:none !important; }</style></div>';
            return;
        }
        echo '<div class="rti-parking-plate" style="margin:0 0 1em;">';
        if (!is_user_logged_in() && !self::cart_has_event_ticket()) {
            echo '<p class="woocommerce-info">' . esc_html(self::eligibility_message()) . '</p>';
        }
        echo '<label for="rti_parking_plate" style="display:block;font-weight:600;margin-bottom:4px;">' . esc_html__('Licence plate', 'rt-event-manager') . ' <abbr class="required" title="required">*</abbr></label>';
        echo '<input type="text" name="' . esc_attr(self::CART_KEY) . '" id="rti_parking_plate" required maxlength="20" autocomplete="off" style="text-transform:uppercase;min-width:200px;" placeholder="' . esc_attr__('e.g. ZH 123456', 'rt-event-manager') . '" />';
        echo '<p style="margin:.4em 0 0;color:#666;font-size:.9em;">' . esc_html(sprintf(
            /* translators: %s: event dates */
            __('One parking permit per account, valid %s.', 'rt-event-manager'),
            self::event_window_label()
        )) . '</p>';
        echo '</div>';
    }

    public function validate_add_to_cart($passed, $product_id, $quantity) {
        if (!self::is_parking_product($product_id)) {
            return $passed;
        }
        if (!self::current_user_may_buy()) {
            wc_add_notice(self::eligibility_message(), 'error');
            return false;
        }
        $plate = isset($_REQUEST[self::CART_KEY]) ? self::clean_plate(wp_unslash($_REQUEST[self::CART_KEY])) : '';
        if (!self::plate_is_valid($plate)) {
            wc_add_notice(__('Please enter the licence plate of the vehicle (2–15 letters or digits).', 'rt-event-manager'), 'error');
            return false;
        }
        $blocked = self::one_per_account_message();
        if ('' !== $blocked) {
            wc_add_notice($blocked, 'error');
            return false;
        }
        if ((int) $quantity > 1) {
            wc_add_notice(__('Only one parking permit can be booked per account.', 'rt-event-manager'), 'error');
            return false;
        }
        return $passed;
    }

    /** Number of parking lines in the cart. */
    private static function cart_parking_count() {
        if (!function_exists('WC') || !WC()->cart) {
            return 0;
        }
        $n = 0;
        foreach (WC()->cart->get_cart() as $ci) {
            if (!empty($ci['product_id']) && self::is_parking_product($ci['product_id'])) {
                $n += max(1, (int) $ci['quantity']);
            }
        }
        return $n;
    }

    /**
     * Why the current visitor may not add another parking permit ('' if they
     * may): the account already holds one, or one is already in the cart.
     */
    /** The unpaid order this session is checking out again (classic or block checkout). */
    private static function session_pending_order_id() {
        if (!function_exists('WC') || !WC()->session) {
            return 0;
        }
        $id = absint(WC()->session->get('order_awaiting_payment'));
        return $id ? $id : absint(WC()->session->get('store_api_draft_order'));
    }

    public static function one_per_account_message() {
        if (self::user_active_permit(get_current_user_id(), self::session_pending_order_id())) {
            return __('You already have a parking permit. Only one parking spot can be booked per account — see the Parking tab in your account.', 'rt-event-manager');
        }
        if (self::cart_parking_count() > 0) {
            return __('A parking permit is already in your cart. Only one parking spot can be booked per account.', 'rt-event-manager');
        }
        return '';
    }

    public function add_cart_item_data($data, $product_id) {
        if (self::is_parking_product($product_id) && isset($_REQUEST[self::CART_KEY])) {
            $plate = self::clean_plate(wp_unslash($_REQUEST[self::CART_KEY]));
            if ('' !== $plate) {
                $data[self::CART_KEY] = $plate;
                // Each vehicle is its own cart line.
                $data['rti_parking_unique'] = $product_id . '-' . self::normalize_plate($plate) . '-' . microtime(true);
            }
        }
        return $data;
    }

    public function cart_item_display($item_data, $cart_item) {
        if (!empty($cart_item[self::CART_KEY])) {
            $item_data[] = array(
                'key'   => __('Licence plate', 'rt-event-manager'),
                'value' => esc_html($cart_item[self::CART_KEY]),
            );
        }
        return $item_data;
    }

    /** One vehicle per cart line: lock the quantity at 1. */
    public function sold_individually($individually, $product) {
        if ($product && self::is_parking_product($product->get_id())) {
            return true;
        }
        return $individually;
    }

    private function cart_has_parking() {
        if (!function_exists('WC') || !WC()->cart) {
            return false;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            if (!empty($ci['product_id']) && self::is_parking_product($ci['product_id'])) {
                return true;
            }
        }
        return false;
    }

    /** Re-check on cart/checkout: eligibility and a plate on every line. */
    public function check_cart_eligibility() {
        if (!$this->cart_has_parking()) {
            return;
        }
        if (!self::current_user_may_buy()) {
            wc_add_notice(self::eligibility_message(), 'error');
            return;
        }
        if (self::cart_parking_count() > 1) {
            wc_add_notice(__('Only one parking spot can be booked per account. Please remove the extra parking permit from your cart.', 'rt-event-manager'), 'error');
            return;
        }
        if (self::user_active_permit(get_current_user_id(), self::session_pending_order_id())) {
            wc_add_notice(__('You already have a parking permit. Only one parking spot can be booked per account — please remove the parking permit from your cart.', 'rt-event-manager'), 'error');
            return;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            if (!empty($ci['product_id']) && self::is_parking_product($ci['product_id'])
                && (empty($ci[self::CART_KEY]) || !self::plate_is_valid($ci[self::CART_KEY]))) {
                wc_add_notice(__('A parking permit in your cart has no licence plate. Please remove it and add it again with the plate.', 'rt-event-manager'), 'error');
                return;
            }
        }
    }

    public function order_line_item_meta($item, $cart_item_key, $values, $order) {
        if (!empty($values[self::CART_KEY])) {
            $plate = self::clean_plate($values[self::CART_KEY]);
            $item->add_meta_data(__('Licence plate', 'rt-event-manager'), $plate, true);
            $item->add_meta_data(self::ITEM_META, $plate, true);
        }
    }

    /* ---------------------------------------------------------------------
     * Permit lifecycle
     * ------------------------------------------------------------------- */

    /** Map a WooCommerce order status to a permit status. */
    private static function status_for_order($order_status) {
        switch ($order_status) {
            case 'processing':
            case 'completed':
                return 'valid';
            case 'cancelled':
            case 'failed':
                return 'cancelled';
            case 'refunded':
                return 'refunded';
            default:
                return 'draft';
        }
    }

    public function on_order_processed($order_id) {
        $order = wc_get_order($order_id);
        if ($order) {
            $this->sync_order($order);
        }
    }

    public function on_order_processed_obj($order) {
        if ($order instanceof WC_Order) {
            $this->sync_order($order);
        }
    }

    public function on_order_status_changed($order_id, $from, $to) {
        $order = wc_get_order($order_id);
        if ($order) {
            $this->sync_order($order);
        }
    }

    /**
     * Ensure every parking line on the order has its permit rows, and set their
     * status from the order's status. Idempotent.
     */
    public function sync_order($order) {
        global $wpdb;
        $table  = self::table();
        $status = self::status_for_order($order->get_status());
        $holder = trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name());
        $now    = current_time('mysql');
        $found  = false;

        foreach ($order->get_items() as $item_id => $item) {
            $pid = $item->get_product_id();
            if (!self::is_parking_product($pid)) {
                continue;
            }
            $found = true;
            $plate = self::clean_plate((string) $item->get_meta(self::ITEM_META));
            $qty   = max(1, (int) $item->get_quantity());
            for ($i = 0; $i < $qty; $i++) {
                $wpdb->query($wpdb->prepare(
                    "INSERT IGNORE INTO $table (product_id, order_id, order_item_id, permit_index, user_id, holder_name, plate, plate_norm, permit_key, permit_no, status, created_at, updated_at)
                     VALUES (%d, %d, %d, %d, %d, %s, %s, %s, %s, %s, %s, %s, %s)",
                    $pid, $order->get_id(), $item_id, $i, $order->get_user_id(), $holder,
                    $plate, self::normalize_plate($plate), wp_generate_password(16, false, false), self::generate_permit_no(), $status, $now, $now
                ));
            }
        }

        if ($found) {
            $wpdb->query($wpdb->prepare(
                "UPDATE $table SET status = %s, updated_at = %s WHERE order_id = %d AND status NOT IN (%s, 'revoked')",
                $status, $now, $order->get_id(), $status
            ));
        }
    }

    /**
     * Holder line for the printed permit, which is publicly visible behind the
     * windscreen: initials plus the member's .WORLD ID, or their WordPress user
     * ID when they have none — e.g. "KS - kenneth.staub" / "KS - 123".
     */
    public static function holder_code($permit) {
        $parts = preg_split('/\s+/u', trim((string) $permit['holder_name']), -1, PREG_SPLIT_NO_EMPTY);
        $initials = '';
        if (!empty($parts)) {
            $pick = (count($parts) > 1) ? array($parts[0], end($parts)) : array($parts[0]);
            foreach ($pick as $w) {
                $initials .= function_exists('mb_substr') ? mb_strtoupper(mb_substr($w, 0, 1, 'UTF-8'), 'UTF-8') : strtoupper(substr($w, 0, 1));
            }
        }

        $uid = absint($permit['user_id']);
        $id  = $uid ? trim((string) get_user_meta($uid, 'world_id', true)) : '';
        if ('' === $id && $uid && class_exists('RT_Event_Manager')) {
            // Fall back to the .WORLD ID on the holder's own event/staff ticket.
            foreach (RT_Event_Manager::get_tickets_for_user($uid) as $t) {
                if (in_array(RT_Event_Manager::get_ticket_kind($t), array('event', 'staff'), true)
                    && !empty($t['world_id'])
                    && 0 === strcasecmp(trim((string) $t['holder_name']), trim((string) $permit['holder_name']))) {
                    $id = trim((string) $t['world_id']);
                    break;
                }
            }
        }
        if ('' === $id && $uid) {
            $id = (string) $uid;
        }
        return trim($initials . ('' !== $id ? ' - ' . $id : ''), ' -');
    }

    /**
     * The holder's Round Table family as its short code (RT, C41, LC, AC, TC),
     * taken from their event (or staff) ticket — the one in the holder's own
     * name when there are several. '' when unknown.
     */
    public static function holder_family($permit) {
        if (empty($permit['user_id']) || !class_exists('RT_Event_Manager')) {
            return '';
        }
        $abbr = array(0 => 'RT', 1 => 'C41', 2 => 'LC', 3 => 'AC', 4 => 'TC'); // same map as the wallet passes
        $pick = null;
        foreach (RT_Event_Manager::get_tickets_for_user($permit['user_id']) as $t) {
            if (!in_array(RT_Event_Manager::get_ticket_kind($t), array('event', 'staff'), true)
                || !isset($t['rti_family']) || '' === (string) $t['rti_family']) {
                continue;
            }
            if (!$pick) {
                $pick = $t;
            }
            if (0 === strcasecmp(trim((string) $t['holder_name']), trim((string) $permit['holder_name']))) {
                $pick = $t;
                break;
            }
        }
        if (!$pick) {
            return '';
        }
        $fid = (int) $pick['rti_family'];
        return isset($abbr[$fid]) ? $abbr[$fid] : '';
    }

    /** The holder's country name, from the parking order (else their saved billing country). */
    public static function holder_country($permit) {
        $code  = '';
        $order = !empty($permit['order_id']) ? wc_get_order($permit['order_id']) : null;
        if ($order) {
            $code = (string) $order->get_billing_country();
        }
        if ('' === $code && !empty($permit['user_id'])) {
            $code = (string) get_user_meta($permit['user_id'], 'billing_country', true);
        }
        if ('' === $code) {
            return '';
        }
        $countries = (function_exists('WC') && WC()->countries) ? WC()->countries->get_countries() : array();
        return isset($countries[$code]) ? html_entity_decode($countries[$code], ENT_QUOTES, 'UTF-8') : $code;
    }

    /** Human permit reference, e.g. "P-482913". */
    public static function permit_ref($permit) {
        if (!empty($permit['permit_no'])) {
            return 'P-' . $permit['permit_no'];
        }
        return 'P-' . str_pad((string) absint($permit['id']), 4, '0', STR_PAD_LEFT); // legacy fallback
    }

    /* ---------------------------------------------------------------------
     * QR token — parking-only, distinct from the event ticket token
     * ------------------------------------------------------------------- */

    private static function sign($id, $key) {
        return substr(hash_hmac('sha256', 'parking|' . absint($id) . '|' . $key, wp_salt('auth')), 0, 20);
    }

    public static function token($permit) {
        $id  = absint($permit['id']);
        $key = (string) $permit['permit_key'];
        return self::TOKEN_PREFIX . '|' . $id . '|' . $key . '|' . self::sign($id, $key);
    }

    public static function is_parking_token($token) {
        return 0 === strpos((string) $token, self::TOKEN_PREFIX . '|');
    }

    /** Resolve a scanned token to its permit row, or false. */
    public static function verify_token($token) {
        if (!preg_match('/^' . self::TOKEN_PREFIX . '\|(\d+)\|([A-Za-z0-9]{8,32})\|([a-f0-9]{20})$/', trim((string) $token), $m)) {
            return false;
        }
        if (!hash_equals(self::sign($m[1], $m[2]), $m[3])) {
            return false;
        }
        $permit = self::get_permit($m[1]);
        if (!$permit || !hash_equals((string) $permit['permit_key'], $m[2])) {
            return false;
        }
        return $permit;
    }

    /* ---------------------------------------------------------------------
     * Validity
     * ------------------------------------------------------------------- */

    /** Re-read the order so a stale row never reads as valid. */
    private function refresh_status($permit) {
        $order = $permit['order_id'] ? wc_get_order($permit['order_id']) : null;
        if (!$order) {
            return $permit;
        }
        $this->sync_order($order);
        $fresh = self::get_permit($permit['id']);
        return $fresh ? $fresh : $permit;
    }

    /**
     * @return array{valid:bool, reason:string}
     */
    public static function validity($permit) {
        $labels = self::status_labels();
        $status = isset($permit['status']) ? $permit['status'] : 'draft';
        if ('valid' !== $status) {
            return array('valid' => false, 'reason' => sprintf(
                /* translators: %s: permit status */
                __('Permit is %s — not valid for parking.', 'rt-event-manager'),
                isset($labels[$status]) ? $labels[$status] : $status
            ));
        }
        list($from, $to) = self::event_window();
        if ('' !== $from) {
            $today = self::today();
            if ($today < $from || $today > $to) {
                return array('valid' => false, 'reason' => sprintf(
                    /* translators: %s: event dates */
                    __('Permit is valid only %s — not today.', 'rt-event-manager'),
                    self::event_window_label()
                ));
            }
        }
        return array('valid' => true, 'reason' => '');
    }

    public static function status_labels() {
        return array(
            'valid'     => __('Confirmed', 'rt-event-manager'),
            'draft'     => __('Awaiting payment', 'rt-event-manager'),
            'cancelled' => __('Cancelled', 'rt-event-manager'),
            'refunded'  => __('Refunded', 'rt-event-manager'),
            'revoked'   => __('Revoked', 'rt-event-manager'),
        );
    }

    /* ---------------------------------------------------------------------
     * Check-in app integration
     * ------------------------------------------------------------------- */

    public static function staff_can_scan($user_id = 0) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id) {
            return false;
        }
        if (user_can($user_id, 'edit_shop_orders')) {
            return true;
        }
        return class_exists('RT_Event_Manager_Staff')
            && defined('RT_Event_Manager_Staff::CAP_CHECKIN_PARKING')
            && RT_Event_Manager_Staff::user_can_staff($user_id, RT_Event_Manager_Staff::CAP_CHECKIN_PARKING);
    }

    /**
     * Handle a check-in lookup for a parking permit. Sends the JSON response.
     *
     * @param string $token Scanned QR text ('' for a manual plate lookup).
     * @param string $plate Manual plate lookup.
     */
    public function checkin_lookup($token, $plate = '') {
        if (!self::staff_can_scan()) {
            wp_send_json_error(array('message' => __('You cannot check parking permits.', 'rt-event-manager')));
        }

        $permit = false;
        if ('' !== $token) {
            $permit = self::verify_token($token);
            if (!$permit) {
                wp_send_json_error(array('message' => __('Unrecognised code — this is not a valid parking permit.', 'rt-event-manager')));
            }
        } elseif ('' !== $plate) {
            global $wpdb;
            // Accept a permit number ("P-482913" / "482913") as well as a plate.
            if (preg_match('/^\s*P?-?\s*(\d{6,8})\s*$/i', $plate, $pm)) {
                $rows = (array) $wpdb->get_results($wpdb->prepare(
                    'SELECT * FROM ' . self::table() . ' WHERE permit_no = %s LIMIT 1',
                    $pm[1]
                ), ARRAY_A);
            } else {
                $rows = array();
            }
            if (empty($rows)) {
                $rows = (array) $wpdb->get_results($wpdb->prepare(
                    'SELECT * FROM ' . self::table() . " WHERE plate_norm = %s ORDER BY (status = 'valid') DESC, id DESC LIMIT 1",
                    self::normalize_plate($plate)
                ), ARRAY_A);
            }
            $permit = $rows ? $rows[0] : false;
            if (!$permit) {
                wp_send_json_error(array('message' => sprintf(
                    /* translators: %s: licence plate */
                    __('No parking permit found for %s.', 'rt-event-manager'),
                    self::clean_plate($plate)
                )));
            }
        }
        if (!$permit) {
            wp_send_json_error(array('message' => __('Enter a licence plate or scan a permit.', 'rt-event-manager')));
        }

        $permit = $this->refresh_status($permit);
        wp_send_json_success($this->checkin_payload($permit));
    }

    private function checkin_payload($permit) {
        $v       = self::validity($permit);
        $product = wc_get_product($permit['product_id']);
        $labels  = self::status_labels();
        return array(
            'parking'   => true,
            'permit_id' => absint($permit['id']),
            'ref'       => self::permit_ref($permit),
            'plate'     => $permit['plate'],
            'holder'    => $permit['holder_name'],
            'product'   => $product ? $product->get_name() : __('Parking', 'rt-event-manager'),
            'order_id'  => absint($permit['order_id']),
            'status'    => $permit['status'],
            'status_label' => isset($labels[$permit['status']]) ? $labels[$permit['status']] : $permit['status'],
            'dates'     => self::event_window_label(),
            'valid'     => $v['valid'],
            'reason'    => $v['reason'],
        );
    }

    /* ---------------------------------------------------------------------
     * Member portal: Parking tab
     * ------------------------------------------------------------------- */

    public static function tab_visible($user_id) {
        if ('yes' !== get_option('rt_event_manager_show_parking', 'yes')) {
            return false;
        }
        self::backfill_user($user_id);
        if (!empty(self::get_permits_for_user($user_id))) {
            return true;
        }
        return self::user_is_eligible($user_id) && !empty(self::parking_products());
    }

    public function maybe_enqueue() {
        if (!function_exists('is_account_page') || !is_account_page()) {
            return;
        }
        $tab = isset($_GET['tab']) ? sanitize_key(wp_unslash($_GET['tab'])) : '';
        if ('parking' !== $tab) {
            return;
        }
        $path = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/parking.js';
        wp_enqueue_script('rt-event-manager-parking', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/parking.js', array(), file_exists($path) ? filemtime($path) : RT_EVENT_MANAGER_VERSION, true);
        wp_localize_script('rt-event-manager-parking', 'rtEventManagerParking', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('rt_event_manager_parking_plate'),
            'i18n'    => array(
                'save'     => __('Save', 'rt-event-manager'),
                'cancel'   => __('Cancel', 'rt-event-manager'),
                'edit'     => __('Change plate', 'rt-event-manager'),
                'saving'   => __('Saving…', 'rt-event-manager'),
                'error'    => __('Could not save the plate. Please try again.', 'rt-event-manager'),
                'reprint'  => __('Plate updated — print the permit again.', 'rt-event-manager'),
            ),
        ));
    }

    public function render_account_tab() {
        $uid    = get_current_user_id();
        $permit = self::user_active_permit($uid);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Parking', 'rt-event-manager') . '</h2>';

        if ($permit) {
            $this->render_permit_card($permit);
            return;
        }

        echo '<p>' . esc_html(sprintf(
            /* translators: %s: event dates */
            __('Parking permits are valid for the whole event (%s), for the vehicle shown on the permit. One parking spot can be booked per account.', 'rt-event-manager'),
            self::event_window_label()
        )) . '</p>';

        // Earlier permits that were cancelled or refunded.
        $past = array_filter(self::get_permits_for_user($uid), function ($p) {
            return !in_array($p['status'], self::holding_statuses(), true);
        });
        if (!empty($past)) {
            $labels = self::status_labels();
            echo '<p class="uk-text-meta">' . esc_html__('Previous permits:', 'rt-event-manager') . ' ';
            $bits = array();
            foreach ($past as $p) {
                $bits[] = esc_html(self::permit_ref($p) . ' (' . $p['plate'] . ') — ' . (isset($labels[$p['status']]) ? $labels[$p['status']] : $p['status']));
            }
            echo implode(' · ', $bits) . '</p>'; // phpcs:ignore -- escaped above
        }

        // A permit already waiting in the cart.
        if (self::cart_parking_count() > 0) {
            echo '<div class="uk-alert uk-alert-primary"><p>' . esc_html__('A parking permit is in your cart.', 'rt-event-manager')
                . ' <a href="' . esc_url(wc_get_checkout_url()) . '">' . esc_html__('Go to checkout', 'rt-event-manager') . '</a></p></div>';
            return;
        }

        // ---- Book ----
        $products = self::parking_products();
        if (empty($products)) {
            echo '<p>' . esc_html__('Parking is not on sale right now.', 'rt-event-manager') . '</p>';
            return;
        }
        echo '<h3>' . esc_html__('Book a parking spot', 'rt-event-manager') . '</h3>';
        if (!self::user_is_eligible($uid)) {
            echo '<div class="uk-alert uk-alert-warning"><p>' . esc_html(self::eligibility_message()) . '</p></div>';
            return;
        }
        echo '<div class="rtacc-products rtacc-parking-products">';
        foreach ($products as $product) {
            echo '<div class="rtacc-product uk-card uk-card-default uk-card-body">';
            echo '<h4 class="rtacc-product-title">' . esc_html($product->get_name()) . '</h4>';
            echo '<div class="rtacc-product-price">' . wp_kses_post($product->get_price_html()) . '</div>';
            if ($product->managing_stock() && null !== $product->get_stock_quantity()) {
                $left = max(0, (int) $product->get_stock_quantity());
                echo '<p class="uk-text-meta">' . esc_html(sprintf(
                    /* translators: %d: spots left */
                    _n('%d spot left', '%d spots left', $left, 'rt-event-manager'),
                    $left
                )) . '</p>';
            }
            if (!$product->is_purchasable() || !$product->is_in_stock()) {
                echo '<p><strong>' . esc_html__('Sold out', 'rt-event-manager') . '</strong></p>';
            } else {
                echo '<form method="post" action="' . esc_url(wc_get_cart_url()) . '" class="rtacc-parking-buy">';
                echo '<input type="hidden" name="add-to-cart" value="' . esc_attr($product->get_id()) . '" />';
                echo '<input type="hidden" name="quantity" value="1" />';
                echo '<label class="uk-form-label" for="rti-plate-' . esc_attr($product->get_id()) . '">' . esc_html__('Licence plate', 'rt-event-manager') . '</label>';
                echo '<input class="uk-input" type="text" id="rti-plate-' . esc_attr($product->get_id()) . '" name="' . esc_attr(self::CART_KEY) . '" required maxlength="20" autocomplete="off" placeholder="' . esc_attr__('e.g. ZH 123456', 'rt-event-manager') . '" />';
                echo '<button type="submit" class="uk-button uk-button-default uk-margin-small-top">' . esc_html__('Add to cart', 'rt-event-manager') . '</button>';
                echo '</form>';
            }
            echo '</div>';
        }
        echo '</div>';
    }

    /**
     * The member's permit, drawn as a ticket, with Print / Pay / Change plate.
     *
     * @param array $permit
     * @param bool  $compact Dashboard view: no plate editing or notes, plus a
     *                       link to the Parking tab.
     */
    public function render_permit_card($permit, $compact = false) {
        $labels   = self::status_labels();
        $status   = $permit['status'];
        $product  = wc_get_product($permit['product_id']);
        $order    = $permit['order_id'] ? wc_get_order($permit['order_id']) : null;
        $event    = get_option('rt_event_manager_wallet_event_name', __('RTI Half-Year Meeting 2027', 'rt-event-manager'));
        $editable = !$compact && self::plate_editing_allowed() && in_array($status, array('valid', 'draft'), true);

        // Dashboard: a compact row in the same table style as the tours.
        if ($compact) {
            $this->render_permit_row($permit, $product, $order, $labels);
            return;
        }

        $qr       = ('valid' === $status) ? $this->qr_data_uri(self::token($permit), 360) : '';

        echo '<div class="rtacc-permit rtacc-permit--' . esc_attr($status) . '" data-permit="' . esc_attr($permit['id']) . '">';

        echo '<div class="rtacc-permit-main">';
        echo '<div class="rtacc-permit-head"><span class="rtacc-permit-p" aria-hidden="true">P</span><div>';
        echo '<div class="rtacc-permit-kicker">' . esc_html__('Parking permit', 'rt-event-manager') . '</div>';
        echo '<div class="rtacc-permit-event">' . esc_html($event) . '</div>';
        if ($product) {
            echo '<div class="rtacc-permit-sub">' . esc_html($product->get_name()) . '</div>';
        }
        echo '</div></div>';

        echo '<div class="rtacc-permit-lbl">' . esc_html__('Licence plate', 'rt-event-manager') . '</div>';
        echo '<div class="rtacc-parking-plate-cell"><strong class="rtacc-parking-plate rtacc-permit-plate">' . esc_html('' !== $permit['plate'] ? $permit['plate'] : '—') . '</strong>';
        if ($editable) {
            echo ' <button type="button" class="uk-button uk-button-link rtacc-parking-edit">' . esc_html__('Change plate', 'rt-event-manager') . '</button>';
        }
        echo '</div>';

        echo '<dl class="rtacc-permit-meta">';
        echo '<dt>' . esc_html__('Valid', 'rt-event-manager') . '</dt><dd>' . esc_html(self::event_window_label()) . '</dd>';
        echo '<dt>' . esc_html__('Holder', 'rt-event-manager') . '</dt><dd>' . esc_html($permit['holder_name']) . '</dd>';
        echo '<dt>' . esc_html__('Permit', 'rt-event-manager') . '</dt><dd>' . esc_html(self::permit_ref($permit))
            . ($order ? ' · <a href="' . esc_url($order->get_view_order_url()) . '">' . esc_html(sprintf(__('Order #%s', 'rt-event-manager'), $order->get_order_number())) . '</a>' : '') . '</dd>';
        echo '<dt>' . esc_html__('Status', 'rt-event-manager') . '</dt><dd><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html(isset($labels[$status]) ? $labels[$status] : $status) . '</span></dd>';
        echo '</dl>';
        echo '</div>'; // .rtacc-permit-main

        echo '<div class="rtacc-permit-stub">';
        if ($qr) {
            echo '<img class="rtacc-permit-qr" src="' . esc_attr($qr) . '" alt="' . esc_attr__('Parking permit QR code', 'rt-event-manager') . '" />';
            echo '<a class="uk-button uk-button-primary rtacc-permit-print" target="_blank" rel="noopener" href="' . esc_url(self::permit_pdf_url($permit['id'])) . '">'
                . '<i class="fa-regular fa-print" aria-hidden="true"></i> ' . esc_html__('Print permit', 'rt-event-manager') . '</a>';
        } elseif ('draft' === $status) {
            echo '<p class="rtacc-permit-note">' . esc_html__('Your permit can be printed once the order is paid.', 'rt-event-manager') . '</p>';
            if ($order && $order->needs_payment()) {
                echo '<a class="uk-button uk-button-primary" href="' . esc_url($order->get_checkout_payment_url()) . '">' . esc_html__('Pay now', 'rt-event-manager') . '</a>';
            }
        } else {
            echo '<p class="rtacc-permit-note">' . esc_html__('This permit has been revoked. Please contact the organisers.', 'rt-event-manager') . '</p>';
        }
        echo '</div>'; // .rtacc-permit-stub

        echo '</div>'; // .rtacc-permit

        echo '<p class="uk-text-meta">' . esc_html__('Print the permit and place it behind your windscreen with the QR code facing out. One parking spot can be booked per account.', 'rt-event-manager') . '</p>';
        $deadline = self::plate_edit_deadline_label();
        if (!self::plate_editing_allowed()) {
            echo '<p class="uk-text-meta">' . esc_html__('The licence plate can no longer be changed online. Please contact the organisers for changes.', 'rt-event-manager') . '</p>';
        } elseif ('' !== $deadline && in_array($permit['status'], array('valid', 'draft'), true)) {
            echo '<p class="uk-text-meta">' . esc_html(sprintf(
                /* translators: %s: date and time */
                __('You can change the licence plate until %s (30 minutes before the permit becomes valid).', 'rt-event-manager'),
                $deadline
            )) . '</p>';
        }
    }

    /** Dashboard row: the permit in the tours' table layout (stacks on mobile). */
    private function render_permit_row($permit, $product, $order, $labels) {
        $status = $permit['status'];

        echo '<table class="rtacc-table rtacc-tickets rtacc-dashboard-table rtacc-parking-dash uk-table uk-table-divider uk-table-middle uk-table-small">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Parking', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Date', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody><tr>';
        echo '<td class="rtacc-parking-label" data-title="' . esc_attr__('Parking', 'rt-event-manager') . '"><strong class="rtacc-parking-plate">' . esc_html('' !== $permit['plate'] ? $permit['plate'] : '—') . '</strong></td>';
        echo '<td data-title="' . esc_attr__('Date', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--date"><i class="fa-solid fa-calendar" aria-hidden="true"></i> ' . esc_html(self::event_window_label()) . '</span></td>';
        echo '<td data-title="' . esc_attr__('Status', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html(isset($labels[$status]) ? $labels[$status] : $status) . '</span></td>';
        echo '</tr></tbody></table>';

        echo '<p class="rtacc-actions rtacc-parking-dash-actions">';
        if ('valid' === $status) {
            echo '<a class="uk-button uk-button-primary uk-button-small" target="_blank" rel="noopener" href="' . esc_url(self::permit_pdf_url($permit['id'])) . '">'
                . '<i class="fa-regular fa-print" aria-hidden="true"></i> ' . esc_html__('Print permit', 'rt-event-manager') . '</a>';
        } elseif ('draft' === $status && $order && $order->needs_payment()) {
            echo '<a class="uk-button uk-button-default uk-button-small" href="' . esc_url($order->get_checkout_payment_url()) . '">' . esc_html__('Pay now', 'rt-event-manager') . '</a>';
        }
        echo '</p>';
    }

    /** Member action: change a permit's plate (until 30 min before validity). */
    public function ajax_update_plate() {
        check_ajax_referer('rt_event_manager_parking_plate', 'nonce');
        $permit = self::get_permit(isset($_POST['permit_id']) ? absint($_POST['permit_id']) : 0);
        if (!$permit || absint($permit['user_id']) !== get_current_user_id()) {
            wp_send_json_error(array('message' => __('Parking permit not found.', 'rt-event-manager')));
        }
        if (!self::plate_editing_allowed() || !in_array($permit['status'], array('valid', 'draft'), true)) {
            wp_send_json_error(array('message' => __('This plate can no longer be changed.', 'rt-event-manager')));
        }
        $plate = self::clean_plate(isset($_POST['plate']) ? wp_unslash($_POST['plate']) : '');
        if (!self::plate_is_valid($plate)) {
            wp_send_json_error(array('message' => __('Please enter a valid licence plate (2–15 letters or digits).', 'rt-event-manager')));
        }
        $this->set_plate($permit, $plate);
        wp_send_json_success(array('plate' => $plate));
    }

    private function set_plate($permit, $plate) {
        global $wpdb;
        $wpdb->update(
            self::table(),
            array('plate' => $plate, 'plate_norm' => self::normalize_plate($plate), 'updated_at' => current_time('mysql')),
            array('id' => absint($permit['id'])),
            array('%s', '%s', '%s'),
            array('%d')
        );
        // Keep the order line in step so the order/emails show the current plate.
        if (!empty($permit['order_item_id']) && function_exists('wc_update_order_item_meta')) {
            wc_update_order_item_meta($permit['order_item_id'], self::ITEM_META, $plate);
            wc_update_order_item_meta($permit['order_item_id'], __('Licence plate', 'rt-event-manager'), $plate);
        }
    }

    /* ---------------------------------------------------------------------
     * Printable windscreen permit (PDF)
     * ------------------------------------------------------------------- */

    public static function permit_pdf_url($permit_id) {
        return add_query_arg(array(
            'action'    => 'rt_event_manager_parking_permit',
            'permit_id' => absint($permit_id),
            'nonce'     => wp_create_nonce('rt_event_manager_parking_permit_' . absint($permit_id)),
        ), admin_url('admin-ajax.php'));
    }

    public function ajax_permit_pdf() {
        if (!is_user_logged_in()) {
            wp_die(esc_html__('You must be logged in.', 'rt-event-manager'));
        }
        $id = isset($_GET['permit_id']) ? absint($_GET['permit_id']) : 0;
        if (!$id || !isset($_GET['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['nonce'])), 'rt_event_manager_parking_permit_' . $id)) {
            wp_die(esc_html__('Invalid request.', 'rt-event-manager'));
        }
        $permit = self::get_permit($id);
        $is_admin = current_user_can('edit_shop_orders');
        if (!$permit || (!$is_admin && absint($permit['user_id']) !== get_current_user_id())) {
            wp_die(esc_html__('Parking permit not found.', 'rt-event-manager'));
        }
        $permit = $this->refresh_status($permit);

        $pdf = $this->build_pdf($permit);
        if (false === $pdf) {
            wp_die(esc_html__('Could not generate the parking permit.', 'rt-event-manager'));
        }
        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="parking-' . sanitize_file_name(self::permit_ref($permit)) . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf; // phpcs:ignore
        exit;
    }

    private function qr_data_uri($data, $size = 480) {
        try {
            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($data)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size($size)
                ->margin(4)
                ->build();
            return 'data:image/png;base64,' . base64_encode($result->getString());
        } catch (\Exception $e) {
            error_log('RT Event Manager parking QR failed: ' . $e->getMessage());
            return '';
        }
    }

    /**
     * A4 sheet with an A5-landscape windscreen permit at the top and a cut line.
     *
     * @return string|false
     */
    private function build_pdf($permit) {
        $valid_status = ('valid' === $permit['status']);
        $qr       = $valid_status ? $this->qr_data_uri(self::token($permit)) : '';
        $labels   = self::status_labels();
        $event    = get_option('rt_event_manager_wallet_event_name', __('RTI Half-Year Meeting 2027', 'rt-event-manager'));
        $product  = wc_get_product($permit['product_id']);
        $pname    = $product ? $product->get_name() : __('Parking', 'rt-event-manager');
        $venue    = (string) get_option('rt_event_manager_wallet_venue_name', '');
        $family   = self::holder_family($permit);
        $country  = self::holder_country($permit);

        ob_start();
        ?>
        <!DOCTYPE html>
        <html><head><meta charset="utf-8" />
        <style>
            @page { margin: 10mm; }
            body { font-family: 'DejaVu Sans', sans-serif; color: #111; margin: 0; }
            /* dompdf ignores box-sizing: content 172mm + 2×8mm padding + 2×0.8mm border = 190mm (A4 minus margins). */
            .permit { width: 172mm; border: 0.8mm solid #0b4ea2; border-radius: 6mm; padding: 7mm 8mm 5mm; }
            .head { width: 100%; border-collapse: collapse; }
            .head td { vertical-align: middle; }
            .p-sign { width: 26mm; height: 26mm; background: #0b4ea2; color: #fff; font-size: 64pt; font-weight: bold; text-align: center; line-height: 26mm; border-radius: 4mm; }
            .title { padding-left: 6mm; }
            .title .kicker { font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; color: #0b4ea2; font-weight: bold; }
            .title .event { font-size: 15pt; font-weight: bold; margin-top: 1mm; }
            .title .sub { font-size: 10pt; color: #444; margin-top: 1mm; }
            .body { width: 100%; border-collapse: collapse; margin-top: 6mm; }
            .body td { vertical-align: top; }
            .plate-lbl { font-size: 9pt; color: #555; text-transform: uppercase; letter-spacing: 1px; }
            .plate { display: inline-block; font-family: 'DejaVu Sans Mono', monospace; font-size: 38pt; font-weight: bold; border: 2px solid #111; border-radius: 2mm; padding: 1mm 4mm; margin: 1mm 0 5mm; }
            .meta { font-size: 10.5pt; border-collapse: collapse; }
            .meta td { padding: 1.2mm 0; }
            .meta td.lbl { color: #555; width: 32mm; }
            .qr { text-align: center; width: 66mm; }
            .qr img { width: 62mm; height: 62mm; }
            .void { display: inline-block; width: 56mm; padding: 22mm 3mm; border: 2px dashed #b32d2e; color: #b32d2e; font-weight: bold; text-align: center; }
            .foot { margin-top: 7mm; font-size: 8.5pt; color: #444; border-top: 1px solid #ccc; padding-top: 2mm; }
            .org { font-size: 9.5pt; color: #444; margin-top: 0.5mm; }
            .cut { margin-top: 6mm; border-top: 1px dashed #999; font-size: 8pt; color: #888; padding-top: 1mm; }
        </style></head><body>
            <div class="permit">
                <table class="head"><tr>
                    <td style="width:26mm"><div class="p-sign">P</div></td>
                    <td class="title">
                        <div class="kicker"><?php esc_html_e('Parking permit', 'rt-event-manager'); ?></div>
                        <div class="event"><?php echo esc_html($event); ?></div>
                        <div class="sub"><?php echo esc_html($pname); echo '' !== $venue ? ' · ' . esc_html($venue) : ''; ?></div>
                    </td>
                </tr></table>
                <table class="body"><tr>
                    <td>
                        <div class="plate-lbl"><?php esc_html_e('Licence plate', 'rt-event-manager'); ?></div>
                        <div class="plate"><?php echo esc_html('' !== $permit['plate'] ? $permit['plate'] : '—'); ?></div>
                        <table class="meta">
                            <tr><td class="lbl"><?php esc_html_e('Valid', 'rt-event-manager'); ?></td><td><strong><?php echo esc_html(self::event_window_label()); ?></strong></td></tr>
                            <tr><td class="lbl"><?php esc_html_e('Holder', 'rt-event-manager'); ?></td><td><?php echo esc_html(self::holder_code($permit)); ?>
                                <?php $org = implode(' ', array_filter(array($family, $country))); ?>
                                <?php if ('' !== $org) : ?><div class="org"><?php echo esc_html($org); ?></div><?php endif; ?>
                            </td></tr>
                            <tr><td class="lbl"><?php esc_html_e('Permit', 'rt-event-manager'); ?></td><td><?php echo esc_html(self::permit_ref($permit)); ?> · <?php echo esc_html(sprintf(__('Order #%d', 'rt-event-manager'), absint($permit['order_id']))); ?></td></tr>
                        </table>
                    </td>
                    <td class="qr">
                        <?php if ($qr) : ?>
                            <img src="<?php echo esc_attr($qr); ?>" alt="QR" />
                        <?php else : ?>
                            <div class="void"><?php echo esc_html(isset($labels[$permit['status']]) ? $labels[$permit['status']] : $permit['status']); ?><br><?php esc_html_e('Not valid for parking', 'rt-event-manager'); ?></div>
                        <?php endif; ?>
                    </td>
                </tr></table>
                <div class="foot"><?php esc_html_e('Place behind the windscreen with this side and the QR code facing out. Valid only for the vehicle shown. Not an event admission ticket.', 'rt-event-manager'); ?></div>
            </div>
            <div class="cut">✂ <?php esc_html_e('Cut along the outer border', 'rt-event-manager'); ?></div>
        </body></html>
        <?php
        $html = ob_get_clean();

        try {
            $options = new Options();
            $options->set('isRemoteEnabled', false);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('defaultFont', 'DejaVu Sans');
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            return $dompdf->output();
        } catch (\Exception $e) {
            error_log('RT Event Manager parking permit failed: ' . $e->getMessage());
            return false;
        }
    }

    /* ---------------------------------------------------------------------
     * Admin: RT Event → Parking
     * ------------------------------------------------------------------- */

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Parking Permits', 'rt-event-manager'),
            __('Parking Permits', 'rt-event-manager'),
            'edit_shop_orders',
            self::PAGE_SLUG,
            array($this, 'render_admin_page')
        );
    }

    /** Cancel / reactivate a single permit (Post/Redirect/Get). */
    public function handle_admin_post() {
        if (empty($_POST['rti_parking_action']) || !current_user_can('edit_shop_orders')) {
            return;
        }
        check_admin_referer('rti_parking_admin');
        $permit = self::get_permit(isset($_POST['permit_id']) ? absint($_POST['permit_id']) : 0);
        $action = sanitize_key(wp_unslash($_POST['rti_parking_action']));
        $msg    = 'none';
        if ($permit) {
            global $wpdb;
            if ('cancel' === $action) {
                // 'revoked' is admin-only: order status changes never overwrite it.
                $wpdb->update(self::table(), array('status' => 'revoked', 'updated_at' => current_time('mysql')), array('id' => $permit['id']));
                $msg = 'cancelled';
            } elseif ('reactivate' === $action) {
                $order  = $permit['order_id'] ? wc_get_order($permit['order_id']) : null;
                $status = $order ? self::status_for_order($order->get_status()) : 'valid';
                $wpdb->update(self::table(), array('status' => $status, 'updated_at' => current_time('mysql')), array('id' => $permit['id']));
                $msg = 'reactivated';
            } elseif ('plate' === $action) {
                $plate = self::clean_plate(isset($_POST['plate']) ? wp_unslash($_POST['plate']) : '');
                if (self::plate_is_valid($plate)) {
                    $this->set_plate($permit, $plate);
                    $msg = 'plate';
                } else {
                    $msg = 'badplate';
                }
            }
        }
        $view = isset($_POST['status']) ? sanitize_key(wp_unslash($_POST['status'])) : 'valid';
        wp_safe_redirect(add_query_arg(array('page' => self::PAGE_SLUG, 'status' => $view, 'rti_msg' => $msg), admin_url('admin.php')));
        exit;
    }

    public function render_admin_page() {
        if (!current_user_can('edit_shop_orders')) {
            return;
        }
        $this->backfill_all_once();
        global $wpdb;
        $search = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

        // Status views: the list opens on valid permits.
        $views = array(
            'valid'     => array(__('Valid', 'rt-event-manager'), array('valid')),
            'draft'     => array(__('Awaiting payment', 'rt-event-manager'), array('draft')),
            'revoked'   => array(__('Revoked', 'rt-event-manager'), array('revoked')),
            'cancelled' => array(__('Cancelled / refunded', 'rt-event-manager'), array('cancelled', 'refunded')),
            'all'       => array(__('All', 'rt-event-manager'), array()),
        );
        $view = isset($_GET['status']) ? sanitize_key(wp_unslash($_GET['status'])) : 'valid';
        if (!isset($views[$view])) {
            $view = 'valid';
        }
        $counts = array();
        foreach ((array) $wpdb->get_results('SELECT status, COUNT(*) AS n FROM ' . self::table() . ' GROUP BY status', ARRAY_A) as $c) {
            $counts[$c['status']] = (int) $c['n'];
        }

        $where  = array('1=1');
        $params = array();
        if (!empty($views[$view][1])) {
            $where[] = 'status IN (' . implode(',', array_fill(0, count($views[$view][1]), '%s')) . ')';
            $params  = array_merge($params, $views[$view][1]);
        }
        if ('' !== $search) {
            $like    = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(plate_norm LIKE %s OR holder_name LIKE %s OR order_id = %d OR permit_no = %s)';
            $params  = array_merge($params, array('%' . $wpdb->esc_like(self::normalize_plate($search)) . '%', $like, absint($search), preg_replace('/^P-?/i', '', trim($search))));
        }
        $sql  = 'SELECT p.* FROM ' . self::table() . ' p WHERE ' . implode(' AND ', $where) . ' ORDER BY p.plate_norm ASC, p.id DESC LIMIT 2000';
        $rows = $params ? $wpdb->get_results($wpdb->prepare($sql, $params), ARRAY_A) : $wpdb->get_results($sql, ARRAY_A);
        $labels = self::status_labels();

        $notices = array(
            'cancelled'   => __('Permit revoked.', 'rt-event-manager'),
            'reactivated' => __('Permit reactivated.', 'rt-event-manager'),
            'plate'       => __('Licence plate updated.', 'rt-event-manager'),
            'badplate'    => __('That licence plate is not valid.', 'rt-event-manager'),
        );
        $msg = isset($_GET['rti_msg']) ? sanitize_key(wp_unslash($_GET['rti_msg'])) : '';

        echo '<div class="wrap"><h1>' . esc_html__('Parking permits', 'rt-event-manager') . '</h1>';
        if (isset($notices[$msg])) {
            echo '<div class="notice notice-' . ('badplate' === $msg ? 'error' : 'success') . ' is-dismissible"><p>' . esc_html($notices[$msg]) . '</p></div>';
        }

        // Capacity summary per parking product.
        $products = self::parking_products();
        if (!empty($products)) {
            echo '<h2>' . esc_html__('Capacity', 'rt-event-manager') . '</h2><table class="widefat striped" style="max-width:720px"><thead><tr><th>' . esc_html__('Product', 'rt-event-manager') . '</th><th>' . esc_html__('Confirmed permits', 'rt-event-manager') . '</th><th>' . esc_html__('Spots left (stock)', 'rt-event-manager') . '</th></tr></thead><tbody>';
            foreach ($products as $p) {
                $sold = (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM ' . self::table() . " WHERE product_id = %d AND status = 'valid'", $p->get_id()));
                $left = $p->managing_stock() ? (string) (int) $p->get_stock_quantity() : __('unlimited', 'rt-event-manager');
                echo '<tr><td><a href="' . esc_url(get_edit_post_link($p->get_id())) . '">' . esc_html($p->get_name()) . '</a></td><td>' . esc_html($sold) . '</td><td>' . esc_html($left) . '</td></tr>';
            }
            echo '</tbody></table>';
        } else {
            echo '<p>' . esc_html__('No parking products yet. Edit a simple product and tick “Parking permit” to start selling parking.', 'rt-event-manager') . '</p>';
        }

        echo '<h2>' . esc_html__('Permits', 'rt-event-manager') . '</h2>';

        // Status links (WordPress "subsubsub" style) with counts.
        $links = array();
        foreach ($views as $key => $def) {
            $n = 0;
            if (empty($def[1])) {
                $n = array_sum($counts);
            } else {
                foreach ($def[1] as $st) {
                    $n += isset($counts[$st]) ? $counts[$st] : 0;
                }
            }
            $url     = add_query_arg(array('page' => self::PAGE_SLUG, 'status' => $key), admin_url('admin.php'));
            $links[] = '<li><a href="' . esc_url($url) . '"' . ($key === $view ? ' class="current" aria-current="page"' : '') . '>'
                . esc_html($def[0]) . ' <span class="count">(' . esc_html($n) . ')</span></a>';
        }
        echo '<ul class="subsubsub">' . implode(' | </li>', $links) . '</li></ul>';

        echo '<form method="get"><input type="hidden" name="page" value="' . esc_attr(self::PAGE_SLUG) . '" /><input type="hidden" name="status" value="' . esc_attr($view) . '" />';
        echo '<p class="search-box"><input type="search" name="s" value="' . esc_attr($search) . '" placeholder="' . esc_attr__('Plate, name, order # or permit #', 'rt-event-manager') . '" /> ';
        submit_button(__('Search', 'rt-event-manager'), '', '', false);
        echo '</p></form><br class="clear" />';

        echo '<table class="widefat striped"><thead><tr>';
        foreach (array(__('Permit', 'rt-event-manager'), __('Licence plate', 'rt-event-manager'), __('Holder', 'rt-event-manager'), __('Family / country', 'rt-event-manager'), __('Product', 'rt-event-manager'), __('Order', 'rt-event-manager'), __('Status', 'rt-event-manager'), __('Actions', 'rt-event-manager')) as $h) {
            echo '<th>' . esc_html($h) . '</th>';
        }
        echo '</tr></thead><tbody>';
        if (empty($rows)) {
            echo '<tr><td colspan="8">' . esc_html__('No parking permits found.', 'rt-event-manager') . '</td></tr>';
        }
        foreach ((array) $rows as $r) {
            $product = wc_get_product($r['product_id']);
            $order   = $r['order_id'] ? wc_get_order($r['order_id']) : null;
            echo '<tr>';
            echo '<td>' . esc_html(self::permit_ref($r)) . '</td>';
            echo '<td><form method="post" style="display:flex;gap:4px">';
            wp_nonce_field('rti_parking_admin');
            echo '<input type="hidden" name="permit_id" value="' . esc_attr($r['id']) . '" /><input type="hidden" name="rti_parking_action" value="plate" /><input type="hidden" name="status" value="' . esc_attr($view) . '" />';
            echo '<input type="text" name="plate" value="' . esc_attr($r['plate']) . '" maxlength="20" style="width:120px;text-transform:uppercase" />';
            echo '<button class="button button-small">' . esc_html__('Save', 'rt-event-manager') . '</button></form></td>';
            echo '<td>' . esc_html($r['holder_name']) . '</td>';
            echo '<td>' . esc_html(implode(' ', array_filter(array(self::holder_family($r), self::holder_country($r))))) . '</td>';
            echo '<td>' . esc_html($product ? $product->get_name() : '#' . $r['product_id']) . '</td>';
            echo '<td>' . ($order ? '<a href="' . esc_url($order->get_edit_order_url()) . '">#' . esc_html($order->get_order_number()) . '</a>' : '—') . '</td>';
            echo '<td>' . esc_html(isset($labels[$r['status']]) ? $labels[$r['status']] : $r['status']) . '</td>';
            echo '<td>';
            echo '<a class="button button-small" target="_blank" rel="noopener" href="' . esc_url(self::permit_pdf_url($r['id'])) . '">' . esc_html__('Permit PDF', 'rt-event-manager') . '</a> ';
            echo '<form method="post" style="display:inline">';
            wp_nonce_field('rti_parking_admin');
            echo '<input type="hidden" name="permit_id" value="' . esc_attr($r['id']) . '" /><input type="hidden" name="status" value="' . esc_attr($view) . '" />';
            if ('revoked' === $r['status']) {
                echo '<input type="hidden" name="rti_parking_action" value="reactivate" /><button class="button button-small">' . esc_html__('Reactivate', 'rt-event-manager') . '</button>';
            } elseif (in_array($r['status'], array('valid', 'draft'), true)) {
                echo '<input type="hidden" name="rti_parking_action" value="cancel" /><button class="button button-small" onclick="return confirm(\'' . esc_js(__('Revoke this parking permit? Its QR code will stop working. (To refund it, refund the order instead.)', 'rt-event-manager')) . '\');">' . esc_html__('Revoke', 'rt-event-manager') . '</button>';
            }
            echo '</form></td></tr>';
        }
        echo '</tbody></table></div>';
    }
}
