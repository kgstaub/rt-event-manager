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
            'cartUrl'      => wc_get_cart_url(),
            'profileNonce' => wp_create_nonce('rt_event_manager_save_profile'),
            'ticketsNonce' => wp_create_nonce('rt_event_manager_account_save_tickets'),
            'i18n'         => array(
                'saving'      => __('Saving…', 'rt-event-manager'),
                'saved'       => __('Saved!', 'rt-event-manager'),
                'error'       => __('Something went wrong. Please try again.', 'rt-event-manager'),
                'requestFail' => __('Request failed. Please try again.', 'rt-event-manager'),
                'needParent'  => __('Please choose which ticket to attach this to.', 'rt-event-manager'),
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
        $user_id  = get_current_user_id();
        $tickets  = RT_Event_Manager::get_tickets_for_user($user_id);
        $can_edit = RT_Event_Manager::instance()->is_frontend_editing_allowed();
        $by_id    = $this->index_by_id($tickets);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Event Tickets', 'rt-event-manager') . '</h2>';
        $this->maybe_cutoff_notice($can_edit);

        // Classify event tickets; attach minors linked to any event ticket.
        $mine       = array();
        $companions = array();
        $event_ids  = array();
        foreach ($tickets as $t) {
            if ('event' === $this->effective_kind($t)) {
                $event_ids[absint($t['id'])] = true;
                if (intval($t['ticket_index']) === 0) {
                    $mine[] = $t;
                } else {
                    $companions[] = $t;
                }
            }
        }
        $event_parents = array_merge($mine, $companions); // for the minor parent selector
        foreach ($tickets as $t) {
            if ('minor' === $this->effective_kind($t) && isset($event_ids[absint($t['parent_ticket_id'])])) {
                $companions[] = $t;
            }
        }

        $this->render_editable_sections(
            'rtacc-tickets-form',
            $mine, __('My Ticket', 'rt-event-manager'), __('You do not have a ticket assigned to yourself yet.', 'rt-event-manager'),
            $companions, __('Travelling with me', 'rt-event-manager'), __('No additional tickets yet.', 'rt-event-manager'),
            $by_id, $can_edit
        );

        // Add more event tickets (event-kind products only).
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Add more tickets', 'rt-event-manager') . '</h3>';
        $this->render_products_grid($this->get_event_product_ids());
        echo '</section>';

        // Add a Future member (minor) co-traveller attached to an event ticket.
        $this->render_future_add_section($this->ticket_options($event_parents));
    }

    private function render_pretour() {
        $user_id  = get_current_user_id();
        $tickets  = RT_Event_Manager::get_tickets_for_user($user_id);
        $can_edit = RT_Event_Manager::instance()->is_frontend_editing_allowed();
        $by_id    = $this->index_by_id($tickets);

        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Pretour', 'rt-event-manager') . '</h2>';
        $this->maybe_cutoff_notice($can_edit);

        // Event ticket id sets (to decide "mine" vs "travelling with me" for pretour).
        $my_event_ids = array();
        $event_all    = array();
        foreach ($tickets as $t) {
            if ('event' === $this->effective_kind($t)) {
                $event_all[] = $t;
                if (intval($t['ticket_index']) === 0) {
                    $my_event_ids[absint($t['id'])] = true;
                }
            }
        }

        $mine        = array();
        $companions  = array();
        $pretour_ids = array();
        foreach ($tickets as $t) {
            if ('pretour' === $this->effective_kind($t)) {
                $pretour_ids[absint($t['id'])] = true;
                $parent = absint($t['parent_ticket_id']);
                if (!$parent || isset($my_event_ids[$parent])) {
                    $mine[] = $t;
                } else {
                    $companions[] = $t;
                }
            }
        }
        // Minors attached to a pretour ticket travel under "Travelling with me".
        $pretour_parents = array();
        foreach (array_merge($mine, $companions) as $t) {
            $pretour_parents[] = $t;
        }
        foreach ($tickets as $t) {
            if ('minor' === $this->effective_kind($t) && isset($pretour_ids[absint($t['parent_ticket_id'])])) {
                $companions[] = $t;
            }
        }

        $this->render_editable_sections(
            'rtacc-pretour-form',
            $mine, __('My Pretour', 'rt-event-manager'), __('You do not have a pretour ticket yet.', 'rt-event-manager'),
            $companions, __('Travelling with me', 'rt-event-manager'), __('No additional pretour tickets yet.', 'rt-event-manager'),
            $by_id, $can_edit
        );

        // Add a pretour, linked to one of the user's event tickets.
        $this->render_pretour_add_section($this->get_pretour_product_ids(), $this->ticket_options($event_all));

        // Add a Future member (minor) co-traveller attached to a pretour ticket.
        if (!empty($pretour_parents)) {
            $this->render_future_add_section($this->ticket_options($pretour_parents));
        }
    }

    /* ---- Ticket rendering helpers ---- */

    private function index_by_id($tickets) {
        $by_id = array();
        foreach ($tickets as $t) {
            $by_id[absint($t['id'])] = $t;
        }
        return $by_id;
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
            $who     = ($t['holder_name'] !== '') ? $t['holder_name'] : $pname;
            $opts[absint($t['id'])] = sprintf('%s (#%d)', $who, absint($t['id']));
        }
        return $opts;
    }

    /**
     * Render the two editable sections (mine / travelling with me) inside one
     * save form. The form is submitted by account.js (class rtacc-tickets-form).
     */
    private function render_editable_sections($form_id, $mine, $mine_label, $mine_empty, $companions, $comp_label, $comp_empty, $by_id, $can_edit) {
        echo '<form id="' . esc_attr($form_id) . '" class="rtacc-form uk-form-stacked rtacc-tickets-form">';

        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html($mine_label) . '</h3>';
        if (empty($mine)) {
            echo '<p>' . esc_html($mine_empty) . '</p>';
        } else {
            $this->render_ticket_table($mine, $can_edit, $by_id);
        }
        echo '</section>';

        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html($comp_label) . '</h3>';
        if (empty($companions)) {
            echo '<p>' . esc_html($comp_empty) . '</p>';
        } else {
            $this->render_ticket_table($companions, $can_edit, $by_id);
        }
        echo '</section>';

        if ($can_edit && (!empty($mine) || !empty($companions))) {
            echo '<p class="rtacc-actions">';
            echo '<button type="submit" class="uk-button uk-button-primary">' . esc_html__('Save ticket details', 'rt-event-manager') . '</button>';
            echo '<span class="rtacc-status" aria-live="polite"></span>';
            echo '</p>';
        }

        echo '</form>';
    }

    /**
     * Render a ticket table. Rows adapt to their kind: minors have no phone or
     * family and show their gender + parent link; event/pretour rows are fully
     * editable (family only for companions, i.e. ticket_index > 0).
     *
     * @param array $tickets
     * @param bool  $can_edit
     * @param array $by_id     id => ticket, for resolving parent labels.
     */
    private function render_ticket_table($tickets, $can_edit, $by_id) {
        $family_options  = RT_Event_Manager::$family_options;
        $dietary_options = RT_Event_Manager::get_dietary_options(true);
        $status_labels   = $this->status_labels();

        echo '<table class="rtacc-table rtacc-tickets uk-table uk-table-divider uk-table-middle uk-table-small">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Type', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Product', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Phone', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Family', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Dietary', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Linked to', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($tickets as $t) {
            $id        = absint($t['id']);
            $product   = wc_get_product($t['product_id']);
            $pname     = $product ? $product->get_name() : __('(deleted product)', 'rt-event-manager');
            $status    = isset($t['status']) ? $t['status'] : 'draft';
            $phone     = isset($t['phone']) ? $t['phone'] : '';
            $kind       = $this->effective_kind($t);
            $is_minor   = ('minor' === $kind);
            $is_comp    = (intval($t['ticket_index']) > 0);
            $parent_id  = isset($t['parent_ticket_id']) ? absint($t['parent_ticket_id']) : 0;
            $minor_type = isset($t['minor_type']) ? $t['minor_type'] : '';

            $type_label = $kind === 'pretour' ? __('Pretour', 'rt-event-manager') : __('Event', 'rt-event-manager');
            if ($is_minor) {
                $type_label = ('circler' === $minor_type)
                    ? __('Future Circler', 'rt-event-manager')
                    : __('Future Tabler', 'rt-event-manager');
            }

            echo '<tr data-ticket-id="' . esc_attr($id) . '">';
            echo '<td data-title="' . esc_attr__('Type', 'rt-event-manager') . '">' . esc_html($type_label) . '</td>';
            echo '<td data-title="' . esc_attr__('Product', 'rt-event-manager') . '">' . esc_html($pname) . '</td>';

            // Holder name (editable for every kind).
            if ($can_edit) {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '"><input type="text" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][holder_name]" value="' . esc_attr($t['holder_name']) . '" /></td>';
            } else {
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">' . esc_html($t['holder_name'] ?: '—') . '</td>';
            }

            // Phone — minors have none.
            if ($is_minor) {
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">&mdash;</td>';
            } elseif ($can_edit) {
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '"><input type="tel" class="rtacc-ticket-field uk-input uk-form-small" name="tickets[' . esc_attr($id) . '][phone]" value="' . esc_attr($phone) . '" pattern="\+[0-9\s()\-]{7,}" inputmode="tel" placeholder="+41791234567" title="' . esc_attr__('International format, e.g. +41791234567', 'rt-event-manager') . '" /></td>';
            } else {
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">' . esc_html($phone ?: '—') . '</td>';
            }

            // Family — minors have none; editable only for companions.
            if ($is_minor) {
                echo '<td data-title="' . esc_attr__('Family', 'rt-event-manager') . '">&mdash;</td>';
            } elseif ($can_edit && $is_comp) {
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

            // Dietary (editable for every kind).
            if ($can_edit) {
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '"><select class="rtacc-ticket-field uk-select uk-form-small" name="tickets[' . esc_attr($id) . '][dietary]">';
                foreach ($dietary_options as $dkey => $dlabel) {
                    echo '<option value="' . esc_attr($dkey) . '" ' . selected($t['dietary'], $dkey, false) . '>' . esc_html($dlabel) . '</option>';
                }
                echo '</select></td>';
            } else {
                $dlabel = isset($dietary_options[$t['dietary']]) ? $dietary_options[$t['dietary']] : '—';
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">' . esc_html($dlabel) . '</td>';
            }

            // Linked to (parent ticket).
            if ($parent_id && isset($by_id[$parent_id])) {
                $p     = $by_id[$parent_id];
                $plabel = ($p['holder_name'] !== '') ? $p['holder_name'] : ('#' . $parent_id);
                echo '<td data-title="' . esc_attr__('Linked to', 'rt-event-manager') . '">' . esc_html($plabel) . '</td>';
            } elseif ($parent_id) {
                echo '<td data-title="' . esc_attr__('Linked to', 'rt-event-manager') . '">#' . esc_html($parent_id) . '</td>';
            } else {
                echo '<td data-title="' . esc_attr__('Linked to', 'rt-event-manager') . '">&mdash;</td>';
            }

            echo '<td data-title="' . esc_attr__('Status', 'rt-event-manager') . '"><span class="rtacc-badge rtacc-badge--' . esc_attr($status) . '">' . esc_html($status_labels[$status]) . '</span></td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
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
     * Render a grid of directly-purchasable products (add-to-cart).
     *
     * @param array $product_ids
     */
    private function render_products_grid($product_ids) {
        $cards = 0;
        echo '<div class="rtacc-products">';
        foreach ($product_ids as $pid) {
            $product = wc_get_product($pid);
            if (!$product || !$product->is_purchasable() || !$product->is_in_stock()) {
                continue;
            }
            $this->render_product_card($product);
            $cards++;
        }
        echo '</div>';
        if (!$cards) {
            echo '<p>' . esc_html__('Nothing is available for purchase right now.', 'rt-event-manager') . '</p>';
        }
    }

    /**
     * "Add a Future member" control: pick a parent ticket + gender, then add the
     * single Future product to the cart carrying the linkage.
     *
     * @param array $parent_options id => label
     */
    private function render_future_add_section($parent_options) {
        $future_pid = $this->get_future_product_id();

        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Add a Future member (co-traveller)', 'rt-event-manager') . '</h3>';

        if (!$future_pid) {
            echo '<p>' . esc_html__('No Future member ticket product is configured yet.', 'rt-event-manager') . '</p></section>';
            return;
        }
        if (empty($parent_options)) {
            echo '<p>' . esc_html__('You need an existing ticket before you can add a Future member co-traveller.', 'rt-event-manager') . '</p></section>';
            return;
        }

        echo '<p class="rtacc-hint">' . esc_html__('A Future Tabler (boys) or Future Circler (girls) travels with one of your existing tickets.', 'rt-event-manager') . '</p>';
        echo '<div class="rtacc-linked-add rtacc-form uk-form-stacked" data-product="' . esc_attr($future_pid) . '">';

        echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Attach to ticket', 'rt-event-manager') . '</label>';
        echo '<select class="rtacc-add-parent uk-select">';
        foreach ($parent_options as $pid => $label) {
            echo '<option value="' . esc_attr($pid) . '">' . esc_html($label) . '</option>';
        }
        echo '</select></p>';

        echo '<p class="rtacc-field"><label class="uk-form-label">' . esc_html__('Type', 'rt-event-manager') . '</label>';
        echo '<select class="rtacc-add-gender uk-select">';
        echo '<option value="tabler">' . esc_html__('Future Tabler (boys)', 'rt-event-manager') . '</option>';
        echo '<option value="circler">' . esc_html__('Future Circler (girls)', 'rt-event-manager') . '</option>';
        echo '</select></p>';

        echo '<p class="rtacc-actions"><button type="button" class="uk-button uk-button-primary rtacc-add-linked-btn" data-product="' . esc_attr($future_pid) . '" data-needs-gender="1">' . esc_html__('Add co-traveller', 'rt-event-manager') . '</button></p>';
        echo '</div></section>';
    }

    /**
     * "Add a pretour" control: pick a parent event ticket, then add a pretour
     * product carrying the linkage. Products needing options link to their page.
     *
     * @param array $product_ids
     * @param array $parent_options id => label
     */
    private function render_pretour_add_section($product_ids, $parent_options) {
        echo '<section class="rtacc-panel uk-card uk-card-default uk-card-body">';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('Add a pretour', 'rt-event-manager') . '</h3>';

        if (empty($product_ids)) {
            echo '<p>' . esc_html__('No pretour products are available. Set a Pretour category under WooCommerce settings.', 'rt-event-manager') . '</p></section>';
            return;
        }
        if (empty($parent_options)) {
            echo '<p>' . esc_html__('You need an event ticket before you can add a pretour.', 'rt-event-manager') . '</p></section>';
            return;
        }

        echo '<div class="rtacc-linked-add">';
        echo '<p class="rtacc-field rtacc-form uk-form-stacked"><label class="uk-form-label">' . esc_html__('Link pretour to event ticket', 'rt-event-manager') . '</label>';
        echo '<select class="rtacc-add-parent uk-select">';
        foreach ($parent_options as $pid => $label) {
            echo '<option value="' . esc_attr($pid) . '">' . esc_html($label) . '</option>';
        }
        echo '</select></p>';

        echo '<div class="rtacc-products">';
        foreach ($product_ids as $pid) {
            $product = wc_get_product($pid);
            if (!$product || !$product->is_purchasable() || !$product->is_in_stock()) {
                continue;
            }
            $needs_options = $product->is_type('variable') || $product->is_type('make_to_order');

            echo '<div class="rtacc-product uk-card uk-card-default uk-card-body">';
            echo '<a class="rtacc-product-thumb" href="' . esc_url($product->get_permalink()) . '">' . $product->get_image('woocommerce_thumbnail') . '</a>';
            echo '<h4 class="rtacc-product-title">' . esc_html($product->get_name()) . '</h4>';
            echo '<div class="rtacc-product-price">' . wp_kses_post($product->get_price_html()) . '</div>';
            if ($needs_options) {
                echo '<button type="button" class="uk-button uk-button-default uk-button-small rtacc-choose-options-btn" data-url="' . esc_url($product->get_permalink()) . '">' . esc_html__('Choose options', 'rt-event-manager') . '</button>';
            } else {
                echo '<button type="button" class="uk-button uk-button-primary uk-button-small rtacc-add-linked-btn" data-product="' . esc_attr($product->get_id()) . '">' . esc_html__('Add pretour', 'rt-event-manager') . '</button>';
            }
            echo '</div>';
        }
        echo '</div>';
        echo '</div></section>';
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
