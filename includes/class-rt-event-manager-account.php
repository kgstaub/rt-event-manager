<?php
/**
 * Custom "My Account" portal for RT Event Manager.
 *
 * Rendered through the [rt_event_manager_account] shortcode. Place the
 * shortcode on a page and set that page as WooCommerce → Settings → Advanced →
 * "My account page". The portal sits on top of WooCommerce: it shows the WC
 * login form when logged out, passes through to WC's native output on active
 * account endpoints (order-pay, lost-password, view-order, …), and renders the
 * custom tabbed member portal for the logged-in account root.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Account {

    /** @var RT_Event_Manager_Account|null */
    private static $instance = null;

    /** @var int Id of the current user's own event ticket, for this render pass. */
    private $own_event_id = 0;

    /**
     * @return RT_Event_Manager_Account
     */
    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        add_shortcode('rt_event_manager_account', array($this, 'render_shortcode'));

        // Assets (also enqueued on demand inside the shortcode as a fallback).
        add_action('wp_enqueue_scripts', array($this, 'maybe_enqueue_assets'));

        // Show the merged ".WORLD" SSO login buttons above the WooCommerce
        // registration form (WC uses its own form, which the SSO module's
        // WP-core register_form hook does not reach).
        add_action('woocommerce_register_form_start', array($this, 'render_sso_login_buttons'));

        // "Add more to your booking" controls on the cart page.
        add_action('woocommerce_after_cart_table', array($this, 'render_cart_add_tickets'));

        // AJAX (logged-in only — the whole portal requires authentication).
        add_action('wp_ajax_rt_event_manager_save_profile', array($this, 'ajax_save_profile'));
        add_action('wp_ajax_rt_event_manager_account_save_tickets', array($this, 'ajax_save_tickets'));
        add_action('wp_ajax_rt_event_manager_receipt', array($this, 'ajax_receipt'));
        add_action('wp_ajax_rt_event_manager_add_ticket_to_cart', array($this, 'ajax_add_ticket_to_cart'));
        add_action('wp_ajax_rt_event_manager_add_pretours_to_cart', array($this, 'ajax_add_pretours_to_cart'));
        add_action('wp_ajax_rt_event_manager_request_transfer', array($this, 'ajax_request_transfer'));
        add_action('wp_ajax_rt_event_manager_cancel_ticket', array($this, 'ajax_cancel_ticket'));
        add_action('wp_ajax_rt_event_manager_accept_transfer', array($this, 'ajax_accept_transfer'));
        add_action('wp_ajax_rt_event_manager_decline_transfer', array($this, 'ajax_decline_transfer'));

        // Automatically withdraw pending transfers older than the expiry window.
        add_action('init', array($this, 'maybe_schedule_transfer_expiry'));
        add_action('rt_event_manager_expire_transfers', array($this, 'cron_expire_transfers'));
    }

    /** Ensure the hourly transfer-expiry sweep is scheduled. */
    public function maybe_schedule_transfer_expiry() {
        if (!wp_next_scheduled('rt_event_manager_expire_transfers')) {
            wp_schedule_event(time() + HOUR_IN_SECONDS, 'hourly', 'rt_event_manager_expire_transfers');
        }
    }

    /** Clear transfer offers whose invitation has passed the expiry window. */
    public function cron_expire_transfers() {
        global $wpdb;
        $table  = $wpdb->prefix . 'rti_tickets';
        // Compare in the same local-wall-clock basis the timestamps are stored in.
        $cutoff = date('Y-m-d H:i:s', strtotime(current_time('mysql')) - RT_Event_Manager::transfer_expiry_seconds());
        $wpdb->query($wpdb->prepare(
            "UPDATE $table SET transfer_token = '', transfer_email = ''
             WHERE transfer_token <> '' AND transfer_requested_at IS NOT NULL AND transfer_requested_at < %s",
            $cutoff
        ));
    }

    /**
     * Whether a pending transfer offer has passed the expiry window (a lazy
     * check so an expired link is rejected even before the cron sweep runs).
     *
     * @param array $ticket
     * @return bool
     */
    private function transfer_expired($ticket) {
        $ts = isset($ticket['transfer_requested_at']) ? (string) $ticket['transfer_requested_at'] : '';
        if ('' === $ts || 0 === strpos($ts, '0000')) {
            return false;
        }
        $age = strtotime(current_time('mysql')) - strtotime($ts);
        return $age > RT_Event_Manager::transfer_expiry_seconds();
    }

    /* ---------------------------------------------------------------------
     * Navigation helpers
     * ------------------------------------------------------------------- */

    /**
     * Tab slug => label, in display order.
     *
     * @return array
     */
    private function get_tabs() {
        return array(
            'dashboard' => __('Dashboard', 'rt-event-manager'),
            'profile'   => __('My Profile', 'rt-event-manager'),
            'orders'    => __('Order History', 'rt-event-manager'),
            'tickets'   => __('Event Tickets', 'rt-event-manager'),
            'pretour'   => __('Pretour', 'rt-event-manager'),
            'travel'    => __('Travel and Visa', 'rt-event-manager'),
            'shop'      => __('Shop', 'rt-event-manager'),
        );
    }

    private function current_tab() {
        $tab = isset($_GET['tab']) ? sanitize_key(wp_unslash($_GET['tab'])) : 'dashboard';
        return array_key_exists($tab, $this->get_tabs()) ? $tab : 'dashboard';
    }

    private function account_base_url() {
        $url = wc_get_page_permalink('myaccount');
        if (!$url) {
            $url = home_url('/');
        }
        return $url;
    }

    private function tab_url($tab) {
        return add_query_arg('tab', $tab, $this->account_base_url());
    }

    /* ---------------------------------------------------------------------
     * Assets
     * ------------------------------------------------------------------- */

    public function maybe_enqueue_assets() {
        if (function_exists('is_account_page') && (is_account_page() || is_cart())) {
            $this->enqueue_assets();
        }
    }

    private function enqueue_assets() {
        if (wp_script_is('rt-event-manager-account', 'enqueued')) {
            return;
        }

        wp_enqueue_style(
            'rt-event-manager-account',
            RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/account.css',
            array(),
            RT_EVENT_MANAGER_VERSION
        );

        wp_enqueue_script(
            'rt-event-manager-account',
            RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/account.js',
            array('jquery'),
            RT_EVENT_MANAGER_VERSION,
            true
        );

        wp_localize_script('rt-event-manager-account', 'rtEventManagerAccount', array(
            'ajaxUrl'      => admin_url('admin-ajax.php'),
            'cartUrl'      => wc_get_cart_url(),
            'accountUrl'   => wc_get_page_permalink('myaccount'),
            'profileNonce' => wp_create_nonce('rt_event_manager_save_profile'),
            'ticketsNonce' => wp_create_nonce('rt_event_manager_account_save_tickets'),
            'addTicketNonce' => wp_create_nonce('rt_event_manager_add_ticket'),
            'transferNonce' => wp_create_nonce('rt_event_manager_transfer'),
            'cancelNonce'  => wp_create_nonce('rt_event_manager_cancel'),
            'acceptNonce'  => wp_create_nonce('rt_event_manager_accept_transfer'),
            'declineNonce' => wp_create_nonce('rt_event_manager_decline_transfer'),
            'i18n'         => array(
                'saving'      => __('Saving…', 'rt-event-manager'),
                'saved'       => __('Saved!', 'rt-event-manager'),
                'error'       => __('Something went wrong. Please try again.', 'rt-event-manager'),
                'requestFail' => __('Request failed. Please try again.', 'rt-event-manager'),
                'needParent'  => __('Please choose which ticket to attach this to.', 'rt-event-manager'),
                'selectMember' => __('Please select at least one member.', 'rt-event-manager'),
                'needEmail'   => __('Please enter the new holder\'s email address.', 'rt-event-manager'),
                'sending'     => __('Sending…', 'rt-event-manager'),
                'cancelling'  => __('Cancelling…', 'rt-event-manager'),
                'accepting'   => __('Accepting…', 'rt-event-manager'),
                'ticketFor'   => __('Ticket:', 'rt-event-manager'),
                'sendTransfer' => __('Send transfer request', 'rt-event-manager'),
                'declining'   => __('Declining…', 'rt-event-manager'),
                'shareWarn'   => __('Share this link with the new holder. Anyone with this link can accept the transfer!', 'rt-event-manager'),
                'copyLink'    => __('Copy link', 'rt-event-manager'),
                'copied'      => __('Copied!', 'rt-event-manager'),
                'linkReady'   => __('Transfer link ready — share it with the new holder.', 'rt-event-manager'),
                'shareIntro'  => __("I'd like to transfer my event ticket to you. Accept it here:", 'rt-event-manager'),
                'shareSubject' => __('Event ticket transfer', 'rt-event-manager'),
                'sendEmail'   => __('Send email', 'rt-event-manager'),
                'sendWhatsApp' => __('Send WhatsApp', 'rt-event-manager'),
            ),
        ));
    }

    /**
     * Render the merged .WORLD SSO login buttons (via the module's shortcode)
     * at the top of the WooCommerce registration form. No-op if the SSO module
     * is unavailable.
     */
    public function render_sso_login_buttons() {
        if (shortcode_exists('world_sso_login')) {
            echo do_shortcode('[world_sso_login]');
        }
    }

    /**
     * "Add more to your booking" controls on the cart page. Shown when the cart
     * contains an event ticket, letting the buyer add another attendee, a
     * pretour, or a Future member in the same order.
     */
    public function render_cart_add_tickets() {
        if (!function_exists('WC') || !WC()->cart) {
            return;
        }

        $has_event = false;
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            if ($pid && RT_Event_Manager::is_ticket_product($pid) && 'event' === RT_Event_Manager::get_ticket_kind_for_product($pid)) {
                $has_event = true;
                break;
            }
        }
        if (!$has_event) {
            return;
        }

        $buttons = '';
        $modals  = '';
        $event   = $this->first_purchasable_product($this->get_event_product_ids());
        $fut_id  = $this->get_future_product_id();
        $future  = $fut_id ? wc_get_product($fut_id) : null;

        // Purchasable pretour products (there can be several to choose from).
        $pretours = array();
        foreach ($this->get_pretour_product_ids() as $pid) {
            $p = wc_get_product($pid);
            if ($p && $p->is_purchasable() && $p->is_in_stock()) {
                $pretours[] = $p;
            }
        }

        if ($event) {
            $buttons .= $this->cart_add_link($event, __('Add another attendee', 'rt-event-manager'));
        }

        if (count($pretours) > 1) {
            // Multiple tours → open a modal to choose which one.
            $buttons .= '<button type="button" class="uk-button uk-button-primary" data-rtacc-modal="cart-pretour">' . esc_html__('Add a pretour', 'rt-event-manager') . '</button>';
            $options = '';
            foreach ($pretours as $p) {
                $options .= '<div class="rtacc-cart-pretour-option">' . $this->cart_add_link($p, $p->get_name() . ' — ' . wp_strip_all_tags($p->get_price_html()), 'uk-button uk-button-secondary') . '</div>';
            }
            $modals .= '<div class="rtacc-modal" id="rtacc-modal-cart-pretour" hidden>'
                . '<div class="rtacc-modal-backdrop" data-rtacc-close></div>'
                . '<div class="rtacc-modal-dialog"><h3 class="rtacc-subtitle">' . esc_html__('Choose a pretour', 'rt-event-manager') . '</h3>'
                . '<div class="rtacc-cart-pretour-list">' . $options . '</div>'
                . '<p class="rtacc-actions"><button type="button" class="uk-button uk-button-primary" data-rtacc-close>' . esc_html__('Cancel', 'rt-event-manager') . '</button></p>'
                . '</div></div>';
        } elseif (count($pretours) === 1) {
            $buttons .= $this->cart_add_link($pretours[0], __('Add a pretour', 'rt-event-manager'));
        }

        if ($future && $future->is_purchasable() && $future->is_in_stock()) {
            $buttons .= $this->cart_add_link($future, __('Add a Future member', 'rt-event-manager'));
        }

        if ($buttons === '') {
            return;
        }

        echo '<div class="rtacc-cart-add">';
        echo '<h3 class="rtacc-cart-add-title">' . esc_html__('Add more to your registration', 'rt-event-manager') . '</h3>';
        echo '<p class="rtacc-cart-add-hint">' . esc_html__('Attendee details are collected at checkout.', 'rt-event-manager') . '</p>';
        echo '<div class="rtacc-cart-add-buttons">' . $buttons . '</div>';
        echo '</div>';
        echo $modals;
    }

    /**
     * Add-to-cart button for the cart "add more" section. Products needing
     * options link to their page; simple products add to the cart directly.
     *
     * @param WC_Product $product
     * @param string     $label
     * @param string     $classes CSS classes for the anchor.
     * @return string
     */
    private function cart_add_link($product, $label, $classes = 'uk-button uk-button-primary') {
        if ($this->product_needs_options($product)) {
            $url = $product->get_permalink();
        } else {
            $url = add_query_arg('add-to-cart', $product->get_id(), wc_get_cart_url());
        }
        return '<a class="' . esc_attr($classes) . ' rtacc-cart-add-btn" href="' . esc_url($url) . '" rel="nofollow">' . esc_html($label) . '</a>';
    }

    /* ---------------------------------------------------------------------
     * Shortcode entry point
     * ------------------------------------------------------------------- */

    public function render_shortcode($atts) {
        $transfer_token = isset($_GET['rti_transfer']) ? sanitize_text_field(wp_unslash($_GET['rti_transfer'])) : '';

        // Logged out → let WooCommerce render its login/register form. When a
        // transfer link brought them here, keep the token and return to it after
        // they log in or register.
        if (!is_user_logged_in()) {
            if ('' !== $transfer_token) {
                $this->prepare_transfer_login_redirect($transfer_token);
                $notice = '<div class="woocommerce-info">' . esc_html__('Please log in or create an account to accept this ticket transfer.', 'rt-event-manager') . '</div>';
                return $notice . do_shortcode('[woocommerce_my_account]');
            }
            return do_shortcode('[woocommerce_my_account]');
        }

        // Active WC endpoint (view-order, order-pay, lost-password, add-payment
        // -method, …) → defer to WooCommerce so those flows keep working.
        if (function_exists('is_wc_endpoint_url') && is_wc_endpoint_url()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        $this->enqueue_assets();

        ob_start();
        if ('' !== $transfer_token) {
            $this->render_transfer_accept($transfer_token);
        } else {
            $this->render_portal();
        }
        return ob_get_clean();
    }

    /**
     * After a logged-out visitor authenticates from a transfer link, send them
     * back to the accept page (with the token) instead of the account root.
     *
     * @param string $token
     */
    private function prepare_transfer_login_redirect($token) {
        $url = add_query_arg('rti_transfer', rawurlencode($token), wc_get_page_permalink('myaccount'));
        $redirect = function () use ($url) {
            return $url;
        };
        add_filter('woocommerce_login_redirect', $redirect, 100);
        add_filter('woocommerce_registration_redirect', $redirect, 100);
    }

    private function render_portal() {
        $tab = $this->current_tab();

        echo '<div class="rtacc">';
        $this->render_nav($tab);

        echo '<div class="rtacc-content rtacc-content--' . esc_attr($tab) . '">';
        switch ($tab) {
            case 'profile':
                $this->render_profile();
                break;
            case 'orders':
                $this->render_orders();
                break;
            case 'tickets':
                $this->render_tickets();
                break;
            case 'pretour':
                $this->render_pretour();
                break;
            case 'travel':
                $this->render_travel();
                break;
            case 'shop':
                $this->render_shop();
                break;
            case 'dashboard':
            default:
                $this->render_dashboard();
                break;
        }
        echo '</div>'; // .rtacc-content

        echo '</div>'; // .rtacc
    }

    private function render_nav($current) {
        echo '<nav class="rtacc-nav" aria-label="' . esc_attr__('Account navigation', 'rt-event-manager') . '"><ul>';
        foreach ($this->get_tabs() as $key => $label) {
            $active = ($key === $current) ? ' is-active' : '';
            printf(
                '<li class="rtacc-nav-item%s"><a href="%s">%s</a></li>',
                esc_attr($active),
                esc_url($this->tab_url($key)),
                esc_html($label)
            );
        }
        printf(
            '<li class="rtacc-nav-item rtacc-nav-logout"><a href="%s">%s</a></li>',
            esc_url(wp_logout_url($this->account_base_url())),
            esc_html__('Log out', 'rt-event-manager')
        );
        echo '</ul></nav>';
    }

    /* ---------------------------------------------------------------------
     * Tab: Dashboard
     * ------------------------------------------------------------------- */

    private function render_dashboard() {
        $user    = wp_get_current_user();
        $sso     = $this->get_sso_profile($user->ID);
        $tickets = RT_Event_Manager::get_tickets_for_user($user->ID);

        $status_labels = $this->status_labels();

        $display_name = !empty($sso['name']) ? $sso['name'] : $user->display_name;

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html(sprintf(__('Welcome, %s', 'rt-event-manager'), $display_name)) . '</h2>';

        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your tickets', 'rt-event-manager') . '</h3>';
        if (empty($tickets)) {
            echo '<p>' . esc_html__('You do not have any event tickets yet.', 'rt-event-manager') . '</p>';
        } else {
            // Group tickets by the person holding them.
            $groups = array();
            foreach ($tickets as $t) {
                $holder = $t['holder_name'] !== '' ? $t['holder_name'] : __('Unassigned', 'rt-event-manager');
                $groups[$holder][] = $t;
            }

            echo '<ul class="rtacc-ticket-groups">';
            foreach ($groups as $holder => $rows) {
                echo '<li class="rtacc-ticket-group"><strong>' . esc_html($holder) . '</strong>';
                echo '<ul class="rtacc-ticket-summary">';
                foreach ($rows as $t) {
                    $status  = isset($t['status']) ? $t['status'] : 'draft';
                    $product = wc_get_product($t['product_id']);
                    $what    = $product ? $product->get_name() : RT_Event_Manager::ticket_kind_label($t);
                    echo '<li>';
                    echo '<span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span> ';
                    echo esc_html($what);
                    echo '</li>';
                }
                echo '</ul></li>';
            }
            echo '</ul>';
        }

        echo '<p class="rtacc-actions">';
        echo '<a class="uk-button uk-button-default" href="' . esc_url($this->tab_url('tickets')) . '">' . esc_html__('Manage tickets', 'rt-event-manager') . '</a> ';
        echo '<a class="uk-button uk-button-default" href="' . esc_url($this->tab_url('orders')) . '">' . esc_html__('View orders', 'rt-event-manager') . '</a>';
        echo '</p>';
    }

    /* ---------------------------------------------------------------------
     * Tab: My Profile
     * ------------------------------------------------------------------- */

    /**
     * Assemble the profile data. `.WORLD` SSO owns the identity/club/address
     * fields (read-only). We map what we can from local sources today and
     * expose a filter so the SSO integration can supply authoritative values.
     *
     * @param int $user_id
     * @return array
     */
    public function get_sso_profile($user_id) {
        $user = get_userdata($user_id);

        $family_raw = get_user_meta($user_id, 'rti_family', true);

        $profile = array(
            'id'          => get_user_meta($user_id, 'world_id', true),
            'email'       => $user ? $user->user_email : '',
            'first_name'  => $user ? $user->first_name : '',
            'last_name'   => $user ? $user->last_name : '',
            'name'        => $user ? trim($user->first_name . ' ' . $user->last_name) : '',
            // Profile picture: the merged .WORLD SSO module filters get_avatar_url.
            'profile_pic' => get_avatar_url($user_id),
            'club'        => array(
                'name'      => get_user_meta($user_id, 'rti_club', true),
                'family'    => ($family_raw !== '') ? RT_Event_Manager::get_family_label($family_raw) : '',
                // SSO stores the club domain in rti_club_domain (club.subdomain).
                'subdomain' => get_user_meta($user_id, 'rti_club_domain', true),
            ),
            'address'     => array(
                'street1'     => get_user_meta($user_id, 'billing_address_1', true),
                'street2'     => get_user_meta($user_id, 'billing_address_2', true),
                'city'        => get_user_meta($user_id, 'billing_city', true),
                'postal_code' => get_user_meta($user_id, 'billing_postcode', true),
                'country'     => get_user_meta($user_id, 'billing_country', true),
            ),
        );
        if (empty($profile['name'])) {
            $profile['name'] = $user ? $user->display_name : '';
        }

        /**
         * Allow the .WORLD SSO integration to supply the authoritative profile.
         *
         * @param array $profile The mapped-from-local profile.
         * @param int   $user_id
         */
        return apply_filters('rt_event_manager_sso_profile', $profile, $user_id);
    }

    private function render_profile() {
        $user_id = get_current_user_id();
        $sso     = $this->get_sso_profile($user_id);
        $is_sso  = $this->user_is_sso($user_id);

        $emergency = get_user_meta($user_id, 'rti_emergency_contact', true);
        $function  = get_user_meta($user_id, 'rti_function', true);

        // Function / Role: typeable field with admin-maintained suggestions and
        // an optional preselected default (applied only when the user has none).
        $function_suggestions = RT_Event_Manager::get_function_suggestions();
        if ($function === '') {
            $function = RT_Event_Manager::get_function_preselect();
        }

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('My Profile', 'rt-event-manager') . '</h2>';

        // Membership details are read-only ONLY for accounts created through
        // .WORLD SSO (that data is owned by .WORLD). Manually-created accounts
        // edit the same fields directly in the form below.
        if ($is_sso) {
            echo '<section class="rtacc-panel rtacc-panel--readonly uk-card uk-card-secondary uk-card-body">';
            echo '<h3 class="rtacc-subtitle">' . esc_html__('Member details (from .WORLD)', 'rt-event-manager') . '</h3>';
            echo '<p class="rtacc-hint">' . esc_html__('These details are provided by .WORLD single sign-on and cannot be changed here.', 'rt-event-manager') . '</p>';

            if (!empty($sso['profile_pic'])) {
                echo '<img class="rtacc-avatar" src="' . esc_url($sso['profile_pic']) . '" alt="" />';
            }

            $rows = array(
                __('Name', 'rt-event-manager')      => $sso['name'],
                __('Email', 'rt-event-manager')     => $sso['email'],
                __('.WORLD ID', 'rt-event-manager') => $sso['id'],
                __('Family', 'rt-event-manager')    => $sso['club']['family'],
                __('Club', 'rt-event-manager')      => $sso['club']['name'],
            );
            echo '<dl class="rtacc-deflist uk-description-list uk-description-list-divider">';
            foreach ($rows as $label => $value) {
                echo '<dt>' . esc_html($label) . '</dt>';
                echo '<dd>' . ($value !== '' ? esc_html($value) : '<span class="rtacc-muted">—</span>') . '</dd>';
            }

            $addr = $sso['address'];
            $addr_parts = array_filter(array(
                $addr['street1'], $addr['street2'],
                trim($addr['postal_code'] . ' ' . $addr['city']),
                $addr['country'],
            ));
            echo '<dt>' . esc_html__('Address', 'rt-event-manager') . '</dt>';
            echo '<dd>' . (!empty($addr_parts) ? nl2br(esc_html(implode("\n", $addr_parts))) : '<span class="rtacc-muted">—</span>') . '</dd>';
            echo '</dl>';
            echo '</section>';
        }

        // --- Editable block ---
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your details', 'rt-event-manager') . '</h3>';
        echo '<form id="rtacc-profile-form" class="rtacc-form uk-form-stacked">';

        // Manually-created accounts can edit their membership details here.
        if (!$is_sso) {
            $this->render_editable_membership_fields($user_id);
        }

        echo '<p class="rtacc-field">';
        echo '<label class="uk-form-label" for="rtacc-emergency">' . esc_html__('Emergency Contact', 'rt-event-manager') . '</label>';
        echo '<input type="text" id="rtacc-emergency" class="uk-input" name="emergency_contact" value="' . esc_attr($emergency) . '" placeholder="' . esc_attr__('Name, Phone, Email', 'rt-event-manager') . '" />';
        echo '</p>';

        echo '<p class="rtacc-field">';
        echo '<label class="uk-form-label" for="rtacc-function">' . esc_html__('Function / Role', 'rt-event-manager') . '</label>';
        echo '<input type="text" id="rtacc-function" class="uk-input" name="function" value="' . esc_attr($function) . '" list="rtacc-function-suggestions" autocomplete="off" />';
        if (!empty($function_suggestions)) {
            echo '<datalist id="rtacc-function-suggestions">';
            foreach ($function_suggestions as $suggestion) {
                echo '<option value="' . esc_attr($suggestion) . '"></option>';
            }
            echo '</datalist>';
        }
        echo '</p>';

        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Save changes', 'rt-event-manager') . '</button>';
        echo '<span class="rtacc-status" id="rtacc-profile-status" aria-live="polite"></span>';
        echo '</p>';

        echo '</form>';
        echo '</section>';
    }

    /**
     * Whether the account was created through .WORLD SSO (its membership data is
     * then owned by .WORLD and shown read-only).
     *
     * @param int $user_id
     * @return bool
     */
    private function user_is_sso($user_id) {
        if (class_exists('Multi_OAuth_SSO_User_Handler')) {
            return (bool) Multi_OAuth_SSO_User_Handler::is_sso_user($user_id);
        }
        return (bool) get_user_meta($user_id, 'oauth_sso_provider', true);
    }

    /**
     * Editable membership fields for manually-created (non-SSO) accounts.
     *
     * @param int $user_id
     */
    private function render_editable_membership_fields($user_id) {
        $user       = get_userdata($user_id);
        $rti_family = get_user_meta($user_id, 'rti_family', true);

        $text_fields = array(
            'first_name'        => array(__('First name', 'rt-event-manager'), $user ? $user->first_name : ''),
            'last_name'         => array(__('Last name', 'rt-event-manager'), $user ? $user->last_name : ''),
        );
        foreach ($text_fields as $name => $spec) {
            echo '<p class="rtacc-field"><label class="uk-form-label" for="rtacc-' . esc_attr($name) . '">' . esc_html($spec[0]) . '</label>';
            echo '<input type="text" id="rtacc-' . esc_attr($name) . '" class="uk-input" name="' . esc_attr($name) . '" value="' . esc_attr($spec[1]) . '" /></p>';
        }

        echo '<p class="rtacc-field"><label class="uk-form-label" for="rtacc-email">' . esc_html__('Email', 'rt-event-manager') . '</label>';
        echo '<input type="email" id="rtacc-email" class="uk-input" name="email" value="' . esc_attr($user ? $user->user_email : '') . '" /></p>';

        echo '<p class="rtacc-field"><label class="uk-form-label" for="rtacc-family">' . esc_html__('Family', 'rt-event-manager') . '</label>';
        echo '<select id="rtacc-family" class="uk-select" name="rti_family">';
        echo '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
        foreach (RT_Event_Manager::$family_options as $key => $label) {
            echo '<option value="' . esc_attr($key) . '" ' . selected($rti_family, (string) $key, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select></p>';

        $meta_fields = array(
            'rti_club'          => __('Club', 'rt-event-manager'),
            'billing_address_1' => __('Address line 1', 'rt-event-manager'),
            'billing_address_2' => __('Address line 2', 'rt-event-manager'),
            'billing_city'      => __('City', 'rt-event-manager'),
            'billing_postcode'  => __('Postcode', 'rt-event-manager'),
            'billing_country'   => __('Country', 'rt-event-manager'),
        );
        foreach ($meta_fields as $name => $label) {
            echo '<p class="rtacc-field"><label class="uk-form-label" for="rtacc-' . esc_attr($name) . '">' . esc_html($label) . '</label>';
            echo '<input type="text" id="rtacc-' . esc_attr($name) . '" class="uk-input" name="' . esc_attr($name) . '" value="' . esc_attr(get_user_meta($user_id, $name, true)) . '" /></p>';
        }
    }

    /* ---------------------------------------------------------------------
     * Tab: Order History
     * ------------------------------------------------------------------- */

    private function render_orders() {
        $user_id = get_current_user_id();
        $orders  = wc_get_orders(array(
            'customer_id' => $user_id,
            'limit'       => -1,
            'orderby'     => 'date',
            'order'       => 'DESC',
        ));

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Order History', 'rt-event-manager') . '</h2>';

        if (empty($orders)) {
            echo '<p>' . esc_html__('You have no orders yet.', 'rt-event-manager') . '</p>';
            return;
        }

        echo '<table class="rtacc-table rtacc-orders uk-table uk-table-divider uk-table-middle uk-table-small">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Date', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Items', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Total', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Document', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($orders as $order) {
            $item_names = array();
            foreach ($order->get_items() as $item) {
                $item_names[] = $item->get_name() . ' × ' . $item->get_quantity();
            }

            // A paid order gets a "receipt"; an unpaid/draft order gets an
            // "invoice". Prefer a WooCommerce PDF plugin's document if present.
            $is_paid = $order->is_paid();
            $label   = $is_paid ? __('Download receipt', 'rt-event-manager') : __('Download invoice', 'rt-event-manager');
            $doc_url = $this->wc_pdf_document_url($order, $is_paid ? 'receipt' : 'invoice');
            if ('' === $doc_url) {
                $doc_url = wp_nonce_url(
                    add_query_arg(array(
                        'action'   => 'rt_event_manager_receipt',
                        'order_id' => $order->get_id(),
                        'doc'      => $is_paid ? 'receipt' : 'invoice',
                    ), admin_url('admin-ajax.php')),
                    'rt_event_manager_receipt_' . $order->get_id(),
                    'nonce'
                );
            }

            echo '<tr>';
            echo '<td>#' . esc_html($order->get_order_number()) . '</td>';
            echo '<td>' . esc_html(wc_format_datetime($order->get_date_created())) . '</td>';
            echo '<td>' . esc_html(wc_get_order_status_name($order->get_status())) . '</td>';
            echo '<td>' . esc_html(implode(', ', $item_names)) . '</td>';
            echo '<td>' . wp_kses_post($order->get_formatted_order_total()) . '</td>';
            echo '<td><a class="uk-button uk-button-default uk-button-small" href="' . esc_url($doc_url) . '" target="_blank" rel="noopener">' . esc_html($label) . '</a></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
    }

    /**
     * Return a WooCommerce PDF plugin's customer document link for an order, or
     * '' when none is available. Currently supports "PDF Invoices & Packing
     * Slips" (WPO WCPDF). Falls back (empty) to our own generator otherwise.
     *
     * @param WC_Order $order
     * @param string   $doc  'receipt' | 'invoice' (advisory; WPO uses 'invoice').
     * @return string
     */
    private function wc_pdf_document_url($order, $doc = 'invoice') {
        if (function_exists('WPO_WCPDF')) {
            $wcpdf = WPO_WCPDF();
            if (is_object($wcpdf) && isset($wcpdf->endpoint) && is_object($wcpdf->endpoint)
                && method_exists($wcpdf->endpoint, 'get_document_link')) {
                try {
                    $link = $wcpdf->endpoint->get_document_link($order, 'invoice');
                    if (is_string($link) && '' !== $link) {
                        return $link;
                    }
                } catch (\Throwable $e) {
                    // Fall through to our own generator.
                }
            }
        }
        return '';
    }

    /* ---------------------------------------------------------------------
     * Tab: Event Tickets
     * ------------------------------------------------------------------- */

    private function render_tickets() {
        $user_id  = get_current_user_id();
        $tickets  = RT_Event_Manager::get_tickets_for_user($user_id);
        $can_edit = RT_Event_Manager::instance()->is_frontend_editing_allowed();
        $by_id    = $this->index_by_id($tickets);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Event Tickets', 'rt-event-manager') . '</h2>';
        $this->maybe_cutoff_notice($can_edit);

        // Classify event tickets; Future members (minors) go in their own block.
        // "My Ticket" is the user's OWN event ticket (their first parentless one);
        // every other event ticket — including a companion registered from scratch
        // in its own later order — belongs under "Travelling with me".
        $this->own_event_id = $this->own_event_ticket_id($tickets);
        $mine       = array();
        $companions = array();
        $minors     = array();
        $event_ids  = array();
        foreach ($tickets as $t) {
            if ('event' === $this->effective_kind($t)) {
                $event_ids[absint($t['id'])] = true;
                if (absint($t['id']) === $this->own_event_id) {
                    $mine[] = $t;
                } else {
                    $companions[] = $t;
                }
            }
        }
        $event_parents = array_merge($mine, $companions); // for the guardian selector
        foreach ($tickets as $t) {
            if ('minor' === $this->effective_kind($t) && isset($event_ids[absint($t['parent_ticket_id'])])) {
                $minors[] = $t;
            }
        }

        // The purchaser's own ticket — new co-travellers link to it so their
        // checkout collects the traveller's own details rather than the buyer's.
        $primary_id = !empty($mine) ? absint($mine[0]['id']) : 0;

        // Add buttons live inside their respective section (co-travellers under
        // "Travelling with me", Future members under "Future members").
        $add_ticket_button = $this->cotraveller_add_button($primary_id);
        $future_options    = $this->ticket_options($event_parents);
        $future_button     = $this->future_add_button($future_options);

        $this->render_editable_sections('rtacc-tickets-form', array(
            array('label' => __('My Ticket', 'rt-event-manager'), 'tickets' => $mine, 'empty' => __('You do not have a ticket assigned to yourself yet.', 'rt-event-manager')),
            array('label' => __('Travelling with me', 'rt-event-manager'), 'tickets' => $companions, 'empty' => __('No additional tickets yet.', 'rt-event-manager'), 'after' => $add_ticket_button),
            array('label' => __('Future members', 'rt-event-manager'), 'tickets' => $minors, 'empty' => __('No Future member tickets yet.', 'rt-event-manager'), 'minor' => true, 'after' => $future_button, 'guardian_options' => $future_options),
        ), $by_id, $can_edit);

        // Customize-ticket modals (rendered once, opened by the section buttons).
        $primary_product = $this->first_purchasable_product($this->get_event_product_ids());
        if ($primary_id && $primary_product && !$this->product_needs_options($primary_product)) {
            $this->render_ticket_modal('cotraveller', array(
                'title'      => __('Add a ticket', 'rt-event-manager'),
                'product_id' => $primary_product->get_id(),
                'parent_id'  => $primary_id,
                'is_minor'   => false,
            ));
        }
        $this->render_future_modal($future_options);
        $this->render_transfer_cancel_modals();
    }

    private function render_pretour() {
        $user_id  = get_current_user_id();
        $tickets  = RT_Event_Manager::get_tickets_for_user($user_id);
        $can_edit = RT_Event_Manager::instance()->is_frontend_editing_allowed();
        $by_id    = $this->index_by_id($tickets);

        // "Mine" is the user's OWN event ticket (their first parentless one). Adult
        // co-travellers are separate, so their pretours belong under "Travelling
        // with me". Also collect Future member ticket ids so pretours bought for a
        // minor land in the Future members block.
        $this->own_event_id = $this->own_event_ticket_id($tickets);
        $my_event_ids = $this->own_event_id ? array($this->own_event_id => true) : array();
        $minor_ids    = array();
        foreach ($tickets as $t) {
            if ('minor' === $this->effective_kind($t)) {
                $minor_ids[absint($t['id'])] = true;
            }
        }

        $mine       = array();
        $companions = array();
        $minors     = array();
        foreach ($tickets as $t) {
            if ('pretour' !== $this->effective_kind($t)) {
                continue;
            }
            $parent = absint($t['parent_ticket_id']);
            if (isset($minor_ids[$parent])) {
                $minors[] = $t; // pretour purchased for a Future member
            } elseif (isset($my_event_ids[$parent])) {
                $mine[] = $t;   // the buyer's own pretour
            } else {
                $companions[] = $t; // adult co-traveller pretours
            }
        }

        // Bulk pretour candidates: members (event ticket or Future member) who do
        // not already have a pretour (counting unpaid ones in the cart).
        $has_pretour = array();
        foreach ($tickets as $t) {
            if ('pretour' === $this->effective_kind($t)) {
                $pp = absint($t['parent_ticket_id']);
                if ($pp) {
                    $has_pretour[$pp] = true;
                }
            }
        }
        foreach ($this->get_cart_pretour_products() as $pp => $pids) {
            $has_pretour[$pp] = true;
        }
        $candidates = array();
        foreach ($tickets as $t) {
            $k = $this->effective_kind($t);
            if (('event' === $k || 'minor' === $k) && !isset($has_pretour[absint($t['id'])])) {
                $candidates[] = $t;
            }
        }

        // Title line with the "Add a pretour" button at the right edge.
        echo '<div class="rtacc-title-row">';
        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Pretour', 'rt-event-manager') . '</h2>';
        echo $this->pretour_add_button_html($candidates);
        echo '</div>';

        $this->maybe_cutoff_notice($can_edit);

        // Pretour tickets are read-only (Tour + Holder + Status; Guardian for
        // Future members). Their details are managed on the Event Tickets tab.
        $this->render_editable_sections('rtacc-pretour-form', array(
            array('label' => __('My Pretour', 'rt-event-manager'), 'tickets' => $mine, 'empty' => __('You do not have a pretour ticket yet.', 'rt-event-manager'), 'pretour_view' => true),
            array('label' => __('Travelling with me', 'rt-event-manager'), 'tickets' => $companions, 'empty' => __('No additional pretour tickets yet.', 'rt-event-manager'), 'pretour_view' => true),
            array('label' => __('Future members', 'rt-event-manager'), 'tickets' => $minors, 'empty' => __('No Future member tickets yet.', 'rt-event-manager'), 'minor' => true, 'pretour_view' => true),
        ), $by_id, $can_edit, true);

        // The bulk pretour modal (hidden; opened by the title-line button).
        $this->render_pretour_modal($candidates);
        $this->render_transfer_cancel_modals();
    }

    /**
     * The shared Transfer and Cancel confirmation modals (opened by the per-row
     * action buttons; ticket id and summary text are filled in by account.js).
     */
    private function render_transfer_cancel_modals() {
        $refund_open = RT_Event_Manager::instance()->is_refund_window_open();

        // ---- Transfer ----
        echo '<div class="rtacc-modal" id="rtacc-modal-transfer" hidden>';
        echo '<div class="rtacc-modal-backdrop" data-rtacc-close></div>';
        echo '<div class="rtacc-modal-dialog">';
        echo '<form class="rtacc-form uk-form-stacked rtacc-transfer-form">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Transfer this ticket', 'rt-event-manager') . '</h3>';
        echo '<input type="hidden" name="ticket_id" value="" />';
        echo '<p class="rtacc-modal-target rtacc-muted"></p>';
        echo '<p>' . esc_html__('Create a transfer link and share it with the new holder. The ticket and any pretour linked to it move to them as a package. This is not a refund — they will see the original price paid, and any repayment is arranged between the two of you.', 'rt-event-manager') . '</p>';
        echo '<p class="rtacc-modal-error uk-text-danger" style="display:none;"></p>';
        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-secondary">' . esc_html__('Create transfer link', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="uk-button uk-button-primary" data-rtacc-close>' . esc_html__('Cancel', 'rt-event-manager') . '</button>';
        echo '</p></form></div></div>';

        // ---- Cancel ----
        $note = $refund_open
            ? __('A refund will be requested from the event organiser. Cancellation is immediate and cannot be undone.', 'rt-event-manager')
            : __('The refund deadline has passed, so this cancellation will not be refunded. Cancellation is immediate and cannot be undone.', 'rt-event-manager');
        echo '<div class="rtacc-modal" id="rtacc-modal-cancel" hidden>';
        echo '<div class="rtacc-modal-backdrop" data-rtacc-close></div>';
        echo '<div class="rtacc-modal-dialog">';
        echo '<form class="rtacc-form uk-form-stacked rtacc-cancel-form">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Cancel this ticket', 'rt-event-manager') . '</h3>';
        echo '<input type="hidden" name="ticket_id" value="" />';
        echo '<p class="rtacc-modal-target rtacc-muted"></p>';
        echo '<p class="rtacc-cancel-package" style="display:none;">' . esc_html__('Any pretour linked to this ticket will be cancelled as well.', 'rt-event-manager') . '</p>';
        echo '<p>' . esc_html($note) . '</p>';
        echo '<p class="rtacc-modal-error uk-text-danger" style="display:none;"></p>';
        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Confirm cancellation', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="uk-button uk-button-secondary" data-rtacc-close>' . esc_html__('Keep ticket', 'rt-event-manager') . '</button>';
        echo '</p></form></div></div>';
    }

    /**
     * Render the transfer-accept page (reached via the emailed link, once the
     * new holder is logged in): show the package being transferred, the original
     * price paid, the private-settlement note, and an Accept button.
     *
     * @param string $token
     */
    private function render_transfer_accept($token) {
        echo '<div class="rtacc rtacc--transfer">';
        echo '<div class="rtacc-content" style="flex:1 1 100%;">';
        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Accept ticket transfer', 'rt-event-manager') . '</h2>';

        $event = RT_Event_Manager::get_ticket_by_transfer_token($token);
        if ($event && $this->transfer_expired($event)) {
            // Expired — withdraw it now and treat as invalid.
            RT_Event_Manager::instance()->update_ticket(absint($event['id']), array(
                'transfer_token' => '',
                'transfer_email' => '',
            ));
            $event = null;
        }
        if (!$event || 'event' !== RT_Event_Manager::get_ticket_kind($event) || 'cancelled' === $event['status']) {
            echo '<div class="rtacc-notice uk-alert-danger" uk-alert><p>' . esc_html__('This transfer link is no longer valid. It may have already been accepted, declined, withdrawn, or expired.', 'rt-event-manager') . '</p></div>';
            echo '<p><a class="uk-button uk-button-default" href="' . esc_url(wc_get_page_permalink('myaccount')) . '">' . esc_html__('Go to my account', 'rt-event-manager') . '</a></p>';
            echo '</div></div>';
            return;
        }

        $pretours = RT_Event_Manager::get_child_pretours(absint($event['id']));
        $product  = wc_get_product($event['product_id']);
        $ename    = $product ? $product->get_name() : __('Event ticket', 'rt-event-manager');
        $currency = RT_Event_Manager::get_ticket_currency($event);

        $original = RT_Event_Manager::get_ticket_original_amount($event);
        $paid     = RT_Event_Manager::get_ticket_paid_amount($event);
        foreach ($pretours as $p) {
            $original += RT_Event_Manager::get_ticket_original_amount($p);
            $paid     += RT_Event_Manager::get_ticket_paid_amount($p);
        }

        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<p>' . esc_html(sprintf(__('%s has offered to transfer the following to you:', 'rt-event-manager'), $event['holder_name'] !== '' ? $event['holder_name'] : __('A member', 'rt-event-manager'))) . '</p>';
        echo '<ul class="rtacc-transfer-list">';
        echo '<li>' . esc_html($ename) . '</li>';
        foreach ($pretours as $p) {
            $pp = wc_get_product($p['product_id']);
            echo '<li>' . esc_html($pp ? $pp->get_name() : __('Pretour', 'rt-event-manager')) . '</li>';
        }
        echo '</ul>';

        echo '<p><strong>' . esc_html__('Original price:', 'rt-event-manager') . '</strong> ' . wp_kses_post(wc_price($original, array('currency' => $currency))) . '</p>';
        echo '<p><strong>' . esc_html__('Price paid (after coupons):', 'rt-event-manager') . '</strong> ' . wp_kses_post(wc_price($paid, array('currency' => $currency))) . '</p>';
        echo '<p class="rtacc-muted">' . esc_html__('Accepting does not charge you and does not refund the current holder. Any repayment or compensation is to be agreed directly between you and the current holder.', 'rt-event-manager') . '</p>';

        echo '<form class="rtacc-form rtacc-accept-form">';
        echo '<input type="hidden" name="token" value="' . esc_attr($token) . '" />';
        echo '<p class="rtacc-modal-error uk-text-danger" style="display:none;"></p>';
        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Accept transfer', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="uk-button uk-button-secondary rtacc-decline-btn">' . esc_html__('Decline', 'rt-event-manager') . '</button>';
        echo '<span class="rtacc-status" aria-live="polite"></span>';
        echo '</p></form>';
        echo '</section>';

        echo '</div></div>';
    }

    /* ---- Ticket rendering helpers ---- */

    private function index_by_id($tickets) {
        $by_id = array();
        foreach ($tickets as $t) {
            $by_id[absint($t['id'])] = $t;
        }
        return $by_id;
    }

    /**
     * The id of the user's OWN event ticket — their first parentless event
     * ticket (tickets arrive ordered oldest-order-first). Every other event
     * ticket is a co-traveller, even when it is ticket_index 0 of a later order
     * (e.g. a companion registered from scratch in its own order).
     *
     * @param array $tickets
     * @return int 0 when the user has no event ticket of their own.
     */
    private function own_event_ticket_id($tickets) {
        foreach ($tickets as $t) {
            if ('event' === $this->effective_kind($t) && !absint($t['parent_ticket_id'])) {
                return absint($t['id']);
            }
        }
        return 0;
    }

    /**
     * Resolve the guardian holder label for a ticket. If the direct parent is
     * itself a Future member (e.g. a pretour bought for a minor), resolve one
     * level up to that minor's guardian.
     *
     * @param array $t
     * @param array $by_id
     * @return string
     */
    private function guardian_label($t, $by_id) {
        $parent_id = isset($t['parent_ticket_id']) ? absint($t['parent_ticket_id']) : 0;
        if (!$parent_id) {
            return '';
        }
        if (isset($by_id[$parent_id])) {
            $p = $by_id[$parent_id];
            if ('minor' === RT_Event_Manager::get_ticket_kind($p)) {
                $gp = absint($p['parent_ticket_id']);
                if ($gp && isset($by_id[$gp])) {
                    $p = $by_id[$gp];
                }
            }
            return ($p['holder_name'] !== '') ? $p['holder_name'] : ('#' . $parent_id);
        }
        return '#' . $parent_id;
    }

    private function maybe_cutoff_notice($can_edit) {
        if (!$can_edit) {
            echo '<div class="rtacc-notice uk-alert-warning" uk-alert>' . esc_html__('The ticket editing deadline has passed. Please contact us if you need to make changes.', 'rt-event-manager') . '</div>';
        }
    }

    /**
     * Effective ticket kind: prefer the stored value, fall back to deriving from
     * the product category (handles rows created before the kind was stored).
     *
     * @param array $t
     * @return string 'event' | 'pretour' | 'minor'
     */
    private function effective_kind($t) {
        $k = isset($t['ticket_kind']) ? $t['ticket_kind'] : '';
        if (in_array($k, array('pretour', 'minor'), true)) {
            return $k;
        }
        return RT_Event_Manager::get_ticket_kind_for_product($t['product_id']);
    }

    /**
     * Build id => label options for a parent-ticket selector.
     *
     * @param array $tickets
     * @return array
     */
    private function ticket_options($tickets) {
        $opts = array();
        foreach ($tickets as $t) {
            $product = wc_get_product($t['product_id']);
            $pname   = $product ? $product->get_name() : __('ticket', 'rt-event-manager');
            $opts[absint($t['id'])] = ($t['holder_name'] !== '') ? $t['holder_name'] : $pname;
        }
        return $opts;
    }

    /**
     * Render a set of editable ticket sections inside one save form. Each
     * section is array('label','tickets','empty', optional 'minor'=>true). The
     * form is submitted by account.js (class rtacc-tickets-form).
     */
    private function render_editable_sections($form_id, $sections, $by_id, $can_edit, $readonly = false) {
        if ($readonly) {
            echo '<div class="rtacc-readonly-sections">';
        } else {
            echo '<form id="' . esc_attr($form_id) . '" class="rtacc-form uk-form-stacked rtacc-tickets-form">';
        }

        $has_rows = false;
        foreach ($sections as $sec) {
            echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
            echo '<h3 class="rtacc-subtitle">' . esc_html($sec['label']) . '</h3>';
            if (empty($sec['tickets'])) {
                echo '<p>' . esc_html($sec['empty']) . '</p>';
            } else {
                $has_rows = true;
                $this->render_ticket_table($sec['tickets'], $can_edit, $by_id, !empty($sec['minor']), isset($sec['guardian_options']) ? $sec['guardian_options'] : array(), !empty($sec['show_product']), !empty($sec['pretour_view']));
            }
            // Optional action for this section (already-escaped HTML).
            if (!empty($sec['after'])) {
                echo $sec['after'];
            }
            echo '</section>';
        }

        if (!$readonly && $can_edit && $has_rows) {
            echo '<p class="rtacc-actions">';
            echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Save ticket details', 'rt-event-manager') . '</button>';
            echo '<span class="rtacc-status" aria-live="polite"></span>';
            echo '</p>';
        }

        echo $readonly ? '</div>' : '</form>';
    }

    /**
     * Render a ticket table. The Future members block ($minor_block) omits the
     * Phone and Family columns; other blocks keep them. The parent event ticket
     * is shown in the Guardian column.
     *
     * @param array $tickets
     * @param bool  $can_edit
     * @param array $by_id       id => ticket, for resolving guardian labels.
     * @param bool  $minor_block      Whether this is the Future members block.
     * @param array $guardian_options id => label for the editable Guardian select.
     * @param bool  $show_product     Whether to show a Tour (product name) column.
     * @param bool  $pretour_view     Minimal read-only layout for pretour tickets:
     *                                Tour + Holder (+ Guardian for minors) + Status.
     */
    private function render_ticket_table($tickets, $can_edit, $by_id, $minor_block = false, $guardian_options = array(), $show_product = false, $pretour_view = false) {
        $status_labels = $this->status_labels();

        if ($pretour_view) {
            // Identical columns across all pretour blocks so they align; the
            // Future members' guardian is shown as a sub-line under the holder.
            echo '<table class="rtacc-table rtacc-tickets rtacc-pretour-table uk-table uk-table-divider uk-table-middle uk-table-small">';
            echo '<thead><tr>';
            echo '<th style="width:30%;">' . esc_html__('Tour', 'rt-event-manager') . '</th>';
            echo '<th style="width:30%;">' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
            echo '<th style="width:130px;">' . esc_html__('Status', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Actions', 'rt-event-manager') . '</th>';
            echo '</tr></thead><tbody>';
            foreach ($tickets as $t) {
                $status  = isset($t['status']) ? $t['status'] : 'draft';
                $product = wc_get_product($t['product_id']);
                $pname   = $product ? $product->get_name() : __('(deleted product)', 'rt-event-manager');
                echo '<tr>';
                echo '<td data-title="' . esc_attr__('Tour', 'rt-event-manager') . '">' . esc_html($pname) . '</td>';
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">' . esc_html($t['holder_name'] ?: '—');
                if ($minor_block) {
                    $g = $this->guardian_label($t, $by_id);
                    if ($g !== '') {
                        echo '<br><span class="rtacc-muted rtacc-guardian-line">' . esc_html(sprintf(__('Guardian: %s', 'rt-event-manager'), $g)) . '</span>';
                    }
                }
                echo '</td>';
                echo '<td data-title="' . esc_attr__('Status', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span></td>';
                echo '<td data-title="' . esc_attr__('Actions', 'rt-event-manager') . '">' . $this->ticket_actions_cell($t) . '</td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
            return;
        }

        $family_options      = RT_Event_Manager::$family_options;
        $dietary_options     = RT_Event_Manager::get_dietary_options(true);
        $allergy_suggestions = RT_Event_Manager::get_allergy_suggestions();

        echo '<table class="rtacc-table rtacc-tickets uk-table uk-table-divider uk-table-middle uk-table-small">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Type', 'rt-event-manager') . '</th>';
        if ($show_product) {
            echo '<th>' . esc_html__('Tour', 'rt-event-manager') . '</th>';
        }
        echo '<th>' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
        if (!$minor_block) {
            echo '<th>' . esc_html__('Phone', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Family', 'rt-event-manager') . '</th>';
        }
        echo '<th>' . esc_html__('Dietary', 'rt-event-manager') . '</th>';
        if ($minor_block) {
            echo '<th>' . esc_html__('Guardian', 'rt-event-manager') . '</th>';
        }
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Actions', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($tickets as $t) {
            $id         = absint($t['id']);
            $status     = isset($t['status']) ? $t['status'] : 'draft';
            $phone      = isset($t['phone']) ? $t['phone'] : '';
            $kind       = $this->effective_kind($t);
            $is_minor   = ('minor' === $kind);
            $parent_id  = isset($t['parent_ticket_id']) ? absint($t['parent_ticket_id']) : 0;
            // Additional travellers (every ticket except the user's own) own their
            // organization details; the user's own ticket inherits them and shows
            // them read-only.
            $is_comp    = ($id !== $this->own_event_id);

            echo '<tr data-ticket-id="' . esc_attr($id) . '">';
            echo '<td data-title="' . esc_attr__('Type', 'rt-event-manager') . '">' . esc_html(RT_Event_Manager::ticket_kind_label($t)) . '</td>';

            if ($show_product) {
                $product = wc_get_product($t['product_id']);
                $pname   = $product ? $product->get_name() : __('(deleted product)', 'rt-event-manager');
                echo '<td data-title="' . esc_attr__('Tour', 'rt-event-manager') . '">' . esc_html($pname) . '</td>';
            }

            // Holder name (editable for every kind).
            if ($can_edit) {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '"><input type="text" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][holder_name]" value="' . esc_attr($t['holder_name']) . '" /></td>';
            } else {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">' . esc_html($t['holder_name'] ?: '—') . '</td>';
            }

            if (!$minor_block) {
                // Phone.
                if ($can_edit) {
                    echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '"><input type="tel" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][phone]" value="' . esc_attr($phone) . '" pattern="\+[0-9\s()\-]{7,}" inputmode="tel" placeholder="+41791234567" title="' . esc_attr__('International format, e.g. +41791234567', 'rt-event-manager') . '" /></td>';
                } else {
                    echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">' . esc_html($phone ?: '—') . '</td>';
                }

                // Family — editable only for companions (ticket_index > 0).
                if ($can_edit && $is_comp && !$is_minor) {
                    echo '<td data-title="' . esc_attr__('Family', 'rt-event-manager') . '"><select class="rtacc-ticket-field uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][rti_family]">';
                    echo '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
                    foreach ($family_options as $key => $label) {
                        echo '<option value="' . esc_attr($key) . '" ' . selected($t['rti_family'], (string) $key, false) . '>' . esc_html($label) . '</option>';
                    }
                    echo '</select></td>';
                } else {
                    $flabel = ($t['rti_family'] !== '') ? RT_Event_Manager::get_family_label($t['rti_family']) : '—';
                    echo '<td data-title="' . esc_attr__('Family', 'rt-event-manager') . '">' . esc_html($flabel) . '</td>';
                }
            }

            // Dietary (+ conditional allergy details), editable for every kind.
            $allergy_val = isset($t['allergy_details']) ? $t['allergy_details'] : '';
            if ($can_edit) {
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '"><select class="rtacc-ticket-field rtacc-dietary-select uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][dietary]">';
                foreach ($dietary_options as $dkey => $dlabel) {
                    echo '<option value="' . esc_attr($dkey) . '" ' . selected($t['dietary'], $dkey, false) . '>' . esc_html($dlabel) . '</option>';
                }
                echo '</select>';
                $list_id = 'rtacc-allergy-list-' . $id;
                echo '<input type="text" class="rtacc-ticket-field rtacc-allergy-input uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][allergy_details]" value="' . esc_attr($allergy_val) . '" list="' . esc_attr($list_id) . '" placeholder="' . esc_attr__('Select or specify allergies', 'rt-event-manager') . '" style="margin-top:4px;' . ($t['dietary'] === 'allergies' ? '' : 'display:none;') . '" />';
                if (!empty($allergy_suggestions)) {
                    echo '<datalist id="' . esc_attr($list_id) . '">';
                    foreach ($allergy_suggestions as $s) {
                        echo '<option value="' . esc_attr($s) . '"></option>';
                    }
                    echo '</datalist>';
                }
                echo '</td>';
            } else {
                $dlabel = isset($dietary_options[$t['dietary']]) ? $dietary_options[$t['dietary']] : '—';
                if ($t['dietary'] === 'allergies' && $allergy_val !== '') {
                    $dlabel .= ' (' . $allergy_val . ')';
                }
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">' . esc_html($dlabel) . '</td>';
            }

            // Guardian (parent ticket) — only in the Future members block.
            // Editable when guardian options are available.
            if ($minor_block) {
                if ($can_edit && !empty($guardian_options)) {
                    echo '<td data-title="' . esc_attr__('Guardian', 'rt-event-manager') . '"><select class="rtacc-ticket-field uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][parent_ticket_id]">';
                    foreach ($guardian_options as $gid => $glabel) {
                        echo '<option value="' . esc_attr($gid) . '" ' . selected($parent_id, absint($gid), false) . '>' . esc_html($glabel) . '</option>';
                    }
                    echo '</select></td>';
                } elseif ($parent_id && isset($by_id[$parent_id])) {
                    // If the direct parent is itself a Future member (a pretour
                    // bought for a minor), resolve to that minor's guardian.
                    $p = $by_id[$parent_id];
                    if ('minor' === RT_Event_Manager::get_ticket_kind($p)) {
                        $gp = absint($p['parent_ticket_id']);
                        if ($gp && isset($by_id[$gp])) {
                            $p = $by_id[$gp];
                        }
                    }
                    $plabel = ($p['holder_name'] !== '') ? $p['holder_name'] : ('#' . $parent_id);
                    echo '<td data-title="' . esc_attr__('Guardian', 'rt-event-manager') . '">' . esc_html($plabel) . '</td>';
                } elseif ($parent_id) {
                    echo '<td data-title="' . esc_attr__('Guardian', 'rt-event-manager') . '">#' . esc_html($parent_id) . '</td>';
                } else {
                    echo '<td data-title="' . esc_attr__('Guardian', 'rt-event-manager') . '">&mdash;</td>';
                }
            }

            echo '<td data-title="' . esc_attr__('Status', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span></td>';
            echo '<td data-title="' . esc_attr__('Actions', 'rt-event-manager') . '">' . $this->ticket_actions_cell($t) . '</td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
    }

    /**
     * Per-row Transfer / Cancel action buttons. Transfer is offered only for
     * adult event tickets (they move as a package with their pretours); every
     * live ticket can be cancelled. Cancelled/checked-in rows show no actions.
     *
     * @param array $t Ticket row.
     * @return string HTML.
     */
    private function ticket_actions_cell($t) {
        $id     = absint($t['id']);
        $kind   = $this->effective_kind($t);
        $status = isset($t['status']) ? $t['status'] : 'draft';
        $name   = ($t['holder_name'] !== '') ? $t['holder_name'] : ('#' . $id);

        // Terminal states have no actions — the Status column already shows the
        // cancelled/checked-in badge, so leave the Actions cell empty.
        if (in_array($status, array('cancelled', 'checked_in'), true)) {
            return '';
        }

        $refund_open = RT_Event_Manager::instance()->is_refund_window_open();

        // Icon-only buttons; the label doubles as the hover tooltip (title) and
        // the accessible name (aria-label).
        $icon_transfer = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>';
        $icon_cancel   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

        $transfer_label = __('Request transfer', 'rt-event-manager');
        $cancel_label   = $refund_open
            ? __('Cancel and request refund', 'rt-event-manager')
            : __('Cancel ticket', 'rt-event-manager');

        $out = '<div class="rtacc-row-actions">';
        if ('event' === $kind) {
            $out .= '<button type="button" class="rtacc-icon-btn rtacc-transfer-btn" data-ticket="' . esc_attr($id) . '" data-name="' . esc_attr($name) . '" title="' . esc_attr($transfer_label) . '" aria-label="' . esc_attr($transfer_label) . '">' . $icon_transfer . '</button>';
        }
        $out .= '<button type="button" class="rtacc-icon-btn rtacc-icon-btn--danger rtacc-cancel-btn" data-ticket="' . esc_attr($id) . '" data-name="' . esc_attr($name) . '" data-kind="' . esc_attr($kind) . '" title="' . esc_attr($cancel_label) . '" aria-label="' . esc_attr($cancel_label) . '">' . $icon_cancel . '</button>';
        $out .= '</div>';

        return $out;
    }

    /* ---- Product queries for the add sections ---- */

    /** Ticket products that are plain Event tickets (not pretour, not minor). */
    private function get_event_product_ids() {
        $ids = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'fields'         => 'ids',
            'meta_query'     => array(array('key' => '_rti_is_ticket', 'value' => 'yes')),
        ));
        return array_values(array_filter($ids, function ($pid) {
            return 'event' === RT_Event_Manager::get_ticket_kind_for_product($pid);
        }));
    }

    /**
     * Primary "Add a ticket" button for the co-traveller section. Targets the
     * first purchasable Event ticket product, carrying the co-traveller link to
     * the member's own ticket. Returns '' if no event product is available.
     *
     * @param int $parent_id The member's own ticket id (0 if they have none yet).
     * @return string Escaped button HTML.
     */
    private function cotraveller_add_button($parent_id) {
        // Co-travellers link to the member's own ticket, so only offer this once
        // the account has a primary ticket to link them to.
        if (!absint($parent_id)) {
            return '';
        }
        $product = $this->first_purchasable_product($this->get_event_product_ids());
        if (!$product) {
            return '';
        }

        // Variable / MTO products must choose options on the product page (a modal
        // can't capture those); simple products open the customize modal.
        if ($this->product_needs_options($product)) {
            $parent_id = absint($parent_id);
            $url = $parent_id
                ? add_query_arg('rti_parent_ticket_id', $parent_id, $product->get_permalink())
                : $product->get_permalink();
            return '<p class="rtacc-actions"><a class="uk-button uk-button-primary" href="' . esc_url($url) . '">'
                . esc_html__('Add a ticket', 'rt-event-manager') . '</a></p>';
        }

        return '<p class="rtacc-actions"><button type="button" class="uk-button uk-button-primary" data-rtacc-modal="cotraveller">'
            . esc_html__('Add a ticket', 'rt-event-manager') . '</button></p>';
    }

    /** First purchasable, in-stock product from a list of ids, or null. */
    private function first_purchasable_product($product_ids) {
        foreach ($product_ids as $pid) {
            $p = wc_get_product($pid);
            if ($p && $p->is_purchasable() && $p->is_in_stock()) {
                return $p;
            }
        }
        return null;
    }

    /** Whether a product requires choosing options (variable / make-to-order). */
    private function product_needs_options($product) {
        return $product->is_type('variable') || $product->is_type('make_to_order');
    }

    /** Ticket products in the configured Pretour category. */
    private function get_pretour_product_ids() {
        $cat = RT_Event_Manager::get_pretour_category_id();
        if (!$cat) {
            return array();
        }
        return get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'fields'         => 'ids',
            'tax_query'      => array(array('taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => array($cat))),
        ));
    }

    /** The single Future/minor product (first purchasable one in the category). */
    private function get_future_product_id() {
        $cat = RT_Event_Manager::get_future_category_id();
        if (!$cat) {
            return 0;
        }
        $ids = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => 1,
            'post_status'    => 'publish',
            'fields'         => 'ids',
            'tax_query'      => array(array('taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => array($cat))),
        ));
        return !empty($ids) ? absint($ids[0]) : 0;
    }

    /**
     * "Add a Future member" control: pick a parent ticket + gender, then add the
     * single Future product to the cart carrying the linkage.
     *
     * @param array $parent_options id => label
     */
    /**
     * "Add a Future member" button, placed inside the Future members section.
     * Returns '' if there is no Future product or the member has no ticket to
     * link to; a product-page link for variable/MTO products; otherwise a modal
     * trigger.
     *
     * @param array $parent_options Guardian ticket options (id => label).
     * @return string Escaped button HTML.
     */
    private function future_add_button($parent_options) {
        $future_pid     = $this->get_future_product_id();
        $future_product = $future_pid ? wc_get_product($future_pid) : null;
        if (!$future_product || empty($parent_options)) {
            return '';
        }
        if ($this->product_needs_options($future_product)) {
            return '<p class="rtacc-actions"><a class="uk-button uk-button-primary" href="' . esc_url($future_product->get_permalink()) . '">' . esc_html__('Add a Future member', 'rt-event-manager') . '</a></p>';
        }
        return '<p class="rtacc-actions"><button type="button" class="uk-button uk-button-primary" data-rtacc-modal="future">' . esc_html__('Add a Future member', 'rt-event-manager') . '</button></p>';
    }

    /**
     * Render the Future member customize modal (once), opened by the button.
     *
     * @param array $parent_options Guardian ticket options (id => label).
     */
    private function render_future_modal($parent_options) {
        $future_pid     = $this->get_future_product_id();
        $future_product = $future_pid ? wc_get_product($future_pid) : null;
        if (!$future_product || empty($parent_options) || $this->product_needs_options($future_product)) {
            return;
        }
        $this->render_ticket_modal('future', array(
            'title'          => __('Add a Future member', 'rt-event-manager'),
            'product_id'     => $future_product->get_id(),
            'is_minor'       => true,
            'parent_options' => $parent_options,
        ));
    }

    /**
     * Render a "customize the ticket" modal (co-traveller or Future member).
     * Submitted via account.js to add the product to the cart with the entered
     * details, then redirect to checkout for payment.
     *
     * @param string $key modal key: 'cotraveller' | 'future'
     * @param array  $cfg title, product_id, is_minor, parent_id | parent_options
     */
    private function render_ticket_modal($key, $cfg) {
        $is_minor            = !empty($cfg['is_minor']);
        $dietary_options     = RT_Event_Manager::get_dietary_options(true);
        $allergy_suggestions = RT_Event_Manager::get_allergy_suggestions();
        $list_id             = 'rtacc-modal-allergy-' . $key;

        echo '<div class="rtacc-modal" id="rtacc-modal-' . esc_attr($key) . '" hidden>';
        echo '<div class="rtacc-modal-backdrop" data-rtacc-close></div>';
        echo '<div class="rtacc-modal-dialog">';
        echo '<form class="rtacc-modal-form rtacc-form uk-form-stacked" data-product="' . esc_attr($cfg['product_id']) . '" data-minor="' . ($is_minor ? '1' : '0') . '">';
        echo '<h3 class="rtacc-subtitle">' . esc_html($cfg['title']) . '</h3>';

        // Holder / child name.
        echo '<p class="rtacc-field"><label class="uk-form-label">' . ($is_minor ? esc_html__('Child\'s name', 'rt-event-manager') : esc_html__('Ticket holder name', 'rt-event-manager')) . '</label>';
        echo '<input type="text" class="uk-input" name="name" required /></p>';

        if ($is_minor) {
            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Legal guardian (their ticket)', 'rt-event-manager') . '</label>';
            echo '<select class="uk-select" name="parent_id" required>';
            foreach ($cfg['parent_options'] as $pid => $label) {
                echo '<option value="' . esc_attr($pid) . '">' . esc_html($label) . '</option>';
            }
            echo '</select></p>';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Type', 'rt-event-manager') . '</label>';
            echo '<select class="uk-select" name="gender">';
            echo '<option value="tabler">' . esc_html__('Future Tabler', 'rt-event-manager') . '</option>';
            echo '<option value="circler">' . esc_html__('Future Circler', 'rt-event-manager') . '</option>';
            echo '</select></p>';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Date of birth', 'rt-event-manager') . '</label>';
            echo '<input type="date" class="uk-input" name="dob" required />';
            echo '<span class="rtacc-hint">' . esc_html(sprintf(__('Must be between %1$d and %2$d years old at the event.', 'rt-event-manager'), RT_Event_Manager::get_minor_min_age(), RT_Event_Manager::get_minor_max_age())) . '</span></p>';
        } else {
            echo '<input type="hidden" name="parent_id" value="' . esc_attr(absint(isset($cfg['parent_id']) ? $cfg['parent_id'] : 0)) . '" />';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Phone', 'rt-event-manager') . '</label>';
            echo '<input type="tel" class="uk-input" name="phone" required placeholder="+41791234567" /></p>';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Family', 'rt-event-manager') . '</label>';
            echo '<select class="uk-select" name="family"><option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
            foreach (RT_Event_Manager::$family_options as $fk => $fl) {
                echo '<option value="' . esc_attr($fk) . '">' . esc_html($fl) . '</option>';
            }
            echo '</select></p>';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Club', 'rt-event-manager') . '</label>';
            echo '<input type="text" class="uk-input" name="club" /></p>';

            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('.WORLD ID', 'rt-event-manager') . '</label>';
            echo '<input type="text" class="uk-input" name="world_id" /></p>';
        }

        // Dietary + conditional allergy details.
        echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Dietary', 'rt-event-manager') . '</label>';
        echo '<select class="uk-select rtacc-modal-dietary" name="dietary">';
        foreach ($dietary_options as $dk => $dl) {
            echo '<option value="' . esc_attr($dk) . '">' . esc_html($dl) . '</option>';
        }
        echo '</select></p>';
        echo '<p class="rtacc-field rtacc-modal-allergy-field" style="display:none;"><label class="uk-form-label">' . esc_html__('Please specify the allergies', 'rt-event-manager') . '</label>';
        echo '<input type="text" class="uk-input rtacc-modal-allergy" name="allergy" list="' . esc_attr($list_id) . '" placeholder="' . esc_attr__('Select or specify allergies', 'rt-event-manager') . '" autocomplete="off" />';
        if (!empty($allergy_suggestions)) {
            echo '<datalist id="' . esc_attr($list_id) . '">';
            foreach ($allergy_suggestions as $s) {
                echo '<option value="' . esc_attr($s) . '"></option>';
            }
            echo '</datalist>';
        }
        echo '</p>';

        echo '<div class="rtacc-modal-error rtacc-status is-error" style="display:none;"></div>';
        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Continue to payment', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="uk-button uk-button-default" data-rtacc-close>' . esc_html__('Cancel', 'rt-event-manager') . '</button>';
        echo '</p>';

        echo '</form></div></div>';
    }

    /**
     * Simple, purchasable pretour products the bulk flow can offer (variable /
     * MTO pretours must be bought via their own product page).
     *
     * @return WC_Product[]
     */
    private function get_bulk_pretour_products() {
        $products = array();
        foreach ($this->get_pretour_product_ids() as $pid) {
            $p = wc_get_product($pid);
            if ($p && $p->is_purchasable() && $p->is_in_stock() && !$this->product_needs_options($p)) {
                $products[] = $p;
            }
        }
        return $products;
    }

    /**
     * The "Add a pretour" title-line button. Empty when there is no bookable
     * pretour product or no eligible member.
     *
     * @param array $candidates Eligible member ticket rows.
     * @return string
     */
    private function pretour_add_button_html($candidates) {
        if (empty($this->get_bulk_pretour_products()) || empty($candidates)) {
            return '';
        }
        return '<button type="button" class="uk-button uk-button-primary rtacc-title-action" data-rtacc-modal="pretour">'
            . esc_html__('Add a pretour', 'rt-event-manager') . '</button>';
    }

    /**
     * The bulk pretour modal: choose the tour and which group members join. One
     * pretour is added per selected member, then the JS redirects to checkout.
     *
     * @param array $candidates Eligible member ticket rows.
     */
    private function render_pretour_modal($candidates) {
        $products = $this->get_bulk_pretour_products();
        if (empty($products) || empty($candidates)) {
            return;
        }

        echo '<div class="rtacc-modal" id="rtacc-modal-pretour" hidden>';
        echo '<div class="rtacc-modal-backdrop" data-rtacc-close></div>';
        echo '<div class="rtacc-modal-dialog">';
        echo '<form class="rtacc-pretour-form rtacc-form uk-form-stacked">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Add a pretour', 'rt-event-manager') . '</h3>';

        // Pretour selector (a dropdown when there is more than one to choose).
        if (count($products) > 1) {
            echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Tour', 'rt-event-manager') . '</label>';
            echo '<select class="uk-select" name="product_id">';
            foreach ($products as $p) {
                echo '<option value="' . esc_attr($p->get_id()) . '">' . esc_html($p->get_name()) . ' — ' . esc_html(wp_strip_all_tags($p->get_price_html())) . '</option>';
            }
            echo '</select></p>';
        } else {
            $only = $products[0];
            echo '<input type="hidden" name="product_id" value="' . esc_attr($only->get_id()) . '" />';
            echo '<p class="rtacc-hint">' . esc_html($only->get_name()) . ' — ' . wp_kses_post($only->get_price_html()) . '</p>';
        }

        echo '<div class="rtacc-checklist">';
        foreach ($candidates as $t) {
            $id    = absint($t['id']);
            $label = ($t['holder_name'] !== '') ? $t['holder_name'] : sprintf(__('Ticket #%d', 'rt-event-manager'), $id);
            $type  = RT_Event_Manager::ticket_kind_label($t);
            echo '<label class="rtacc-check"><input type="checkbox" name="members[]" value="' . esc_attr($id) . '" /> ' . esc_html($label) . ' <span class="rtacc-muted">· ' . esc_html($type) . '</span></label>';
        }
        echo '</div>';
        echo '<div class="rtacc-modal-error rtacc-status is-error" style="display:none;"></div>';
        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Continue to payment', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="uk-button uk-button-default" data-rtacc-close>' . esc_html__('Cancel', 'rt-event-manager') . '</button>';
        echo '</p>';
        echo '</form></div></div>';
    }

    /* ---------------------------------------------------------------------
     * Tab: Travel and Visa (scaffold only — built later)
     * ------------------------------------------------------------------- */

    private function render_travel() {
        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Travel and Visa', 'rt-event-manager') . '</h2>';
        echo '<div class="rtacc-notice uk-alert-warning" uk-alert>' . esc_html__('This section is coming soon.', 'rt-event-manager') . '</div>';

        // Inert preview of the planned layout. Inputs are disabled and nothing
        // is saved yet — see get_travel_plan()/save_travel_plan() stubs below.
        echo '<fieldset class="rtacc-panel uk-card uk-card-default uk-card-body" disabled>';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your travel plans', 'rt-event-manager') . '</h3>';

        echo '<div class="rtacc-form uk-form-stacked">';
        echo '<p class="rtacc-field"><label>' . esc_html__('Arrival date & time', 'rt-event-manager') . '</label><input type="datetime-local" /></p>';
        echo '<p class="rtacc-field"><label>' . esc_html__('Arrival details (flight / train / etc.)', 'rt-event-manager') . '</label><input type="text" /></p>';
        echo '<p class="rtacc-field"><label>' . esc_html__('Departure date & time', 'rt-event-manager') . '</label><input type="datetime-local" /></p>';
        echo '<p class="rtacc-field"><label>' . esc_html__('Departure details', 'rt-event-manager') . '</label><input type="text" /></p>';
        echo '<p class="rtacc-actions"><button type="button" class="uk-button uk-button-default" disabled>' . esc_html__('Request Visa Letter of Invitation', 'rt-event-manager') . '</button></p>';
        echo '</div>';
        echo '</fieldset>';
    }

    /**
     * Stub: future travel-plan retrieval. Planned storage is a dedicated
     * `rti_travel` table (or order/user meta) keyed by user + event.
     *
     * @param int $user_id
     * @return array
     */
    public function get_travel_plan($user_id) {
        /** @todo Implement when the Travel & Visa feature is built. */
        return array();
    }

    /**
     * Stub: future travel-plan persistence.
     *
     * @param int   $user_id
     * @param array $data
     * @return bool
     */
    public function save_travel_plan($user_id, $data) {
        /** @todo Implement when the Travel & Visa feature is built. */
        return false;
    }

    /* ---------------------------------------------------------------------
     * Tab: Shop (merch / regalia — non-ticket products)
     * ------------------------------------------------------------------- */

    private function render_shop() {
        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Shop', 'rt-event-manager') . '</h2>';

        $args = array(
            'status'  => 'publish',
            'limit'   => -1,
            'orderby' => 'title',
            'order'   => 'ASC',
        );

        $merch_cat = get_option('rt_event_manager_merch_category', '');
        if ($merch_cat !== '') {
            $term = get_term(absint($merch_cat), 'product_cat');
            if ($term && !is_wp_error($term)) {
                $args['category'] = array($term->slug);
            }
        }

        $products = wc_get_products($args);

        // Exclude ticket products regardless of category.
        $products = array_filter($products, function ($product) {
            return 'yes' !== get_post_meta($product->get_id(), '_rti_is_ticket', true);
        });

        if (empty($products)) {
            echo '<p>' . esc_html__('No merchandise is available right now.', 'rt-event-manager') . '</p>';
            return;
        }

        echo '<div class="rtacc-products">';
        foreach ($products as $product) {
            $this->render_product_card($product);
        }
        echo '</div>';
    }

    /* ---------------------------------------------------------------------
     * Shared product card (used by Shop and "Add more tickets")
     * ------------------------------------------------------------------- */

    private function render_product_card($product, $parent_id = 0) {
        $needs_options = $product->is_type('variable') || $product->is_type('make_to_order');
        $parent_id     = absint($parent_id);

        echo '<div class="rtacc-product uk-card uk-card-default uk-card-body">';
        echo '<a class="rtacc-product-thumb" href="' . esc_url($product->get_permalink()) . '">' . $product->get_image('woocommerce_thumbnail') . '</a>';
        echo '<h4 class="rtacc-product-title"><a href="' . esc_url($product->get_permalink()) . '">' . esc_html($product->get_name()) . '</a></h4>';
        echo '<div class="rtacc-product-price">' . wp_kses_post($product->get_price_html()) . '</div>';

        if ($needs_options) {
            // Carry the co-traveller link through the options page (re-emitted as a
            // hidden add-to-cart field by inject_link_hidden_fields).
            $opts_url = $parent_id
                ? add_query_arg('rti_parent_ticket_id', $parent_id, $product->get_permalink())
                : $product->get_permalink();
            echo '<a class="uk-button uk-button-default" href="' . esc_url($opts_url) . '">' . esc_html__('Choose options', 'rt-event-manager') . '</a>';
        } else {
            $add_args = array('add-to-cart' => $product->get_id());
            if ($parent_id) {
                $add_args['rti_parent_ticket_id'] = $parent_id;
            }
            $add_url = add_query_arg($add_args, wc_get_cart_url());
            echo '<a class="uk-button uk-button-default" href="' . esc_url($add_url) . '" data-quantity="1" data-product_id="' . esc_attr($product->get_id()) . '" rel="nofollow">' . esc_html__('Add to cart', 'rt-event-manager') . '</a>';
        }
        echo '</div>';
    }

    /* ---------------------------------------------------------------------
     * Shared small helpers
     * ------------------------------------------------------------------- */

    private function status_labels() {
        return array(
            'valid'      => __('Confirmed', 'rt-event-manager'),
            'draft'      => __('Pending Confirmation', 'rt-event-manager'),
            'invalid'    => __('Invalid', 'rt-event-manager'),
            'checked_in' => __('Checked In', 'rt-event-manager'),
            'cancelled'  => __('Cancelled', 'rt-event-manager'),
        );
    }

    /**
     * Whether the current user owns a ticket row. Prefers the explicit
     * owner_user_id; falls back to the order customer for legacy rows.
     *
     * @param array $t
     * @param int   $user_id
     * @return bool
     */
    private function user_owns_ticket($t, $user_id) {
        $owner = absint(isset($t['owner_user_id']) ? $t['owner_user_id'] : 0);
        if ($owner) {
            return $owner === absint($user_id);
        }
        $order = wc_get_order(absint($t['order_id']));
        return $order && absint($order->get_customer_id()) === absint($user_id);
    }

    /* ---------------------------------------------------------------------
     * AJAX: ticket transfer & cancellation
     * ------------------------------------------------------------------- */

    /** Request a transfer of an adult event ticket to a new holder's email. */
    public function ajax_request_transfer() {
        check_ajax_referer('rt_event_manager_transfer', 'nonce');
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }
        $user_id   = get_current_user_id();
        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;

        $t = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$t || !$this->user_owns_ticket($t, $user_id)) {
            wp_send_json_error(__('Ticket not found.', 'rt-event-manager'));
        }
        if ('event' !== RT_Event_Manager::get_ticket_kind($t)) {
            wp_send_json_error(__('Only event tickets can be transferred. Future member tickets must be cancelled instead.', 'rt-event-manager'));
        }
        if (in_array($t['status'], array('cancelled', 'checked_in'), true)) {
            wp_send_json_error(__('This ticket can no longer be transferred.', 'rt-event-manager'));
        }
        if (!empty($t['transfer_token'])) {
            wp_send_json_error(__('A transfer is already pending for this ticket. Please wait for it to be accepted or declined, or ask an organiser to withdraw it, before starting another.', 'rt-event-manager'));
        }

        $token = wp_generate_password(32, false);
        RT_Event_Manager::instance()->update_ticket($ticket_id, array(
            'transfer_token'        => $token,
            'transfer_email'        => '',
            'transfer_requested_at' => current_time('mysql'),
        ));

        $product = wc_get_product($t['product_id']);
        $pname   = $product ? $product->get_name() : __('an event ticket', 'rt-event-manager');
        $hours   = max(1, round(RT_Event_Manager::transfer_expiry_seconds() / HOUR_IN_SECONDS));

        wp_send_json_success(array(
            'accept_url' => add_query_arg('rti_transfer', rawurlencode($token), wc_get_page_permalink('myaccount')),
            'product'    => $pname,
            'hours'      => $hours,
        ));
    }

    /** Cancel a ticket immediately (cascades to linked pretours). */
    public function ajax_cancel_ticket() {
        check_ajax_referer('rt_event_manager_cancel', 'nonce');
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }
        $user_id   = get_current_user_id();
        $ticket_id = isset($_POST['ticket_id']) ? absint($_POST['ticket_id']) : 0;

        $t = $ticket_id ? RT_Event_Manager::get_ticket_by_id($ticket_id) : null;
        if (!$t || !$this->user_owns_ticket($t, $user_id)) {
            wp_send_json_error(__('Ticket not found.', 'rt-event-manager'));
        }
        if (in_array($t['status'], array('cancelled', 'checked_in'), true)) {
            wp_send_json_error(__('This ticket cannot be cancelled.', 'rt-event-manager'));
        }

        $mgr         = RT_Event_Manager::instance();
        $refund_open = $mgr->is_refund_window_open();

        // Before the cutoff a refund is requested (pending admin action);
        // afterwards the cancellation is recorded with no refund due.
        $refund_status = $refund_open ? 'requested' : 'none';

        $cancelled = array($t);
        $mgr->update_ticket($ticket_id, array(
            'status'         => 'cancelled',
            'refund_status'  => $refund_status,
            'transfer_token' => '',
            'transfer_email' => '',
        ));
        // A pretour cannot outlive its host — cascade the cancellation.
        if (in_array(RT_Event_Manager::get_ticket_kind($t), array('event', 'minor'), true)) {
            foreach (RT_Event_Manager::get_child_pretours($ticket_id) as $child) {
                $mgr->update_ticket(absint($child['id']), array(
                    'status'        => 'cancelled',
                    'refund_status' => $refund_status,
                ));
                $cancelled[] = $child;
            }
        }

        $this->send_cancel_email($t, $cancelled, $refund_open, $user_id);

        wp_send_json_success(array(
            'message' => $refund_open
                ? __('Ticket cancelled. A refund has been requested from the organiser.', 'rt-event-manager')
                : __('Ticket cancelled. No refund is due after the deadline.', 'rt-event-manager'),
        ));
    }

    /** Accept a pending transfer: reassign the package to the logged-in user. */
    public function ajax_accept_transfer() {
        check_ajax_referer('rt_event_manager_accept_transfer', 'nonce');
        if (!is_user_logged_in()) {
            wp_send_json_error(__('Please log in to accept this transfer.', 'rt-event-manager'));
        }
        $user_id = get_current_user_id();
        $token   = isset($_POST['token']) ? sanitize_text_field(wp_unslash($_POST['token'])) : '';

        $event = RT_Event_Manager::get_ticket_by_transfer_token($token);
        if ($event && $this->transfer_expired($event)) {
            RT_Event_Manager::instance()->update_ticket(absint($event['id']), array(
                'transfer_token' => '',
                'transfer_email' => '',
            ));
            wp_send_json_error(__('This transfer invitation has expired. Please ask the current holder to send a new one.', 'rt-event-manager'));
        }
        if (!$event || 'event' !== RT_Event_Manager::get_ticket_kind($event) || 'cancelled' === $event['status']) {
            wp_send_json_error(__('This transfer link is no longer valid.', 'rt-event-manager'));
        }

        $mgr      = RT_Event_Manager::instance();
        $new_user = get_userdata($user_id);
        $new_name = trim($new_user->first_name . ' ' . $new_user->last_name);
        if ('' === $new_name) {
            $new_name = $new_user->display_name;
        }
        $new_world  = get_user_meta($user_id, 'world_id', true);
        $new_family = get_user_meta($user_id, 'rti_family', true);
        $new_club   = get_user_meta($user_id, 'rti_club', true);
        $qr         = $new_world ? ('tablerworld:///member?id=' . $new_world) : '';

        $order  = wc_get_order(absint($event['order_id']));
        $status = $order ? rt_event_manager_determine_ticket_status($order, $new_name) : 'draft';

        // Capture the outgoing owner so the completed transfer can be shown in
        // the backend (owner_user_id falls back to the order customer for legacy).
        $from_owner = absint(isset($event['owner_user_id']) ? $event['owner_user_id'] : 0);
        if (!$from_owner && $order) {
            $from_owner = absint($order->get_customer_id());
        }

        // Overwrite the event ticket to the new owner; personal fields are reset.
        $mgr->update_ticket(absint($event['id']), array(
            'owner_user_id'   => $user_id,
            'holder_name'     => $new_name,
            'phone'           => '',
            'rti_family'      => $new_family,
            'rti_club'        => $new_club,
            'world_id'        => $new_world,
            'qr_code_url'     => $qr,
            'dietary'         => 'none',
            'allergy_details' => '',
            'transfer_token'  => '',
            'transfer_email'  => '',
            'status'          => $status,
            'transferred_from_user_id' => $from_owner,
            'transferred_at'  => current_time('mysql'),
        ));

        // The pretour package follows the same person.
        foreach (RT_Event_Manager::get_child_pretours(absint($event['id'])) as $child) {
            $mgr->update_ticket(absint($child['id']), array(
                'owner_user_id' => $user_id,
                'holder_name'   => $new_name,
                'phone'         => '',
                'status'        => $order ? rt_event_manager_determine_ticket_status($order, $new_name) : 'draft',
            ));
        }

        wp_send_json_success(array(
            'redirect' => add_query_arg('tab', 'tickets', wc_get_page_permalink('myaccount')),
        ));
    }

    /** Decline a pending transfer: clear the offer so the owner can re-issue it. */
    public function ajax_decline_transfer() {
        check_ajax_referer('rt_event_manager_decline_transfer', 'nonce');
        if (!is_user_logged_in()) {
            wp_send_json_error(__('Please log in to decline this transfer.', 'rt-event-manager'));
        }
        $token = isset($_POST['token']) ? sanitize_text_field(wp_unslash($_POST['token'])) : '';
        $event = RT_Event_Manager::get_ticket_by_transfer_token($token);
        if (!$event) {
            wp_send_json_error(__('This transfer link is no longer valid.', 'rt-event-manager'));
        }

        // Notify the current owner before clearing the offer, then clear it so a
        // new transfer can be started.
        $this->send_transfer_declined_email($event);
        RT_Event_Manager::instance()->update_ticket(absint($event['id']), array(
            'transfer_token' => '',
            'transfer_email' => '',
        ));

        wp_send_json_success(array(
            'redirect' => wc_get_page_permalink('myaccount'),
        ));
    }

    /** Notify the current owner that their transfer offer was declined. */
    private function send_transfer_declined_email($ticket) {
        $owner_id = absint(isset($ticket['owner_user_id']) ? $ticket['owner_user_id'] : 0);
        $owner    = $owner_id ? get_userdata($owner_id) : null;
        if (!$owner || empty($owner->user_email)) {
            return;
        }
        $product = wc_get_product($ticket['product_id']);
        $pname   = $product ? $product->get_name() : __('your event ticket', 'rt-event-manager');
        $invitee = isset($ticket['transfer_email']) ? $ticket['transfer_email'] : '';

        $subject = __('Your ticket transfer was declined', 'rt-event-manager');
        $lines   = array();
        $lines[] = sprintf(
            __('The transfer of your ticket (%1$s)%2$s was declined.', 'rt-event-manager'),
            $pname,
            $invitee !== '' ? ' ' . sprintf(__('by %s', 'rt-event-manager'), $invitee) : ''
        );
        $lines[] = '';
        $lines[] = __('The ticket is still yours. You can start a new transfer from your account if you wish.', 'rt-event-manager');

        wp_mail($owner->user_email, $subject, implode("\n", $lines));
    }

    /** Email the shop manager about a cancellation (and refund status). */
    private function send_cancel_email($ticket, $cancelled, $refund_open, $user_id) {
        $to       = RT_Event_Manager::get_shop_manager_email();
        $user     = get_userdata($user_id);
        $who      = $user ? $user->user_email : '';
        $order_id = absint($ticket['order_id']);

        $subject = $refund_open
            ? sprintf(__('Ticket cancellation & refund request (order #%d)', 'rt-event-manager'), $order_id)
            : sprintf(__('Ticket cancellation, no refund (order #%d)', 'rt-event-manager'), $order_id);

        $lines   = array();
        $lines[] = sprintf(__('A customer cancelled the following ticket(s) from order #%d:', 'rt-event-manager'), $order_id);
        foreach ($cancelled as $c) {
            $p    = wc_get_product($c['product_id']);
            $name = ($c['holder_name'] !== '') ? $c['holder_name'] : ('#' . $c['id']);
            $lines[] = '- ' . ($p ? $p->get_name() : ('#' . $c['id'])) . ' — ' . $name;
        }
        $lines[] = '';
        $lines[] = sprintf(__('Cancelled by: %1$s (user #%2$d)', 'rt-event-manager'), $who, $user_id);
        $lines[] = '';
        $lines[] = $refund_open
            ? __('This cancellation is within the refund window — please process a refund for the amounts paid.', 'rt-event-manager')
            : __('This cancellation is after the refund deadline — no refund is due.', 'rt-event-manager');

        wp_mail($to, $subject, implode("\n", $lines));
    }

    /* ---------------------------------------------------------------------
     * AJAX: save profile (local editable fields only)
     * ------------------------------------------------------------------- */

    public function ajax_save_profile() {
        check_ajax_referer('rt_event_manager_save_profile', 'nonce');

        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }

        $user_id = get_current_user_id();

        // Always-editable local fields.
        if (isset($_POST['emergency_contact'])) {
            update_user_meta($user_id, 'rti_emergency_contact', sanitize_text_field(wp_unslash($_POST['emergency_contact'])));
        }
        if (isset($_POST['function'])) {
            update_user_meta($user_id, 'rti_function', sanitize_text_field(wp_unslash($_POST['function'])));
        }

        // Membership fields: editable only for manually-created (non-SSO)
        // accounts. For SSO accounts these are owned by .WORLD and ignored here.
        if (!$this->user_is_sso($user_id)) {
            $userdata = array('ID' => $user_id);
            if (isset($_POST['first_name'])) {
                $userdata['first_name'] = sanitize_text_field(wp_unslash($_POST['first_name']));
            }
            if (isset($_POST['last_name'])) {
                $userdata['last_name'] = sanitize_text_field(wp_unslash($_POST['last_name']));
            }
            if (isset($_POST['email'])) {
                $email = sanitize_email(wp_unslash($_POST['email']));
                if ($email && is_email($email)) {
                    $existing = email_exists($email);
                    if (!$existing || (int) $existing === (int) $user_id) {
                        $userdata['user_email'] = $email;
                    } else {
                        wp_send_json_error(__('That email address is already in use.', 'rt-event-manager'));
                    }
                }
            }
            if (count($userdata) > 1) {
                wp_update_user($userdata);
            }

            $meta_map = array('rti_family', 'rti_club', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_postcode', 'billing_country');
            foreach ($meta_map as $key) {
                if (isset($_POST[$key])) {
                    update_user_meta($user_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
                }
            }
        }

        wp_send_json_success();
    }

    /* ---------------------------------------------------------------------
     * AJAX: save ticket details across the user's orders
     * ------------------------------------------------------------------- */

    public function ajax_save_tickets() {
        check_ajax_referer('rt_event_manager_account_save_tickets', 'nonce');

        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }

        $user_id = get_current_user_id();
        $posted  = isset($_POST['tickets']) && is_array($_POST['tickets']) ? wp_unslash($_POST['tickets']) : array();

        if (empty($posted)) {
            wp_send_json_error(__('Nothing to save.', 'rt-event-manager'));
        }

        $main = RT_Event_Manager::instance();

        // Server-side cutoff enforcement.
        if (!$main->is_frontend_editing_allowed()) {
            wp_send_json_error(__('The ticket editing deadline has passed.', 'rt-event-manager'));
        }

        // Build a trusted map of the user's own tickets: ticket_id => order_id.
        $owned = array();
        foreach (RT_Event_Manager::get_tickets_for_user($user_id) as $row) {
            $owned[intval($row['id'])] = intval($row['order_id']);
        }

        $orders_touched = array();

        foreach ($posted as $ticket_id => $data) {
            $ticket_id = absint($ticket_id);
            if (!isset($owned[$ticket_id])) {
                continue; // Not this user's ticket — silently skip.
            }

            $allowed = array();
            if (isset($data['holder_name'])) {
                $allowed['holder_name'] = sanitize_text_field($data['holder_name']);
            }
            if (isset($data['dietary'])) {
                $allowed['dietary'] = sanitize_text_field($data['dietary']);
                // Allergy details only meaningful when dietary = allergies.
                if ('allergies' === $allowed['dietary']) {
                    $allowed['allergy_details'] = isset($data['allergy_details']) ? sanitize_text_field($data['allergy_details']) : '';
                    if (trim($allowed['allergy_details']) === '') {
                        wp_send_json_error(__('Please specify the allergies for each attendee who selected “Allergies”.', 'rt-event-manager'));
                    }
                } else {
                    $allowed['allergy_details'] = '';
                }
            }
            if (isset($data['rti_family'])) {
                $allowed['rti_family'] = sanitize_text_field($data['rti_family']);
            }
            // Guardian re-assignment (Future members): only to one of the user's
            // own tickets.
            if (isset($data['parent_ticket_id'])) {
                $new_parent = absint($data['parent_ticket_id']);
                if ($new_parent && isset($owned[$new_parent])) {
                    $allowed['parent_ticket_id'] = $new_parent;
                }
            }
            if (isset($data['phone'])) {
                $phone_raw = $data['phone'];
                if (trim($phone_raw) === '' || !RT_Event_Manager::is_valid_intl_phone($phone_raw)) {
                    wp_send_json_error(__('Please enter each phone number in international format, e.g. +41791234567.', 'rt-event-manager'));
                }
                $allowed['phone'] = $phone_raw; // update_ticket normalizes.
            }

            if (!empty($allowed)) {
                $main->update_ticket($ticket_id, $allowed);
                $orders_touched[$owned[$ticket_id]] = true;
            }
        }

        // Recalculate statuses for every affected order (holder_name changes).
        foreach (array_keys($orders_touched) as $oid) {
            $main->recalculate_order_ticket_statuses($oid);
        }

        wp_send_json_success();
    }

    /* ---------------------------------------------------------------------
     * AJAX: add a customized ticket to the cart (from the modal), then the JS
     * redirects to checkout for payment.
     * ------------------------------------------------------------------- */

    public function ajax_add_ticket_to_cart() {
        check_ajax_referer('rt_event_manager_add_ticket', 'nonce');

        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }
        if (!function_exists('WC') || !WC()->cart) {
            wp_send_json_error(__('Cart is unavailable.', 'rt-event-manager'));
        }

        $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;
        $product    = $product_id ? wc_get_product($product_id) : null;
        if (!$product || 'yes' !== get_post_meta($product_id, '_rti_is_ticket', true)) {
            wp_send_json_error(__('Invalid ticket product.', 'rt-event-manager'));
        }
        if (!$product->is_purchasable() || !$product->is_in_stock()) {
            wp_send_json_error(__('This ticket cannot be purchased right now.', 'rt-event-manager'));
        }
        // Variable / MTO products need their options chosen on the product page.
        if ($product->is_type('variable') || $product->is_type('make_to_order')) {
            wp_send_json_error(__('Please choose this ticket\'s options on its product page.', 'rt-event-manager'));
        }

        $kind      = RT_Event_Manager::get_ticket_kind_for_product($product_id);
        $is_minor  = ('minor' === $kind);
        $name      = isset($_POST['name']) ? sanitize_text_field(wp_unslash($_POST['name'])) : '';
        $dietary   = isset($_POST['dietary']) ? sanitize_text_field(wp_unslash($_POST['dietary'])) : '';
        $allergy   = ('allergies' === $dietary && isset($_POST['allergy'])) ? sanitize_text_field(wp_unslash($_POST['allergy'])) : '';
        $parent_id = isset($_POST['parent_id']) ? absint($_POST['parent_id']) : 0;

        if ($name === '') {
            wp_send_json_error(__('Please enter the ticket holder name.', 'rt-event-manager'));
        }
        if ('allergies' === $dietary && $allergy === '') {
            wp_send_json_error(__('Please specify the allergies.', 'rt-event-manager'));
        }

        // Verify any parent ticket belongs to this user.
        if ($parent_id) {
            $owned = wp_list_pluck(RT_Event_Manager::get_tickets_for_user(get_current_user_id()), 'id');
            if (!in_array((string) $parent_id, array_map('strval', $owned), true)) {
                wp_send_json_error(__('Invalid linked ticket.', 'rt-event-manager'));
            }
        }

        $prefill = array(
            'name'     => $name,
            'dietary'  => $dietary,
            'allergy'  => $allergy,
            'phone'    => '',
            'family'   => '',
            'club'     => '',
            'world_id' => '',
            'dob'      => '',
        );

        if ($is_minor) {
            $gender = isset($_POST['gender']) ? sanitize_key(wp_unslash($_POST['gender'])) : '';
            $dob    = isset($_POST['dob']) ? RT_Event_Manager::sanitize_dob(wp_unslash($_POST['dob'])) : '';
            if (!$parent_id) {
                wp_send_json_error(__('Please choose the legal guardian.', 'rt-event-manager'));
            }
            if (!in_array($gender, array('tabler', 'circler'), true)) {
                wp_send_json_error(__('Please choose the ticket type.', 'rt-event-manager'));
            }
            if ($dob === '' || !RT_Event_Manager::is_valid_minor_dob($dob)) {
                wp_send_json_error(sprintf(
                    __('The date of birth must make the child between %1$d and %2$d years old at the event.', 'rt-event-manager'),
                    RT_Event_Manager::get_minor_min_age(),
                    RT_Event_Manager::get_minor_max_age()
                ));
            }
            $prefill['dob'] = $dob;
            // Carry parent + gender for the existing linking mechanism.
            $_REQUEST['rti_parent_ticket_id'] = $parent_id;
            $_REQUEST['rti_minor_gender']     = $gender;
        } else {
            $phone = isset($_POST['phone']) ? RT_Event_Manager::normalize_phone(wp_unslash($_POST['phone'])) : '';
            if ($phone === '' || !RT_Event_Manager::is_valid_intl_phone($phone)) {
                wp_send_json_error(__('Please enter a valid phone number in international format, e.g. +41791234567.', 'rt-event-manager'));
            }
            $prefill['phone']    = $phone;
            $prefill['family']   = isset($_POST['family']) ? sanitize_text_field(wp_unslash($_POST['family'])) : '';
            $prefill['club']     = isset($_POST['club']) ? sanitize_text_field(wp_unslash($_POST['club'])) : '';
            $prefill['world_id'] = isset($_POST['world_id']) ? sanitize_text_field(wp_unslash($_POST['world_id'])) : '';
            if ($parent_id) {
                $_REQUEST['rti_parent_ticket_id'] = $parent_id;
            }
        }

        $added = WC()->cart->add_to_cart($product_id, 1, 0, array(), array('rti_prefill' => $prefill));
        if (!$added) {
            wp_send_json_error(__('Could not add the ticket to your cart.', 'rt-event-manager'));
        }

        wp_send_json_success(array('checkout_url' => wc_get_checkout_url()));
    }

    /* ---------------------------------------------------------------------
     * AJAX: add a pretour for each selected group member (bulk), then checkout.
     * ------------------------------------------------------------------- */

    /**
     * Member ticket id => [pretour product ids] currently in the cart (added but
     * not yet paid). Used to prevent a second pretour for the same person.
     *
     * @return array
     */
    private function get_cart_pretour_products() {
        $map = array();
        if (function_exists('WC') && WC()->cart) {
            foreach (WC()->cart->get_cart() as $ci) {
                $pid    = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
                $parent = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
                if ($pid && $parent && RT_Event_Manager::is_pretour_product($pid)) {
                    $map[$parent][] = $pid;
                }
            }
        }
        return $map;
    }

    public function ajax_add_pretours_to_cart() {
        check_ajax_referer('rt_event_manager_add_ticket', 'nonce');

        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }
        if (!function_exists('WC') || !WC()->cart) {
            wp_send_json_error(__('Cart is unavailable.', 'rt-event-manager'));
        }

        $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;
        $product    = $product_id ? wc_get_product($product_id) : null;
        if (!$product || !RT_Event_Manager::is_pretour_product($product_id)) {
            wp_send_json_error(__('Invalid pretour product.', 'rt-event-manager'));
        }
        if (!$product->is_purchasable() || !$product->is_in_stock()) {
            wp_send_json_error(__('This pretour cannot be purchased right now.', 'rt-event-manager'));
        }
        if ($product->is_type('variable') || $product->is_type('make_to_order')) {
            wp_send_json_error(__('Please choose this pretour\'s options on its product page.', 'rt-event-manager'));
        }

        $members = (isset($_POST['members']) && is_array($_POST['members'])) ? array_map('absint', $_POST['members']) : array();
        if (empty($members)) {
            wp_send_json_error(__('Please select at least one member joining the tour.', 'rt-event-manager'));
        }

        // Index the user's tickets, record who already has a pretour (one per
        // person) and which pretour products each member already holds.
        $by_id            = array();
        $has_pretour      = array();
        $pretour_products = array(); // member ticket id => [product_id, ...]
        foreach (RT_Event_Manager::get_tickets_for_user(get_current_user_id()) as $t) {
            $by_id[absint($t['id'])] = $t;
            if ('pretour' === RT_Event_Manager::get_ticket_kind($t)) {
                $pp = absint($t['parent_ticket_id']);
                if ($pp) {
                    $has_pretour[$pp]        = true;
                    $pretour_products[$pp][] = absint($t['product_id']);
                }
            }
        }
        // Also count pretours already sitting in the cart (not yet paid).
        foreach ($this->get_cart_pretour_products() as $pp => $pids) {
            $has_pretour[$pp] = true;
            foreach ($pids as $p) {
                $pretour_products[$pp][] = $p;
            }
        }

        $added = 0;
        foreach ($members as $mid) {
            if (!isset($by_id[$mid]) || isset($has_pretour[$mid])) {
                continue; // not owned, or already has a pretour (one per person)
            }
            $m    = $by_id[$mid];
            $kind = RT_Event_Manager::get_ticket_kind($m);
            if (!in_array($kind, array('event', 'minor'), true)) {
                continue; // pretours attach to event tickets or Future members
            }

            // A Future member may only join the same tour as their guardian: the
            // guardian must be getting this pretour in the batch, or already have
            // one for this product.
            if ('minor' === $kind) {
                $guardian    = absint($m['parent_ticket_id']);
                $guardian_ok = in_array($guardian, $members, true)
                    || (isset($pretour_products[$guardian]) && in_array($product_id, $pretour_products[$guardian], true));
                if (!$guardian_ok) {
                    $who = ($m['holder_name'] !== '') ? $m['holder_name'] : ('#' . $mid);
                    wp_send_json_error(sprintf(
                        __('%s can only join the same tour as their guardian. Please also select their guardian for this tour, or assign their guardian under Event Tickets.', 'rt-event-manager'),
                        $who
                    ));
                }
            }

            $prefill = array(
                'name'     => $m['holder_name'],
                'phone'    => isset($m['phone']) ? $m['phone'] : '',
                'family'   => isset($m['rti_family']) ? $m['rti_family'] : '',
                'club'     => isset($m['rti_club']) ? $m['rti_club'] : '',
                'world_id' => isset($m['world_id']) ? $m['world_id'] : '',
                'dietary'  => isset($m['dietary']) ? $m['dietary'] : '',
                'allergy'  => isset($m['allergy_details']) ? $m['allergy_details'] : '',
                'dob'      => isset($m['dob']) ? $m['dob'] : '',
            );

            // Link this pretour to the member's ticket (captured by the filter).
            $_REQUEST['rti_parent_ticket_id'] = $mid;
            if (WC()->cart->add_to_cart($product_id, 1, 0, array(), array('rti_prefill' => $prefill))) {
                $added++;
            }
        }

        if (!$added) {
            wp_send_json_error(__('Could not add any pretour to your cart.', 'rt-event-manager'));
        }

        wp_send_json_success(array('checkout_url' => wc_get_checkout_url()));
    }

    /* ---------------------------------------------------------------------
     * AJAX: stream a PDF receipt for one of the user's orders
     * ------------------------------------------------------------------- */

    public function ajax_receipt() {
        $order_id = isset($_GET['order_id']) ? absint($_GET['order_id']) : 0;

        if (!isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rt_event_manager_receipt_' . $order_id)) {
            wp_die(esc_html__('Security check failed.', 'rt-event-manager'));
        }

        if (!is_user_logged_in()) {
            wp_die(esc_html__('You must be logged in.', 'rt-event-manager'));
        }

        $order = wc_get_order($order_id);
        if (!$order || $order->get_customer_id() !== get_current_user_id()) {
            wp_die(esc_html__('Permission denied.', 'rt-event-manager'));
        }

        if (!class_exists('RT_Event_Manager_Receipt')) {
            wp_die(esc_html__('Receipt generator not available.', 'rt-event-manager'));
        }

        // Draft/unpaid orders get an invoice; paid orders get a receipt.
        $doc_type = (isset($_GET['doc']) && 'invoice' === $_GET['doc']) ? 'invoice' : 'receipt';

        $pdf = RT_Event_Manager_Receipt::instance()->generate_receipt_pdf($order_id, $doc_type);
        if (!$pdf) {
            wp_die(esc_html__('Failed to generate the PDF.', 'rt-event-manager'));
        }

        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . $doc_type . '-order-' . $order_id . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf;
        exit;
    }
}
