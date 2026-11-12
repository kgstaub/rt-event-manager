<?php
/**
 * RT Event Manager — Delegate day tours.
 *
 * A day-tour product flagged **Delegates only** (`_rti_delegates_only`) can be
 * booked solely by confirmed delegates, and only from the *Day Tours* tab of
 * the member's event account:
 *
 * - it is hidden from the main shop, search and the cart's "Add a day tour";
 * - the product page shows a notice instead of an add-to-cart button, and any
 *   classic / link / Store API add-to-cart is refused (the portal adds tours
 *   through WC()->cart->add_to_cart(), which does not run that validation);
 * - every cart line must be attached to a confirmed delegate's ticket, which is
 *   re-checked in the cart and at checkout.
 *
 * A ticket counts as a confirmed delegate when it is flagged delegate on its own
 * (`is_delegate`), or when it is the account holder's own event ticket and the
 * account's delegate status is *Delegate*.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Delegate_Tour {

    /** @var RT_Event_Manager_Delegate_Tour|null */
    private static $instance = null;

    const META = '_rti_delegates_only';

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('woocommerce_product_options_general_product_data', array($this, 'product_fields'));
        add_action('woocommerce_process_product_meta', array($this, 'save_product_fields'));

        // Not sold outside the event account.
        add_filter('woocommerce_product_is_visible', array($this, 'hide_from_catalog'), 20, 2);
        add_action('woocommerce_before_add_to_cart_form', array($this, 'product_page_notice'));
        add_filter('woocommerce_add_to_cart_validation', array($this, 'block_direct_add'), 5, 2);

        // Only for confirmed delegates (cart + checkout).
        add_action('woocommerce_check_cart_items', array($this, 'check_cart'));
    }

    /* ---------------------------------------------------------------------
     * Product flag
     * ------------------------------------------------------------------- */

    public static function is_delegate_tour($product_id) {
        return 'yes' === get_post_meta(absint($product_id), self::META, true);
    }

    public function product_fields() {
        echo '<div class="options_group">';
        woocommerce_wp_checkbox(array(
            'id'          => self::META,
            'label'       => __('Delegates only', 'rt-event-manager'),
            'description' => __('Day tours: only confirmed delegates can book this tour, and only from the Day Tours tab of their event account. Hidden from the shop and search.', 'rt-event-manager'),
        ));
        echo '</div>';
    }

    public function save_product_fields($product_id) {
        update_post_meta($product_id, self::META, isset($_POST[self::META]) ? 'yes' : 'no');
    }

    /* ---------------------------------------------------------------------
     * Who is a confirmed delegate
     * ------------------------------------------------------------------- */

    /** The account a ticket belongs to (owner, else the order's customer). */
    private static function ticket_owner($ticket) {
        $owner = isset($ticket['owner_user_id']) ? absint($ticket['owner_user_id']) : 0;
        if (!$owner && !empty($ticket['order_id']) && function_exists('wc_get_order')) {
            $order = wc_get_order(absint($ticket['order_id']));
            $owner = $order ? absint($order->get_customer_id()) : 0;
        }
        return $owner;
    }

    /** Is this the account holder's own ticket (by name, else unnamed + .WORLD ID)? */
    private static function is_owners_ticket($ticket, $user_id) {
        $u = get_userdata($user_id);
        if (!$u) {
            return false;
        }
        $own_name = strtolower(trim($u->first_name . ' ' . $u->last_name));
        if ('' === $own_name) {
            $own_name = strtolower(trim((string) $u->display_name));
        }
        $name = strtolower(trim((string) (isset($ticket['holder_name']) ? $ticket['holder_name'] : '')));
        if ('' !== $name) {
            return '' !== $own_name && $name === $own_name;
        }
        $own_world = strtolower(trim((string) get_user_meta($user_id, 'world_id', true)));
        $world     = strtolower(trim((string) (isset($ticket['world_id']) ? $ticket['world_id'] : '')));
        return '' !== $own_world && $world === $own_world;
    }

    /**
     * Whether an attendee ticket belongs to a confirmed delegate.
     *
     * @param array $ticket Ticket row (ARRAY_A).
     */
    public static function ticket_is_delegate($ticket) {
        if (!$ticket || !class_exists('RT_Event_Manager')) {
            return false;
        }
        $status = isset($ticket['status']) ? $ticket['status'] : '';
        if (in_array($status, array('cancelled', 'refunded', 'invalid'), true)) {
            return false;
        }
        if ('event' !== RT_Event_Manager::get_ticket_kind($ticket)) {
            return false; // delegates hold an adult event ticket
        }
        if (!empty($ticket['is_delegate'])) {
            return true;
        }
        $owner = self::ticket_owner($ticket);
        return $owner
            && 'delegate' === RT_Event_Manager::get_delegate_status($owner)
            && self::is_owners_ticket($ticket, $owner);
    }

    /* ---------------------------------------------------------------------
     * Event account only
     * ------------------------------------------------------------------- */

    public function hide_from_catalog($visible, $product_id) {
        return self::is_delegate_tour($product_id) ? false : $visible;
    }

    public function product_page_notice() {
        global $product;
        if (!$product || !self::is_delegate_tour($product->get_id())) {
            return;
        }
        $url = function_exists('wc_get_page_permalink') ? add_query_arg('tab', 'daytour', wc_get_page_permalink('myaccount')) : '';
        echo '<div class="woocommerce-info rti-delegate-tour-notice">'
            . esc_html__('This day tour is reserved for confirmed delegates and can only be booked from the Day Tours section of your event account.', 'rt-event-manager')
            . ($url ? ' <a href="' . esc_url($url) . '">' . esc_html__('Go to Day Tours', 'rt-event-manager') . '</a>' : '')
            . '</div>';
        echo '<style>.rti-delegate-tour-notice ~ form.cart, .rti-delegate-tour-notice ~ .cart { display:none !important; }</style>';
    }

    /** Refuse product-page, link and Store API add-to-cart for delegate tours. */
    public function block_direct_add($passed, $product_id) {
        if (self::is_delegate_tour($product_id)) {
            wc_add_notice(__('This day tour is reserved for confirmed delegates and can only be booked from the Day Tours section of your event account.', 'rt-event-manager'), 'error');
            return false;
        }
        return $passed;
    }

    /** Every delegate-tour line must be attached to a confirmed delegate's ticket. */
    public function check_cart() {
        if (!function_exists('WC') || !WC()->cart || !class_exists('RT_Event_Manager')) {
            return;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            if (!$pid || !self::is_delegate_tour($pid)) {
                continue;
            }
            $product = wc_get_product($pid);
            $pname   = $product ? $product->get_name() : __('this day tour', 'rt-event-manager');
            $parent  = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
            $host    = $parent ? RT_Event_Manager::get_ticket_by_id($parent) : null;
            if (!$host || !self::ticket_is_delegate($host)) {
                $who = ($host && '' !== $host['holder_name']) ? $host['holder_name'] : __('This attendee', 'rt-event-manager');
                wc_add_notice(sprintf(
                    /* translators: 1: attendee name, 2: tour name */
                    __('%1$s is not a confirmed delegate, so “%2$s” cannot be booked. Please remove it from your cart.', 'rt-event-manager'),
                    $who,
                    $pname
                ), 'error');
            }
        }
    }
}
