<?php
/**
 * Numbered challenge coin.
 *
 * A product flagged as a challenge coin sells each number exactly once. The
 * buyer picks a free number on the product page; it is reserved when added to
 * the cart and claimed when the order is placed. Cancelling / refunding /
 * failing the order releases the number again.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Coin {

    /** @var RT_Event_Manager_Coin|null */
    private static $instance = null;

    const META_IS_COIN = '_rti_is_coin';
    const META_MIN     = '_rti_coin_min';
    const META_MAX     = '_rti_coin_max';

    /** How long an in-cart number stays reserved (minutes). */
    const RESERVE_MINUTES = 60;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Product editor: coin options.
        add_action('woocommerce_product_options_general_product_data', array($this, 'product_fields'));
        add_action('woocommerce_process_product_meta', array($this, 'save_product_fields'));

        // Product page: the number picker + validation + cart wiring.
        add_action('woocommerce_before_add_to_cart_button', array($this, 'render_number_field'));
        add_filter('woocommerce_add_to_cart_validation', array($this, 'validate_add_to_cart'), 10, 3);
        add_filter('woocommerce_add_cart_item_data', array($this, 'add_cart_item_data'), 10, 2);
        add_filter('woocommerce_get_item_data', array($this, 'cart_item_display'), 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'order_line_item_meta'), 10, 4);

        // Claim on order placed; release on a dead order.
        add_action('woocommerce_checkout_order_processed', array($this, 'claim_for_order'), 10, 1);
        add_action('woocommerce_store_api_checkout_order_processed', array($this, 'claim_for_order_obj'), 10, 1);
        foreach (array('cancelled', 'failed', 'refunded') as $status) {
            add_action('woocommerce_order_status_' . $status, array($this, 'release_for_order'), 10, 1);
        }

        // Release a reservation when its cart line is removed.
        add_action('woocommerce_remove_cart_item', array($this, 'on_cart_item_removed'), 10, 2);
        add_action('woocommerce_before_cart_item_quantity_zero', array($this, 'on_cart_item_removed'), 10, 2);
    }

    /* ---------------------------------------------------------------------
     * Product configuration
     * ------------------------------------------------------------------- */

    public static function is_coin($product_id) {
        return 'yes' === get_post_meta(absint($product_id), self::META_IS_COIN, true);
    }

    /**
     * A *limited* (numbered) coin — flagged as a coin AND with a configured
     * number range. Only these require the buyer to pick a number; a coin with
     * no range (or any regular product) behaves like normal merchandise.
     */
    public static function is_numbered_coin($product_id) {
        if (!self::is_coin($product_id)) {
            return false;
        }
        list($min, $max) = self::coin_range($product_id);
        return $max > 0 && $max >= $min;
    }

    /** [min, max] for a coin; max 0 means unconfigured. */
    public static function coin_range($product_id) {
        $min = (int) get_post_meta(absint($product_id), self::META_MIN, true);
        $max = (int) get_post_meta(absint($product_id), self::META_MAX, true);
        if ($min < 1) {
            $min = 1;
        }
        return array($min, $max);
    }

    public function product_fields() {
        global $post;
        $is_coin = 'yes' === get_post_meta($post ? $post->ID : 0, self::META_IS_COIN, true);

        echo '<div class="options_group show_if_simple">';
        woocommerce_wp_checkbox(array(
            'id'          => self::META_IS_COIN,
            'label'       => __('Numbered coin', 'rt-event-manager'),
            'description' => __('Each number can be purchased only once. The buyer picks a free number. Leave off for regular merchandise.', 'rt-event-manager'),
        ));

        // The number range applies only to a numbered coin — hidden otherwise so
        // it is never shown (or expected) on regular merchandise.
        echo '<div class="rti-coin-range-fields"' . ($is_coin ? '' : ' style="display:none;"') . '>';
        // No HTML5 "min" constraint: the field is hidden for non-coins and holds
        // 0, which would otherwise be an un-focusable invalid control that blocks
        // the whole product save. Values are validated/clamped in save.
        woocommerce_wp_text_input(array(
            'id'                => self::META_MIN,
            'label'             => __('Lowest coin number', 'rt-event-manager'),
            'type'              => 'number',
            'custom_attributes' => array('step' => '1'),
            'placeholder'       => '1',
        ));
        woocommerce_wp_text_input(array(
            'id'                => self::META_MAX,
            'label'             => __('Highest coin number', 'rt-event-manager'),
            'type'              => 'number',
            'custom_attributes' => array('step' => '1'),
            'description'       => __('e.g. 500 for coins numbered 1–500.', 'rt-event-manager'),
        ));
        echo '</div>';
        echo '</div>';

        // Toggle the range fields with the checkbox (admin product editor only).
        wc_enqueue_js(
            'jQuery(function($){' .
            'function rtiCoinToggle(){ $(".rti-coin-range-fields").toggle( $("#' . esc_js(self::META_IS_COIN) . '").is(":checked") ); }' .
            '$(document).on("change", "#' . esc_js(self::META_IS_COIN) . '", rtiCoinToggle); rtiCoinToggle();' .
            '});'
        );
    }

    public function save_product_fields($product_id) {
        update_post_meta($product_id, self::META_IS_COIN, isset($_POST[self::META_IS_COIN]) ? 'yes' : 'no');
        $min = isset($_POST[self::META_MIN]) ? max(1, absint($_POST[self::META_MIN])) : 1;
        $max = isset($_POST[self::META_MAX]) ? absint($_POST[self::META_MAX]) : 0;
        update_post_meta($product_id, self::META_MIN, $min);
        update_post_meta($product_id, self::META_MAX, $max);
    }

    /* ---------------------------------------------------------------------
     * Claims registry
     * ------------------------------------------------------------------- */

    private static function table() {
        global $wpdb;
        return $wpdb->prefix . 'rti_coin_claims';
    }

    /** Remove expired reservations so their numbers free up. */
    private function cleanup_expired() {
        global $wpdb;
        $table = self::table();
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $table WHERE status = 'reserved' AND expires_at IS NOT NULL AND expires_at < %s",
            current_time('mysql')
        ));
    }

    /** Numbers currently unavailable (claimed, or actively reserved). */
    public function taken_numbers($product_id) {
        global $wpdb;
        $this->cleanup_expired();
        $table = self::table();
        $rows = $wpdb->get_col($wpdb->prepare(
            "SELECT number FROM $table WHERE product_id = %d
             AND (status = 'claimed' OR (status = 'reserved' AND (expires_at IS NULL OR expires_at >= %s)))",
            absint($product_id),
            current_time('mysql')
        ));
        return array_map('intval', (array) $rows);
    }

    /** Free numbers within the product's range. */
    public function available_numbers($product_id) {
        list($min, $max) = self::coin_range($product_id);
        if ($max < $min) {
            return array();
        }
        $taken = array_flip($this->taken_numbers($product_id));
        $out   = array();
        for ($n = $min; $n <= $max; $n++) {
            if (!isset($taken[$n])) {
                $out[] = $n;
            }
        }
        return $out;
    }

    /** Is a specific number free (claimed or actively reserved counts as taken)? */
    public function is_number_available($product_id, $number) {
        list($min, $max) = self::coin_range($product_id);
        $number = (int) $number;
        if ($number < $min || $number > $max || $max < $min) {
            return false;
        }
        return !in_array($number, $this->taken_numbers($product_id), true);
    }

    /** The current cart/session identity used for reservations. */
    private function session_id() {
        if (function_exists('WC') && WC()->session) {
            return (string) WC()->session->get_customer_id();
        }
        return '';
    }

    /** Reserve a number for the current session. Returns true on success. */
    private function reserve($product_id, $number) {
        global $wpdb;
        $this->cleanup_expired();
        if (!$this->is_number_available($product_id, $number)) {
            return false;
        }
        // WP-local time string, matching current_time('mysql') used elsewhere.
        $expires = date('Y-m-d H:i:s', current_time('timestamp') + self::RESERVE_MINUTES * MINUTE_IN_SECONDS);
        $ok = $wpdb->query($wpdb->prepare(
            "INSERT INTO " . self::table() . " (product_id, number, order_id, user_id, reserved_by, status, expires_at, created_at)
             VALUES (%d, %d, 0, %d, %s, 'reserved', %s, %s)",
            absint($product_id),
            (int) $number,
            get_current_user_id(),
            $this->session_id(),
            $expires,
            current_time('mysql')
        ));
        return (false !== $ok);
    }

    /** Promote a reservation (or create) to a claim tied to an order. */
    private function claim($product_id, $number, $order_id, $user_id) {
        global $wpdb;
        $table  = self::table();
        $number = (int) $number;

        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE product_id = %d AND number = %d",
            absint($product_id), $number
        ));
        // Already claimed by a different order — do not steal it.
        if ($existing && 'claimed' === $existing->status && (int) $existing->order_id && (int) $existing->order_id !== (int) $order_id) {
            error_log(sprintf('[RT Coin] number %d for product %d already claimed by order %d', $number, $product_id, $existing->order_id));
            return false;
        }
        $wpdb->query($wpdb->prepare(
            "INSERT INTO $table (product_id, number, order_id, user_id, reserved_by, status, expires_at, created_at)
             VALUES (%d, %d, %d, %d, '', 'claimed', NULL, %s)
             ON DUPLICATE KEY UPDATE order_id = VALUES(order_id), user_id = VALUES(user_id), status = 'claimed', expires_at = NULL",
            absint($product_id), $number, absint($order_id), absint($user_id), current_time('mysql')
        ));
        return true;
    }

    private function release_reservation_for($product_id, $number) {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM " . self::table() . " WHERE product_id = %d AND number = %d AND status = 'reserved' AND reserved_by = %s",
            absint($product_id), (int) $number, $this->session_id()
        ));
    }

    /* ---------------------------------------------------------------------
     * Cart & checkout
     * ------------------------------------------------------------------- */

    public function render_number_field() {
        global $product;
        if (!$product || !self::is_numbered_coin($product->get_id())) {
            return;
        }
        $available = $this->available_numbers($product->get_id());
        list($min, $max) = self::coin_range($product->get_id());

        echo '<div class="rti-coin-picker" style="margin:0 0 1em;">';
        echo '<label for="rti_coin_number" style="display:block;font-weight:600;margin-bottom:4px;">' . esc_html__('Choose your coin number', 'rt-event-manager') . '</label>';
        if (empty($available)) {
            echo '<p class="stock out-of-stock">' . esc_html__('All coin numbers have been claimed — sold out.', 'rt-event-manager') . '</p>';
            // Hide the add-to-cart button when nothing is available.
            echo '<style>.rti-coin-picker ~ .single_add_to_cart_button, .rti-coin-picker ~ .quantity { display:none !important; }</style>';
            echo '</div>';
            return;
        }
        echo '<select name="rti_coin_number" id="rti_coin_number" class="rti-coin-select" required style="min-width:160px;">';
        echo '<option value="">' . esc_html__('— Select a number —', 'rt-event-manager') . '</option>';
        foreach ($available as $n) {
            echo '<option value="' . esc_attr($n) . '">' . esc_html($n) . '</option>';
        }
        echo '</select>';
        echo '<p class="rti-coin-remaining" style="margin:.4em 0 0;color:#666;font-size:.9em;">'
            . esc_html(sprintf(
                /* translators: 1: available count, 2: min, 3: max */
                __('%1$d of the coins numbered %2$d–%3$d are still available. Each number is sold only once.', 'rt-event-manager'),
                count($available), $min, $max
            ))
            . '</p>';
        echo '</div>';
    }

    public function validate_add_to_cart($passed, $product_id, $quantity) {
        if (!self::is_numbered_coin($product_id)) {
            return $passed;
        }
        if ((int) $quantity > 1) {
            wc_add_notice(__('Only one coin can be added at a time — each number is unique.', 'rt-event-manager'), 'error');
            return false;
        }
        $number = isset($_POST['rti_coin_number']) ? absint($_POST['rti_coin_number']) : 0;
        if (!$number) {
            wc_add_notice(__('Please choose a coin number.', 'rt-event-manager'), 'error');
            return false;
        }
        if (!$this->is_number_available($product_id, $number)) {
            wc_add_notice(sprintf(__('Coin number %d is no longer available. Please choose another.', 'rt-event-manager'), $number), 'error');
            return false;
        }
        if (!$this->reserve($product_id, $number)) {
            wc_add_notice(sprintf(__('Coin number %d could not be reserved. Please choose another.', 'rt-event-manager'), $number), 'error');
            return false;
        }
        return $passed;
    }

    public function add_cart_item_data($cart_item_data, $product_id) {
        if (self::is_numbered_coin($product_id) && isset($_POST['rti_coin_number'])) {
            $number = absint($_POST['rti_coin_number']);
            if ($number) {
                $cart_item_data['rti_coin_number'] = $number;
                // Unique key so each coin is its own cart line (never merged).
                $cart_item_data['rti_coin_unique'] = $product_id . '-' . $number . '-' . microtime(true);
            }
        }
        return $cart_item_data;
    }

    public function cart_item_display($item_data, $cart_item) {
        if (!empty($cart_item['rti_coin_number'])) {
            $item_data[] = array(
                'key'   => __('Coin number', 'rt-event-manager'),
                'value' => (string) absint($cart_item['rti_coin_number']),
            );
        }
        return $item_data;
    }

    public function order_line_item_meta($item, $cart_item_key, $values, $order) {
        if (!empty($values['rti_coin_number'])) {
            $number = absint($values['rti_coin_number']);
            // Visible label (shows on order + emails) + a hidden machine key.
            $item->add_meta_data(__('Coin number', 'rt-event-manager'), (string) $number, true);
            $item->add_meta_data('_rti_coin_number', $number, true);
        }
    }

    /** Claim every coin number on the order once it is placed. */
    public function claim_for_order($order_id) {
        $order = wc_get_order($order_id);
        if ($order) {
            $this->claim_for_order_obj($order);
        }
    }

    public function claim_for_order_obj($order) {
        if (!$order instanceof WC_Order) {
            return;
        }
        $user_id = $order->get_user_id();
        foreach ($order->get_items() as $item) {
            $number = (int) $item->get_meta('_rti_coin_number');
            $pid    = $item->get_product_id();
            if ($number > 0 && self::is_coin($pid)) {
                $this->claim($pid, $number, $order->get_id(), $user_id);
            }
        }
    }

    /** Free the numbers on a cancelled/failed/refunded order. */
    public function release_for_order($order_id) {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM " . self::table() . " WHERE order_id = %d",
            absint($order_id)
        ));
    }

    public function on_cart_item_removed($cart_item_key, $cart) {
        $item = isset($cart->cart_contents[$cart_item_key]) ? $cart->cart_contents[$cart_item_key] : null;
        if ($item && !empty($item['rti_coin_number']) && !empty($item['product_id'])) {
            $this->release_reservation_for($item['product_id'], $item['rti_coin_number']);
        }
    }

    /* ---------------------------------------------------------------------
     * Admin overview: claimed coin numbers
     * ------------------------------------------------------------------- */

    /** All claimed numbers for a product: [number => order_id]. */
    public static function claimed_map($product_id) {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT number, order_id FROM " . self::table() . " WHERE product_id = %d AND status = 'claimed' ORDER BY number ASC",
            absint($product_id)
        ), ARRAY_A);
        $map = array();
        foreach ((array) $rows as $r) {
            $map[(int) $r['number']] = (int) $r['order_id'];
        }
        return $map;
    }
}
