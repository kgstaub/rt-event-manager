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

        // AJAX (logged-in only — the whole portal requires authentication).
        add_action('wp_ajax_rt_event_manager_save_profile', array($this, 'ajax_save_profile'));
        add_action('wp_ajax_rt_event_manager_account_save_tickets', array($this, 'ajax_save_tickets'));
        add_action('wp_ajax_rt_event_manager_receipt', array($this, 'ajax_receipt'));
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
        if (function_exists('is_account_page') && is_account_page()) {
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
            'profileNonce' => wp_create_nonce('rt_event_manager_save_profile'),
            'ticketsNonce' => wp_create_nonce('rt_event_manager_account_save_tickets'),
            'i18n'         => array(
                'saving'      => __('Saving…', 'rt-event-manager'),
                'saved'       => __('Saved!', 'rt-event-manager'),
                'error'       => __('Something went wrong. Please try again.', 'rt-event-manager'),
                'requestFail' => __('Request failed. Please try again.', 'rt-event-manager'),
            ),
        ));
    }

    /* ---------------------------------------------------------------------
     * Shortcode entry point
     * ------------------------------------------------------------------- */

    public function render_shortcode($atts) {
        // Logged out → let WooCommerce render its login/register form.
        if (!is_user_logged_in()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        // Active WC endpoint (view-order, order-pay, lost-password, add-payment
        // -method, …) → defer to WooCommerce so those flows keep working.
        if (function_exists('is_wc_endpoint_url') && is_wc_endpoint_url()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        $this->enqueue_assets();

        ob_start();
        $this->render_portal();
        return ob_get_clean();
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

        $counts = array('valid' => 0, 'draft' => 0, 'invalid' => 0, 'checked_in' => 0);
        foreach ($tickets as $t) {
            $status = isset($t['status']) ? $t['status'] : 'draft';
            if (isset($counts[$status])) {
                $counts[$status]++;
            }
        }
        $status_labels = $this->status_labels();

        $display_name = !empty($sso['name']) ? $sso['name'] : $user->display_name;

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html(sprintf(__('Welcome, %s', 'rt-event-manager'), $display_name)) . '</h2>';

        echo '<div class="rtacc-cards">';
        foreach (array('valid', 'draft', 'checked_in', 'invalid') as $status) {
            echo '<div class="rtacc-card rtacc-card--' . esc_attr($status) . '">';
            echo '<span class="rtacc-card-count">' . esc_html($counts[$status]) . '</span>';
            echo '<span class="rtacc-card-label">' . esc_html($status_labels[$status]) . '</span>';
            echo '</div>';
        }
        echo '</div>';

        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your tickets', 'rt-event-manager') . '</h3>';
        if (empty($tickets)) {
            echo '<p>' . esc_html__('You do not have any event tickets yet.', 'rt-event-manager') . '</p>';
        } else {
            echo '<ul class="rtacc-ticket-summary">';
            foreach ($tickets as $t) {
                $product = wc_get_product($t['product_id']);
                $pname   = $product ? $product->get_name() : __('(deleted product)', 'rt-event-manager');
                $status  = isset($t['status']) ? $t['status'] : 'draft';
                $holder  = $t['holder_name'] !== '' ? $t['holder_name'] : __('Unassigned', 'rt-event-manager');
                echo '<li>';
                echo '<span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span> ';
                echo esc_html($pname) . ' — ' . esc_html($holder);
                echo '</li>';
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

        $profile = array(
            'id'              => get_user_meta($user_id, 'world_id', true),
            'email'           => $user ? $user->user_email : '',
            'first_name'      => $user ? $user->first_name : '',
            'last_name'       => $user ? $user->last_name : '',
            'name'            => $user ? trim($user->first_name . ' ' . $user->last_name) : '',
            'profile_pic'     => '',
            'club'            => array(
                'name'      => get_user_meta($user_id, 'rti_club', true),
                'family'    => RT_Event_Manager::get_family_label(get_user_meta($user_id, 'rti_family', true)),
                'subdomain' => '',
                'level'     => '',
            ),
            'address'         => array(
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

        $emergency = get_user_meta($user_id, 'rti_emergency_contact', true);
        $function  = get_user_meta($user_id, 'rti_function', true);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('My Profile', 'rt-event-manager') . '</h2>';

        // --- Read-only .WORLD SSO block ---
        echo '<section class="rtacc-panel rtacc-panel--readonly uk-card uk-card-secondary uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Member details (from .WORLD)', 'rt-event-manager') . '</h3>';
        echo '<p class="rtacc-hint">' . esc_html__('These details are provided by .WORLD single sign-on and cannot be changed here.', 'rt-event-manager') . '</p>';

        if (!empty($sso['profile_pic'])) {
            echo '<img class="rtacc-avatar" src="' . esc_url($sso['profile_pic']) . '" alt="" />';
        }

        $rows = array(
            __('Name', 'rt-event-manager')        => $sso['name'],
            __('Email', 'rt-event-manager')       => $sso['email'],
            __('.WORLD ID', 'rt-event-manager')   => $sso['id'],
            __('Family', 'rt-event-manager')      => $sso['club']['family'],
            __('Club', 'rt-event-manager')        => $sso['club']['name'],
            __('Club level', 'rt-event-manager')  => $sso['club']['level'],
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

        // --- Editable local block ---
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your details', 'rt-event-manager') . '</h3>';
        echo '<form id="rtacc-profile-form" class="rtacc-form uk-form-stacked">';

        echo '<p class="rtacc-field">';
        echo '<label class="uk-form-label" for="rtacc-emergency">' . esc_html__('Emergency Contact', 'rt-event-manager') . '</label>';
        echo '<input type="text" id="rtacc-emergency" class="uk-input" name="emergency_contact" value="' . esc_attr($emergency) . '" placeholder="' . esc_attr__('Name, Phone, Email', 'rt-event-manager') . '" />';
        echo '</p>';

        echo '<p class="rtacc-field">';
        echo '<label class="uk-form-label" for="rtacc-function">' . esc_html__('Function / Role', 'rt-event-manager') . '</label>';
        echo '<input type="text" id="rtacc-function" class="uk-input" name="function" value="' . esc_attr($function) . '" />';
        echo '</p>';

        echo '<p class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Save changes', 'rt-event-manager') . '</button>';
        echo '<span class="rtacc-status" id="rtacc-profile-status" aria-live="polite"></span>';
        echo '</p>';

        echo '</form>';
        echo '</section>';
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
        echo '<th>' . esc_html__('Receipt', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($orders as $order) {
            $item_names = array();
            foreach ($order->get_items() as $item) {
                $item_names[] = $item->get_name() . ' × ' . $item->get_quantity();
            }

            $receipt_url = wp_nonce_url(
                add_query_arg(array(
                    'action'   => 'rt_event_manager_receipt',
                    'order_id' => $order->get_id(),
                ), admin_url('admin-ajax.php')),
                'rt_event_manager_receipt_' . $order->get_id(),
                'nonce'
            );

            echo '<tr>';
            echo '<td>#' . esc_html($order->get_order_number()) . '</td>';
            echo '<td>' . esc_html(wc_format_datetime($order->get_date_created())) . '</td>';
            echo '<td>' . esc_html(wc_get_order_status_name($order->get_status())) . '</td>';
            echo '<td>' . esc_html(implode(', ', $item_names)) . '</td>';
            echo '<td>' . wp_kses_post($order->get_formatted_order_total()) . '</td>';
            echo '<td><a class="uk-button uk-button-default uk-button-small" href="' . esc_url($receipt_url) . '" target="_blank" rel="noopener">' . esc_html__('Download PDF', 'rt-event-manager') . '</a></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
    }

    /* ---------------------------------------------------------------------
     * Tab: Event Tickets
     * ------------------------------------------------------------------- */

    private function render_tickets() {
        $user_id = get_current_user_id();
        $tickets = RT_Event_Manager::get_tickets_for_user($user_id);
        $can_edit = RT_Event_Manager::instance()->is_frontend_editing_allowed();

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Event Tickets', 'rt-event-manager') . '</h2>';

        if (!$can_edit) {
            echo '<div class="rtacc-notice uk-alert-warning" uk-alert>' . esc_html__('The ticket editing deadline has passed. Please contact us if you need to make changes.', 'rt-event-manager') . '</div>';
        }

        $own       = array();
        $companion = array();
        foreach ($tickets as $t) {
            if (intval($t['ticket_index']) === 0) {
                $own[] = $t;
            } else {
                $companion[] = $t;
            }
        }

        echo '<form id="rtacc-tickets-form" class="rtacc-form uk-form-stacked">';

        // Section 1: My Ticket
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('My Ticket', 'rt-event-manager') . '</h3>';
        if (empty($own)) {
            echo '<p>' . esc_html__('You do not have a ticket assigned to yourself yet.', 'rt-event-manager') . '</p>';
        } else {
            $this->render_ticket_table($own, $can_edit, false);
        }
        echo '</section>';

        // Section 2: Travelling with me
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Travelling with me', 'rt-event-manager') . '</h3>';
        if (empty($companion)) {
            echo '<p>' . esc_html__('No additional tickets yet.', 'rt-event-manager') . '</p>';
        } else {
            $this->render_ticket_table($companion, $can_edit, true);
        }
        echo '</section>';

        if ($can_edit && (!empty($own) || !empty($companion))) {
            echo '<p class="rtacc-actions">';
            echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Save ticket details', 'rt-event-manager') . '</button>';
            echo '<span class="rtacc-status" id="rtacc-tickets-status" aria-live="polite"></span>';
            echo '</p>';
        }

        echo '</form>';

        // Section 3: Add more tickets
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Add more tickets', 'rt-event-manager') . '</h3>';
        $this->render_ticket_products();
        echo '</section>';
    }

    /**
     * @param array $tickets     Ticket rows.
     * @param bool  $can_edit    Whether the cutoff still allows editing.
     * @param bool  $show_family Whether to show the family selector (companions).
     */
    private function render_ticket_table($tickets, $can_edit, $show_family) {
        $family_options  = RT_Event_Manager::$family_options;
        $dietary_options = RT_Event_Manager::get_dietary_options(true);
        $status_labels   = $this->status_labels();

        echo '<table class="rtacc-table rtacc-tickets uk-table uk-table-divider uk-table-middle uk-table-small">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Product', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Phone', 'rt-event-manager') . '</th>';
        if ($show_family) {
            echo '<th>' . esc_html__('Family', 'rt-event-manager') . '</th>';
        }
        echo '<th>' . esc_html__('Dietary', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($tickets as $t) {
            $id      = absint($t['id']);
            $product = wc_get_product($t['product_id']);
            $pname   = $product ? $product->get_name() : __('(deleted product)', 'rt-event-manager');
            $status  = isset($t['status']) ? $t['status'] : 'draft';
            $phone   = isset($t['phone']) ? $t['phone'] : '';

            echo '<tr data-ticket-id="' . esc_attr($id) . '">';
            echo '<td data-title="' . esc_attr__('Product', 'rt-event-manager') . '">' . esc_html($pname) . '</td>';

            if ($can_edit) {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">';
                echo '<input type="text" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][holder_name]" value="' . esc_attr($t['holder_name']) . '" />';
                echo '</td>';

                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">';
                echo '<input type="tel" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][phone]" value="' . esc_attr($phone) . '" pattern="\+[0-9\s()\-]{7,}" inputmode="tel" placeholder="+41791234567" title="' . esc_attr__('International format, e.g. +41791234567', 'rt-event-manager') . '" />';
                echo '</td>';

                if ($show_family) {
                    echo '<td data-title="' . esc_attr__('Family', 'rt-event-manager') . '">';
                    echo '<select class="rtacc-ticket-field uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][rti_family]">';
                    echo '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
                    foreach ($family_options as $key => $label) {
                        echo '<option value="' . esc_attr($key) . '" ' . selected($t['rti_family'], (string) $key, false) . '>' . esc_html($label) . '</option>';
                    }
                    echo '</select></td>';
                }

                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">';
                echo '<select class="rtacc-ticket-field uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][dietary]">';
                foreach ($dietary_options as $dkey => $dlabel) {
                    echo '<option value="' . esc_attr($dkey) . '" ' . selected($t['dietary'], $dkey, false) . '>' . esc_html($dlabel) . '</option>';
                }
                echo '</select></td>';
            } else {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">' . esc_html($t['holder_name'] ?: '—') . '</td>';
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">' . esc_html($phone ?: '—') . '</td>';
                if ($show_family) {
                    $flabel = ($t['rti_family'] !== '') ? RT_Event_Manager::get_family_label($t['rti_family']) : '—';
                    echo '<td data-title="' . esc_attr__('Family', 'rt-event-manager') . '">' . esc_html($flabel) . '</td>';
                }
                $dlabel = isset($dietary_options[$t['dietary']]) ? $dietary_options[$t['dietary']] : '—';
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">' . esc_html($dlabel) . '</td>';
            }

            echo '<td data-title="' . esc_attr__('Status', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
    }

    /**
     * Grid of purchasable ticket products for the "Add more tickets" section.
     */
    private function render_ticket_products() {
        $product_ids = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'fields'         => 'ids',
            'meta_query'     => array(
                array('key' => '_rti_is_ticket', 'value' => 'yes'),
            ),
        ));

        if (empty($product_ids)) {
            echo '<p>' . esc_html__('No tickets are currently available for purchase.', 'rt-event-manager') . '</p>';
            return;
        }

        echo '<div class="rtacc-products">';
        foreach ($product_ids as $pid) {
            $product = wc_get_product($pid);
            if (!$product || !$product->is_purchasable() || !$product->is_in_stock()) {
                continue;
            }
            $this->render_product_card($product);
        }
        echo '</div>';
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

    private function render_product_card($product) {
        $needs_options = $product->is_type('variable') || $product->is_type('make_to_order');

        echo '<div class="rtacc-product uk-card uk-card-default uk-card-body">';
        echo '<a class="rtacc-product-thumb" href="' . esc_url($product->get_permalink()) . '">' . $product->get_image('woocommerce_thumbnail') . '</a>';
        echo '<h4 class="rtacc-product-title"><a href="' . esc_url($product->get_permalink()) . '">' . esc_html($product->get_name()) . '</a></h4>';
        echo '<div class="rtacc-product-price">' . wp_kses_post($product->get_price_html()) . '</div>';

        if ($needs_options) {
            echo '<a class="uk-button uk-button-default" href="' . esc_url($product->get_permalink()) . '">' . esc_html__('Choose options', 'rt-event-manager') . '</a>';
        } else {
            $add_url = add_query_arg('add-to-cart', $product->get_id(), wc_get_cart_url());
            echo '<a class="uk-button uk-button-default" href="' . esc_url($add_url) . '" data-quantity="1" data-product_id="' . esc_attr($product->get_id()) . '" rel="nofollow">' . esc_html__('Add to cart', 'rt-event-manager') . '</a>';
        }
        echo '</div>';
    }

    /* ---------------------------------------------------------------------
     * Shared small helpers
     * ------------------------------------------------------------------- */

    private function status_labels() {
        return array(
            'valid'      => __('Valid', 'rt-event-manager'),
            'draft'      => __('Draft', 'rt-event-manager'),
            'invalid'    => __('Invalid', 'rt-event-manager'),
            'checked_in' => __('Checked In', 'rt-event-manager'),
        );
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

        if (isset($_POST['emergency_contact'])) {
            update_user_meta($user_id, 'rti_emergency_contact', sanitize_text_field(wp_unslash($_POST['emergency_contact'])));
        }
        if (isset($_POST['function'])) {
            update_user_meta($user_id, 'rti_function', sanitize_text_field(wp_unslash($_POST['function'])));
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
            }
            if (isset($data['rti_family'])) {
                $allowed['rti_family'] = sanitize_text_field($data['rti_family']);
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

        $pdf = RT_Event_Manager_Receipt::instance()->generate_receipt_pdf($order_id);
        if (!$pdf) {
            wp_die(esc_html__('Failed to generate receipt PDF.', 'rt-event-manager'));
        }

        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="receipt-order-' . $order_id . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf;
        exit;
    }
}
