<?php
/**
 * Main plugin class — RT Event Manager
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

/**
 * RT_Event_Manager Class (RT Event Manager)
 */
class RT_Event_Manager {

    /**
     * Single instance of the class
     *
     * @var RT_Event_Manager
     */
    protected static $instance = null;

    /**
     * Family organization options
     *
     * @var array
     */
    public static $family_options = array(
        0 => 'Round Table',
        1 => 'Club 41',
        2 => 'Ladies Circle',
        3 => 'Agora Club',
        4 => 'Tangent Club',
        9 => 'Guest/Partner',
    );

    /**
     * Main Instance
     *
     * @return RT_Event_Manager
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Admin user profile fields
        add_action('show_user_profile', array($this, 'add_customer_meta_fields'), 20);
        add_action('edit_user_profile', array($this, 'add_customer_meta_fields'), 20);

        // Save admin user profile fields
        add_action('personal_options_update', array($this, 'save_customer_meta_fields'));
        add_action('edit_user_profile_update', array($this, 'save_customer_meta_fields'));

        // WooCommerce My Account edit fields
        add_action('woocommerce_edit_account_form', array($this, 'add_my_account_fields'));
        add_action('woocommerce_save_account_details', array($this, 'save_my_account_fields'));

        // WooCommerce registration fields
        add_action('woocommerce_register_form', array($this, 'add_registration_fields'));
        add_action('woocommerce_created_customer', array($this, 'save_registration_fields'));

        // Validate registration fields
        add_filter('woocommerce_registration_errors', array($this, 'validate_registration_fields'), 10, 3);

        // WooCommerce checkout fields
        add_filter('woocommerce_checkout_fields', array($this, 'add_checkout_fields'));
        add_action('woocommerce_checkout_update_order_meta', array($this, 'save_checkout_fields'));

        // Admin order billing fields - add editable fields to billing section
        add_filter('woocommerce_admin_billing_fields', array($this, 'add_admin_billing_fields'));

        // Format billing address to include RTI fields
        add_filter('woocommerce_order_formatted_billing_address', array($this, 'add_rti_to_formatted_address'), 10, 2);
        add_filter('woocommerce_formatted_address_replacements', array($this, 'format_rti_address_replacements'), 10, 2);
        add_filter('woocommerce_localisation_address_formats', array($this, 'add_rti_address_format'));

        // Add RTI fields to WooCommerce billing address fields (My Account > Addresses)
        add_filter('woocommerce_billing_fields', array($this, 'add_billing_address_fields'), 20);

        // Load user profile data into billing fields
        add_filter('woocommerce_checkout_get_value', array($this, 'prefill_checkout_fields'), 10, 2);

        // Save billing address fields to user meta
        add_action('woocommerce_customer_save_address', array($this, 'save_billing_address_fields'), 10, 2);

        // Populate RTI fields on My Account > Edit Address page
        add_filter('woocommerce_my_account_edit_address_field_value', array($this, 'populate_address_field_value'), 10, 3);

        // Display family label instead of ID in admin order view
        add_filter('woocommerce_admin_order_preview_get_order_details', array($this, 'add_rti_to_order_preview'), 10, 2);

        // Add columns to users list
        add_filter('manage_users_columns', array($this, 'add_user_columns'));
        add_filter('manage_users_custom_column', array($this, 'show_user_column_content'), 10, 3);

        // Make columns sortable
        add_filter('manage_users_sortable_columns', array($this, 'make_columns_sortable'));

        // Enqueue styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_styles'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_styles'));

        // Add section headers to checkout
        add_action('woocommerce_before_checkout_billing_form', array($this, 'add_checkout_section_headers'));

        // Hide state field via filter
        add_filter('woocommerce_default_address_fields', array($this, 'customize_address_fields'));

        // Product ticket options
        add_action('woocommerce_product_options_general_product_data', array($this, 'add_ticket_product_options'));
        add_action('woocommerce_process_product_meta', array($this, 'save_ticket_product_options'));

        // Ticket holder fields on checkout
        add_action('woocommerce_after_order_notes', array($this, 'add_ticket_holder_fields'));
        add_action('woocommerce_checkout_process', array($this, 'validate_ticket_holder_fields'));

        // Ticket linking: carry the chosen parent ticket (and minor gender) from the
        // add-to-cart request through the cart into the order line item.
        add_filter('woocommerce_add_cart_item_data', array($this, 'capture_link_cart_item_data'), 10, 2);
        add_filter('woocommerce_get_item_data', array($this, 'display_link_cart_item_data'), 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'save_link_order_item_meta'), 10, 4);

        // Future (minor) tickets may only be bought as a co-traveller (parent required)
        // and are hidden from the normal catalog.
        add_filter('woocommerce_add_to_cart_validation', array($this, 'validate_future_add_to_cart'), 10, 3);
        // Re-check tour conflicts at cart/checkout time against the live DB state
        // so a stale cart (e.g. a second browser window) cannot double-book a tour
        // after another order has already claimed the host.
        add_action('woocommerce_check_cart_items', array($this, 'validate_cart_tours_against_db'));
        add_action('woocommerce_check_cart_items', array($this, 'validate_future_needs_adult'));
        add_action('woocommerce_product_query', array($this, 'hide_future_from_catalog'));

        // Carry the linkage through the single-product "choose options" page for
        // variable / MTO tickets: echo the request params as hidden add-to-cart fields.
        add_action('woocommerce_before_add_to_cart_button', array($this, 'inject_link_hidden_fields'));

        // Admin ticket metabox on order page
        add_action('add_meta_boxes', array($this, 'add_tickets_metabox'));

        // AJAX handlers for ticket management
        add_action('wp_ajax_rti_save_tickets', array($this, 'ajax_save_tickets'));
        add_action('wp_ajax_rti_add_ticket', array($this, 'ajax_add_ticket'));
        add_action('wp_ajax_rti_export_tickets_xlsx', array($this, 'ajax_export_tickets_xlsx'));

        // Frontend ticket display on order view (My Account > Orders > View)
        add_action('woocommerce_order_details_after_order_table', array($this, 'render_frontend_tickets'), 10, 1);

        // Frontend AJAX save handler for customers
        add_action('wp_ajax_rti_frontend_save_tickets', array($this, 'ajax_frontend_save_tickets'));

        // Settings live on the RT Event Manager → Settings admin page (see
        // add_admin_menu / render_settings_page), not the WooCommerce settings page.
        add_action('woocommerce_admin_field_rti_datetime', array($this, 'render_datetime_field'));
        add_action('woocommerce_update_option_rti_datetime', array($this, 'save_datetime_field'));

        // Admin side menu — RT Event Manager
        add_action('admin_menu', array($this, 'add_admin_menu'));

        // Update ticket statuses when order status changes
        add_action('woocommerce_order_status_changed', array($this, 'on_order_status_changed'), 10, 4);

        // A full WooCommerce refund confirms any refund request and refunds the
        // tickets. Runs before woocommerce_order_status_changed so the refunded
        // status is set first and preserved by the recalculation.
        add_action('woocommerce_order_status_refunded', array($this, 'on_order_refunded'), 10, 1);

        // Handle order trashed/deleted
        add_action('woocommerce_trash_order', array($this, 'on_order_trashed'));
        add_action('woocommerce_delete_order', array($this, 'on_order_deleted'));
        add_action('trashed_post', array($this, 'on_order_post_trashed'));
        add_action('deleted_post', array($this, 'on_order_post_deleted'));
    }

    /**
     * Enqueue admin styles
     */
    public function enqueue_admin_styles($hook) {
        if ('profile.php' === $hook || 'user-edit.php' === $hook) {
            wp_add_inline_style('common', $this->get_admin_css());
        }

        // Add styles for order edit page
        $screen = get_current_screen();
        if ($screen && in_array($screen->id, array('shop_order', 'woocommerce_page_wc-orders'), true)) {
            wp_add_inline_style('woocommerce_admin_styles', $this->get_order_admin_css());
        }
    }

    /**
     * Enqueue frontend styles
     */
    public function enqueue_frontend_styles() {
        if (is_account_page() || is_checkout()) {
            wp_add_inline_style('woocommerce-general', $this->get_frontend_css());
        }
    }

    /**
     * Get admin CSS
     *
     * @return string
     */
    private function get_admin_css() {
        return '
            .rt-event-manager {
                background: #fff;
                border: 1px solid #c3c4c7;
                border-radius: 4px;
                padding: 20px;
                margin-top: 20px;
            }
            .rt-event-manager h2 {
                margin-top: 0;
                padding-bottom: 10px;
                border-bottom: 1px solid #c3c4c7;
                color: #1d2327;
            }
            .rt-event-manager .form-table th {
                padding-left: 0;
            }
            .rt-event-manager .description {
                font-style: italic;
                color: #646970;
            }
        ';
    }

    /**
     * Get order admin CSS
     *
     * @return string
     */
    private function get_order_admin_css() {
        return '
            .order_data_column .rti-billing-fields {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #e5e5e5;
            }
            .order_data_column .rti-billing-fields h4 {
                margin: 0 0 10px 0;
                color: #23282d;
                font-size: 13px;
            }
            #order_data .order_data_column ._rti_family_field,
            #order_data .order_data_column ._rti_club_field,
            #order_data .order_data_column ._rti_function_field {
                clear: both;
            }
            .rti-tickets-table {
                margin-top: 5px;
            }
            .rti-tickets-table th {
                font-weight: 600;
                white-space: nowrap;
                padding: 8px 6px;
            }
            .rti-tickets-table td {
                padding: 6px;
                vertical-align: middle;
            }
            .rti-tickets-table input[type="text"],
            .rti-tickets-table select {
                min-width: 80px;
            }
            .rti-qr-cell {
                max-width: 180px;
            }
        ';
    }

    /**
     * Get frontend CSS
     *
     * @return string
     */
    private function get_frontend_css() {
        return '
            .wc-rti-fields-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
            }
            .wc-rti-fields-section h3 {
                margin-bottom: 15px;
            }
            .woocommerce-MyAccount-content .wc-rti-fields-section .form-row {
                margin-bottom: 15px;
            }
            /* Section headers */
            h4.wc-checkout-section-header {
                width: 100%;
                margin: 3rem 0 10px 0;
                padding: 10px 0;
                border-bottom: 2px solid #ccc;
                font-size: 1.2em;
                font-weight: 600;
            }
            h4.wc-checkout-section-header:first-child {
                margin-top: 0;
            }
            /* Ticket holder fields */
            #rti-ticket-holders {
                margin-top: 20px;
            }
            #rti-ticket-holders h3 {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #ccc;
            }
            .rti-ticket-section {
                margin-bottom: 40px;
            }
            .rti-ticket-section-title {
                margin: 0 0 15px;
                font-size: 1.1em;
                text-transform: uppercase;
                letter-spacing: 0.04em;
                color: #660b05;
            }
            .rti-field-hint {
                margin: -6px 0 12px;
                font-size: 0.85em;
                color: #777;
            }
            .rti-ticket-holder-group {
                margin-bottom: 20px;
                padding: 15px;
                background: #f9f9f9;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
            }
            .rti-ticket-holder-group h4 {
                margin: 0 0 10px 0;
                font-weight: 600;
            }
            /* Frontend ticket table (order view) */
            .rti-frontend-tickets-section {
                margin-top: 2em;
            }
            .rti-frontend-tickets-section h2 {
                font-size: 1.5em;
                margin-bottom: 0.8em;
            }
            .rti-frontend-tickets-table input[type="text"],
            .rti-frontend-tickets-table select {
                width: 100%;
                min-width: 80px;
                padding: 6px 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            .rti-tickets-cutoff-notice {
                padding: 0.8em 1em;
                margin-bottom: 1em;
                border-radius: 4px;
            }
            .rti-tickets-cutoff-info {
                background: #f0f6fc;
                border-left: 4px solid #2196f3;
            }
            .rti-tickets-cutoff-expired {
                background: #fff9e5;
                border-left: 4px solid #ffb900;
            }
            .rti-tickets-cutoff-notice p {
                margin: 0;
            }
            .rti-frontend-save-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #rti-frontend-tickets-status {
                font-weight: 600;
            }
        ';
    }

    /**
     * Get family label by ID
     *
     * @param int $family_id Family ID
     * @return string
     */
    public static function get_family_label($family_id) {
        $family_id = absint($family_id);
        return isset(self::$family_options[$family_id]) ? self::$family_options[$family_id] : __('Unknown', 'rt-event-manager');
    }

    /**
     * Add ticket options to product editor
     */
    public function add_ticket_product_options() {
        global $post;

        echo '<div class="options_group">';

        woocommerce_wp_checkbox(array(
            'id'          => '_rti_is_ticket',
            'label'       => __('Is Ticket', 'rt-event-manager'),
            'description' => __('Enable ticket holder name fields at checkout for each quantity of this product.', 'rt-event-manager'),
        ));

        woocommerce_wp_checkbox(array(
            'id'          => '_rti_ticket_dietary',
            'label'       => __('Require Dietary Restrictions', 'rt-event-manager'),
            'description' => __('Show a dietary restrictions dropdown for each ticket holder. Only applies when "Is Ticket" is enabled.', 'rt-event-manager'),
        ));

        woocommerce_wp_text_input(array(
            'id'          => '_rti_start',
            'label'       => __('Starts (date & time)', 'rt-event-manager'),
            'type'        => 'datetime-local',
            'desc_tip'    => true,
            'description' => __('When this ticket / tour begins — shown in the customer event calendar.', 'rt-event-manager'),
        ));
        woocommerce_wp_text_input(array(
            'id'          => '_rti_end',
            'label'       => __('Ends (date & time)', 'rt-event-manager'),
            'type'        => 'datetime-local',
            'desc_tip'    => true,
            'description' => __('When this ticket / tour ends — shown in the customer event calendar.', 'rt-event-manager'),
        ));

        echo '</div>';
    }

    /**
     * Save ticket product options
     *
     * @param int $post_id Product ID
     */
    public function save_ticket_product_options($post_id) {
        update_post_meta($post_id, '_rti_is_ticket', isset($_POST['_rti_is_ticket']) ? 'yes' : 'no');
        update_post_meta($post_id, '_rti_ticket_dietary', isset($_POST['_rti_ticket_dietary']) ? 'yes' : 'no');
        update_post_meta($post_id, '_rti_start', sanitize_text_field(wp_unslash($_POST['_rti_start'] ?? '')));
        update_post_meta($post_id, '_rti_end', sanitize_text_field(wp_unslash($_POST['_rti_end'] ?? '')));
    }

    /**
     * Get ticket items from the cart
     *
     * @return array Array of ticket cart items with product info
     */
    private function get_ticket_cart_items() {
        $ticket_items = array();

        if (!WC()->cart) {
            return $ticket_items;
        }

        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            $product_id = $cart_item['product_id'];

            if (self::is_ticket_product($product_id)) {
                $require_dietary = get_post_meta($product_id, '_rti_ticket_dietary', true);
                $ticket_items[] = array(
                    'cart_item_key'   => $cart_item_key,
                    'product_id'      => $product_id,
                    'product_name'    => $cart_item['data']->get_name(),
                    'quantity'        => $cart_item['quantity'],
                    'require_dietary' => 'yes' === $require_dietary,
                    'kind'            => self::get_ticket_kind_for_product($product_id),
                    // A linked co-traveller (added from the account with a parent)
                    // is never the purchaser, even when it is the only ticket in the
                    // order (ticket_index 0).
                    'has_parent'      => !empty($cart_item['rti_parent_ticket_id']),
                    // Details entered in the account "customize ticket" modal
                    // before checkout (holder name, phone, family, etc.).
                    'prefill'         => isset($cart_item['rti_prefill']) && is_array($cart_item['rti_prefill']) ? $cart_item['rti_prefill'] : array(),
                    // Minor gender chosen at add-to-cart (empty when added directly).
                    'minor_gender'    => isset($cart_item['rti_minor_gender']) ? $cart_item['rti_minor_gender'] : '',
                );
            }
        }

        return $ticket_items;
    }

    /**
     * Add ticket holder fields to checkout
     *
     * @param WC_Checkout $checkout Checkout object
     */
    public function add_ticket_holder_fields($checkout) {
        $ticket_items = $this->get_ticket_cart_items();

        if (empty($ticket_items)) {
            return;
        }

        $current_user = wp_get_current_user();
        $default_name = '';
        if ($current_user->ID) {
            $default_name = trim($current_user->first_name . ' ' . $current_user->last_name);
            if (empty($default_name)) {
                $default_name = $current_user->display_name;
            }
        }

        // If the buyer already holds their own event ticket, every ticket in this
        // new order is for someone else — request full details for all of them.
        $buyer_has_ticket = $current_user->ID && self::user_has_own_event_ticket($current_user->ID);

        // Pre-compute a flat list of every ticket slot so a pretour can offer a
        // picker of the event / Future member tickets in this same order to link
        // to (the pretour then inherits that attendee's details).
        $host_options  = array(); // global ticket index => fallback label
        $host_products = array(); // global ticket index => product name
        $event_slots   = array(); // global ticket index => true (adult event slots)
        $slot_idx = 0;
        foreach ($ticket_items as $item) {
            for ($q = 0; $q < $item['quantity']; $q++) {
                if (in_array($item['kind'], array('event', 'minor'), true)) {
                    $host_options[$slot_idx] = sprintf(
                        __('Ticket %d — %s', 'rt-event-manager'),
                        $slot_idx + 1,
                        $item['product_name']
                    );
                    $host_products[$slot_idx] = $item['product_name'];
                }
                if ('event' === $item['kind']) {
                    $event_slots[$slot_idx] = true;
                }
                $slot_idx++;
            }
        }

        // Guardian options for Future member tickets: adult event tickets already
        // on the buyer's account (static labels) plus adult event tickets in this
        // cart (dynamic, live holder names — value is the slot index).
        $guardian_account = array(); // ticket id => holder name
        if ($current_user->ID) {
            foreach (self::get_tickets_for_user($current_user->ID) as $at) {
                if ('event' === self::get_ticket_kind($at)) {
                    $name = ($at['holder_name'] !== '') ? $at['holder_name'] : sprintf(__('Ticket #%d', 'rt-event-manager'), absint($at['id']));
                    $guardian_account[absint($at['id'])] = $name;
                }
            }
        }

        $ticket_index = 0;

        echo '<div id="rti-ticket-holders">';
        echo '<h3>' . esc_html__('Ticket Holders', 'rt-event-manager') . '</h3>';

        // Buffer each ticket's fields and bucket them by kind so they can be shown
        // grouped in sections, while the field index stays tied to the cart slot.
        $sections = array('event' => array(), 'minor' => array(), 'pretour' => array(), 'daytour' => array(), 'other' => array());

        foreach ($ticket_items as $item) {
            for ($i = 0; $i < $item['quantity']; $i++) {
                $ticket_num = $ticket_index + 1;
                $field_prefix = 'rti_ticket_' . $ticket_index;

                ob_start();
                echo '<div class="rti-ticket-holder-group">';
                echo '<h4>' . esc_html(sprintf(
                    __('Ticket %d — %s', 'rt-event-manager'),
                    $ticket_num,
                    $item['product_name']
                )) . '</h4>';

                $is_minor = (isset($item['kind']) && 'minor' === $item['kind']);
                // A ticket is "additional" (for someone other than the purchaser)
                // when it is not the first ticket of the order OR it is a linked
                // co-traveller added from the account.
                $is_additional = ($ticket_index > 0) || !empty($item['has_parent']) || $buyer_has_ticket;
                $prefill = isset($item['prefill']) ? $item['prefill'] : array();

                // A pretour / day tour added from the cart (no explicit parent, not
                // prefilled) is booked for one of the attendees in this same order
                // rather than a new person — offer a picker to choose which one.
                $item_kind = isset($item['kind']) ? $item['kind'] : '';
                $is_cart_tour = in_array($item_kind, array('pretour', 'daytour'), true) && empty($item['has_parent']);

                if (!empty($prefill)) {
                    // Details were entered in the account modal before checkout —
                    // show a read-only summary and pass them through as hidden
                    // fields so the normal save path stores them unchanged.
                    $this->render_prefilled_ticket_fields($field_prefix, $prefill);
                } elseif ($is_cart_tour && !empty($host_options)) {
                    // Link picker: the tour inherits the chosen attendee's name,
                    // phone, family, club and dietary details at checkout.
                    $tour_word = ('daytour' === $item_kind) ? __('day tour', 'rt-event-manager') : __('pretour', 'rt-event-manager');
                    $link_opts = array('' => __('— Select the attendee —', 'rt-event-manager'));
                    foreach ($host_options as $hidx => $hlabel) {
                        $link_opts[$hidx] = $hlabel;
                    }
                    woocommerce_form_field($field_prefix . '_link', array(
                        'type'        => 'select',
                        'label'       => sprintf(__('This %s is for', 'rt-event-manager'), $tour_word),
                        'required'    => true,
                        'class'       => array('form-row-wide'),
                        'options'     => $link_opts,
                    ), '');
                    // Static hint (not the WC field description, which toggles on
                    // focus and shifts the layout).
                    echo '<p class="rti-field-hint">' . esc_html(sprintf(__('Choose which attendee is joining this %s — it uses their name and details.', 'rt-event-manager'), $tour_word)) . '</p>';
                } else {

                $name_value = (!$is_additional && !$is_minor) ? $default_name : '';

                woocommerce_form_field($field_prefix . '_name', array(
                    'type'     => 'text',
                    'label'    => $is_minor ? __('Child\'s Name', 'rt-event-manager') : __('Ticket Holder Name', 'rt-event-manager'),
                    'required' => true,
                    'class'    => array('form-row-wide'),
                ), $name_value);

                // Minors (Future Tabler / Circler) do not require a phone number,
                // but must provide a date of birth for age verification.
                if ($is_minor) {
                    $min_age = self::get_minor_min_age();
                    $max_age = self::get_minor_max_age();
                    $dob_attrs = array();
                    $event_date = self::get_event_date();
                    if ($event_date !== '' && ($ev_ts = strtotime($event_date))) {
                        $dob_attrs['max'] = gmdate('Y-m-d', strtotime('-' . $min_age . ' years', $ev_ts));
                        $dob_attrs['min'] = gmdate('Y-m-d', strtotime('-' . ($max_age + 1) . ' years +1 day', $ev_ts));
                    }
                    woocommerce_form_field($field_prefix . '_dob', array(
                        'type'              => 'date',
                        'label'             => __('Date of Birth', 'rt-event-manager'),
                        'required'          => true,
                        'class'             => array('form-row-wide'),
                        'description'       => sprintf(
                            /* translators: 1: min age, 2: max age */
                            __('Future members must be between %1$d and %2$d years old at the time of the event.', 'rt-event-manager'),
                            $min_age,
                            $max_age
                        ),
                        'custom_attributes' => $dob_attrs,
                    ), '');

                    // Gender/type — only asked here when it wasn't already chosen
                    // when the ticket was added (i.e. added directly from the cart).
                    $item_gender = isset($item['minor_gender']) ? $item['minor_gender'] : '';
                    if ('' === $item_gender) {
                        woocommerce_form_field($field_prefix . '_minor_gender', array(
                            'type'     => 'select',
                            'label'    => __('Type', 'rt-event-manager'),
                            'required' => true,
                            'class'    => array('form-row-wide'),
                            'options'  => array(
                                'tabler'  => __('Future Tabler', 'rt-event-manager'),
                                'circler' => __('Future Circler', 'rt-event-manager'),
                            ),
                        ), '');
                    }

                    // Guardian picker: the accompanying adult, chosen from the
                    // buyer's account event tickets or the adult tickets in this
                    // cart. Only shown when the minor was not already linked to a
                    // guardian when it was added from the account.
                    if (empty($item['has_parent'])) {
                        $g_opts = array('' => __('— Select the guardian —', 'rt-event-manager'));
                        foreach ($guardian_account as $gid => $gname) {
                            $g_opts['acct:' . $gid] = $gname;
                        }
                        foreach ($event_slots as $es => $unused) {
                            if (isset($host_options[$es])) {
                                $g_opts[$es] = $host_options[$es];
                            }
                        }
                        if (count($g_opts) > 1) {
                            woocommerce_form_field($field_prefix . '_guardian', array(
                                'type'        => 'select',
                                'label'       => __('Guardian', 'rt-event-manager'),
                                'required'    => true,
                                'class'       => array('form-row-wide'),
                                'options'     => $g_opts,
                            ), '');
                            echo '<p class="rti-field-hint">' . esc_html__('Choose the accompanying adult (parent / guardian) for this child.', 'rt-event-manager') . '</p>';
                        }
                    }
                } else {
                    woocommerce_form_field($field_prefix . '_phone', array(
                        'type'              => 'tel',
                        'label'             => __('Phone Number', 'rt-event-manager'),
                        'required'          => true,
                        'class'             => array('form-row-wide'),
                        'placeholder'       => __('+41 79 123 45 67', 'rt-event-manager'),
                        'description'       => __('Please use international format, starting with your country code (e.g. +41…).', 'rt-event-manager'),
                        'custom_attributes' => array(
                            'pattern'   => '\+[0-9\s()\-]{7,}',
                            'inputmode' => 'tel',
                            'title'     => __('Enter the number in international format, e.g. +41791234567', 'rt-event-manager'),
                        ),
                    ), '');
                }

                // Additional travellers carry their OWN organization details (they
                // are not the purchaser). The purchaser's own ticket inherits the
                // buyer's family / club / .WORLD ID; minors carry none of these.
                if ($is_additional && !$is_minor) {
                    woocommerce_form_field($field_prefix . '_family', array(
                        'type'     => 'select',
                        'label'    => __('Family Organization', 'rt-event-manager'),
                        'required' => false,
                        'class'    => array('form-row-wide'),
                        'options'  => array('' => __('— Select Organization —', 'rt-event-manager')) + self::$family_options,
                    ), '9');

                    woocommerce_form_field($field_prefix . '_club', array(
                        'type'     => 'text',
                        'label'    => __('Club', 'rt-event-manager'),
                        'required' => false,
                        'class'    => array('form-row-wide'),
                    ), '');

                    // .WORLD ID is not collected on the checkout form (kept as a
                    // hidden field so the save path still receives the key).
                    echo '<input type="hidden" name="' . esc_attr($field_prefix . '_world_id') . '" value="" />';
                }

                if ($item['require_dietary']) {
                    woocommerce_form_field($field_prefix . '_dietary', array(
                        'type'     => 'select',
                        'label'    => __('Dietary Restrictions', 'rt-event-manager'),
                        'required' => true,
                        'class'    => array('form-row-wide', 'rti-dietary-select'),
                        'options'  => self::get_dietary_options(false),
                    ), '');

                    // Conditional allergy details field (shown only when "Allergies"
                    // is selected), with admin-maintained type-ahead suggestions.
                    $allergy_suggestions = self::get_allergy_suggestions();
                    $list_id = $field_prefix . '_allergy_list';
                    echo '<p class="form-row form-row-wide rti-allergy-field" id="' . esc_attr($field_prefix) . '_allergy_field" style="display:none;">';
                    echo '<label for="' . esc_attr($field_prefix) . '_allergy">' . esc_html__('Please specify the allergies', 'rt-event-manager') . '&nbsp;<abbr class="required" title="required">*</abbr></label>';
                    echo '<span class="woocommerce-input-wrapper">';
                    echo '<input type="text" class="input-text" id="' . esc_attr($field_prefix) . '_allergy" name="' . esc_attr($field_prefix) . '_allergy" value="" list="' . esc_attr($list_id) . '" placeholder="' . esc_attr__('Select or specify allergies', 'rt-event-manager') . '" autocomplete="off" />';
                    if (!empty($allergy_suggestions)) {
                        echo '<datalist id="' . esc_attr($list_id) . '">';
                        foreach ($allergy_suggestions as $s) {
                            echo '<option value="' . esc_attr($s) . '"></option>';
                        }
                        echo '</datalist>';
                    }
                    echo '</span></p>';
                }

                } // end visible-fields branch

                // Hidden field mapping this ticket index to its product ID
                echo '<input type="hidden" name="rti_ticket_product_map[' . esc_attr($ticket_index) . ']" value="' . esc_attr($item['product_id']) . '" />';

                echo '</div>';

                $bucket = in_array($item['kind'], array('event', 'minor', 'pretour', 'daytour'), true) ? $item['kind'] : 'other';
                $sections[$bucket][] = ob_get_clean();

                $ticket_index++;
            }
        }

        // Emit the buffered tickets grouped into labelled sections.
        $section_labels = array(
            'event'   => __('Event Tickets', 'rt-event-manager'),
            'minor'   => __('Future Tablers / Future Circlers', 'rt-event-manager'),
            'pretour' => __('Pretours', 'rt-event-manager'),
            'daytour' => __('Day Tours', 'rt-event-manager'),
            'other'   => __('Other', 'rt-event-manager'),
        );
        foreach ($section_labels as $bucket => $label) {
            if (empty($sections[$bucket])) {
                continue;
            }
            echo '<section class="rti-ticket-section">';
            echo '<h4 class="rti-ticket-section-title">' . esc_html($label) . '</h4>';
            echo implode('', $sections[$bucket]); // phpcs:ignore — already-escaped buffered markup
            echo '</section>';
        }

        // Hidden field to track total ticket count
        echo '<input type="hidden" name="rti_ticket_count" value="' . esc_attr($ticket_index) . '" />';

        // Toggle each ticket's allergy-details field based on its dietary select,
        // and keep the "This tour is for" pickers labelled with the live holder
        // names entered above (falling back to "Ticket N — Product").
        ?>
        <script type="text/javascript">
        (function () {
            function toggleAllergy(sel) {
                var prefix = sel.name.replace(/_dietary$/, '');
                var field  = document.getElementById(prefix + '_allergy_field');
                if (field) { field.style.display = (sel.value === 'allergies') ? '' : 'none'; }
            }
            var selects = document.querySelectorAll('#rti-ticket-holders select[name$="_dietary"]');
            selects.forEach(function (sel) {
                toggleAllergy(sel);
                sel.addEventListener('change', function () { toggleAllergy(sel); });
            });

            var products  = <?php echo wp_json_encode($host_products); ?>;
            var fallbacks = <?php echo wp_json_encode($host_options); ?>;
            function holderName(idx) {
                var el = document.getElementById('rti_ticket_' + idx + '_name');
                return el ? el.value.trim() : '';
            }
            function refreshPickers() {
                var links = document.querySelectorAll('#rti-ticket-holders select[name$="_link"], #rti-ticket-holders select[name$="_guardian"]');
                links.forEach(function (sel) {
                    Array.prototype.forEach.call(sel.options, function (opt) {
                        // Only the cart-slot options (numeric value) track a live
                        // holder name; blank and account (acct:*) options stay put.
                        if (!/^\d+$/.test(opt.value)) { return; }
                        var name = holderName(opt.value);
                        if (name !== '') {
                            var product = products[opt.value] ? ' — ' + products[opt.value] : '';
                            opt.textContent = name + product;
                        } else if (fallbacks[opt.value]) {
                            opt.textContent = fallbacks[opt.value];
                        }
                    });
                });
            }
            document.addEventListener('input', function (e) {
                if (e.target && /^rti_ticket_\d+_name$/.test(e.target.id || '')) { refreshPickers(); }
            });
            refreshPickers();
        })();
        </script>
        <?php

        echo '</div>';
    }

    /**
     * Render a prefilled ticket (details entered in the account modal) as a
     * read-only summary plus hidden inputs, so the standard checkout save path
     * stores them without the buyer re-entering anything.
     *
     * @param string $field_prefix e.g. rti_ticket_0
     * @param array  $prefill      name/phone/family/club/world_id/dietary/allergy/dob
     */
    private function render_prefilled_ticket_fields($field_prefix, $prefill) {
        $val = function ($k) use ($prefill) {
            return isset($prefill[$k]) ? $prefill[$k] : '';
        };

        $summary_bits = array_filter(array($val('name'), $val('phone')));
        echo '<p class="rti-prefilled-summary">' . esc_html(implode(' — ', $summary_bits)) . ' <em>(' . esc_html__('details entered', 'rt-event-manager') . ')</em></p>';

        // Marker so checkout validation skips this ticket — it was already
        // validated when it was added from the account.
        echo '<input type="hidden" name="' . esc_attr($field_prefix . '_prefilled') . '" value="1" />';

        foreach (array('name', 'phone', 'family', 'club', 'world_id', 'dietary', 'allergy', 'dob') as $key) {
            echo '<input type="hidden" name="' . esc_attr($field_prefix . '_' . $key) . '" value="' . esc_attr($val($key)) . '" />';
        }
    }

    /**
     * Validate ticket holder fields
     */
    public function validate_ticket_holder_fields() {
        $ticket_count = isset($_POST['rti_ticket_count']) ? absint($_POST['rti_ticket_count']) : 0;

        $product_map = isset($_POST['rti_ticket_product_map']) ? array_map('absint', (array) $_POST['rti_ticket_product_map']) : array();

        for ($i = 0; $i < $ticket_count; $i++) {
            $field_prefix = 'rti_ticket_' . $i;
            $name_key = $field_prefix . '_name';
            $phone_key = $field_prefix . '_phone';

            // Prefilled tickets (added and validated from the account) are not
            // re-validated at checkout.
            if (!empty($_POST[$field_prefix . '_prefilled'])) {
                continue;
            }

            // A cart pretour uses the "This pretour is for" picker instead of its
            // own holder fields — just require that an attendee was chosen.
            if (isset($_POST[$field_prefix . '_link'])) {
                $link = wp_unslash($_POST[$field_prefix . '_link']);
                if ('' === trim((string) $link) || !is_numeric($link)) {
                    wc_add_notice(sprintf(
                        __('Please choose which attendee Ticket %d is for.', 'rt-event-manager'),
                        $i + 1
                    ), 'error');
                }
                continue;
            }

            if (empty($_POST[$name_key])) {
                wc_add_notice(sprintf(
                    __('Please enter the name for Ticket %d.', 'rt-event-manager'),
                    $i + 1
                ), 'error');
            }

            // If dietary is "Allergies", the details are required (applies to any
            // ticket kind, including minors).
            $dietary_val = isset($_POST[$field_prefix . '_dietary']) ? sanitize_text_field(wp_unslash($_POST[$field_prefix . '_dietary'])) : '';
            if ('allergies' === $dietary_val && trim((string) ($_POST[$field_prefix . '_allergy'] ?? '')) === '') {
                wc_add_notice(sprintf(
                    __('Please specify the allergies for Ticket %d.', 'rt-event-manager'),
                    $i + 1
                ), 'error');
            }

            // Minors (Future Tabler / Circler) are exempt from the phone
            // requirement but must provide a date of birth within the age range.
            $pid = isset($product_map[$i]) ? $product_map[$i] : 0;
            if ($pid && 'minor' === self::get_ticket_kind_for_product($pid)) {
                $dob_raw = isset($_POST[$field_prefix . '_dob']) ? wp_unslash($_POST[$field_prefix . '_dob']) : '';
                if (trim($dob_raw) === '') {
                    wc_add_notice(sprintf(
                        __('Please enter the date of birth for Ticket %d.', 'rt-event-manager'),
                        $i + 1
                    ), 'error');
                } elseif (!self::is_valid_minor_dob($dob_raw)) {
                    wc_add_notice(sprintf(
                        /* translators: 1: ticket number, 2: min age, 3: max age */
                        __('Ticket %1$d: Future members must be between %2$d and %3$d years old at the time of the event.', 'rt-event-manager'),
                        $i + 1,
                        self::get_minor_min_age(),
                        self::get_minor_max_age()
                    ), 'error');
                }
                // When the type/gender is asked on the form (added directly), it
                // must be chosen.
                if (isset($_POST[$field_prefix . '_minor_gender'])) {
                    $g = sanitize_key(wp_unslash($_POST[$field_prefix . '_minor_gender']));
                    if (!in_array($g, array('tabler', 'circler'), true)) {
                        wc_add_notice(sprintf(
                            __('Please choose the type for Ticket %d.', 'rt-event-manager'),
                            $i + 1
                        ), 'error');
                    }
                }
                // When the guardian picker is shown, one must be chosen.
                if (isset($_POST[$field_prefix . '_guardian']) && '' === trim((string) wp_unslash($_POST[$field_prefix . '_guardian']))) {
                    wc_add_notice(sprintf(
                        __('Please choose the guardian for Ticket %d.', 'rt-event-manager'),
                        $i + 1
                    ), 'error');
                }
                continue;
            }

            $phone_raw = isset($_POST[$phone_key]) ? wp_unslash($_POST[$phone_key]) : '';
            if (trim($phone_raw) === '') {
                wc_add_notice(sprintf(
                    __('Please enter the phone number for Ticket %d.', 'rt-event-manager'),
                    $i + 1
                ), 'error');
            } elseif (!self::is_valid_intl_phone($phone_raw)) {
                wc_add_notice(sprintf(
                    __('Please enter the phone number for Ticket %d in international format, e.g. +41791234567.', 'rt-event-manager'),
                    $i + 1
                ), 'error');
            }
        }

        // Validate the "This pretour is for" picker selections (one tour per
        // attendee; a Future member's tour must match their guardian's).
        $this->validate_pretour_assignments();
    }

    /**
     * Validate pretour picker selections at checkout:
     *  - an attendee may be assigned at most one tour (no double-booking), and
     *  - a Future member may only join the same tour as their guardian.
     */
    private function validate_pretour_assignments() {
        $ticket_count = isset($_POST['rti_ticket_count']) ? absint($_POST['rti_ticket_count']) : 0;
        if ($ticket_count < 1) {
            return;
        }
        $product_map = isset($_POST['rti_ticket_product_map']) ? array_map('absint', (array) $_POST['rti_ticket_product_map']) : array();

        // Kind per ticket index and the guardian (first event ticket in the order).
        $kind           = array();
        $guardian_index = -1;
        for ($i = 0; $i < $ticket_count; $i++) {
            $pid       = isset($product_map[$i]) ? $product_map[$i] : 0;
            $kind[$i]  = $pid ? self::get_ticket_kind_for_product($pid) : 'event';
            if ($guardian_index < 0 && 'event' === $kind[$i]) {
                $guardian_index = $i;
            }
        }

        // Collect picker selections per tour kind: kind => host index => products.
        // Pretours and day tours are tracked separately (a host may have one of
        // each).
        $assign = array();
        for ($i = 0; $i < $ticket_count; $i++) {
            $tk = isset($kind[$i]) ? $kind[$i] : '';
            if (!in_array($tk, array('pretour', 'daytour'), true) || !isset($_POST['rti_ticket_' . $i . '_link'])) {
                continue;
            }
            $raw = wp_unslash($_POST['rti_ticket_' . $i . '_link']);
            if ('' === trim((string) $raw) || !is_numeric($raw)) {
                continue; // emptiness is reported by the required-field check
            }
            $host = absint($raw);
            if ($host === $i || !isset($kind[$host])) {
                continue;
            }
            if (!in_array($kind[$host], array('event', 'minor'), true)) {
                wc_add_notice(sprintf(
                    __('Ticket %d cannot be assigned to that attendee.', 'rt-event-manager'),
                    $i + 1
                ), 'error');
                continue;
            }
            $assign[$tk][$host][] = isset($product_map[$i]) ? absint($product_map[$i]) : 0;
        }

        // Pretours: one per attendee. Day tours: several are allowed per attendee
        // as long as their times do not overlap.
        foreach ($assign as $tk => $hosts) {
            foreach ($hosts as $host => $products) {
                if ('pretour' === $tk) {
                    if (count($products) > 1) {
                        wc_add_notice(sprintf(
                            __('%s can join only one pretour. Please assign the other pretour to a different attendee.', 'rt-event-manager'),
                            $this->attendee_label_from_post($host)
                        ), 'error');
                    }
                    continue;
                }
                // Day tours — flag only genuinely overlapping selections.
                $count = count($products);
                $clash = false;
                for ($a = 0; $a < $count && !$clash; $a++) {
                    for ($b = $a + 1; $b < $count; $b++) {
                        if (self::daytours_conflict($products[$a], $products[$b])) {
                            $clash = true;
                            break;
                        }
                    }
                }
                if ($clash) {
                    wc_add_notice(sprintf(
                        __('%s has overlapping day tours. Day tours for the same person must not overlap in time — choose day tours at different times, or assign one to a different attendee.', 'rt-event-manager'),
                        $this->attendee_label_from_post($host)
                    ), 'error');
                }
            }
        }

        // A Future member's tour must match one their CHOSEN guardian is also on.
        // The guardian is taken from that minor's guardian picker — either another
        // attendee in this cart or an event ticket already on the account.
        foreach ($assign as $tk => $hostmap) {
            $tour_word = ('daytour' === $tk) ? __('day tour', 'rt-event-manager') : __('pretour', 'rt-event-manager');
            foreach ($hostmap as $host => $products) {
                if ('minor' !== $kind[$host]) {
                    continue;
                }
                $guardian_products = $this->guardian_tour_products($host, $tk, $assign);
                foreach ($products as $p) {
                    if (!in_array($p, $guardian_products, true)) {
                        wc_add_notice(sprintf(
                            /* translators: 1: attendee name, 2: pretour / day tour */
                            __('%1$s can only join the same %2$s as their guardian. Please also add that %2$s for their guardian.', 'rt-event-manager'),
                            $this->attendee_label_from_post($host),
                            $tour_word
                        ), 'error');
                        break;
                    }
                }
            }
        }
    }

    /**
     * The tour products (of a kind) the chosen guardian of a Future member is on.
     * The guardian comes from that minor's guardian picker: a cart attendee slot
     * (its tours assigned in this same cart) or an account event ticket (its tours
     * already stored in the database).
     *
     * @param int    $minor_slot Checkout ticket index of the Future member.
     * @param string $kind       'pretour' | 'daytour'
     * @param array  $assign     kind => host slot => product ids assigned this cart.
     * @return int[] Guardian's tour product ids.
     */
    private function guardian_tour_products($minor_slot, $kind, $assign) {
        $raw = isset($_POST['rti_ticket_' . $minor_slot . '_guardian'])
            ? sanitize_text_field(wp_unslash($_POST['rti_ticket_' . $minor_slot . '_guardian']))
            : '';
        if (is_numeric($raw)) {
            $g = absint($raw);
            return isset($assign[$kind][$g]) ? $assign[$kind][$g] : array();
        }
        if (0 === strpos($raw, 'acct:')) {
            $gid = absint(substr($raw, 5));
            $out = array();
            if ($gid) {
                foreach (self::get_child_tours($gid, $kind) as $ch) {
                    $out[] = absint($ch['product_id']);
                }
            }
            return $out;
        }
        return array();
    }

    /**
     * Human label for the attendee at a given checkout ticket index — their typed
     * name if present, otherwise the ticket number.
     *
     * @param int $index
     * @return string
     */
    private function attendee_label_from_post($index) {
        $name = isset($_POST['rti_ticket_' . $index . '_name']) ? sanitize_text_field(wp_unslash($_POST['rti_ticket_' . $index . '_name'])) : '';
        return ('' !== trim($name)) ? $name : sprintf(__('Ticket %d', 'rt-event-manager'), absint($index) + 1);
    }

    /**
     * Customize default address fields - remove state
     *
     * @param array $fields Address fields
     * @return array
     */
    public function customize_address_fields($fields) {
        // Completely remove state field
        unset($fields['state']);
        return $fields;
    }

    /**
     * Add section headers to checkout form via JavaScript
     */
    public function add_checkout_section_headers() {
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            // Wait for checkout to be fully loaded
            $(document.body).on('updated_checkout init_checkout', function() {
                addSectionHeaders();
            });

            // Also run on page load
            addSectionHeaders();

            function addSectionHeaders() {
                var $billingForm = $('.woocommerce-billing-fields__field-wrapper');

                // Remove existing headers to prevent duplicates
                $billingForm.find('.wc-checkout-section-header').remove();

                // Section: Attendee - before first_name
                var $firstName = $billingForm.find('#billing_first_name_field');
                if ($firstName.length && !$firstName.prev('.wc-checkout-section-header').length) {
                    $firstName.before('<h4 class="wc-checkout-section-header"><?php echo esc_js(__('Purchased by', 'rt-event-manager')); ?></h4>');
                }

                // Section: Billing Address - before address_1
                var $address1 = $billingForm.find('#billing_address_1_field');
                if ($address1.length && !$address1.prev('.wc-checkout-section-header').length) {
                    $address1.before('<h4 class="wc-checkout-section-header"><?php echo esc_js(__('Billing Address', 'rt-event-manager')); ?></h4>');
                }
            }
        });
        </script>
        <?php
    }

    /**
     * Add custom fields to admin user profile
     * Note: Hidden - RTI fields are managed via WooCommerce My Account
     *
     * @param WP_User $user User object
     */
    public function add_customer_meta_fields($user) {
        // RTI Organization Details and Additional Information blocks are hidden from backend user profile
        // These fields are managed through WooCommerce My Account pages
    }

    /**
     * Save custom fields from admin user profile
     *
     * @param int $user_id User ID
     */
    public function save_customer_meta_fields($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return;
        }

        // Verify nonce (WordPress handles this for profile updates)
        if (isset($_POST['rti_family'])) {
            update_user_meta($user_id, 'rti_family', sanitize_text_field($_POST['rti_family']));
        }

        if (isset($_POST['rti_club'])) {
            update_user_meta($user_id, 'rti_club', sanitize_text_field($_POST['rti_club']));
        }

        if (isset($_POST['rti_function'])) {
            update_user_meta($user_id, 'rti_function', sanitize_text_field($_POST['rti_function']));
        }

        if (isset($_POST['rti_world_id'])) {
            update_user_meta($user_id, 'world_id', sanitize_text_field($_POST['rti_world_id']));
        }

        if (isset($_POST['rti_emergency_contact'])) {
            update_user_meta($user_id, 'rti_emergency_contact', sanitize_text_field($_POST['rti_emergency_contact']));
        }
    }

    /**
     * Add fields to WooCommerce My Account page
     */
    public function add_my_account_fields() {
        $user_id = get_current_user_id();
        $family = get_user_meta($user_id, 'rti_family', true);
        $club = get_user_meta($user_id, 'rti_club', true);
        $function = get_user_meta($user_id, 'rti_function', true);
        $world_id = get_user_meta($user_id, 'world_id', true);
        $emergency_contact = get_user_meta($user_id, 'rti_emergency_contact', true);
        ?>
        <div class="wc-rti-fields-section">
            <h3><?php esc_html_e('Organization Details', 'rt-event-manager'); ?></h3>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_family"><?php esc_html_e('Family Organization', 'rt-event-manager'); ?></label>
                <select name="rti_family" id="rti_family" class="woocommerce-Input woocommerce-Input--select input-select">
                    <option value=""><?php esc_html_e('— Select Organization —', 'rt-event-manager'); ?></option>
                    <?php foreach (self::$family_options as $key => $label) : ?>
                        <option value="<?php echo esc_attr($key); ?>" <?php selected($family, (string) $key); ?>>
                            <?php echo esc_html($label); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </p>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_club"><?php esc_html_e('Club', 'rt-event-manager'); ?></label>
                <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_club" id="rti_club" value="<?php echo esc_attr($club); ?>" placeholder="<?php esc_attr_e('e.g., 123 - Example City', 'rt-event-manager'); ?>" />
            </p>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_function"><?php esc_html_e('Function / Role', 'rt-event-manager'); ?></label>
                <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_function" id="rti_function" value="<?php echo esc_attr($function); ?>" />
            </p>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_world_id"><?php esc_html_e('.WORLD ID', 'rt-event-manager'); ?></label>
                <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_world_id" id="rti_world_id" value="<?php echo esc_attr($world_id); ?>" />
            </p>

            <div class="clear"></div>
        </div>

        <div class="wc-rti-fields-section">
            <h3><?php esc_html_e('Additional Information', 'rt-event-manager'); ?></h3>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_emergency_contact"><?php esc_html_e('Emergency Contact', 'rt-event-manager'); ?></label>
                <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_emergency_contact" id="rti_emergency_contact" value="<?php echo esc_attr($emergency_contact); ?>" placeholder="<?php esc_attr_e('Name, Phone, Email', 'rt-event-manager'); ?>" />
            </p>

            <div class="clear"></div>
        </div>
        <?php
    }

    /**
     * Save fields from WooCommerce My Account page
     *
     * @param int $user_id User ID
     */
    public function save_my_account_fields($user_id) {
        if (isset($_POST['rti_family'])) {
            update_user_meta($user_id, 'rti_family', sanitize_text_field($_POST['rti_family']));
        }

        if (isset($_POST['rti_club'])) {
            update_user_meta($user_id, 'rti_club', sanitize_text_field($_POST['rti_club']));
        }

        if (isset($_POST['rti_function'])) {
            update_user_meta($user_id, 'rti_function', sanitize_text_field($_POST['rti_function']));
        }

        if (isset($_POST['rti_world_id'])) {
            update_user_meta($user_id, 'world_id', sanitize_text_field($_POST['rti_world_id']));
        }

        if (isset($_POST['rti_emergency_contact'])) {
            update_user_meta($user_id, 'rti_emergency_contact', sanitize_text_field($_POST['rti_emergency_contact']));
        }
    }

    /**
     * Add fields to WooCommerce registration form
     */
    public function add_registration_fields() {
        ?>
        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label for="reg_rti_family"><?php esc_html_e('Family Organization', 'rt-event-manager'); ?></label>
            <select name="rti_family" id="reg_rti_family" class="woocommerce-Input woocommerce-Input--select input-select">
                <option value=""><?php esc_html_e('— Select Organization —', 'rt-event-manager'); ?></option>
                <?php foreach (self::$family_options as $key => $label) : ?>
                    <option value="<?php echo esc_attr($key); ?>" <?php selected(isset($_POST['rti_family']) ? $_POST['rti_family'] : '', (string) $key); ?>>
                        <?php echo esc_html($label); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>

        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label for="reg_rti_club"><?php esc_html_e('Club', 'rt-event-manager'); ?></label>
            <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_club" id="reg_rti_club" value="<?php echo isset($_POST['rti_club']) ? esc_attr($_POST['rti_club']) : ''; ?>" placeholder="<?php esc_attr_e('e.g., 123 - Example City', 'rt-event-manager'); ?>" />
        </p>

        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label for="reg_rti_function"><?php esc_html_e('Function / Role', 'rt-event-manager'); ?></label>
            <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_function" id="reg_rti_function" value="<?php echo isset($_POST['rti_function']) ? esc_attr($_POST['rti_function']) : ''; ?>" />
        </p>

        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label for="reg_rti_world_id"><?php esc_html_e('.WORLD ID', 'rt-event-manager'); ?></label>
            <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="rti_world_id" id="reg_rti_world_id" value="<?php echo isset($_POST['rti_world_id']) ? esc_attr($_POST['rti_world_id']) : ''; ?>" />
        </p>
        <?php
    }

    /**
     * Validate registration fields
     *
     * @param WP_Error $validation_errors Validation errors
     * @param string   $username Username
     * @param string   $email Email
     * @return WP_Error
     */
    public function validate_registration_fields($validation_errors, $username, $email) {
        // Add validation if needed (fields are optional by default)
        // Example: Make family required
        // if (isset($_POST['rti_family']) && empty($_POST['rti_family'])) {
        //     $validation_errors->add('rti_family_error', __('Please select your family organization.', 'rt-event-manager'));
        // }

        return $validation_errors;
    }

    /**
     * Save registration fields
     *
     * @param int $customer_id Customer ID
     */
    public function save_registration_fields($customer_id) {
        if (isset($_POST['rti_family'])) {
            update_user_meta($customer_id, 'rti_family', sanitize_text_field($_POST['rti_family']));
        }

        if (isset($_POST['rti_club'])) {
            update_user_meta($customer_id, 'rti_club', sanitize_text_field($_POST['rti_club']));
        }

        if (isset($_POST['rti_function'])) {
            update_user_meta($customer_id, 'rti_function', sanitize_text_field($_POST['rti_function']));
        }

        if (isset($_POST['rti_world_id'])) {
            update_user_meta($customer_id, 'world_id', sanitize_text_field($_POST['rti_world_id']));
        }
    }

    /**
     * Add RTI fields to WooCommerce billing address fields (used in My Account > Addresses)
     *
     * @param array $fields Billing fields
     * @return array
     */
    public function add_billing_address_fields($fields) {
        // Completely remove state field
        unset($fields['billing_state']);

        // Get current user ID for default values
        $user_id = get_current_user_id();

        // ===========================================
        // Section: Attendee (priority 10-17)
        // ===========================================

        // 1-2. Name fields
        if (isset($fields['billing_first_name'])) {
            $fields['billing_first_name']['priority'] = 10;
        }
        if (isset($fields['billing_last_name'])) {
            $fields['billing_last_name']['priority'] = 11;
        }

        // 3. Family Organization
        $fields['billing_rti_family'] = array(
            'type'        => 'select',
            'label'       => __('Family Organization', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 12,
            'options'     => array('' => __('— Select Organization —', 'rt-event-manager')) + self::$family_options,
            'default'     => $user_id ? get_user_meta($user_id, 'rti_family', true) : '',
        );

        // 4. Club
        $fields['billing_rti_club'] = array(
            'type'        => 'text',
            'label'       => __('Club', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 13,
            'placeholder' => __('e.g., 123 - Example City', 'rt-event-manager'),
            'default'     => $user_id ? get_user_meta($user_id, 'rti_club', true) : '',
        );

        // 5. Country (after Club in Attendee section)
        if (isset($fields['billing_country'])) {
            $fields['billing_country']['priority'] = 14;
        }

        // 6. Function / Role
        $fields['billing_rti_function'] = array(
            'type'        => 'text',
            'label'       => __('Function / Role', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 15,
            'default'     => $user_id ? get_user_meta($user_id, 'rti_function', true) : '',
        );

        // 7. .WORLD ID (only on My Account address page, not on checkout)
        if (!is_checkout()) {
            $fields['billing_rti_world_id'] = array(
                'type'        => 'text',
                'label'       => __('.WORLD ID', 'rt-event-manager'),
                'required'    => false,
                'class'       => array('form-row-wide'),
                'priority'    => 16,
                'default'     => $user_id ? get_user_meta($user_id, 'world_id', true) : '',
            );
        }

        // 8. Email (in Attendee section)
        if (isset($fields['billing_email'])) {
            $fields['billing_email']['priority'] = 17;
        }

        // 9. Phone (in Attendee section)
        if (isset($fields['billing_phone'])) {
            $fields['billing_phone']['priority'] = 18;
        }

        // ===========================================
        // Section: Billing Address (priority 30-34)
        // ===========================================

        // 1. Street 1
        if (isset($fields['billing_address_1'])) {
            $fields['billing_address_1']['priority'] = 30;
        }

        // 2. Street 2
        if (isset($fields['billing_address_2'])) {
            $fields['billing_address_2']['priority'] = 31;
        }

        // 3. Postal Code
        if (isset($fields['billing_postcode'])) {
            $fields['billing_postcode']['priority'] = 32;
            $fields['billing_postcode']['class'] = array('form-row-first');
        }

        // 4. City
        if (isset($fields['billing_city'])) {
            $fields['billing_city']['priority'] = 33;
            $fields['billing_city']['class'] = array('form-row-last');
        }

        // Company field at the end
        if (isset($fields['billing_company'])) {
            $fields['billing_company']['priority'] = 40;
        }

        return $fields;
    }

    /**
     * Prefill checkout fields with user profile data
     *
     * @param mixed  $value Current value
     * @param string $input Field name
     * @return mixed
     */
    public function prefill_checkout_fields($value, $input) {
        $user_id = get_current_user_id();

        if (!$user_id) {
            return $value;
        }

        // Map checkout field names to user meta keys
        $field_map = array(
            'billing_rti_family'            => 'rti_family',
            'billing_rti_club'              => 'rti_club',
            'billing_rti_function'          => 'rti_function',
        );

        if (isset($field_map[$input])) {
            $meta_value = get_user_meta($user_id, $field_map[$input], true);
            if (!empty($meta_value) || $meta_value === '0') {
                return $meta_value;
            }
        }

        return $value;
    }

    /**
     * Save billing address fields to user meta
     *
     * @param int    $user_id User ID
     * @param string $address_type Address type (billing or shipping)
     */
    public function save_billing_address_fields($user_id, $address_type) {
        if ('billing' !== $address_type) {
            return;
        }

        // Only save the RTI fields that are in the billing address form
        $fields = array(
            'billing_rti_family'   => 'rti_family',
            'billing_rti_club'     => 'rti_club',
            'billing_rti_function' => 'rti_function',
            'billing_rti_world_id' => 'world_id',
        );

        foreach ($fields as $post_key => $meta_key) {
            if (isset($_POST[$post_key])) {
                update_user_meta($user_id, $meta_key, sanitize_text_field($_POST[$post_key]));
            }
        }
    }

    /**
     * Populate RTI field values on My Account > Edit Address page
     *
     * @param mixed  $value Current field value
     * @param string $key Field key
     * @param string $load_address Address type being loaded
     * @return mixed
     */
    public function populate_address_field_value($value, $key, $load_address) {
        // Only handle billing address
        if ('billing' !== $load_address) {
            return $value;
        }

        $user_id = get_current_user_id();
        if (!$user_id) {
            return $value;
        }

        // Map field keys to user meta keys
        $field_map = array(
            'billing_rti_family'   => 'rti_family',
            'billing_rti_club'     => 'rti_club',
            'billing_rti_function' => 'rti_function',
            'billing_rti_world_id' => 'world_id',
        );

        if (isset($field_map[$key])) {
            $meta_value = get_user_meta($user_id, $field_map[$key], true);
            if ($meta_value !== '' || $meta_value === '0') {
                return $meta_value;
            }
        }

        return $value;
    }

    /**
     * Add fields to WooCommerce checkout
     *
     * @param array $fields Checkout fields
     * @return array
     */
    public function add_checkout_fields($fields) {
        // Completely remove state field
        unset($fields['billing']['billing_state']);

        // ===========================================
        // Section: Attendee (priority 10-17)
        // ===========================================

        // 1-2. Name (first_name and last_name already exist, adjust priority)
        if (isset($fields['billing']['billing_first_name'])) {
            $fields['billing']['billing_first_name']['priority'] = 10;
        }
        if (isset($fields['billing']['billing_last_name'])) {
            $fields['billing']['billing_last_name']['priority'] = 11;
        }

        // 3. Family Organization
        $fields['billing']['billing_rti_family'] = array(
            'type'        => 'select',
            'label'       => __('Family Organization', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 12,
            'options'     => array('' => __('— Select Organization —', 'rt-event-manager')) + self::$family_options,
        );

        // 4. Club
        $fields['billing']['billing_rti_club'] = array(
            'type'        => 'text',
            'label'       => __('Club', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 13,
            'placeholder' => __('e.g., 123 - Example City', 'rt-event-manager'),
        );

        // 5. Country (after Club in Attendee section)
        if (isset($fields['billing']['billing_country'])) {
            $fields['billing']['billing_country']['priority'] = 14;
            $fields['billing']['billing_country']['class'] = array('form-row-wide');
        }

        // 6. Function / Role
        $fields['billing']['billing_rti_function'] = array(
            'type'        => 'text',
            'label'       => __('Function / Role', 'rt-event-manager'),
            'required'    => false,
            'class'       => array('form-row-wide'),
            'priority'    => 15,
        );

        // 7. Email (in Attendee section)
        if (isset($fields['billing']['billing_email'])) {
            $fields['billing']['billing_email']['priority'] = 16;
        }

        // 8. Phone (in Attendee section)
        if (isset($fields['billing']['billing_phone'])) {
            $fields['billing']['billing_phone']['priority'] = 17;
        }

        // ===========================================
        // Section: Additional Information (priority 20-29)
        // ===========================================

        // Emergency Contact is now displayed in the Ticket Holders section
        // (only shown when a ticket product is in the cart).

        // Remove the default WooCommerce "Order notes" textarea from checkout.
        if (isset($fields['order']['order_comments'])) {
            unset($fields['order']['order_comments']);
        }

        // ===========================================
        // Section: Billing Address (priority 30-39)
        // ===========================================

        // 1. Street 1 (address_1)
        if (isset($fields['billing']['billing_address_1'])) {
            $fields['billing']['billing_address_1']['priority'] = 30;
            $fields['billing']['billing_address_1']['class'] = array('form-row-wide');
        }

        // 2. Street 2 (address_2)
        if (isset($fields['billing']['billing_address_2'])) {
            $fields['billing']['billing_address_2']['priority'] = 31;
            $fields['billing']['billing_address_2']['class'] = array('form-row-wide');
        }

        // 3. Postal Code
        if (isset($fields['billing']['billing_postcode'])) {
            $fields['billing']['billing_postcode']['priority'] = 32;
            $fields['billing']['billing_postcode']['class'] = array('form-row-first');
        }

        // 4. City
        if (isset($fields['billing']['billing_city'])) {
            $fields['billing']['billing_city']['priority'] = 33;
            $fields['billing']['billing_city']['class'] = array('form-row-last');
        }

        // Company field at the end (optional)
        if (isset($fields['billing']['billing_company'])) {
            $fields['billing']['billing_company']['priority'] = 40;
        }

        return $fields;
    }

    /**
     * Save checkout fields to order and user meta
     *
     * @param int $order_id Order ID
     */
    public function save_checkout_fields($order_id) {
        $order = wc_get_order($order_id);
        $user_id = $order->get_customer_id();

        // Map POST field names to meta keys
        $fields = array(
            'billing_rti_family'            => 'rti_family',
            'billing_rti_club'              => 'rti_club',
            'billing_rti_function'          => 'rti_function',
            'rti_emergency_contact'         => 'rti_emergency_contact',
        );

        foreach ($fields as $post_key => $meta_key) {
            if (isset($_POST[$post_key])) {
                $value = sanitize_text_field($_POST[$post_key]);

                // Save to order meta
                $order->update_meta_data('_' . $meta_key, $value);

                // Save to user meta if logged in
                if ($user_id) {
                    update_user_meta($user_id, $meta_key, $value);
                }
            }
        }

        // Save .WORLD ID to order meta from user meta (field is not on checkout form)
        if ($user_id) {
            $wid = get_user_meta($user_id, 'world_id', true);
            if (!empty($wid)) {
                $order->update_meta_data('_rti_world_id', $wid);
            }
        }

        // Save ticket holder data to custom table
        $ticket_count = isset($_POST['rti_ticket_count']) ? absint($_POST['rti_ticket_count']) : 0;

        if ($ticket_count > 0) {
            // Build product map from hidden fields to know which ticket belongs to which product
            $ticket_product_map = isset($_POST['rti_ticket_product_map']) ? array_map('absint', (array) $_POST['rti_ticket_product_map']) : array();

            // Build combination_id map from order items (MTO products store combination_id).
            // Only iterate ticket items (_rti_is_ticket=yes) to match the checkout form's
            // ticket_product_map indexing which also only counts ticket items.
            $combination_map = array(); // ticket_index => combination_id
            $kind_map        = array(); // ticket_index => 'event'|'pretour'|'minor'
            $parent_map      = array(); // ticket_index => parent ticket id
            $minor_type_map  = array(); // ticket_index => 'tabler'|'circler'
            $item_combo_index = 0;
            foreach ($order->get_items() as $item) {
                $pid = $item->get_product_id();
                if (!self::is_ticket_product($pid)) {
                    continue;
                }
                $combo_id = absint($item->get_meta('_mto_combination_id'));
                $kind     = self::get_ticket_kind_for_product($pid);
                $parent   = absint($item->get_meta('_rti_parent_ticket_id'));
                $gender   = sanitize_text_field($item->get_meta('_rti_minor_gender'));
                $qty = $item->get_quantity();
                for ($q = 0; $q < $qty; $q++) {
                    if ($combo_id) {
                        $combination_map[$item_combo_index] = $combo_id;
                    }
                    $kind_map[$item_combo_index]       = $kind;
                    $parent_map[$item_combo_index]     = $parent;
                    $minor_type_map[$item_combo_index] = ('minor' === $kind) ? $gender : '';
                    $item_combo_index++;
                }
            }

            // Get the purchaser's RTI details
            $buyer_family = isset($_POST['billing_rti_family']) ? sanitize_text_field($_POST['billing_rti_family']) : '';
            $buyer_club   = isset($_POST['billing_rti_club']) ? sanitize_text_field($_POST['billing_rti_club']) : '';

            // Get the purchaser's .WORLD ID from user meta (not on checkout form)
            $buyer_world_id = $user_id ? get_user_meta($user_id, 'world_id', true) : '';

            // If the buyer already owns their own event ticket (a prior order),
            // every ticket here is an additional co-traveller with its own details.
            $buyer_has_ticket = $user_id && self::user_has_own_event_ticket($user_id, $order_id);

            for ($i = 0; $i < $ticket_count; $i++) {
                $field_prefix = 'rti_ticket_' . $i;
                $holder_name  = isset($_POST[$field_prefix . '_name']) ? sanitize_text_field($_POST[$field_prefix . '_name']) : '';
                $phone        = isset($_POST[$field_prefix . '_phone']) ? self::normalize_phone(wp_unslash($_POST[$field_prefix . '_phone'])) : '';
                $dietary      = isset($_POST[$field_prefix . '_dietary']) ? sanitize_text_field($_POST[$field_prefix . '_dietary']) : '';
                $allergy      = ('allergies' === $dietary && isset($_POST[$field_prefix . '_allergy'])) ? sanitize_text_field(wp_unslash($_POST[$field_prefix . '_allergy'])) : '';
                $product_id   = isset($ticket_product_map[$i]) ? $ticket_product_map[$i] : 0;
                $combo_id     = isset($combination_map[$i]) ? $combination_map[$i] : 0;
                $kind         = isset($kind_map[$i]) ? $kind_map[$i] : 'event';
                $parent_id    = isset($parent_map[$i]) ? $parent_map[$i] : 0;
                $minor_type   = isset($minor_type_map[$i]) ? $minor_type_map[$i] : '';
                $is_minor     = ('minor' === $kind);
                // A ticket is "additional" (not the purchaser's own) when it is not
                // the first ticket of the order, OR it is a linked co-traveller, OR
                // the buyer already holds their own ticket from a previous order.
                $is_additional = ($i > 0) || ($parent_id > 0) || $buyer_has_ticket;
                $dob          = ($is_minor && isset($_POST[$field_prefix . '_dob'])) ? self::sanitize_dob(wp_unslash($_POST[$field_prefix . '_dob'])) : '';

                // Gender/type from the checkout form when it wasn't chosen at
                // add-to-cart (Future member added directly alongside an event ticket).
                if ($is_minor && '' === $minor_type && isset($_POST[$field_prefix . '_minor_gender'])) {
                    $g = sanitize_key(wp_unslash($_POST[$field_prefix . '_minor_gender']));
                    if (in_array($g, array('tabler', 'circler'), true)) {
                        $minor_type = $g;
                    }
                }

                // The purchaser's own ticket inherits their family / club / .WORLD
                // ID. Additional travellers carry their OWN details entered on the
                // checkout form. Minors carry none of these.
                if ($is_minor) {
                    $ticket_family = '';
                    $ticket_club   = '';
                    $world_id      = '';
                } elseif (!$is_additional) {
                    $ticket_family = $buyer_family;
                    $ticket_club   = $buyer_club;
                    $world_id      = $user_id ? $buyer_world_id : '';
                } else {
                    $ticket_family = isset($_POST[$field_prefix . '_family']) ? sanitize_text_field($_POST[$field_prefix . '_family']) : '9';
                    $ticket_club   = isset($_POST[$field_prefix . '_club']) ? sanitize_text_field(wp_unslash($_POST[$field_prefix . '_club'])) : '';
                    $world_id      = isset($_POST[$field_prefix . '_world_id']) ? sanitize_text_field(wp_unslash($_POST[$field_prefix . '_world_id'])) : '';
                }

                $qr_code_url = '';
                if (!empty($world_id)) {
                    $qr_code_url = 'tablerworld:///member?id=' . $world_id;
                }

                // Determine ticket status based on order status and assignment
                $ticket_status = rt_event_manager_determine_ticket_status($order, $holder_name);

                $this->insert_ticket(array(
                    'order_id'         => $order_id,
                    'product_id'       => $product_id,
                    'combination_id'   => $combo_id,
                    'parent_ticket_id' => $parent_id,
                    'ticket_kind'      => $kind,
                    'minor_type'       => $minor_type,
                    'ticket_index'     => $i,
                    'holder_name'      => $holder_name,
                    'phone'            => $phone,
                    'dob'              => $dob,
                    'rti_family'       => $ticket_family,
                    'rti_club'         => $ticket_club,
                    'dietary'          => $dietary,
                    'allergy_details'  => $allergy,
                    'world_id'         => $world_id,
                    'qr_code_url'      => $qr_code_url,
                    'status'           => $ticket_status,
                    // Initial owner is the buyer; a transfer can reassign it later.
                    'owner_user_id'    => $user_id,
                ));
            }

            // Link any Future member or pretour added directly (no parent yet) to
            // this order's own tickets. Future members attach to the buyer's event
            // ticket (their guardian); pretours are spread one-per-host across the
            // event AND Future member tickets, so no ticket ends up with more than
            // one pretour.
            $order_tickets    = self::get_tickets_for_order($order_id);
            $event_ticket_ids = array();
            $minor_ticket_ids = array();
            foreach ($order_tickets as $ot) {
                $k = self::get_ticket_kind($ot);
                if ('event' === $k && !absint($ot['parent_ticket_id'])) {
                    $event_ticket_ids[] = absint($ot['id']);
                } elseif ('minor' === $k) {
                    $minor_ticket_ids[] = absint($ot['id']);
                }
            }
            // Pretours are one per host; day tours may stack on a host as long as
            // they do not overlap in time (checked live against DB children, which
            // update_ticket writes immediately below).
            $tour_taken = array('pretour' => array());
            foreach ($order_tickets as $ot) {
                if ('pretour' === self::get_ticket_kind($ot) && absint($ot['parent_ticket_id'])) {
                    $tour_taken['pretour'][absint($ot['parent_ticket_id'])] = true;
                }
            }
            $primary_event = !empty($event_ticket_ids) ? $event_ticket_ids[0] : 0;

            // Map every checkout slot index to the ticket id just created for it,
            // used by the guardian and tour-link pickers below.
            $idx_to_id = array();
            foreach ($order_tickets as $ot) {
                $idx_to_id[absint($ot['ticket_index'])] = absint($ot['id']);
            }

            // Adult event tickets the buyer may pick as a guardian: those in this
            // order, plus any already on their account.
            $event_id_set = array_flip($event_ticket_ids);
            $acct_event   = array();
            $buyer_id     = absint($order->get_customer_id());
            if ($buyer_id) {
                foreach (self::get_tickets_for_user($buyer_id) as $at) {
                    if ('event' === self::get_ticket_kind($at)) {
                        $acct_event[absint($at['id'])] = true;
                    }
                }
            }

            // Attach each Future member to its chosen guardian (an adult event
            // ticket in this order or on the account), falling back to the buyer's
            // first event ticket in this order.
            foreach ($order_tickets as $ot) {
                if ('minor' !== self::get_ticket_kind($ot) || absint($ot['parent_ticket_id'])) {
                    continue;
                }
                $slot     = absint($ot['ticket_index']);
                $guardian = 0;
                if (isset($_POST['rti_ticket_' . $slot . '_guardian'])) {
                    $raw = sanitize_text_field(wp_unslash($_POST['rti_ticket_' . $slot . '_guardian']));
                    if (is_numeric($raw)) {
                        $cand = isset($idx_to_id[absint($raw)]) ? $idx_to_id[absint($raw)] : 0;
                        if ($cand && isset($event_id_set[$cand])) {
                            $guardian = $cand;
                        }
                    } elseif (0 === strpos($raw, 'acct:')) {
                        $cand = absint(substr($raw, 5));
                        if ($cand && isset($acct_event[$cand])) {
                            $guardian = $cand;
                        }
                    }
                }
                if (!$guardian) {
                    $guardian = $primary_event;
                }
                if ($guardian) {
                    $this->update_ticket($ot['id'], array('parent_ticket_id' => $guardian));
                }
            }

            // Resolve tours the buyer linked to a specific attendee at checkout
            // (the "This pretour/day tour is for" picker): copy that attendee's
            // details onto the tour and link it to their ticket. The picker value
            // is the host ticket's checkout index (== stored ticket_index).
            for ($li = 0; $li < $ticket_count; $li++) {
                if (!isset($_POST['rti_ticket_' . $li . '_link'])) {
                    continue;
                }
                $raw = wp_unslash($_POST['rti_ticket_' . $li . '_link']);
                if ('' === $raw || !is_numeric($raw)) {
                    continue;
                }
                $host_index = absint($raw);
                if ($host_index === $li || !isset($idx_to_id[$li], $idx_to_id[$host_index])) {
                    continue;
                }
                $tour_id  = $idx_to_id[$li];
                $tour_row = self::get_ticket_by_id($tour_id);
                $tour_kind = $tour_row ? self::get_ticket_kind($tour_row) : '';
                if (!in_array($tour_kind, array('pretour', 'daytour'), true)) {
                    continue;
                }
                $host_id = $idx_to_id[$host_index];
                if ('pretour' === $tour_kind) {
                    if (!empty($tour_taken['pretour'][$host_id])) {
                        continue; // one pretour per host
                    }
                } elseif (self::host_daytour_conflict($host_id, absint($tour_row['product_id']))) {
                    continue; // day tour overlaps one this host already has
                }
                $host_row = self::get_ticket_by_id($host_id);
                if (!$host_row || !in_array(self::get_ticket_kind($host_row), array('event', 'minor'), true)) {
                    continue;
                }
                $this->update_ticket($tour_id, array(
                    'parent_ticket_id' => $host_id,
                    'holder_name'      => $host_row['holder_name'],
                    'phone'            => $host_row['phone'],
                    'rti_family'       => $host_row['rti_family'],
                    'rti_club'         => $host_row['rti_club'],
                    'dietary'          => $host_row['dietary'],
                    'allergy_details'  => $host_row['allergy_details'],
                    'world_id'         => $host_row['world_id'],
                    'qr_code_url'      => $host_row['qr_code_url'],
                    'status'           => rt_event_manager_determine_ticket_status($order, $host_row['holder_name']),
                ));
                if ('pretour' === $tour_kind) {
                    $tour_taken['pretour'][$host_id] = true;
                }
            }

            // Re-read so tours just linked above are seen as parented and are not
            // re-distributed by the fallback below.
            $order_tickets = self::get_tickets_for_order($order_id);

            // Distribute any still-unparented tours across available hosts (event
            // tickets first, then Future member tickets). Pretours go one per host;
            // day tours prefer a host they do not overlap on.
            $hosts = array_merge($event_ticket_ids, $minor_ticket_ids);
            if (!empty($hosts)) {
                foreach ($order_tickets as $ot) {
                    $ok = self::get_ticket_kind($ot);
                    if (!in_array($ok, array('pretour', 'daytour'), true) || absint($ot['parent_ticket_id'])) {
                        continue;
                    }
                    $target = 0;
                    if ('pretour' === $ok) {
                        // Prefer a host with no pretour — including any already
                        // attached by a previous order (checked against the DB).
                        foreach ($hosts as $hid) {
                            if (empty($tour_taken['pretour'][$hid]) && !self::ticket_has_pretour($hid)) {
                                $target = $hid;
                                break;
                            }
                        }
                    } else { // daytour: first host it does not overlap on
                        $product = absint($ot['product_id']);
                        foreach ($hosts as $hid) {
                            if (!self::host_daytour_conflict($hid, $product)) {
                                $target = $hid;
                                break;
                            }
                        }
                    }
                    if (!$target) {
                        $target = $hosts[0];
                    }
                    if ('pretour' === $ok) {
                        $tour_taken['pretour'][$target] = true;
                    }
                    $this->update_ticket($ot['id'], array('parent_ticket_id' => $target));
                }
            }
        }

        $order->save();
    }

    /* ---------------------------------------------------------------------
     * Ticket linking (pretour / minor co-travellers)
     * ------------------------------------------------------------------- */

    /**
     * Capture the parent ticket id and (for minors) the gender from the
     * add-to-cart request so they travel with the cart item.
     *
     * @param array $cart_item_data
     * @param int   $product_id
     * @return array
     */
    public function capture_link_cart_item_data($cart_item_data, $product_id) {
        $unique = false;

        if (isset($_REQUEST['rti_parent_ticket_id'])) {
            $cart_item_data['rti_parent_ticket_id'] = absint($_REQUEST['rti_parent_ticket_id']);
            $unique = true;
        }
        if (isset($_REQUEST['rti_minor_gender'])) {
            $gender = sanitize_key(wp_unslash($_REQUEST['rti_minor_gender']));
            if (in_array($gender, array('tabler', 'circler'), true)) {
                $cart_item_data['rti_minor_gender'] = $gender;
                $unique = true;
            }
        }

        // Keep each linked co-traveller as its own cart line (don't merge quantities).
        if ($unique) {
            $cart_item_data['rti_link_unique'] = md5(wp_json_encode($cart_item_data) . wp_rand());
        }

        return $cart_item_data;
    }

    /**
     * Show the linkage in the cart/checkout item details.
     *
     * @param array $item_data
     * @param array $cart_item
     * @return array
     */
    public function display_link_cart_item_data($item_data, $cart_item) {
        if (!empty($cart_item['rti_minor_gender'])) {
            $item_data[] = array(
                'key'   => __('Minor', 'rt-event-manager'),
                'value' => ('circler' === $cart_item['rti_minor_gender'])
                    ? __('Future Circler', 'rt-event-manager')
                    : __('Future Tabler', 'rt-event-manager'),
            );
        }
        if (!empty($cart_item['rti_parent_ticket_id'])) {
            $item_data[] = array(
                'key'   => __('Linked to ticket', 'rt-event-manager'),
                'value' => '#' . absint($cart_item['rti_parent_ticket_id']),
            );
        }
        return $item_data;
    }

    /**
     * Persist the linkage onto the order line item at checkout.
     *
     * @param WC_Order_Item_Product $item
     * @param string                $cart_item_key
     * @param array                 $values
     * @param WC_Order              $order
     */
    public function save_link_order_item_meta($item, $cart_item_key, $values, $order) {
        if (!empty($values['rti_parent_ticket_id'])) {
            $item->add_meta_data('_rti_parent_ticket_id', absint($values['rti_parent_ticket_id']), true);
        }
        if (!empty($values['rti_minor_gender'])) {
            $item->add_meta_data('_rti_minor_gender', sanitize_key($values['rti_minor_gender']), true);
        }
    }

    /**
     * Block adding a Future (minor) ticket to the cart unless a parent ticket is
     * specified — enforcing "co-traveller only".
     *
     * @param bool $passed
     * @param int  $product_id
     * @param int  $quantity
     * @return bool
     */
    /**
     * Re-validate the tours in the cart against the current database state.
     * Add-to-cart validation only reflects the moment an item was added; if
     * another order (or a second browser window) has since given the host a
     * pretour — or an overlapping day tour — this blocks checkout so the same
     * tour cannot be sold twice for the same person.
     */
    /** Whether the given user already has a (non-terminal) adult event ticket. */
    public function user_has_event_ticket($user_id) {
        if (!$user_id) {
            return false;
        }
        foreach (self::get_tickets_for_user($user_id) as $t) {
            if ('event' === self::get_ticket_kind($t)) {
                return true;
            }
        }
        return false;
    }

    /**
     * A Future member ticket may only be purchased when there is at least one
     * adult event ticket to attach it to — either in this order or already on
     * the buyer's account. Blocks checkout otherwise.
     */
    public function validate_future_needs_adult() {
        if (!function_exists('WC') || !WC()->cart) {
            return;
        }
        $has_future = false;
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            if ($pid && self::is_future_product($pid)) {
                $has_future = true;
                break;
            }
        }
        if (!$has_future) {
            return;
        }
        if ($this->cart_has_event_ticket()) {
            return;
        }
        if (is_user_logged_in() && $this->user_has_event_ticket(get_current_user_id())) {
            return;
        }
        wc_add_notice(
            __('Future member tickets require at least one adult event ticket. Please add an adult ticket to your order, or make sure your account already has one.', 'rt-event-manager'),
            'error'
        );
    }

    public function validate_cart_tours_against_db() {
        if (!function_exists('WC') || !WC()->cart) {
            return;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid    = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            $parent = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
            if (!$pid || !$parent) {
                continue; // unparented tours are resolved (and guarded) at checkout
            }
            $kind = self::get_ticket_kind_for_product($pid);
            $host = self::get_ticket_by_id($parent);
            $who  = ($host && $host['holder_name'] !== '') ? $host['holder_name'] : __('this ticket', 'rt-event-manager');
            $product = wc_get_product($pid);
            $pname   = $product ? $product->get_name() : __('this tour', 'rt-event-manager');

            if ('pretour' === $kind && self::ticket_has_pretour($parent)) {
                wc_add_notice(sprintf(
                    /* translators: 1: attendee name, 2: pretour product name */
                    __('%1$s already has a pretour, so “%2$s” can no longer be added. Please remove it from your cart.', 'rt-event-manager'),
                    $who,
                    $pname
                ), 'error');
            } elseif ('daytour' === $kind && self::host_daytour_conflict($parent, $pid)) {
                wc_add_notice(sprintf(
                    /* translators: 1: attendee name, 2: day tour product name */
                    __('%1$s already has a day tour that overlaps “%2$s”. Please remove it from your cart.', 'rt-event-manager'),
                    $who,
                    $pname
                ), 'error');
            }
        }
    }

    public function validate_future_add_to_cart($passed, $product_id, $quantity) {
        $parent_id = isset($_REQUEST['rti_parent_ticket_id']) ? absint($_REQUEST['rti_parent_ticket_id']) : 0;

        if (!$parent_id) {
            if (self::is_future_product($product_id)) {
                // Allowed without an explicit parent if an event ticket is in the
                // cart — the Future member links to that event ticket at checkout.
                if (!$this->cart_has_event_ticket()) {
                    wc_add_notice(
                        __('Future member tickets need an event ticket in your cart, or an existing ticket to link to.', 'rt-event-manager'),
                        'error'
                    );
                    return false;
                }
            } elseif (self::is_pretour_product($product_id)) {
                if (!$this->validate_unparented_tour('pretour', __('pretour', 'rt-event-manager'))) {
                    return false;
                }
            } elseif (self::is_daytour_product($product_id)) {
                if (!$this->validate_unparented_tour('daytour', __('day tour', 'rt-event-manager'))) {
                    return false;
                }
            }
        } elseif (self::is_pretour_product($product_id)) {
            if (self::ticket_has_pretour($parent_id) || $this->cart_has_tour_for_parent($parent_id, 'pretour')) {
                wc_add_notice(__('This ticket already has a pretour. Each ticket can have only one pretour.', 'rt-event-manager'), 'error');
                return false;
            }
        } elseif (self::is_daytour_product($product_id)) {
            // Multiple day tours per person are allowed as long as their time
            // windows do not overlap (and the same tour is not booked twice).
            $cart_products = $this->cart_tour_products_for_parent($parent_id, 'daytour');
            if (self::host_daytour_conflict($parent_id, $product_id, $cart_products)) {
                wc_add_notice(__('This day tour overlaps another day tour already booked for this person. Day tours for the same person must not overlap in time.', 'rt-event-manager'), 'error');
                return false;
            }
        }
        return $passed;
    }

    /**
     * Shared rule for adding an unparented pretour / day tour to the cart: it
     * needs an event ticket in the cart, and the count of that tour kind may not
     * exceed the available hosts (event + Future member tickets).
     *
     * @param string $kind 'pretour' | 'daytour'
     * @param string $word Human label for the notice.
     * @return bool
     */
    private function validate_unparented_tour($kind, $word) {
        if (!$this->cart_has_event_ticket()) {
            wc_add_notice(sprintf(
                /* translators: %s: pretour / day tour */
                __('%s tickets need an event ticket in your cart, or an existing ticket to link to.', 'rt-event-manager'),
                ucfirst($word)
            ), 'error');
            return false;
        }
        // Pretours are one per host, so an unparented pretour may not outnumber
        // the hosts. Day tours may stack (non-overlapping) on a host, so no cap.
        if ('daytour' !== $kind && $this->count_cart_unlinked_tours($kind) + 1 > $this->count_cart_pretour_hosts()) {
            wc_add_notice(sprintf(
                /* translators: %s: pretour / day tour */
                __('Each ticket can have only one %s. Please remove one from your cart before adding another.', 'rt-event-manager'),
                $word
            ), 'error');
            return false;
        }
        return true;
    }

    /**
     * Product ids of tours of a kind currently in the cart that are linked to a
     * specific parent ticket.
     *
     * @param int    $parent_id
     * @param string $kind 'pretour' | 'daytour'
     * @return int[]
     */
    private function cart_tour_products_for_parent($parent_id, $kind) {
        $out       = array();
        $parent_id = absint($parent_id);
        if (!$parent_id || !function_exists('WC') || !WC()->cart) {
            return $out;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid    = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            $parent = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
            if ($pid && $parent === $parent_id && self::get_ticket_kind_for_product($pid) === $kind) {
                $out[] = $pid;
            }
        }
        return $out;
    }

    /**
     * Count tickets in the cart that can host a pretour — event tickets and
     * Future member tickets (each can host one pretour).
     *
     * @return int
     */
    private function count_cart_pretour_hosts() {
        $count = 0;
        if (!function_exists('WC') || !WC()->cart) {
            return 0;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            $qty = isset($ci['quantity']) ? absint($ci['quantity']) : 1;
            if (!$pid || !self::is_ticket_product($pid)) {
                continue;
            }
            $kind = self::get_ticket_kind_for_product($pid);
            if ('event' === $kind || 'minor' === $kind) {
                $count += max(1, $qty);
            }
        }
        return $count;
    }

    /**
     * Count tours of a kind in the cart that have no explicit parent (they link
     * to an event ticket in the same cart at checkout).
     *
     * @param string $kind 'pretour' | 'daytour'
     * @return int
     */
    private function count_cart_unlinked_tours($kind) {
        $count = 0;
        if (!function_exists('WC') || !WC()->cart) {
            return 0;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid    = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            $parent = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
            $qty    = isset($ci['quantity']) ? absint($ci['quantity']) : 1;
            if ($pid && !$parent && self::get_ticket_kind_for_product($pid) === $kind) {
                $count += max(1, $qty);
            }
        }
        return $count;
    }

    /**
     * Whether the cart already holds a tour of the given kind linked to a
     * specific parent ticket.
     *
     * @param int    $parent_id
     * @param string $kind 'pretour' | 'daytour'
     * @return bool
     */
    private function cart_has_tour_for_parent($parent_id, $kind) {
        $parent_id = absint($parent_id);
        if (!$parent_id || !function_exists('WC') || !WC()->cart) {
            return false;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid    = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            $parent = isset($ci['rti_parent_ticket_id']) ? absint($ci['rti_parent_ticket_id']) : 0;
            if ($pid && $parent === $parent_id && self::get_ticket_kind_for_product($pid) === $kind) {
                return true;
            }
        }
        return false;
    }

    /**
     * Whether the cart currently contains an event ticket (used to allow adding
     * a Future member ticket alongside it).
     *
     * @return bool
     */
    private function cart_has_event_ticket() {
        if (!function_exists('WC') || !WC()->cart) {
            return false;
        }
        foreach (WC()->cart->get_cart() as $ci) {
            $pid = isset($ci['product_id']) ? absint($ci['product_id']) : 0;
            if ($pid && self::is_ticket_product($pid) && 'event' === self::get_ticket_kind_for_product($pid)) {
                return true;
            }
        }
        return false;
    }

    /**
     * On the single-product page, re-emit the linkage request params (parent
     * ticket + minor gender) as hidden fields inside the add-to-cart form so
     * they survive an options/variation selection step (variable / MTO tickets).
     */
    public function inject_link_hidden_fields() {
        if (isset($_GET['rti_parent_ticket_id'])) {
            echo '<input type="hidden" name="rti_parent_ticket_id" value="' . esc_attr(absint($_GET['rti_parent_ticket_id'])) . '" />';
        }
        if (isset($_GET['rti_minor_gender'])) {
            $gender = sanitize_key(wp_unslash($_GET['rti_minor_gender']));
            if (in_array($gender, array('tabler', 'circler'), true)) {
                echo '<input type="hidden" name="rti_minor_gender" value="' . esc_attr($gender) . '" />';
            }
        }
    }

    /**
     * Hide Future (minor) and Pretour products from the shop catalog/archive loop
     * so they cannot be purchased standalone (both are account-only, linked).
     *
     * @param WP_Query $query
     */
    public function hide_future_from_catalog($query) {
        $cats = array_filter(array(self::get_future_category_id(), self::get_pretour_category_id()));
        if (empty($cats)) {
            return;
        }
        $tax_query = (array) $query->get('tax_query');
        $tax_query[] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'term_id',
            'terms'    => array_map('absint', $cats),
            'operator' => 'NOT IN',
        );
        $query->set('tax_query', $tax_query);
    }

    /**
     * Normalize a phone number to E.164-style storage form: a leading "+"
     * (if the user provided one) followed by digits only. Formatting
     * characters (spaces, dashes, parentheses, dots) are stripped.
     *
     * @param string $raw Raw user input
     * @return string Normalized phone, or '' if there were no digits
     */
    public static function normalize_phone($raw) {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return '';
        }
        $has_plus = (strpos($raw, '+') === 0);
        $digits   = preg_replace('/\D+/', '', $raw);
        if ($digits === '') {
            return '';
        }
        return ($has_plus ? '+' : '') . $digits;
    }

    /**
     * Validate that a phone number is in international (E.164) format:
     * a leading "+", a country code starting 1-9, and 8-15 digits total.
     *
     * @param string $raw Raw user input (normalized internally)
     * @return bool
     */
    public static function is_valid_intl_phone($raw) {
        $normalized = self::normalize_phone($raw);
        return (bool) preg_match('/^\+[1-9]\d{7,14}$/', $normalized);
    }

    /**
     * Normalize a date-of-birth input to Y-m-d, or '' if not a valid date.
     *
     * @param string $raw
     * @return string
     */
    public static function sanitize_dob($raw) {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return '';
        }
        $ts = strtotime($raw);
        if (!$ts) {
            return '';
        }
        return gmdate('Y-m-d', $ts);
    }

    /**
     * The configured event date (Y-m-d), or '' if unset.
     *
     * @return string
     */
    public static function get_event_date() {
        return (string) get_option('rt_event_manager_event_date', '');
    }

    /**
     * Minimum / maximum permitted age (in years) for a Future member ticket,
     * evaluated at the event date. Defaults 5 and 15.
     *
     * @return int
     */
    public static function get_minor_min_age() {
        $v = (int) get_option('rt_event_manager_minor_min_age', 5);
        return $v > 0 ? $v : 5;
    }

    public static function get_minor_max_age() {
        $v = (int) get_option('rt_event_manager_minor_max_age', 15);
        return $v > 0 ? $v : 15;
    }

    /**
     * Age in whole years a person with the given DOB has at the event date
     * (falls back to today's date if the event date is unset).
     *
     * @param string $dob Y-m-d (or any strtotime-parseable date)
     * @return int|null Age in years, or null if DOB invalid.
     */
    public static function minor_age_at_event($dob) {
        $dob = self::sanitize_dob($dob);
        if ($dob === '') {
            return null;
        }
        $event = self::get_event_date();
        $ref   = $event !== '' ? $event : current_time('Y-m-d');

        try {
            $d1 = new DateTime($dob);
            $d2 = new DateTime($ref);
        } catch (\Exception $e) {
            return null;
        }
        return (int) $d1->diff($d2)->y;
    }

    /**
     * Whether a Future member's DOB yields an age within the configured range
     * at the event date.
     *
     * @param string $dob
     * @return bool
     */
    public static function is_valid_minor_dob($dob) {
        $age = self::minor_age_at_event($dob);
        if ($age === null) {
            return false;
        }
        return $age >= self::get_minor_min_age() && $age <= self::get_minor_max_age();
    }

    /**
     * Insert a ticket into the custom table
     *
     * @param array $data Ticket data
     * @return int|false Inserted row ID or false
     */
    private function insert_ticket($data) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        // Upsert keyed on the UNIQUE KEY (order_id, ticket_index) so repeated checkout
        // submissions for the same order update the existing row instead of duplicating.
        // Checked-in status must never be clobbered by a re-submit.
        $sql = $wpdb->prepare(
            "INSERT INTO $table_name
                (order_id, product_id, combination_id, parent_ticket_id, ticket_kind, minor_type, ticket_index, holder_name, phone, dob, rti_family, rti_club, dietary, allergy_details, world_id, qr_code_url, status, owner_user_id)
             VALUES (%d, %d, %d, %d, %s, %s, %d, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %d)
             ON DUPLICATE KEY UPDATE
                product_id       = VALUES(product_id),
                combination_id   = VALUES(combination_id),
                parent_ticket_id = VALUES(parent_ticket_id),
                ticket_kind      = VALUES(ticket_kind),
                minor_type       = VALUES(minor_type),
                holder_name      = VALUES(holder_name),
                phone            = VALUES(phone),
                dob              = VALUES(dob),
                rti_family       = VALUES(rti_family),
                rti_club         = VALUES(rti_club),
                dietary          = VALUES(dietary),
                allergy_details  = VALUES(allergy_details),
                world_id         = VALUES(world_id),
                qr_code_url      = VALUES(qr_code_url),
                status           = IF(status IN ('checked_in', 'cancelled'), status, VALUES(status)),
                owner_user_id    = IF(owner_user_id > 0, owner_user_id, VALUES(owner_user_id))",
            absint($data['order_id']),
            absint($data['product_id']),
            absint(isset($data['combination_id']) ? $data['combination_id'] : 0),
            absint(isset($data['parent_ticket_id']) ? $data['parent_ticket_id'] : 0),
            isset($data['ticket_kind']) ? sanitize_text_field($data['ticket_kind']) : 'event',
            isset($data['minor_type']) ? sanitize_text_field($data['minor_type']) : '',
            absint($data['ticket_index']),
            sanitize_text_field($data['holder_name']),
            self::normalize_phone(isset($data['phone']) ? $data['phone'] : ''),
            self::sanitize_dob(isset($data['dob']) ? $data['dob'] : ''),
            sanitize_text_field($data['rti_family']),
            sanitize_text_field($data['rti_club']),
            sanitize_text_field($data['dietary']),
            sanitize_text_field(isset($data['allergy_details']) ? $data['allergy_details'] : ''),
            sanitize_text_field($data['world_id']),
            sanitize_text_field($data['qr_code_url']),
            isset($data['status']) ? sanitize_text_field($data['status']) : 'draft',
            absint(isset($data['owner_user_id']) ? $data['owner_user_id'] : 0)
        );

        $result = $wpdb->query($sql);

        return $result !== false ? ($wpdb->insert_id ?: true) : false;
    }

    /**
     * Get tickets for an order from the custom table
     *
     * @param int $order_id Order ID
     * @return array
     */
    public static function get_tickets_for_order($order_id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name WHERE order_id = %d ORDER BY ticket_index ASC",
            $order_id
        ), ARRAY_A);
    }

    /**
     * Get all tickets owned by a user, across every order they placed.
     *
     * Tickets have no direct user column — they link to a user only through
     * their order. We resolve the user's orders HPOS-compatibly via
     * wc_get_orders(), then fetch their tickets in a single query. Each ticket
     * row is augmented with its `order_id` (already present) so callers can
     * group by order.
     *
     * @param int $user_id
     * @return array Array of ticket rows (ARRAY_A), ordered by order then index.
     */
    public static function get_tickets_for_user($user_id, $include_terminal = false) {
        $user_id = absint($user_id);
        if (!$user_id) {
            return array();
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        $order_ids = wc_get_orders(array(
            'customer_id' => $user_id,
            'limit'       => -1,
            'return'      => 'ids',
        ));
        $order_ids = array_map('absint', (array) $order_ids);

        // A ticket belongs to the user when it is explicitly owned by them
        // (owner_user_id) OR — for legacy rows with no owner recorded — when it
        // sits on one of their orders. A ticket transferred AWAY has a different
        // owner_user_id, so the order-based clause no longer returns it to the
        // original buyer.
        $where  = array('owner_user_id = %d');
        $params = array($user_id);

        if (!empty($order_ids)) {
            $placeholders = implode(', ', array_fill(0, count($order_ids), '%d'));
            $where[]      = "(owner_user_id = 0 AND order_id IN ($placeholders))";
            $params       = array_merge($params, $order_ids);
        }

        // Cancelled and refunded tickets are hidden from the customer portal
        // unless explicitly requested (the "show cancelled" toggle).
        $sql = "SELECT * FROM $table_name WHERE (" . implode(' OR ', $where) . ")";
        if (!$include_terminal) {
            $sql .= " AND status NOT IN ('cancelled', 'refunded')";
        }
        $sql .= ' ORDER BY order_id ASC, ticket_index ASC';

        return $wpdb->get_results($wpdb->prepare($sql, $params), ARRAY_A);
    }

    /**
     * Whether the user already holds their own event ticket (kind event, no
     * parent) on a previous order. When true, every event ticket in a new order
     * is treated as an additional co-traveller (full details requested).
     *
     * @param int $user_id
     * @param int $exclude_order_id Order to ignore (the one being checked out).
     * @return bool
     */
    public static function user_has_own_event_ticket($user_id, $exclude_order_id = 0) {
        $exclude_order_id = absint($exclude_order_id);
        foreach (self::get_tickets_for_user($user_id) as $t) {
            if ($exclude_order_id && absint($t['order_id']) === $exclude_order_id) {
                continue;
            }
            // A cancelled or refunded ticket no longer counts — the user may
            // register a fresh ticket as their own.
            $status = isset($t['status']) ? $t['status'] : '';
            if (in_array($status, array('cancelled', 'refunded'), true)) {
                continue;
            }
            if ('event' === self::get_ticket_kind($t) && !absint($t['parent_ticket_id'])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Whether a user owns a ticket row — via explicit owner_user_id, falling
     * back to the order customer for legacy rows.
     *
     * @param array $t
     * @param int   $user_id
     * @return bool
     */
    public static function user_owns_ticket($t, $user_id) {
        $owner = absint(isset($t['owner_user_id']) ? $t['owner_user_id'] : 0);
        if ($owner) {
            return $owner === absint($user_id);
        }
        $order = wc_get_order(absint($t['order_id']));
        return $order && absint($order->get_customer_id()) === absint($user_id);
    }

    /**
     * Whether a refund is still possible for a cancellation. Refunds are tied to
     * the same cutoff date as ticket editing: on or before the cutoff a refund is
     * requested; after it, cancellation happens with no refund.
     *
     * @return bool
     */
    public function is_refund_window_open() {
        return $this->is_frontend_editing_allowed();
    }

    /**
     * Recipient for cancellation / refund-request notifications. Defaults to the
     * site admin (WooCommerce's default new-order recipient); filterable.
     *
     * @return string
     */
    public static function get_shop_manager_email() {
        $email = get_option('admin_email');
        /** Allow overriding the cancellation notification recipient. */
        return apply_filters('rt_event_manager_cancel_notification_email', $email);
    }

    /**
     * How long a pending transfer offer stays valid before it is automatically
     * withdrawn. Defaults to 48 hours; filterable.
     *
     * @return int seconds
     */
    public static function transfer_expiry_seconds() {
        return (int) apply_filters('rt_event_manager_transfer_expiry_seconds', 48 * HOUR_IN_SECONDS);
    }

    /**
     * Per-unit amount actually paid for a ticket, from its order line item
     * (including tax). Returns a float in the order's currency.
     *
     * @param array $ticket Ticket row.
     * @return float
     */
    public static function get_ticket_paid_amount($ticket) {
        $order = wc_get_order(absint($ticket['order_id']));
        if (!$order) {
            return 0.0;
        }
        $product_id = absint($ticket['product_id']);
        foreach ($order->get_items() as $item) {
            if (absint($item->get_product_id()) === $product_id) {
                $qty = max(1, (int) $item->get_quantity());
                return ((float) $item->get_total() + (float) $item->get_total_tax()) / $qty;
            }
        }
        return 0.0;
    }

    /**
     * Per-unit list price for a ticket BEFORE any coupon/voucher discount, taken
     * from the order line subtotal (including tax). Use alongside
     * get_ticket_paid_amount() to show original vs paid.
     *
     * @param array $ticket Ticket row.
     * @return float
     */
    public static function get_ticket_original_amount($ticket) {
        $order = wc_get_order(absint($ticket['order_id']));
        if (!$order) {
            return 0.0;
        }
        $product_id = absint($ticket['product_id']);
        foreach ($order->get_items() as $item) {
            if (absint($item->get_product_id()) === $product_id) {
                $qty = max(1, (int) $item->get_quantity());
                return ((float) $item->get_subtotal() + (float) $item->get_subtotal_tax()) / $qty;
            }
        }
        return 0.0;
    }

    /**
     * Currency code of the order a ticket belongs to (for formatting amounts).
     *
     * @param array $ticket Ticket row.
     * @return string
     */
    public static function get_ticket_currency($ticket) {
        $order = wc_get_order(absint($ticket['order_id']));
        return $order ? $order->get_currency() : get_woocommerce_currency();
    }

    /**
     * Centralized dietary options used across checkout, order editing and the
     * customer account. The leading empty option is included for edit contexts;
     * checkout omits it (the field is required there).
     *
     * @param bool $include_empty Whether to prepend an empty "—" option.
     * @return array value => label
     */
    public static function get_dietary_options($include_empty = true) {
        $options = array(
            'none'       => __('None', 'rt-event-manager'),
            'vegetarian' => __('Vegetarian', 'rt-event-manager'),
            'vegan'      => __('Vegan', 'rt-event-manager'),
            'allergies'  => __('Allergies', 'rt-event-manager'),
        );
        if ($include_empty) {
            $options = array('' => '—') + $options;
        }
        return $options;
    }

    /**
     * Admin-maintained allergy suggestions (type-ahead), as a list.
     *
     * @return string[]
     */
    public static function get_allergy_suggestions() {
        $raw   = (string) get_option('rt_event_manager_allergy_suggestions', '');
        $lines = preg_split('/\r\n|\r|\n/', $raw);
        $out   = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line !== '') {
                $out[] = $line;
            }
        }
        return $out;
    }

    /**
     * Update a single ticket in the custom table
     *
     * @param int   $ticket_id Ticket row ID
     * @param array $data      Data to update
     * @return bool
     */
    public function update_ticket($ticket_id, $data) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        $update_data   = array();
        $update_format = array();

        $allowed_fields = array(
            'holder_name'           => '%s',
            'phone'                 => '%s',
            'dob'                   => '%s',
            'rti_family'            => '%s',
            'rti_club'              => '%s',
            'dietary'               => '%s',
            'allergy_details'       => '%s',
            'world_id'              => '%s',
            'qr_code_url'           => '%s',
            'status'                => '%s',
            'combination_id'        => '%d',
            'parent_ticket_id'      => '%d',
            'ticket_kind'           => '%s',
            'minor_type'            => '%s',
            'owner_user_id'         => '%d',
            'transfer_token'        => '%s',
            'transfer_email'        => '%s',
            'transfer_requested_at' => '%s',
            'refund_status'         => '%s',
            'transferred_from_user_id' => '%d',
            'transferred_at'        => '%s',
            'checked_in_at'         => '%s',
            'checked_in_by'         => '%d',
        );

        foreach ($allowed_fields as $field => $format) {
            if (isset($data[$field])) {
                $update_data[$field] = ($field === 'phone')
                    ? self::normalize_phone($data[$field])
                    : sanitize_text_field($data[$field]);
                $update_format[]     = $format;
            }
        }

        if (empty($update_data)) {
            return false;
        }

        $result = $wpdb->update(
            $table_name,
            $update_data,
            array('id' => absint($ticket_id)),
            $update_format,
            array('%d')
        );

        // Keep a member's pretour ticket holder in sync with their own ticket.
        if (false !== $result && isset($update_data['holder_name'])) {
            $this->sync_child_pretour_holder($ticket_id, $update_data['holder_name']);
        }

        return $result !== false;
    }

    /**
     * Propagate a holder-name change to any pretour ticket linked to this ticket
     * (a pretour is for the same person as its parent member ticket). Scoped to
     * pretour children so it never overwrites a different person (e.g. a minor).
     *
     * @param int    $parent_ticket_id
     * @param string $holder_name
     */
    private function sync_child_pretour_holder($parent_ticket_id, $holder_name) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';
        $wpdb->update(
            $table_name,
            array('holder_name' => sanitize_text_field($holder_name)),
            array('parent_ticket_id' => absint($parent_ticket_id), 'ticket_kind' => 'pretour'),
            array('%s'),
            array('%d', '%s')
        );
    }

    /**
     * Add RTI fields to admin order billing fields
     *
     * @param array $fields Billing fields
     * @return array
     */
    public function add_admin_billing_fields($fields) {
        // Organization Details
        $fields['rti_family'] = array(
            'label'         => __('Family Organization', 'rt-event-manager'),
            'show'          => true,
            'type'          => 'select',
            'options'       => array('' => __('— Select —', 'rt-event-manager')) + self::$family_options,
            'wrapper_class' => 'form-field-wide',
            'class'         => 'select short',
        );

        $fields['rti_club'] = array(
            'label'         => __('Club', 'rt-event-manager'),
            'show'          => true,
            'wrapper_class' => 'form-field-wide',
        );

        $fields['rti_function'] = array(
            'label'         => __('Function / Role', 'rt-event-manager'),
            'show'          => true,
            'wrapper_class' => 'form-field-wide',
        );

        $fields['rti_emergency_contact'] = array(
            'label'         => __('Emergency Contact', 'rt-event-manager'),
            'show'          => true,
            'wrapper_class' => 'form-field-wide',
        );

        return $fields;
    }

    /**
     * Custom display handler for RTI family field in admin
     * Converts numeric ID to readable label
     *
     * @param string $value The field value
     * @return string
     */
    public function get_rti_family_display_value($value) {
        if ($value !== '' && isset(self::$family_options[$value])) {
            return self::$family_options[$value];
        }
        return $value;
    }

    /**
     * Register tickets metabox on order edit screen
     */
    public function add_tickets_metabox() {
        $screen_ids = array('shop_order', 'woocommerce_page_wc-orders');
        foreach ($screen_ids as $screen_id) {
            add_meta_box(
                'rti-tickets-metabox',
                __('Tickets', 'rt-event-manager'),
                array($this, 'render_tickets_metabox'),
                $screen_id,
                'normal',
                'default'
            );
        }
    }

    /**
     * Render a single ticket table row (used by both initial render and AJAX add)
     *
     * @param array $ticket Ticket data from DB row
     */
    private function render_ticket_row($ticket) {
        $ticket_num   = intval($ticket['ticket_index']) + 1;
        $product      = wc_get_product($ticket['product_id']);
        $product_name = $product ? $product->get_name() : __('(deleted)', 'rt-event-manager');

        echo '<tr data-ticket-id="' . esc_attr($ticket['id']) . '">';

        // Ticket number
        echo '<td class="rti-ticket-num">' . esc_html($ticket_num) . '</td>';

        // Type (Event / Pretour / Future Tabler|Circler)
        echo '<td>' . esc_html(self::ticket_kind_label($ticket)) . '</td>';

        // Product name (read-only)
        echo '<td>' . esc_html($product_name) . '</td>';

        // Parent event/pretour ticket (for pretour and future co-travellers)
        $parent_label = self::ticket_parent_label($ticket);
        echo '<td>' . ($parent_label !== '' ? esc_html($parent_label) : '<span style="color:#999;">&mdash;</span>') . '</td>';

        // Holder name
        echo '<td><input type="text" class="rti-ticket-field" name="rti_ticket[' . esc_attr($ticket['id']) . '][holder_name]" value="' . esc_attr($ticket['holder_name']) . '" style="width:100%;" /></td>';

        // Phone (international format)
        $ticket_phone = isset($ticket['phone']) ? $ticket['phone'] : '';
        echo '<td><input type="tel" class="rti-ticket-field" name="rti_ticket[' . esc_attr($ticket['id']) . '][phone]" value="' . esc_attr($ticket_phone) . '" style="width:100%;" pattern="\+[0-9\s()\-]{7,}" inputmode="tel" placeholder="+41791234567" title="' . esc_attr__('International format, e.g. +41791234567', 'rt-event-manager') . '" /></td>';

        // RTI Family dropdown
        echo '<td><select class="rti-ticket-field" name="rti_ticket[' . esc_attr($ticket['id']) . '][rti_family]" style="width:100%;">';
        echo '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
        foreach (self::$family_options as $key => $label) {
            echo '<option value="' . esc_attr($key) . '" ' . selected($ticket['rti_family'], (string) $key, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select></td>';

        // Club
        echo '<td><input type="text" class="rti-ticket-field" name="rti_ticket[' . esc_attr($ticket['id']) . '][rti_club]" value="' . esc_attr($ticket['rti_club']) . '" style="width:100%;" /></td>';

        // Dietary (+ conditional allergy details)
        echo '<td><select class="rti-ticket-field rti-dietary-select" name="rti_ticket[' . esc_attr($ticket['id']) . '][dietary]" style="width:100%;">';
        $dietary_options = self::get_dietary_options(true);
        foreach ($dietary_options as $dkey => $dlabel) {
            echo '<option value="' . esc_attr($dkey) . '" ' . selected($ticket['dietary'], $dkey, false) . '>' . esc_html($dlabel) . '</option>';
        }
        echo '</select>';
        $allergy_val = isset($ticket['allergy_details']) ? $ticket['allergy_details'] : '';
        $allergy_list_id = 'rti-allergy-list-' . absint($ticket['id']);
        $show_allergy = ($ticket['dietary'] === 'allergies') ? 'block' : 'none';
        echo '<input type="text" class="rti-ticket-field rti-allergy-input" name="rti_ticket[' . esc_attr($ticket['id']) . '][allergy_details]" value="' . esc_attr($allergy_val) . '" list="' . esc_attr($allergy_list_id) . '" placeholder="' . esc_attr__('Select or specify allergies', 'rt-event-manager') . '" style="width:100%;margin-top:4px;display:' . esc_attr($show_allergy) . ';" />';
        $allergy_suggestions = self::get_allergy_suggestions();
        if (!empty($allergy_suggestions)) {
            echo '<datalist id="' . esc_attr($allergy_list_id) . '">';
            foreach ($allergy_suggestions as $s) {
                echo '<option value="' . esc_attr($s) . '"></option>';
            }
            echo '</datalist>';
        }
        echo '</td>';

        // .WORLD ID
        echo '<td><input type="text" class="rti-ticket-field" name="rti_ticket[' . esc_attr($ticket['id']) . '][world_id]" value="' . esc_attr($ticket['world_id']) . '" style="width:100%;" /></td>';

        // QR Code URL (display only — auto-generated from world_id)
        echo '<td class="rti-qr-cell">';
        if (!empty($ticket['qr_code_url'])) {
            echo '<code style="font-size:11px;word-break:break-all;">' . esc_html($ticket['qr_code_url']) . '</code>';
        } else {
            echo '<span class="dashicons dashicons-minus" style="color:#999;"></span>';
        }
        echo '</td>';

        // Status badge (read-only)
        $ticket_status = isset($ticket['status']) ? $ticket['status'] : 'draft';
        $status_labels = array('valid' => __('Valid', 'rt-event-manager'), 'draft' => __('Draft', 'rt-event-manager'), 'invalid' => __('Invalid', 'rt-event-manager'), 'checked_in' => __('Checked In', 'rt-event-manager'), 'cancelled' => __('Cancelled', 'rt-event-manager'), 'refunded' => __('Refunded', 'rt-event-manager'));
        $status_colors = array('valid' => '#00a32a', 'draft' => '#dba617', 'invalid' => '#d63638', 'checked_in' => '#2271b1', 'cancelled' => '#8c8f94', 'refunded' => '#8250df');
        $badge_color = isset($status_colors[$ticket_status]) ? $status_colors[$ticket_status] : '#999';
        $badge_label = isset($status_labels[$ticket_status]) ? $status_labels[$ticket_status] : ucfirst($ticket_status);
        echo '<td><span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600;color:#fff;background:' . esc_attr($badge_color) . ';">' . esc_html($badge_label) . '</span></td>';

        // Buyer info columns (only on first ticket of the order)
        $is_first_ticket = intval($ticket['ticket_index']) === 0;
        $voucher_val  = isset($this->_order_buyer_voucher) ? $this->_order_buyer_voucher : '';
        $phone_val    = isset($this->_order_buyer_phone) ? $this->_order_buyer_phone : '';
        $function_val = isset($this->_order_buyer_function) ? $this->_order_buyer_function : '';
        echo '<td>' . esc_html($is_first_ticket ? ($voucher_val ?: '—') : '') . '</td>';
        echo '<td>' . esc_html($is_first_ticket ? ($phone_val ?: '—') : '') . '</td>';
        echo '<td>' . esc_html($is_first_ticket ? ($function_val ?: '—') : '') . '</td>';

        // Print badge button (admin only)
        if (current_user_can('manage_options')) {
            $print_url = add_query_arg(array(
                'action'    => 'rti_print_badge',
                'ticket_id' => $ticket['id'],
                'nonce'     => wp_create_nonce('rti_print_badge'),
            ), admin_url('admin-ajax.php'));
            echo '<td style="text-align:center;">';
            echo '<a href="' . esc_url($print_url) . '" target="_blank" class="button button-small rti-print-badge-btn" title="' . esc_attr__('Print Badge', 'rt-event-manager') . '">';
            echo '<span class="dashicons dashicons-printer" style="vertical-align:middle;margin-top:2px;"></span>';
            echo '</a>';
            echo '</td>';
        }

        echo '</tr>';
    }

    /**
     * Render the tickets metabox content
     *
     * @param WP_Post|WC_Order $post_or_order
     */
    public function render_tickets_metabox($post_or_order) {
        // Support both HPOS and legacy post-based orders
        if ($post_or_order instanceof WC_Order) {
            $order_id = $post_or_order->get_id();
            $order    = $post_or_order;
        } else {
            $order_id = $post_or_order->ID;
            $order    = wc_get_order($order_id);
        }

        $tickets = self::get_tickets_for_order($order_id);

        wp_nonce_field('rti_save_tickets', 'rti_tickets_nonce');
        echo '<input type="hidden" id="rti-tickets-order-id" value="' . esc_attr($order_id) . '" />';

        // Build product options from ALL ticket-type products (not just order line items)
        $ticket_products = array();
        $ticket_product_posts = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'meta_query'     => array(
                array(
                    'key'   => '_rti_is_ticket',
                    'value' => 'yes',
                ),
            ),
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));
        foreach ($ticket_product_posts as $tp) {
            $product = wc_get_product($tp->ID);
            if ($product) {
                $ticket_products[$tp->ID] = $product->get_name();
            }
        }

        echo '<table class="rti-tickets-table widefat striped">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('#', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Type', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Product', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Main ticket / Guardian', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Ticket Phone', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('RTI Family', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Club', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Dietary', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('.WORLD ID', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('QR Code', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Status', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Voucher', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Phone', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Function / Role', 'rt-event-manager') . '</th>';
        if (current_user_can('manage_options')) {
            echo '<th style="width:50px;">' . esc_html__('Print', 'rt-event-manager') . '</th>';
        }
        echo '</tr></thead>';

        // Pre-fetch order-level buyer info for use in render_ticket_row.
        if ($order) {
            $coupon_codes = $order->get_coupon_codes();
            $this->_order_buyer_voucher  = !empty($coupon_codes) ? implode(', ', $coupon_codes) : '';
            $this->_order_buyer_phone    = $order->get_billing_phone();
            $this->_order_buyer_function = $order->get_meta('_rti_function');
        } else {
            $this->_order_buyer_voucher  = '';
            $this->_order_buyer_phone    = '';
            $this->_order_buyer_function = '';
        }
        echo '<tbody id="rti-tickets-tbody">';

        if (empty($tickets)) {
            $total_cols = 15 + (current_user_can('manage_options') ? 1 : 0); // 15 base cols + optional print col
            echo '<tr id="rti-no-tickets-row"><td colspan="' . intval($total_cols) . '" style="text-align:center;color:#999;">';
            echo esc_html__('No tickets yet.', 'rt-event-manager');
            echo '</td></tr>';
        } else {
            // Get the .WORLD ID for auto-filling ticket #1 — check order meta first, then user meta
            $customer_world_id = '';
            $customer_id = 0;
            if ($order) {
                // Try order meta first (saved during checkout)
                $customer_world_id = $order->get_meta('_rti_world_id');
                $customer_id = $order->get_customer_id();

                // Fall back to user meta
                if (empty($customer_world_id) && $customer_id) {
                    $customer_world_id = get_user_meta($customer_id, 'world_id', true);
                }
            }

            foreach ($tickets as &$ticket) {
                // Auto-fill .WORLD ID and QR code for ticket #1 if empty
                if (intval($ticket['ticket_index']) === 0 && empty($ticket['world_id']) && !empty($customer_world_id)) {
                    $ticket['world_id']    = $customer_world_id;
                    $ticket['qr_code_url'] = 'tablerworld:///member?id=' . $customer_world_id;

                    // Persist to DB so it's saved permanently
                    $this->update_ticket($ticket['id'], array(
                        'world_id'    => $customer_world_id,
                        'qr_code_url' => 'tablerworld:///member?id=' . $customer_world_id,
                    ));
                }

                $this->render_ticket_row($ticket);
            }
            unset($ticket);
        }

        echo '</tbody></table>';

        // Add ticket controls
        echo '<div class="rti-add-ticket-controls" style="margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';

        // Product selector (all ticket-type products)
        echo '<select id="rti-add-ticket-product" style="min-width:200px;">';
        if (empty($ticket_products)) {
            echo '<option value="">' . esc_html__('No ticket products found', 'rt-event-manager') . '</option>';
        } else {
            foreach ($ticket_products as $pid => $pname) {
                echo '<option value="' . esc_attr($pid) . '">' . esc_html($pname) . '</option>';
            }
        }
        echo '</select>';

        echo '<button type="button" class="button" id="rti-add-ticket" ' . (empty($ticket_products) ? 'disabled' : '') . '>';
        echo '<span class="dashicons dashicons-plus-alt2" style="vertical-align:middle;margin-top:-2px;"></span> ';
        echo esc_html__('Add Ticket', 'rt-event-manager');
        echo '</button>';

        echo '<button type="button" class="button button-primary" id="rti-save-tickets">' . esc_html__('Save Tickets', 'rt-event-manager') . '</button>';
        echo '<span id="rti-tickets-status" style="margin-left:4px;display:none;"></span>';

        echo '</div>';

        // Inline JS for AJAX save + add
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            var orderId = $('#rti-tickets-order-id').val();
            var nonce   = $('#rti_tickets_nonce').val();

            // ---- Toggle allergy details when dietary = Allergies ----
            $('#rti-tickets-tbody').on('change', '.rti-dietary-select', function() {
                $(this).closest('tr').find('.rti-allergy-input').toggle($(this).val() === 'allergies');
            });

            // ---- Save existing tickets ----
            $('#rti-save-tickets').on('click', function(e) {
                e.preventDefault();
                var $btn    = $(this);
                var $status = $('#rti-tickets-status');

                // Collect ticket data from rows with data-ticket-id (skip no-tickets placeholder)
                var tickets = {};
                var hasTickets = false;
                $('#rti-tickets-tbody tr[data-ticket-id]').each(function() {
                    var ticketId = $(this).data('ticket-id');
                    tickets[ticketId] = {};
                    hasTickets = true;
                    $(this).find('.rti-ticket-field').each(function() {
                        var name = $(this).attr('name');
                        var match = name.match(/\[([^\]]+)\]$/);
                        if (match) {
                            tickets[ticketId][match[1]] = $(this).val();
                        }
                    });
                });

                if (!hasTickets) {
                    $status.text('<?php echo esc_js(__('Nothing to save.', 'rt-event-manager')); ?>').css('color', '#999').show();
                    setTimeout(function() { $status.fadeOut(); }, 2000);
                    return;
                }

                $btn.prop('disabled', true);
                $status.text('<?php echo esc_js(__('Saving...', 'rt-event-manager')); ?>').css('color', '#666').show();

                $.post(ajaxurl, {
                    action:   'rti_save_tickets',
                    order_id: orderId,
                    nonce:    nonce,
                    tickets:  tickets
                }, function(response) {
                    $btn.prop('disabled', false);
                    if (response.success) {
                        $status.text('<?php echo esc_js(__('Saved!', 'rt-event-manager')); ?>').css('color', '#46b450');
                        if (response.data && response.data.qr_urls) {
                            $.each(response.data.qr_urls, function(tid, url) {
                                var $cell = $('tr[data-ticket-id="' + tid + '"] .rti-qr-cell');
                                if (url) {
                                    $cell.html('<code style="font-size:11px;word-break:break-all;">' + $('<span>').text(url).html() + '</code>');
                                } else {
                                    $cell.html('<span class="dashicons dashicons-minus" style="color:#999;"></span>');
                                }
                            });
                        }
                        setTimeout(function() { $status.fadeOut(); }, 3000);
                    } else {
                        $status.text(response.data || '<?php echo esc_js(__('Error saving tickets.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                    }
                }).fail(function() {
                    $btn.prop('disabled', false);
                    $status.text('<?php echo esc_js(__('Request failed.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                });
            });

            // ---- Add new ticket ----
            $('#rti-add-ticket').on('click', function(e) {
                e.preventDefault();
                var $btn       = $(this);
                var productId  = $('#rti-add-ticket-product').val();
                var $status    = $('#rti-tickets-status');

                if (!productId) return;

                $btn.prop('disabled', true);
                $status.text('<?php echo esc_js(__('Adding...', 'rt-event-manager')); ?>').css('color', '#666').show();

                $.post(ajaxurl, {
                    action:     'rti_add_ticket',
                    order_id:   orderId,
                    product_id: productId,
                    nonce:      nonce
                }, function(response) {
                    $btn.prop('disabled', false);
                    if (response.success) {
                        // Remove "No tickets" placeholder if present
                        $('#rti-no-tickets-row').remove();
                        // Append the new row HTML returned by the server
                        $('#rti-tickets-tbody').append(response.data.row_html);
                        $status.text('<?php echo esc_js(__('Ticket added!', 'rt-event-manager')); ?>').css('color', '#46b450');
                        setTimeout(function() { $status.fadeOut(); }, 3000);
                    } else {
                        $status.text(response.data || '<?php echo esc_js(__('Error adding ticket.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                    }
                }).fail(function() {
                    $btn.prop('disabled', false);
                    $status.text('<?php echo esc_js(__('Request failed.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                });
            });
        });
        </script>
        <?php
    }

    /**
     * AJAX handler to save ticket edits from admin metabox
     */
    public function ajax_save_tickets() {
        check_ajax_referer('rti_save_tickets', 'nonce');

        if (!current_user_can('edit_shop_orders')) {
            wp_send_json_error(__('Permission denied.', 'rt-event-manager'));
        }

        $order_id = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;
        $tickets  = isset($_POST['tickets']) ? $_POST['tickets'] : array();

        if (!$order_id || empty($tickets)) {
            wp_send_json_error(__('Invalid data.', 'rt-event-manager'));
        }

        // Verify tickets belong to this order
        $existing = self::get_tickets_for_order($order_id);
        $valid_ids = array_map('intval', array_column($existing, 'id'));

        // Map ticket id => ticket_index for human-friendly validation messages.
        $existing_index_map = array();
        foreach ($existing as $ex_row) {
            $existing_index_map[intval($ex_row['id'])] = intval($ex_row['ticket_index']);
        }

        $qr_urls = array();

        foreach ($tickets as $ticket_id => $data) {
            $ticket_id = absint($ticket_id);
            if (!in_array($ticket_id, $valid_ids, true)) {
                continue;
            }

            // Validate phone format when one is provided. Admins may leave the
            // field blank on a newly added ticket, but a non-empty value must be
            // in international format.
            if (isset($data['phone']) && trim(wp_unslash($data['phone'])) !== '' && !self::is_valid_intl_phone(wp_unslash($data['phone']))) {
                wp_send_json_error(sprintf(
                    __('Ticket %d: phone number must be in international format, e.g. +41791234567.', 'rt-event-manager'),
                    intval($existing_index_map[$ticket_id]) + 1
                ));
            }

            // Auto-generate QR URL from world_id
            $world_id = isset($data['world_id']) ? sanitize_text_field($data['world_id']) : '';
            $data['qr_code_url'] = !empty($world_id) ? 'tablerworld:///member?id=' . $world_id : '';
            $qr_urls[$ticket_id] = $data['qr_code_url'];

            $this->update_ticket($ticket_id, $data);
        }

        // Recalculate ticket statuses (holder_name may have changed)
        $this->recalculate_order_ticket_statuses($order_id);

        wp_send_json_success(array('qr_urls' => $qr_urls));
    }

    /**
     * AJAX handler to add a new ticket to an order
     */
    public function ajax_add_ticket() {
        check_ajax_referer('rti_save_tickets', 'nonce');

        if (!current_user_can('edit_shop_orders')) {
            wp_send_json_error(__('Permission denied.', 'rt-event-manager'));
        }

        $order_id   = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;
        $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;

        if (!$order_id || !$product_id) {
            wp_send_json_error(__('Invalid data.', 'rt-event-manager'));
        }

        // Verify the order exists
        $order = wc_get_order($order_id);
        if (!$order) {
            wp_send_json_error(__('Order not found.', 'rt-event-manager'));
        }

        // Determine next ticket_index for this order
        $existing = self::get_tickets_for_order($order_id);
        $next_index = 0;
        if (!empty($existing)) {
            $max_index = max(array_column($existing, 'ticket_index'));
            $next_index = intval($max_index) + 1;
        }

        // Inherit combination_id from the order line item for this product.
        $combo_id = 0;
        foreach ($order->get_items() as $item) {
            if (absint($item->get_product_id()) === $product_id) {
                $item_combo = absint($item->get_meta('_mto_combination_id'));
                if ($item_combo) {
                    $combo_id = $item_combo;
                    break;
                }
            }
        }

        $ticket_id = $this->insert_ticket(array(
            'order_id'       => $order_id,
            'product_id'     => $product_id,
            'combination_id' => $combo_id,
            'ticket_kind'    => self::get_ticket_kind_for_product($product_id),
            'ticket_index'   => $next_index,
            'holder_name'    => '',
            'phone'          => '',
            'rti_family'     => '',
            'rti_club'       => '',
            'dietary'        => '',
            'world_id'       => '',
            'qr_code_url'    => '',
        ));

        if (!$ticket_id) {
            wp_send_json_error(__('Failed to create ticket.', 'rt-event-manager'));
        }

        // Add a private (non-deletable) order note recording who created the ticket
        $current_user = wp_get_current_user();
        $product      = wc_get_product($product_id);
        $product_name = $product ? $product->get_name() : __('Unknown Product', 'rt-event-manager');
        $ticket_num   = $next_index + 1;
        $timestamp    = current_time('Y-m-d H:i:s');

        $note_text = sprintf(
            /* translators: 1: admin user display name, 2: date/time, 3: ticket number, 4: product name */
            __('Ticket manually added by %1$s on %2$s — Ticket #%3$d (%4$s)', 'rt-event-manager'),
            $current_user->display_name,
            $timestamp,
            $ticket_num,
            $product_name
        );

        // is_customer_note = false makes it a private/internal note (cannot be deleted from frontend)
        $order->add_order_note($note_text, false, true);

        // Build the new row data
        $ticket_data = array(
            'id'           => $ticket_id,
            'order_id'     => $order_id,
            'product_id'   => $product_id,
            'ticket_index' => $next_index,
            'holder_name'  => '',
            'phone'        => '',
            'rti_family'   => '',
            'rti_club'     => '',
            'dietary'      => '',
            'world_id'     => '',
            'qr_code_url'  => '',
        );

        // Render the row HTML into a buffer
        ob_start();
        $this->render_ticket_row($ticket_data);
        $row_html = ob_get_clean();

        wp_send_json_success(array('row_html' => $row_html, 'ticket_id' => $ticket_id));
    }

    /**
     * AJAX handler for exporting tickets to Excel (.xlsx)
     */
    public function ajax_export_tickets_xlsx() {
        // Verify nonce
        if (!isset($_GET['nonce']) || !wp_verify_nonce($_GET['nonce'], 'rti_export_tickets')) {
            wp_die(__('Security check failed.', 'rt-event-manager'));
        }

        // Check capability
        if (!current_user_can('edit_shop_orders')) {
            wp_die(__('Permission denied.', 'rt-event-manager'));
        }

        // Check if PhpSpreadsheet is available
        if (!class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
            wp_die(__('PhpSpreadsheet library not available. Please run composer install.', 'rt-event-manager'));
        }

        global $wpdb;
        $tickets_table = $wpdb->prefix . 'rti_tickets';

        // Get filter parameters
        $search         = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $filter_product = isset($_GET['product_id']) ? absint($_GET['product_id']) : 0;
        $filter_family  = isset($_GET['rti_family']) ? sanitize_text_field($_GET['rti_family']) : '';
        $filter_statuses = isset($_GET['ticket_status']) && is_array($_GET['ticket_status'])
            ? array_map('sanitize_text_field', $_GET['ticket_status'])
            : array('valid', 'draft', 'checked_in');

        // Build query (same logic as overview page, but no pagination)
        $where = array('1=1');
        $params = array();

        if (!empty($search)) {
            $like = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(t.holder_name LIKE %s OR t.rti_club LIKE %s OR t.world_id LIKE %s OR t.phone LIKE %s)';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($filter_product > 0) {
            $where[] = 't.product_id = %d';
            $params[] = $filter_product;
        }

        if ($filter_family !== '') {
            $where[] = 't.rti_family = %s';
            $params[] = $filter_family;
        }

        if (!empty($filter_statuses)) {
            $placeholders = implode(', ', array_fill(0, count($filter_statuses), '%s'));
            $where[] = "t.status IN ($placeholders)";
            $params = array_merge($params, $filter_statuses);
        } else {
            $where[] = '1=0';
        }

        $where_sql = implode(' AND ', $where);

        // Get all matching tickets
        $query = "SELECT t.*, p.post_title AS product_name
                  FROM $tickets_table t
                  LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
                  WHERE $where_sql
                  ORDER BY t.order_id DESC, t.ticket_index ASC";

        $tickets = empty($params)
            ? $wpdb->get_results($query, ARRAY_A)
            : $wpdb->get_results($wpdb->prepare($query, $params), ARRAY_A);

        // Create spreadsheet
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Tickets');

        // Headers
        $headers = array(
            'Order ID',
            'Ticket #',
            'Product',
            'Ticket Type',
            'Status',
            'Holder Name',
            'Country',
            'RTI Family',
            'Club',
            'Dietary',
            '.WORLD ID',
            'QR Code URL',
            'Parent Ticket',
            'Voucher',
            'Phone',
            'Function / Role',
            'Ticket Phone',
            'Date of Birth',
            'Allergy details',
        );

        $col = 1;
        foreach ($headers as $header) {
            $sheet->setCellValueByColumnAndRow($col, 1, $header);
            $col++;
        }

        // Style header row
        $headerStyle = array(
            'font' => array('bold' => true),
            'fill' => array(
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => array('rgb' => 'CCCCCC'),
            ),
        );
        $last_col_letter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($headers));
        $sheet->getStyle('A1:' . $last_col_letter . '1')->applyFromArray($headerStyle);

        // Data rows
        $row = 2;
        foreach ($tickets as $ticket) {
            $order = wc_get_order($ticket['order_id']);
            $billing_country = $order ? $order->get_billing_country() : '';

            $family_label = '';
            if ($ticket['rti_family'] !== '' && isset(self::$family_options[absint($ticket['rti_family'])])) {
                $family_label = self::$family_options[absint($ticket['rti_family'])];
            }

            $dietary_label = $ticket['dietary'] ?: '';
            if ($dietary_label === 'none') $dietary_label = 'None';
            if ($dietary_label === 'vegetarian') $dietary_label = 'Vegetarian';
            if ($dietary_label === 'allergies') $dietary_label = 'Allergies';
            $allergy_details = isset($ticket['allergy_details']) ? $ticket['allergy_details'] : '';

            // Ticket type (Event / Pretour / Future) and parent reference.
            $ticket_type   = self::ticket_kind_label($ticket);
            $parent_label  = self::ticket_parent_label($ticket);

            // Buyer info (only on first ticket of each order)
            $is_first_ticket = intval($ticket['ticket_index']) === 0;
            $buyer_voucher  = '';
            $buyer_phone    = '';
            $buyer_function = '';
            if ($is_first_ticket && $order) {
                $coupon_codes   = $order->get_coupon_codes();
                $buyer_voucher  = !empty($coupon_codes) ? implode(', ', $coupon_codes) : '';
                $buyer_phone    = $order->get_billing_phone();
                $buyer_function = $order->get_meta('_rti_function');
            }

            $sheet->setCellValueByColumnAndRow(1, $row, $ticket['order_id']);
            $sheet->setCellValueByColumnAndRow(2, $row, intval($ticket['ticket_index']) + 1);
            $sheet->setCellValueByColumnAndRow(3, $row, $ticket['product_name'] ?: '(deleted)');
            $sheet->setCellValueByColumnAndRow(4, $row, $ticket_type);
            $sheet->setCellValueByColumnAndRow(5, $row, ucfirst($ticket['status']));
            $sheet->setCellValueByColumnAndRow(6, $row, $ticket['holder_name']);
            $sheet->setCellValueByColumnAndRow(7, $row, $billing_country);
            $sheet->setCellValueByColumnAndRow(8, $row, $family_label);
            $sheet->setCellValueByColumnAndRow(9, $row, $ticket['rti_club']);
            $sheet->setCellValueByColumnAndRow(10, $row, $dietary_label);
            $sheet->setCellValueByColumnAndRow(11, $row, $ticket['world_id']);
            $sheet->setCellValueByColumnAndRow(12, $row, $ticket['qr_code_url']);
            $sheet->setCellValueByColumnAndRow(13, $row, $parent_label);
            $sheet->setCellValueByColumnAndRow(14, $row, $buyer_voucher);
            $sheet->setCellValueByColumnAndRow(15, $row, $buyer_phone);
            $sheet->setCellValueByColumnAndRow(16, $row, $buyer_function);
            $sheet->setCellValueByColumnAndRow(17, $row, isset($ticket['phone']) ? $ticket['phone'] : '');
            $sheet->setCellValueByColumnAndRow(18, $row, isset($ticket['dob']) ? $ticket['dob'] : '');
            $sheet->setCellValueByColumnAndRow(19, $row, $allergy_details);

            $row++;
        }

        // Auto-size columns
        foreach (range('A', $last_col_letter) as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        // Generate filename
        $filename = 'tickets-export-' . date('Y-m-d-His') . '.xlsx';

        // Output
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }

    /**
     * Add RTI details to order preview in admin
     *
     * @param array    $data Order preview data
     * @param WC_Order $order Order object
     * @return array
     */
    public function add_rti_to_order_preview($data, $order) {
        $family = $order->get_meta('_rti_family');
        $club = $order->get_meta('_rti_club');
        $function = $order->get_meta('_rti_function');

        $rti_parts = array();

        if ($family !== '') {
            $rti_parts[] = self::get_family_label($family);
        }
        if ($club) {
            $rti_parts[] = $club;
        }
        if ($function) {
            $rti_parts[] = $function;
        }

        if (!empty($rti_parts)) {
            $data['rti_organization'] = implode(', ', $rti_parts);
        }

        return $data;
    }

    /**
     * Add RTI fields to formatted billing address
     *
     * @param array    $address Address fields
     * @param WC_Order $order Order object
     * @return array
     */
    public function add_rti_to_formatted_address($address, $order) {
        $family = $order->get_meta('_rti_family');
        $club = $order->get_meta('_rti_club');
        $function = $order->get_meta('_rti_function');

        // Build RTI line
        $rti_parts = array();
        if ($family !== '') {
            $rti_parts[] = self::get_family_label($family);
        }
        if ($club) {
            $rti_parts[] = $club;
        }
        if ($function) {
            $rti_parts[] = $function;
        }

        $address['rti_organization'] = !empty($rti_parts) ? implode(', ', $rti_parts) : '';

        return $address;
    }

    /**
     * Add RTI placeholder replacements
     *
     * @param array $replacements Address replacements
     * @param array $args Address arguments
     * @return array
     */
    public function format_rti_address_replacements($replacements, $args) {
        $replacements['{rti_organization}'] = isset($args['rti_organization']) ? $args['rti_organization'] : '';
        $replacements['{rti_organization_upper}'] = isset($args['rti_organization']) ? strtoupper($args['rti_organization']) : '';
        return $replacements;
    }

    /**
     * Modify address format to include RTI organization
     *
     * @param array $formats Address formats by country
     * @return array
     */
    public function add_rti_address_format($formats) {
        // Add RTI organization line to all country formats
        foreach ($formats as $country => $format) {
            // Add after the name line (typically the first line)
            $formats[$country] = str_replace(
                "{name}\n",
                "{name}\n{rti_organization}\n",
                $format
            );
        }
        return $formats;
    }

    /**
     * Add custom columns to users list
     *
     * @param array $columns Existing columns
     * @return array
     */
    public function add_user_columns($columns) {
        $columns['rti_family'] = __('RTI Family', 'rt-event-manager');
        $columns['rti_club'] = __('Club', 'rt-event-manager');
        return $columns;
    }

    /**
     * Display content for custom user columns
     *
     * @param string $value Column value
     * @param string $column_name Column name
     * @param int    $user_id User ID
     * @return string
     */
    public function show_user_column_content($value, $column_name, $user_id) {
        switch ($column_name) {
            case 'rti_family':
                $family = get_user_meta($user_id, 'rti_family', true);
                return $family !== '' ? esc_html(self::get_family_label($family)) : '—';

            case 'rti_club':
                $club = get_user_meta($user_id, 'rti_club', true);
                return $club ? esc_html($club) : '—';
        }

        return $value;
    }

    /**
     * Make custom columns sortable
     *
     * @param array $columns Sortable columns
     * @return array
     */
    public function make_columns_sortable($columns) {
        $columns['rti_family'] = 'rti_family';
        return $columns;
    }

    // =============================================
    // Ticket Status — Order Status Change Handlers
    // =============================================

    /**
     * Recalculate ticket statuses when order status changes
     *
     * @param int    $order_id   Order ID
     * @param string $old_status Old status (without wc- prefix)
     * @param string $new_status New status (without wc- prefix)
     * @param WC_Order $order    Order object
     */
    public function on_order_status_changed($order_id, $old_status, $new_status, $order) {
        $this->recalculate_order_ticket_statuses($order_id);
    }

    /**
     * When an order is fully refunded in WooCommerce, mark its tickets refunded:
     * confirm any pending refund request, and auto-cancel (refund) tickets that
     * had no request. Checked-in tickets are left untouched.
     *
     * @param int $order_id
     */
    public function on_order_refunded($order_id) {
        $tickets = self::get_tickets_for_order($order_id);
        foreach ($tickets as $t) {
            $status = isset($t['status']) ? $t['status'] : '';
            if (in_array($status, array('checked_in', 'refunded'), true)) {
                continue;
            }
            // A refund was processed → the ticket is refunded and the refund is
            // confirmed, whether or not the holder had requested one.
            $this->update_ticket(absint($t['id']), array(
                'status'        => 'refunded',
                'refund_status' => 'confirmed',
            ));
        }
    }

    /**
     * Mark tickets as invalid when order is trashed (HPOS)
     *
     * @param int $order_id Order ID
     */
    public function on_order_trashed($order_id) {
        $this->set_all_tickets_status($order_id, 'invalid');
    }

    /**
     * Mark tickets as invalid when order is deleted (HPOS)
     *
     * @param int $order_id Order ID
     */
    public function on_order_deleted($order_id) {
        $this->set_all_tickets_status($order_id, 'invalid');
    }

    /**
     * Mark tickets as invalid when order post is trashed (legacy)
     *
     * @param int $post_id Post ID
     */
    public function on_order_post_trashed($post_id) {
        if (get_post_type($post_id) === 'shop_order') {
            $this->set_all_tickets_status($post_id, 'invalid');
        }
    }

    /**
     * Mark tickets as invalid when order post is deleted (legacy)
     *
     * @param int $post_id Post ID
     */
    public function on_order_post_deleted($post_id) {
        if (get_post_type($post_id) === 'shop_order') {
            $this->set_all_tickets_status($post_id, 'invalid');
        }
    }

    /**
     * Set all tickets for an order to a given status
     *
     * @param int    $order_id Order ID
     * @param string $status   Status to set
     */
    private function set_all_tickets_status($order_id, $status) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        $wpdb->update(
            $table_name,
            array('status' => sanitize_text_field($status)),
            array('order_id' => absint($order_id)),
            array('%s'),
            array('%d')
        );
    }

    /**
     * Recalculate ticket statuses for all tickets on an order
     *
     * @param int $order_id Order ID
     */
    public function recalculate_order_ticket_statuses($order_id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';

        $order = wc_get_order($order_id);
        $tickets = $wpdb->get_results($wpdb->prepare(
            "SELECT id, holder_name, status FROM $table_name WHERE order_id = %d",
            $order_id
        ), ARRAY_A);

        foreach ($tickets as $ticket) {
            // Never overwrite terminal states set deliberately.
            if (in_array($ticket['status'], array('checked_in', 'cancelled', 'refunded'), true)) {
                continue;
            }
            $status = rt_event_manager_determine_ticket_status($order, $ticket['holder_name']);
            $wpdb->update(
                $table_name,
                array('status' => $status),
                array('id' => absint($ticket['id'])),
                array('%s'),
                array('%d')
            );
        }
    }

    // =============================================
    // Admin Side Menu — RT Event Manager
    // =============================================

    /**
     * Register admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('RT Event Manager', 'rt-event-manager'),
            __('RT Event Manager', 'rt-event-manager'),
            'edit_shop_orders',
            'rt-event-manager',
            array($this, 'render_tickets_overview_page'),
            'dashicons-tickets-alt',
            56 // After WooCommerce
        );

        add_submenu_page(
            'rt-event-manager',
            __('All Tickets', 'rt-event-manager'),
            __('All Tickets', 'rt-event-manager'),
            'edit_shop_orders',
            'rt-event-manager',
            array($this, 'render_tickets_overview_page')
        );

        add_submenu_page(
            'rt-event-manager',
            __('Refunds & Cancellations', 'rt-event-manager'),
            __('Refunds & Cancellations', 'rt-event-manager'),
            'edit_shop_orders',
            'rt-event-manager-refunds',
            array($this, 'render_refunds_page')
        );

        // Refunds workflow — shown only once at least one refund has been requested.
        if (self::has_refund_requests()) {
            add_submenu_page(
                'rt-event-manager',
                __('Refunds', 'rt-event-manager'),
                __('Refunds', 'rt-event-manager'),
                'edit_shop_orders',
                'rt-event-manager-refund-requests',
                array($this, 'render_refund_requests_page')
            );
        }

        add_submenu_page(
            'rt-event-manager',
            __('Transfers', 'rt-event-manager'),
            __('Transfers', 'rt-event-manager'),
            'edit_shop_orders',
            'rt-event-manager-transfers',
            array($this, 'render_transfers_page')
        );

        add_submenu_page(
            'rt-event-manager',
            __('Event Agenda', 'rt-event-manager'),
            __('Event Agenda', 'rt-event-manager'),
            'manage_options',
            'rt-event-manager-agenda',
            array($this, 'render_agenda_page')
        );

        add_submenu_page(
            'rt-event-manager',
            __('Settings', 'rt-event-manager'),
            __('Settings', 'rt-event-manager'),
            'manage_woocommerce',
            'rt-event-manager-settings',
            array($this, 'render_settings_page')
        );

        // Badge Template submenu (admin only)
        add_submenu_page(
            'rt-event-manager',
            __('Badge Template', 'rt-event-manager'),
            __('Badge Template', 'rt-event-manager'),
            'manage_options',
            'rt-event-badge-template',
            array($this, 'render_badge_template_page')
        );
    }

    /**
     * Admin page: cancelled tickets, with open refund requests surfaced first
     * and Confirm / Decline actions to record the organiser's decision.
     */
    public function render_refunds_page() {
        if (!current_user_can('edit_shop_orders')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';

        $this->process_refund_decision_post();

        $rows = $wpdb->get_results(
            "SELECT t.*, p.post_title AS product_name
             FROM $table t LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
             WHERE t.status IN ('cancelled', 'refunded')
             ORDER BY t.updated_at DESC, t.id DESC",
            ARRAY_A
        );

        $open = array();
        $rest = array();
        foreach ($rows as $r) {
            if ('requested' === $r['refund_status']) {
                $open[] = $r;
            } else {
                $rest[] = $r;
            }
        }

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Refunds & Cancellations', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Confirm or decline records the decision here for your reference. Process the actual payment refund in the WooCommerce order.', 'rt-event-manager') . '</p>';

        echo '<h2>' . esc_html(sprintf(__('Open refund requests (%d)', 'rt-event-manager'), count($open))) . '</h2>';
        $this->render_refund_table($open, true);

        echo '<h2>' . esc_html__('Other cancellations', 'rt-event-manager') . '</h2>';
        $this->render_refund_table($rest, false);

        echo '</div>';
    }

    /** Record a Confirm/Decline refund decision from a posted form (shared). */
    private function process_refund_decision_post() {
        if (!isset($_POST['rti_refund_action'], $_POST['rti_ticket_id'])) {
            return;
        }
        check_admin_referer('rti_refund_action');
        $tid      = absint($_POST['rti_ticket_id']);
        $decision = sanitize_key(wp_unslash($_POST['rti_refund_action']));
        if ($tid && in_array($decision, array('confirm', 'decline'), true)) {
            $new = ('confirm' === $decision) ? 'confirmed' : 'declined';
            $this->update_ticket($tid, array('refund_status' => $new));
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html(sprintf(
                'confirm' === $decision
                    ? __('Refund marked as confirmed for ticket #%d.', 'rt-event-manager')
                    : __('Refund marked as declined for ticket #%d.', 'rt-event-manager'),
                $tid
            )) . '</p></div>';
        }
    }

    /** Whether any ticket has an associated refund (requested or processed). */
    public static function has_refund_requests() {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        return (bool) $wpdb->get_var(
            "SELECT EXISTS(SELECT 1 FROM $table WHERE refund_status IN ('requested', 'confirmed', 'declined'))"
        );
    }

    /**
     * Admin page: refund workflow only — pending requests (Confirm/Decline) and
     * already-processed refunds. Registered only when a refund exists.
     */
    public function render_refund_requests_page() {
        if (!current_user_can('edit_shop_orders')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';

        $this->process_refund_decision_post();

        $requested = $wpdb->get_results(
            "SELECT t.*, p.post_title AS product_name
             FROM $table t LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
             WHERE t.refund_status = 'requested'
             ORDER BY t.updated_at DESC, t.id DESC",
            ARRAY_A
        );
        $processed = $wpdb->get_results(
            "SELECT t.*, p.post_title AS product_name
             FROM $table t LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
             WHERE t.refund_status IN ('confirmed', 'declined')
             ORDER BY t.updated_at DESC, t.id DESC",
            ARRAY_A
        );

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Refunds', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Requested refunds awaiting a decision, and refunds already processed. Confirm or decline records the decision here; process the actual payment refund in the WooCommerce order.', 'rt-event-manager') . '</p>';

        echo '<h2>' . esc_html(sprintf(__('Requested (%d)', 'rt-event-manager'), count($requested))) . '</h2>';
        $this->render_refund_table($requested, true);

        echo '<h2>' . esc_html(sprintf(__('Processed (%d)', 'rt-event-manager'), count($processed))) . '</h2>';
        $this->render_refund_table($processed, false);

        echo '</div>';
    }

    /** Render a cancelled-tickets table; $actionable adds Confirm/Decline. */
    private function render_refund_table($rows, $actionable) {
        if (empty($rows)) {
            echo '<p>' . esc_html__('None.', 'rt-event-manager') . '</p>';
            return;
        }
        $refund_labels = array(
            'requested' => __('Refund requested', 'rt-event-manager'),
            'confirmed' => __('Refund confirmed', 'rt-event-manager'),
            'declined'  => __('Refund declined', 'rt-event-manager'),
            'none'      => __('No refund (after cutoff)', 'rt-event-manager'),
            ''          => __('—', 'rt-event-manager'),
        );

        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Holder', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Ticket', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Amount paid', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Cancelled', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Refund', 'rt-event-manager') . '</th>';
        if ($actionable) {
            echo '<th>' . esc_html__('Actions', 'rt-event-manager') . '</th>';
        }
        echo '</tr></thead><tbody>';

        foreach ($rows as $r) {
            $order_id = absint($r['order_id']);
            $order    = wc_get_order($order_id);
            $order_link = $order ? $order->get_edit_order_url() : '';
            $amount   = wc_price(self::get_ticket_paid_amount($r), array('currency' => self::get_ticket_currency($r)));
            $rlabel   = isset($refund_labels[$r['refund_status']]) ? $refund_labels[$r['refund_status']] : $r['refund_status'];
            $pname    = $r['product_name'] ? $r['product_name'] : ('#' . $r['product_id']);

            echo '<tr>';
            echo '<td>' . ($order_link ? '<a href="' . esc_url($order_link) . '">#' . esc_html($order_id) . '</a>' : ('#' . esc_html($order_id))) . '</td>';
            echo '<td>' . esc_html($r['holder_name'] !== '' ? $r['holder_name'] : '—') . '</td>';
            echo '<td>' . esc_html($pname . ' (' . self::ticket_kind_label($r) . ')') . '</td>';
            echo '<td>' . wp_kses_post($amount) . '</td>';
            echo '<td>' . esc_html($r['updated_at']) . '</td>';
            echo '<td>' . esc_html($rlabel) . '</td>';
            if ($actionable) {
                echo '<td><form method="post" style="display:inline">';
                wp_nonce_field('rti_refund_action');
                echo '<input type="hidden" name="rti_ticket_id" value="' . esc_attr($r['id']) . '" />';
                echo '<button type="submit" class="button button-primary" name="rti_refund_action" value="confirm">' . esc_html__('Confirm refund', 'rt-event-manager') . '</button> ';
                echo '<button type="submit" class="button" name="rti_refund_action" value="decline">' . esc_html__('Decline', 'rt-event-manager') . '</button>';
                echo '</form></td>';
            }
            echo '</tr>';
        }
        echo '</tbody></table>';
    }

    /**
     * Admin page: tickets with a pending transfer offer (awaiting acceptance),
     * with a Withdraw action to cancel the offer.
     */
    public function render_transfers_page() {
        if (!current_user_can('edit_shop_orders')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';

        if (isset($_POST['rti_withdraw_transfer'], $_POST['rti_ticket_id'])) {
            check_admin_referer('rti_withdraw_transfer');
            $tid = absint($_POST['rti_ticket_id']);
            if ($tid) {
                $this->update_ticket($tid, array(
                    'transfer_token' => '',
                    'transfer_email' => '',
                ));
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html(sprintf(__('Transfer offer withdrawn for ticket #%d.', 'rt-event-manager'), $tid)) . '</p></div>';
            }
        }

        $rows = $wpdb->get_results(
            "SELECT t.*, p.post_title AS product_name
             FROM $table t LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
             WHERE t.transfer_token <> ''
             ORDER BY t.transfer_requested_at DESC",
            ARRAY_A
        );

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Transfers', 'rt-event-manager') . '</h1>';

        echo '<h2>' . esc_html(sprintf(__('Open transfers (%d)', 'rt-event-manager'), count($rows))) . '</h2>';
        echo '<p class="description">' . esc_html__('Event tickets with a pending transfer offer that the invited person has not yet accepted.', 'rt-event-manager') . '</p>';

        if (empty($rows)) {
            echo '<p>' . esc_html__('No pending transfers.', 'rt-event-manager') . '</p>';
        } else {
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead><tr>';
            echo '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Current holder', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Ticket', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Requested', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Actions', 'rt-event-manager') . '</th>';
            echo '</tr></thead><tbody>';

            foreach ($rows as $r) {
                $order_id   = absint($r['order_id']);
                $order      = wc_get_order($order_id);
                $order_link = $order ? $order->get_edit_order_url() : '';
                $pname      = $r['product_name'] ? $r['product_name'] : ('#' . $r['product_id']);

                echo '<tr>';
                echo '<td>' . ($order_link ? '<a href="' . esc_url($order_link) . '">#' . esc_html($order_id) . '</a>' : ('#' . esc_html($order_id))) . '</td>';
                echo '<td>' . esc_html($r['holder_name'] !== '' ? $r['holder_name'] : '—') . '</td>';
                echo '<td>' . esc_html($pname) . '</td>';
                echo '<td>' . esc_html($r['transfer_requested_at'] ? $r['transfer_requested_at'] : '—') . '</td>';
                echo '<td><form method="post" style="display:inline">';
                wp_nonce_field('rti_withdraw_transfer');
                echo '<input type="hidden" name="rti_ticket_id" value="' . esc_attr($r['id']) . '" />';
                echo '<button type="submit" class="button" name="rti_withdraw_transfer" value="1">' . esc_html__('Withdraw', 'rt-event-manager') . '</button>';
                echo '</form></td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        }

        // Completed transfers (a ticket has been reassigned to a new owner).
        $done = $wpdb->get_results(
            "SELECT t.*, p.post_title AS product_name
             FROM $table t LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
             WHERE t.transferred_at IS NOT NULL
             ORDER BY t.transferred_at DESC",
            ARRAY_A
        );

        echo '<h2>' . esc_html(sprintf(__('Completed transfers (%d)', 'rt-event-manager'), count($done))) . '</h2>';
        if (empty($done)) {
            echo '<p>' . esc_html__('No completed transfers.', 'rt-event-manager') . '</p></div>';
            return;
        }

        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Ticket', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('From', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('To', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Transferred', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';

        foreach ($done as $r) {
            $order_id   = absint($r['order_id']);
            $order      = wc_get_order($order_id);
            $order_link = $order ? $order->get_edit_order_url() : '';
            $pname      = $r['product_name'] ? $r['product_name'] : ('#' . $r['product_id']);

            echo '<tr>';
            echo '<td>' . ($order_link ? '<a href="' . esc_url($order_link) . '">#' . esc_html($order_id) . '</a>' : ('#' . esc_html($order_id))) . '</td>';
            echo '<td>' . esc_html($pname) . '</td>';
            echo '<td>' . esc_html(self::user_display($r['transferred_from_user_id'])) . '</td>';
            echo '<td>' . esc_html(self::user_display($r['owner_user_id']) . ($r['holder_name'] !== '' ? ' — ' . $r['holder_name'] : '')) . '</td>';
            echo '<td>' . esc_html($r['transferred_at']) . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table></div>';
    }

    /** Human label (name + email) for a user id, or an em dash. */
    private static function user_display($user_id) {
        $user_id = absint($user_id);
        if (!$user_id) {
            return '—';
        }
        $u = get_userdata($user_id);
        if (!$u) {
            return '#' . $user_id;
        }
        $name = trim($u->first_name . ' ' . $u->last_name);
        if ('' === $name) {
            $name = $u->display_name;
        }
        return $u->user_email ? ($name . ' <' . $u->user_email . '>') : $name;
    }

    /**
     * Render the tickets overview admin page
     */
    public function render_tickets_overview_page() {
        global $wpdb;
        $tickets_table = $wpdb->prefix . 'rti_tickets';

        // Ensure the status column exists (in case dbDelta didn't add it)
        $table_exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $tickets_table));
        if ($table_exists) {
            $col_exists = $wpdb->get_results("SHOW COLUMNS FROM $tickets_table LIKE 'status'");
            if (empty($col_exists)) {
                $wpdb->query("ALTER TABLE $tickets_table ADD COLUMN `status` varchar(20) NOT NULL DEFAULT 'draft' AFTER `qr_code_url`");
                $wpdb->query("ALTER TABLE $tickets_table ADD INDEX `status` (`status`)");
                if (function_exists('rt_event_manager_recalculate_all_ticket_statuses')) {
                    rt_event_manager_recalculate_all_ticket_statuses();
                }
            }
        }

        // Status definitions
        $status_labels = array(
            'valid'      => __('Valid', 'rt-event-manager'),
            'draft'      => __('Draft', 'rt-event-manager'),
            'checked_in' => __('Checked In', 'rt-event-manager'),
            'invalid'    => __('Invalid', 'rt-event-manager'),
            'cancelled'  => __('Cancelled', 'rt-event-manager'),
            'refunded'   => __('Refunded', 'rt-event-manager'),
        );
        $status_colors = array(
            'valid'      => '#00a32a',
            'draft'      => '#dba617',
            'checked_in' => '#2271b1',
            'invalid'    => '#d63638',
            'cancelled'  => '#8c8f94',
            'refunded'   => '#8250df',
        );

        // Handle search / filters
        $search         = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $filter_product = isset($_GET['product_id']) ? absint($_GET['product_id']) : 0;
        $filter_family  = isset($_GET['rti_family']) ? sanitize_text_field($_GET['rti_family']) : '';
        $paged          = isset($_GET['paged']) ? max(1, absint($_GET['paged'])) : 1;
        $per_page_options = array(25, 50, 100, 250);
        $per_page       = isset($_GET['per_page']) ? absint($_GET['per_page']) : 25;
        if (!in_array($per_page, $per_page_options, true)) {
            $per_page = 25;
        }
        $offset         = ($paged - 1) * $per_page;

        // Multi-select status filter: default = valid, draft, checked_in (hide invalid)
        $default_statuses = array('valid', 'draft', 'checked_in');
        if (isset($_GET['ticket_status']) && is_array($_GET['ticket_status'])) {
            $filter_statuses = array_map('sanitize_text_field', $_GET['ticket_status']);
        } elseif (isset($_GET['ticket_status']) && $_GET['ticket_status'] === 'all') {
            $filter_statuses = array_keys($status_labels);
        } elseif (isset($_GET['filter_applied'])) {
            // Form was submitted but no checkboxes checked — show nothing
            $filter_statuses = array();
        } else {
            $filter_statuses = $default_statuses;
        }

        // Build query
        $where = array('1=1');
        $params = array();

        if (!empty($search)) {
            $like = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(t.holder_name LIKE %s OR t.rti_club LIKE %s OR t.world_id LIKE %s OR t.phone LIKE %s)';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($filter_product > 0) {
            $where[] = 't.product_id = %d';
            $params[] = $filter_product;
        }

        if ($filter_family !== '') {
            $where[] = 't.rti_family = %s';
            $params[] = $filter_family;
        }

        // Status filter
        if (!empty($filter_statuses)) {
            $placeholders = implode(', ', array_fill(0, count($filter_statuses), '%s'));
            $where[] = "t.status IN ($placeholders)";
            $params = array_merge($params, $filter_statuses);
        } else {
            // No statuses selected = show nothing
            $where[] = '1=0';
        }

        $where_sql = implode(' AND ', $where);

        // Count total
        $count_sql = "SELECT COUNT(*) FROM $tickets_table t WHERE $where_sql";
        $total = empty($params) ? $wpdb->get_var($count_sql) : $wpdb->get_var($wpdb->prepare($count_sql, $params));

        // Get tickets for current page
        $query = "SELECT t.*, p.post_title AS product_name
                  FROM $tickets_table t
                  LEFT JOIN {$wpdb->posts} p ON t.product_id = p.ID
                  WHERE $where_sql
                  ORDER BY t.order_id DESC, t.ticket_index ASC
                  LIMIT %d OFFSET %d";

        $query_params = array_merge($params, array($per_page, $offset));
        $tickets = $wpdb->get_results($wpdb->prepare($query, $query_params), ARRAY_A);

        $total_pages = ceil(max(1, $total) / $per_page);

        // Get all ticket products for the filter dropdown
        $ticket_products = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => array('publish', 'private', 'draft'),
            'meta_query'     => array(
                array(
                    'key'   => '_rti_is_ticket',
                    'value' => 'yes',
                ),
            ),
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));

        // Summary stats by status (only count valid + draft for KPI totals)
        $stat_valid      = intval($wpdb->get_var("SELECT COUNT(*) FROM $tickets_table WHERE status = 'valid'"));
        $stat_draft      = intval($wpdb->get_var("SELECT COUNT(*) FROM $tickets_table WHERE status = 'draft'"));
        $stat_checked_in = intval($wpdb->get_var("SELECT COUNT(*) FROM $tickets_table WHERE status = 'checked_in'"));
        $stat_invalid    = intval($wpdb->get_var("SELECT COUNT(*) FROM $tickets_table WHERE status = 'invalid'"));
        $stat_total      = $stat_valid + $stat_draft; // Only valid + draft count towards total

        // Tickets per RTI Family (only valid + draft)
        $family_stats = $wpdb->get_results(
            "SELECT rti_family, COUNT(*) AS cnt FROM $tickets_table WHERE status IN ('valid', 'draft') GROUP BY rti_family ORDER BY rti_family ASC",
            ARRAY_A
        );
        $family_counts = array();
        foreach ($family_stats as $fs) {
            $family_counts[$fs['rti_family']] = intval($fs['cnt']);
        }

        // Tickets per Type (event / pretour / minor), only valid + draft.
        $kind_stats = $wpdb->get_results(
            "SELECT ticket_kind, COUNT(*) AS cnt FROM $tickets_table WHERE status IN ('valid', 'draft') GROUP BY ticket_kind",
            ARRAY_A
        );
        $kind_counts = array(); // kind => count
        foreach ($kind_stats as $ks) {
            $kind = $ks['ticket_kind'] !== '' ? $ks['ticket_kind'] : 'event';
            $kind_counts[$kind] = isset($kind_counts[$kind]) ? $kind_counts[$kind] + intval($ks['cnt']) : intval($ks['cnt']);
        }

        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline"><?php esc_html_e('All Tickets', 'rt-event-manager'); ?></h1>
            <hr class="wp-header-end">

            <!-- Summary boxes -->
            <div class="rti-overview-stats" style="display:flex;gap:15px;margin:15px 0;flex-wrap:wrap;">
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid #2271b1;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:#2271b1;"><?php echo intval($stat_total); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php esc_html_e('Total', 'rt-event-manager'); ?></div>
                </div>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid #00a32a;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:#00a32a;"><?php echo intval($stat_valid); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php esc_html_e('Valid', 'rt-event-manager'); ?></div>
                </div>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid #dba617;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:#dba617;"><?php echo intval($stat_draft); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php esc_html_e('Draft', 'rt-event-manager'); ?></div>
                </div>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid #2271b1;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:#2271b1;"><?php echo intval($stat_checked_in); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php esc_html_e('Checked In', 'rt-event-manager'); ?></div>
                </div>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid #d63638;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:#d63638;"><?php echo intval($stat_invalid); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php esc_html_e('Invalid', 'rt-event-manager'); ?></div>
                </div>
            </div>

            <!-- Tickets per RTI Family -->
            <div class="rti-overview-stats" style="display:flex;gap:15px;margin:0 0 20px;flex-wrap:wrap;">
                <?php
                $family_colors = array(
                    0 => '#0073aa', // Round Table
                    1 => '#7b2d8b', // Club 41
                    2 => '#e91e63', // Ladies Circle
                    3 => '#ff9800', // Agora Club
                    4 => '#009688', // Tangent Club
                    9 => '#607d8b', // Guest/Partner
                );
                foreach (self::$family_options as $fkey => $flabel) :
                    $fcount = isset($family_counts[$fkey]) ? $family_counts[$fkey] : 0;
                    $fcolor = isset($family_colors[$fkey]) ? $family_colors[$fkey] : '#646970';
                ?>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid <?php echo esc_attr($fcolor); ?>;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:<?php echo esc_attr($fcolor); ?>;"><?php echo intval($fcount); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php echo esc_html($flabel); ?></div>
                </div>
                <?php endforeach; ?>
            </div>

            <?php if (!empty($kind_counts)) : ?>
            <!-- Tickets per Type -->
            <div class="rti-overview-stats" style="display:flex;gap:15px;margin:0 0 20px;flex-wrap:wrap;">
                <?php
                $kind_meta = array(
                    'event'   => array(__('Event', 'rt-event-manager'), '#2271b1'),
                    'pretour' => array(__('Pretour', 'rt-event-manager'), '#8e44ad'),
                    'minor'   => array(__('Future member', 'rt-event-manager'), '#c0392b'),
                );
                foreach ($kind_meta as $kkey => $km) :
                    $kcount = isset($kind_counts[$kkey]) ? $kind_counts[$kkey] : 0;
                ?>
                <div class="rti-stat-box" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid <?php echo esc_attr($km[1]); ?>;padding:12px 18px;border-radius:3px;min-width:120px;">
                    <div style="font-size:28px;font-weight:600;color:<?php echo esc_attr($km[1]); ?>;"><?php echo intval($kcount); ?></div>
                    <div style="color:#646970;font-size:13px;"><?php echo esc_html($km[0]); ?></div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <!-- Filters -->
            <form method="get" action="">
                <input type="hidden" name="page" value="rt-event-manager" />
                <input type="hidden" name="filter_applied" value="1" />

                <div class="tablenav top">
                    <div class="alignleft actions">
                        <!-- Multi-select status filter -->
                        <fieldset style="display:inline-flex;gap:10px;align-items:center;margin-right:10px;vertical-align:middle;">
                            <legend class="screen-reader-text"><?php esc_html_e('Filter by status', 'rt-event-manager'); ?></legend>
                            <?php foreach ($status_labels as $skey => $slabel) : ?>
                                <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;">
                                    <input type="checkbox" name="ticket_status[]" value="<?php echo esc_attr($skey); ?>"
                                        <?php checked(in_array($skey, $filter_statuses, true)); ?>
                                        style="margin:0;" />
                                    <span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:12px;font-weight:600;color:#fff;background:<?php echo esc_attr($status_colors[$skey]); ?>;">
                                        <?php echo esc_html($slabel); ?>
                                    </span>
                                </label>
                            <?php endforeach; ?>
                        </fieldset>

                        <!-- Product filter -->
                        <select name="product_id">
                            <option value=""><?php esc_html_e('All Products', 'rt-event-manager'); ?></option>
                            <?php foreach ($ticket_products as $tp) :
                                $product = wc_get_product($tp->ID);
                                if (!$product) continue;
                            ?>
                                <option value="<?php echo esc_attr($tp->ID); ?>" <?php selected($filter_product, $tp->ID); ?>>
                                    <?php echo esc_html($product->get_name()); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>

                        <!-- Family filter -->
                        <select name="rti_family">
                            <option value=""><?php esc_html_e('All Families', 'rt-event-manager'); ?></option>
                            <?php foreach (self::$family_options as $key => $label) : ?>
                                <option value="<?php echo esc_attr($key); ?>" <?php selected($filter_family, (string) $key); ?>>
                                    <?php echo esc_html($label); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>

                        <label for="per_page" style="margin-left:10px;"><?php esc_html_e('Show', 'rt-event-manager'); ?></label>
                        <select name="per_page" id="per_page" style="width:70px;">
                            <?php foreach ($per_page_options as $pp_opt) : ?>
                                <option value="<?php echo esc_attr($pp_opt); ?>" <?php selected($per_page, $pp_opt); ?>><?php echo esc_html($pp_opt); ?></option>
                            <?php endforeach; ?>
                        </select>

                        <input type="submit" class="button" value="<?php esc_attr_e('Filter', 'rt-event-manager'); ?>" />
                    </div>

                    <!-- Export and Search -->
                    <div class="alignright">
                        <?php
                        $export_url = add_query_arg(array(
                            'action' => 'rti_export_tickets_xlsx',
                            'nonce'  => wp_create_nonce('rti_export_tickets'),
                            's'      => $search,
                            'product_id' => $filter_product,
                            'rti_family' => $filter_family,
                            'ticket_status' => $filter_statuses,
                        ), admin_url('admin-ajax.php'));
                        ?>
                        <a href="<?php echo esc_url($export_url); ?>" class="button" style="margin-right:10px;">
                            <span class="dashicons dashicons-download" style="vertical-align:middle;margin-top:3px;"></span>
                            <?php esc_html_e('Export Excel', 'rt-event-manager'); ?>
                        </a>
                        <label class="screen-reader-text" for="ticket-search"><?php esc_html_e('Search tickets', 'rt-event-manager'); ?></label>
                        <input type="search" id="ticket-search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="<?php esc_attr_e('Search holder, club, .WORLD ID...', 'rt-event-manager'); ?>" style="width:250px;" />
                        <input type="submit" class="button" value="<?php esc_attr_e('Search', 'rt-event-manager'); ?>" />
                    </div>

                    <br class="clear" />
                </div>
            </form>

            <!-- Results count -->
            <p class="displaying-num" style="margin:5px 0;">
                <?php
                echo esc_html(sprintf(
                    _n('%s ticket found', '%s tickets found', $total, 'rt-event-manager'),
                    number_format_i18n($total)
                ));
                ?>
            </p>

            <!-- Tickets table -->
            <table class="wp-list-table widefat fixed striped" id="rti-overview-table">
                <thead>
                    <tr>
                        <th style="width:70px;"><?php esc_html_e('Status', 'rt-event-manager'); ?></th>
                        <th style="width:60px;"><?php esc_html_e('Order', 'rt-event-manager'); ?></th>
                        <th style="width:40px;"><?php esc_html_e('#', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Type', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Product', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Main ticket / Guardian', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Holder Name', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Ticket Phone', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Country', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('RTI Family', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Club', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Dietary', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('.WORLD ID', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('QR Code', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Voucher', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Phone', 'rt-event-manager'); ?></th>
                        <th><?php esc_html_e('Function / Role', 'rt-event-manager'); ?></th>
                        <?php if (current_user_can('manage_options')) : ?>
                        <th style="width:50px;"><?php esc_html_e('Print', 'rt-event-manager'); ?></th>
                        <?php endif; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($tickets)) : ?>
                        <tr>
                            <td colspan="<?php echo intval(17 + (current_user_can('manage_options') ? 1 : 0)); ?>" style="text-align:center;color:#999;padding:20px;">
                                <?php esc_html_e('No tickets found.', 'rt-event-manager'); ?>
                            </td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ($tickets as $ticket) :
                            $ticket_num = intval($ticket['ticket_index']) + 1;
                            $product_name = $ticket['product_name'] ?: __('(deleted)', 'rt-event-manager');
                            $family_label = ($ticket['rti_family'] !== '' && isset(self::$family_options[absint($ticket['rti_family'])])) ? self::$family_options[absint($ticket['rti_family'])] : '—';
                            $dietary_label = $ticket['dietary'] ?: '—';
                            if ($dietary_label === 'none') $dietary_label = 'None';
                            if ($dietary_label === 'vegetarian') $dietary_label = 'Vegetarian';
                            if ($dietary_label === 'allergies') {
                                $dietary_label = 'Allergies';
                                if (!empty($ticket['allergy_details'])) {
                                    $dietary_label .= ' (' . $ticket['allergy_details'] . ')';
                                }
                            }

                            $ticket_status = isset($ticket['status']) ? $ticket['status'] : 'draft';
                            $badge_color = isset($status_colors[$ticket_status]) ? $status_colors[$ticket_status] : '#999';
                            $badge_label = isset($status_labels[$ticket_status]) ? $status_labels[$ticket_status] : ucfirst($ticket_status);

                            $order_edit_url = '';
                            $billing_country = '';
                            $ov_buyer_voucher  = '';
                            $ov_buyer_phone    = '';
                            $ov_buyer_function = '';
                            $order = wc_get_order($ticket['order_id']);
                            if ($order) {
                                $order_edit_url = $order->get_edit_order_url();
                                $billing_country = $order->get_billing_country();
                                $ov_coupon_codes   = $order->get_coupon_codes();
                                $ov_buyer_voucher  = !empty($ov_coupon_codes) ? implode(', ', $ov_coupon_codes) : '';
                                $ov_buyer_phone    = $order->get_billing_phone();
                                $ov_buyer_function = $order->get_meta('_rti_function');
                            }
                            $ov_is_first_ticket = intval($ticket['ticket_index']) === 0;
                        ?>
                            <tr>
                                <td>
                                    <span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:12px;font-weight:600;color:#fff;background:<?php echo esc_attr($badge_color); ?>;">
                                        <?php echo esc_html($badge_label); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($order_edit_url) : ?>
                                        <a href="<?php echo esc_url($order_edit_url); ?>" title="<?php esc_attr_e('Edit order', 'rt-event-manager'); ?>">
                                            <strong>#<?php echo esc_html($ticket['order_id']); ?></strong>
                                        </a>
                                    <?php else : ?>
                                        #<?php echo esc_html($ticket['order_id']); ?>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($ticket_num); ?></td>
                                <td><?php echo esc_html(self::ticket_kind_label($ticket)); ?></td>
                                <td><?php echo esc_html($product_name); ?></td>
                                <?php $ov_parent_label = self::ticket_parent_label($ticket); ?>
                                <td><?php echo $ov_parent_label !== '' ? esc_html($ov_parent_label) : '<span style="color:#999;">&mdash;</span>'; ?></td>
                                <td>
                                    <?php if (!empty($ticket['holder_name'])) : ?>
                                        <strong><?php echo esc_html($ticket['holder_name']); ?></strong>
                                    <?php else : ?>
                                        <span style="color:#999;">—</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html(!empty($ticket['phone']) ? $ticket['phone'] : '—'); ?></td>
                                <td><?php echo esc_html($billing_country ?: '—'); ?></td>
                                <td><?php echo esc_html($family_label); ?></td>
                                <td><?php echo esc_html($ticket['rti_club'] ?: '—'); ?></td>
                                <td><?php echo esc_html($dietary_label); ?></td>
                                <td>
                                    <?php if (!empty($ticket['world_id'])) : ?>
                                        <code><?php echo esc_html($ticket['world_id']); ?></code>
                                    <?php else : ?>
                                        <span style="color:#999;">—</span>
                                    <?php endif; ?>
                                </td>
                                <td style="max-width:150px;">
                                    <?php if (!empty($ticket['qr_code_url'])) : ?>
                                        <code style="font-size:11px;word-break:break-all;"><?php echo esc_html($ticket['qr_code_url']); ?></code>
                                    <?php else : ?>
                                        <span style="color:#999;">—</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($ov_is_first_ticket ? ($ov_buyer_voucher ?: '—') : ''); ?></td>
                                <td><?php echo esc_html($ov_is_first_ticket ? ($ov_buyer_phone ?: '—') : ''); ?></td>
                                <td><?php echo esc_html($ov_is_first_ticket ? ($ov_buyer_function ?: '—') : ''); ?></td>
                                <?php if (current_user_can('manage_options')) :
                                    $print_url = add_query_arg(array(
                                        'action'    => 'rti_print_badge',
                                        'ticket_id' => $ticket['id'],
                                        'nonce'     => wp_create_nonce('rti_print_badge'),
                                    ), admin_url('admin-ajax.php'));
                                ?>
                                <td style="text-align:center;">
                                    <a href="<?php echo esc_url($print_url); ?>" target="_blank" class="button button-small rti-print-badge-btn" title="<?php esc_attr_e('Print Badge', 'rt-event-manager'); ?>">
                                        <span class="dashicons dashicons-printer"></span>
                                    </a>
                                </td>
                                <?php endif; ?>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <?php
            // Pagination
            if ($total_pages > 1) {
                echo '<div class="tablenav bottom"><div class="tablenav-pages">';

                $base_args = array(
                    'page'          => 'rt-event-manager',
                    's'             => $search,
                    'product_id'    => $filter_product,
                    'rti_family'    => $filter_family,
                    'per_page'      => $per_page,
                    'filter_applied' => '1',
                );
                $base_url = admin_url('admin.php') . '?' . http_build_query($base_args);
                // Append multi-select status params
                foreach ($filter_statuses as $fs) {
                    $base_url .= '&' . urlencode('ticket_status[]') . '=' . urlencode($fs);
                }

                echo paginate_links(array(
                    'base'      => $base_url . '%_%',
                    'format'    => '&paged=%#%',
                    'current'   => $paged,
                    'total'     => $total_pages,
                    'prev_text' => '&laquo;',
                    'next_text' => '&raquo;',
                ));

                echo '</div></div>';
            }
            ?>
        </div>
        <?php
    }

    /**
     * Render the badge template settings page
     *
     * Admin-only page for configuring badge layout and appearance.
     */
    public function render_badge_template_page() {
        // Check capability
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to access this page.', 'rt-event-manager'));
        }

        $settings = RT_Event_Manager_Badge_Template::get_settings();
        $background_image_url = '';
        if (!empty($settings['background_image_id'])) {
            $background_image_url = wp_get_attachment_image_url($settings['background_image_id'], 'medium');
        }

        ?>
        <div class="wrap rti-badge-template-wrap">
            <h1 class="wp-heading-inline"><?php esc_html_e('Badge Template Settings', 'rt-event-manager'); ?></h1>
            <hr class="wp-header-end">

            <div class="rti-badge-template-container">
                <!-- Left: Settings Form -->
                <div class="rti-badge-settings-panel">
                    <form id="rti-badge-template-form">
                        <?php wp_nonce_field('rti_badge_template', 'rti_badge_nonce'); ?>

                        <!-- Background Settings -->
                        <div class="rti-settings-section">
                            <h2><?php esc_html_e('Background', 'rt-event-manager'); ?></h2>
                            <p class="description"><?php esc_html_e('Badge size: DIN A6 (105mm × 148mm)', 'rt-event-manager'); ?></p>

                            <div class="rti-background-upload">
                                <input type="hidden" name="background_image_id" id="background_image_id"
                                       value="<?php echo esc_attr($settings['background_image_id']); ?>" />
                                <div class="rti-background-preview" id="background-preview">
                                    <?php if ($background_image_url) : ?>
                                        <img src="<?php echo esc_url($background_image_url); ?>" alt="" />
                                    <?php else : ?>
                                        <div class="rti-white-bg-placeholder"><?php esc_html_e('White Background', 'rt-event-manager'); ?></div>
                                    <?php endif; ?>
                                </div>
                                <div class="rti-background-buttons">
                                    <button type="button" class="button" id="select-background-btn">
                                        <?php esc_html_e('Select Image', 'rt-event-manager'); ?>
                                    </button>
                                    <button type="button" class="button" id="remove-background-btn"
                                            <?php echo $settings['background_image_id'] ? '' : 'style="display:none;"'; ?>>
                                        <?php esc_html_e('Remove', 'rt-event-manager'); ?>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Field Configuration Sections -->
                        <?php
                        $fields_config = array(
                            'holder_name' => __('Holder Name', 'rt-event-manager'),
                            'country'     => __('Country', 'rt-event-manager'),
                            'rti_family'  => __('RTI Family', 'rt-event-manager'),
                            'rti_club'    => __('Club', 'rt-event-manager'),
                            'qr_code'     => __('QR Code', 'rt-event-manager'),
                            'combination' => __('Combination', 'rt-event-manager'),
                        );

                        foreach ($fields_config as $field_key => $field_label) :
                            $field_settings = isset($settings['fields'][$field_key])
                                ? $settings['fields'][$field_key]
                                : RT_Event_Manager_Badge_Template::get_defaults()['fields'][$field_key];
                        ?>
                        <div class="rti-settings-section rti-field-section" data-field="<?php echo esc_attr($field_key); ?>">
                            <h3>
                                <label>
                                    <input type="checkbox" name="fields[<?php echo esc_attr($field_key); ?>][enabled]"
                                           value="1" <?php checked(!empty($field_settings['enabled'])); ?>
                                           class="rti-field-enabled" />
                                    <?php echo esc_html($field_label); ?>
                                </label>
                            </h3>

                            <div class="rti-field-options" <?php echo !empty($field_settings['enabled']) ? '' : 'style="display:none;"'; ?>>
                                <div class="rti-field-row">
                                    <label>
                                        <?php esc_html_e('X Position (mm)', 'rt-event-manager'); ?>
                                        <input type="number" name="fields[<?php echo esc_attr($field_key); ?>][x]"
                                               value="<?php echo esc_attr($field_settings['x']); ?>"
                                               min="0" max="105" step="0.5" class="small-text" />
                                    </label>
                                    <label>
                                        <?php esc_html_e('Y Position (mm)', 'rt-event-manager'); ?>
                                        <input type="number" name="fields[<?php echo esc_attr($field_key); ?>][y]"
                                               value="<?php echo esc_attr($field_settings['y']); ?>"
                                               min="0" max="148" step="0.5" class="small-text" />
                                    </label>
                                </div>

                                <?php if ($field_key === 'qr_code') : ?>
                                <div class="rti-field-row">
                                    <label>
                                        <?php esc_html_e('Size (mm)', 'rt-event-manager'); ?>
                                        <input type="number" name="fields[<?php echo esc_attr($field_key); ?>][size]"
                                               value="<?php echo esc_attr($field_settings['size'] ?? 35); ?>"
                                               min="10" max="80" class="small-text" />
                                    </label>
                                </div>
                                <?php else : ?>
                                <div class="rti-field-row">
                                    <label>
                                        <?php esc_html_e('Font Size (pt)', 'rt-event-manager'); ?>
                                        <input type="number" name="fields[<?php echo esc_attr($field_key); ?>][font_size]"
                                               value="<?php echo esc_attr($field_settings['font_size']); ?>"
                                               min="6" max="48" class="small-text" />
                                    </label>
                                    <label>
                                        <?php esc_html_e('Weight', 'rt-event-manager'); ?>
                                        <select name="fields[<?php echo esc_attr($field_key); ?>][font_weight]">
                                            <option value="normal" <?php selected($field_settings['font_weight'] ?? 'normal', 'normal'); ?>>
                                                <?php esc_html_e('Normal', 'rt-event-manager'); ?>
                                            </option>
                                            <option value="bold" <?php selected($field_settings['font_weight'] ?? 'normal', 'bold'); ?>>
                                                <?php esc_html_e('Bold', 'rt-event-manager'); ?>
                                            </option>
                                        </select>
                                    </label>
                                    <label>
                                        <?php esc_html_e('Alignment', 'rt-event-manager'); ?>
                                        <select name="fields[<?php echo esc_attr($field_key); ?>][alignment]">
                                            <option value="left" <?php selected($field_settings['alignment'] ?? 'center', 'left'); ?>>
                                                <?php esc_html_e('Left', 'rt-event-manager'); ?>
                                            </option>
                                            <option value="center" <?php selected($field_settings['alignment'] ?? 'center', 'center'); ?>>
                                                <?php esc_html_e('Center', 'rt-event-manager'); ?>
                                            </option>
                                            <option value="right" <?php selected($field_settings['alignment'] ?? 'center', 'right'); ?>>
                                                <?php esc_html_e('Right', 'rt-event-manager'); ?>
                                            </option>
                                        </select>
                                    </label>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php endforeach; ?>

                        <div class="rti-save-section">
                            <button type="submit" class="button button-primary" id="save-badge-template">
                                <?php esc_html_e('Save Settings', 'rt-event-manager'); ?>
                            </button>
                            <span id="rti-save-status"></span>
                        </div>
                    </form>
                </div>

                <!-- Right: Live Preview -->
                <div class="rti-badge-preview-panel">
                    <h2><?php esc_html_e('Preview', 'rt-event-manager'); ?></h2>
                    <p class="description"><?php esc_html_e('Preview updates as you modify settings.', 'rt-event-manager'); ?></p>
                    <div class="rti-badge-preview-container">
                        <div class="rti-badge-preview" id="badge-preview">
                            <!-- Preview will be rendered here via JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    // =============================================
    // WooCommerce Settings — Ticket Edit Cutoff
    // =============================================

    /**
     * RT Event Manager → Settings admin page. Reuses WooCommerce's settings-field
     * renderer/saver so the field definitions in get_settings_fields() work here.
     */
    public function render_settings_page() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        if (!class_exists('WC_Admin_Settings')) {
            echo '<div class="wrap"><h1>' . esc_html__('RT Event Manager Settings', 'rt-event-manager') . '</h1><p>' . esc_html__('WooCommerce is required.', 'rt-event-manager') . '</p></div>';
            return;
        }

        $fields = $this->get_settings_fields();

        if (isset($_POST['rt_settings_save']) && check_admin_referer('rt_settings_save')) {
            WC_Admin_Settings::save_fields($fields);
            WC_Admin_Settings::add_message(__('Settings saved.', 'rt-event-manager'));
        }

        echo '<div class="wrap woocommerce"><h1>' . esc_html__('RT Event Manager Settings', 'rt-event-manager') . '</h1>';
        WC_Admin_Settings::show_messages();
        echo '<form method="post" action="">';
        WC_Admin_Settings::output_fields($fields);
        wp_nonce_field('rt_settings_save');
        echo '<p class="submit"><button type="submit" name="rt_settings_save" value="1" class="button button-primary">' . esc_html__('Save changes', 'rt-event-manager') . '</button></p>';
        echo '</form></div>';
    }

    /**
     * All plugin settings fields (WooCommerce settings-field format), rendered on
     * the RT Event Manager → Settings admin page.
     *
     * @return array
     */
    public function get_settings_fields() {
        return array(
            array(
                'title' => __('Ticket Edit Settings', 'rt-event-manager'),
                'type'  => 'title',
                'desc'  => __('Control when customers can edit their ticket details from their order history.', 'rt-event-manager'),
                'id'    => 'rti_ticket_settings',
            ),
            array(
                'title'    => __('Ticket Edit Cutoff', 'rt-event-manager'),
                'desc'     => __('After this date and time, customers can no longer edit their tickets from the frontend. Leave empty to always allow editing. Shop Managers and Admins can always edit tickets via the backend.', 'rt-event-manager'),
                'id'       => 'wc_rti_ticket_edit_cutoff',
                'type'     => 'rti_datetime',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'    => __('Pretour Category', 'rt-event-manager'),
                'desc'     => __('Ticket products in this category are treated as Pretour tickets (shown in the Pretour tab and linked to an Event ticket).', 'rt-event-manager'),
                'id'       => 'rt_event_manager_pretour_category',
                'type'     => 'select',
                'options'  => self::get_product_category_options(),
                'default'  => '',
                'desc_tip' => true,
                'class'    => 'wc-enhanced-select',
            ),
            array(
                'title'    => __('Future Member (Minor) Category', 'rt-event-manager'),
                'desc'     => __('Ticket products in this category are treated as Future Tabler / Future Circler minor tickets — addable only as co-travellers linked to an existing Event or Pretour ticket.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_future_category',
                'type'     => 'select',
                'options'  => self::get_product_category_options(),
                'default'  => '',
                'desc_tip' => true,
                'class'    => 'wc-enhanced-select',
            ),
            array(
                'title'    => __('Day Tour Category', 'rt-event-manager'),
                'desc'     => __('Ticket products in this category are shown as Day tours in the customer event calendar.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_daytour_category',
                'type'     => 'select',
                'options'  => self::get_product_category_options(),
                'default'  => '',
                'desc_tip' => true,
                'class'    => 'wc-enhanced-select',
            ),
            array(
                'type' => 'sectionend',
                'id'   => 'rti_ticket_settings',
            ),

            array(
                'title' => __('Customer Account Tabs', 'rt-event-manager'),
                'type'  => 'title',
                'desc'  => __('Show or hide these sections in the customer account portal.', 'rt-event-manager'),
                'id'    => 'rti_account_tabs',
            ),
            array(
                'title'   => __('Pretour', 'rt-event-manager'),
                'desc'    => __('Show the Pretour tab', 'rt-event-manager'),
                'id'      => 'rt_event_manager_show_pretour',
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            array(
                'title'   => __('Day Tours', 'rt-event-manager'),
                'desc'    => __('Show the Day Tours tab', 'rt-event-manager'),
                'id'      => 'rt_event_manager_show_daytour',
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            array(
                'title'   => __('My Calendar', 'rt-event-manager'),
                'desc'    => __('Show the My Calendar tab', 'rt-event-manager'),
                'id'      => 'rt_event_manager_show_calendar',
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            array(
                'title'   => __('Travel and Visa', 'rt-event-manager'),
                'desc'    => __('Show the Travel and Visa tab', 'rt-event-manager'),
                'id'      => 'rt_event_manager_show_travel',
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            array(
                'title'   => __('Shop', 'rt-event-manager'),
                'desc'    => __('Show the Shop tab', 'rt-event-manager'),
                'id'      => 'rt_event_manager_show_shop',
                'type'    => 'checkbox',
                'default' => 'yes',
            ),
            array(
                'type' => 'sectionend',
                'id'   => 'rti_account_tabs',
            ),

            array(
                'title' => __('Shop Settings', 'rt-event-manager'),
                'type'  => 'title',
                'desc'  => __('Control the merchandise shown in the customer account Shop tab.', 'rt-event-manager'),
                'id'    => 'rti_shop_settings',
            ),
            array(
                'title'    => __('Merchandise Category', 'rt-event-manager'),
                'desc'     => __('Products in this category (excluding ticket products) are shown in the account Shop tab. Leave empty to show all non-ticket products.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_merch_category',
                'type'     => 'select',
                'options'  => self::get_product_category_options(),
                'default'  => '',
                'desc_tip' => true,
                'class'    => 'wc-enhanced-select',
            ),
            array(
                'type' => 'sectionend',
                'id'   => 'rti_shop_settings',
            ),

            array(
                'title' => __('Event & Age Limits', 'rt-event-manager'),
                'type'  => 'title',
                'desc'  => __('Event dates for the customer calendar and visa letters, plus the Future member age range.', 'rt-event-manager'),
                'id'    => 'rti_event_settings',
            ),
            array(
                'title'    => __('Event start date', 'rt-event-manager'),
                'desc'     => __('First day of the event (used in the calendar and visa letters).', 'rt-event-manager'),
                'id'       => 'rt_event_manager_event_start',
                'type'     => 'date',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'    => __('Event end date', 'rt-event-manager'),
                'desc'     => __('Last day of the event (used in the calendar and visa letters).', 'rt-event-manager'),
                'id'       => 'rt_event_manager_event_end',
                'type'     => 'date',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'    => __('Age cutoff date', 'rt-event-manager'),
                'desc'     => __('The date at which Future member ages are checked against the range below.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_event_date',
                'type'     => 'date',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'             => __('Future member minimum age', 'rt-event-manager'),
                'desc'              => __('years (at the event date)', 'rt-event-manager'),
                'id'                => 'rt_event_manager_minor_min_age',
                'type'              => 'number',
                'default'           => 5,
                'custom_attributes' => array('min' => '0', 'step' => '1'),
            ),
            array(
                'title'             => __('Future member maximum age', 'rt-event-manager'),
                'desc'              => __('years (at the event date)', 'rt-event-manager'),
                'id'                => 'rt_event_manager_minor_max_age',
                'type'              => 'number',
                'default'           => 15,
                'custom_attributes' => array('min' => '0', 'step' => '1'),
            ),
            array(
                'type' => 'sectionend',
                'id'   => 'rti_event_settings',
            ),

            array(
                'title' => __('Member Profile', 'rt-event-manager'),
                'type'  => 'title',
                'desc'  => __('Controls for the Function / Role field in the customer account profile.', 'rt-event-manager'),
                'id'    => 'rti_profile_settings',
            ),
            array(
                'title'    => __('Function / Role suggestions', 'rt-event-manager'),
                'desc'     => __('One suggestion per line. These appear as type-ahead options for the Function / Role field; members can still type a custom value.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_function_suggestions',
                'type'     => 'textarea',
                'css'      => 'min-width:400px;min-height:120px;',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'    => __('Allergy suggestions', 'rt-event-manager'),
                'desc'     => __('One suggestion per line. These appear as type-ahead options when "Allergies" is chosen for dietary; attendees can still type a custom value.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_allergy_suggestions',
                'type'     => 'textarea',
                'css'      => 'min-width:400px;min-height:120px;',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'title'   => __('Preselect a default Function / Role', 'rt-event-manager'),
                'desc'    => __('Prefill the field with the default value below for members who have not set one.', 'rt-event-manager'),
                'id'      => 'rt_event_manager_function_preselect_enabled',
                'type'    => 'checkbox',
                'default' => 'no',
            ),
            array(
                'title'    => __('Default Function / Role', 'rt-event-manager'),
                'desc'     => __('Used only when the preselection option above is enabled.', 'rt-event-manager'),
                'id'       => 'rt_event_manager_function_preselect_value',
                'type'     => 'text',
                'default'  => '',
                'desc_tip' => true,
            ),
            array(
                'type' => 'sectionend',
                'id'   => 'rti_profile_settings',
            ),
        );
    }

    /**
     * Function / Role type-ahead suggestions (admin-maintained), as a list.
     *
     * @return string[]
     */
    public static function get_function_suggestions() {
        $raw   = (string) get_option('rt_event_manager_function_suggestions', '');
        $lines = preg_split('/\r\n|\r|\n/', $raw);
        $out   = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line !== '') {
                $out[] = $line;
            }
        }
        return $out;
    }

    /**
     * The default Function / Role to preselect, or '' when preselection is off.
     *
     * @return string
     */
    public static function get_function_preselect() {
        if ('yes' !== get_option('rt_event_manager_function_preselect_enabled', 'no')) {
            return '';
        }
        return (string) get_option('rt_event_manager_function_preselect_value', '');
    }

    /**
     * Product category options for settings dropdowns: term_id => name.
     * Includes a leading empty option meaning "no category filter".
     *
     * @return array
     */
    public static function get_product_category_options() {
        $options = array('' => __('— All non-ticket products —', 'rt-event-manager'));

        $terms = get_terms(array(
            'taxonomy'   => 'product_cat',
            'hide_empty' => false,
        ));

        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $options[$term->term_id] = $term->name;
            }
        }

        return $options;
    }

    /**
     * Configured Pretour product category term id (0 if unset).
     *
     * @return int
     */
    public static function get_pretour_category_id() {
        return absint(get_option('rt_event_manager_pretour_category', 0));
    }

    /**
     * Configured Future/minor product category term id (0 if unset).
     *
     * @return int
     */
    public static function get_future_category_id() {
        return absint(get_option('rt_event_manager_future_category', 0));
    }

    /**
     * Configured Day Tour product category term id (0 if unset).
     *
     * @return int
     */
    public static function get_daytour_category_id() {
        return absint(get_option('rt_event_manager_daytour_category', 0));
    }

    /**
     * Calendar category for a product: 'pretour' | 'daytour' | 'event'.
     *
     * @param int $product_id
     * @return string
     */
    public static function get_calendar_category($product_id) {
        $product_id = absint($product_id);
        $pretour = self::get_pretour_category_id();
        $daytour = self::get_daytour_category_id();
        if ($pretour && has_term($pretour, 'product_cat', $product_id)) {
            return 'pretour';
        }
        if ($daytour && has_term($daytour, 'product_cat', $product_id)) {
            return 'daytour';
        }
        return 'event';
    }

    /* ---------------------------------------------------------------------
     * Official event agenda (backend-managed) for the customer calendar
     * ------------------------------------------------------------------- */

    /**
     * The official agenda: an array of items, each
     * array('id'=>string, 'title'=>string, 'start'=>'Y-m-d H:i', 'end'=>'Y-m-d H:i', 'location'=>string).
     *
     * @return array
     */
    public static function get_agenda() {
        $items = get_option('rt_event_manager_agenda', array());
        return is_array($items) ? $items : array();
    }

    public static function save_agenda($items) {
        update_option('rt_event_manager_agenda', array_values((array) $items));
    }

    /** Admin page: manage the official agenda shown in the customer calendar. */
    public function render_agenda_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }

        $items = self::get_agenda();

        if (isset($_POST['rt_agenda_add']) && check_admin_referer('rt_agenda_save')) {
            $title = sanitize_text_field(wp_unslash($_POST['agenda_title'] ?? ''));
            $start = sanitize_text_field(wp_unslash($_POST['agenda_start'] ?? ''));
            $end   = sanitize_text_field(wp_unslash($_POST['agenda_end'] ?? ''));
            $loc   = sanitize_text_field(wp_unslash($_POST['agenda_location'] ?? ''));
            if ('' !== $title && '' !== $start) {
                $items[] = array(
                    'id'       => uniqid('ag_'),
                    'title'    => $title,
                    'start'    => $start,
                    'end'      => $end,
                    'location' => $loc,
                );
                self::save_agenda($items);
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Agenda item added.', 'rt-event-manager') . '</p></div>';
            } else {
                echo '<div class="notice notice-error is-dismissible"><p>' . esc_html__('A title and start time are required.', 'rt-event-manager') . '</p></div>';
            }
        }

        if (!empty($_POST['rt_agenda_delete']) && check_admin_referer('rt_agenda_save')) {
            $del   = sanitize_text_field(wp_unslash($_POST['rt_agenda_delete']));
            $items = array_values(array_filter($items, function ($i) use ($del) {
                return $i['id'] !== $del;
            }));
            self::save_agenda($items);
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Agenda item removed.', 'rt-event-manager') . '</p></div>';
        }

        // Sort by start for display.
        usort($items, function ($a, $b) {
            return strcmp($a['start'], $b['start']);
        });

        echo '<div class="wrap"><h1>' . esc_html__('Event Agenda', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('These official agenda items appear in every attendee\'s event calendar.', 'rt-event-manager') . '</p>';

        // Add form.
        echo '<form method="post" style="margin:16px 0;padding:16px;background:#fff;border:1px solid #ccd0d4;max-width:640px;">';
        wp_nonce_field('rt_agenda_save');
        echo '<h2 style="margin-top:0;">' . esc_html__('Add an item', 'rt-event-manager') . '</h2>';
        echo '<p><label>' . esc_html__('Title', 'rt-event-manager') . '<br><input type="text" name="agenda_title" class="regular-text" required /></label></p>';
        echo '<p><label>' . esc_html__('Location', 'rt-event-manager') . '<br><input type="text" name="agenda_location" class="regular-text" /></label></p>';
        echo '<p><label>' . esc_html__('Start', 'rt-event-manager') . '<br><input type="datetime-local" name="agenda_start" required /></label>';
        echo ' &nbsp; <label>' . esc_html__('End', 'rt-event-manager') . '<br><input type="datetime-local" name="agenda_end" /></label></p>';
        echo '<p><button type="submit" name="rt_agenda_add" value="1" class="button button-primary">' . esc_html__('Add item', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        // List.
        if (empty($items)) {
            echo '<p>' . esc_html__('No agenda items yet.', 'rt-event-manager') . '</p></div>';
            return;
        }
        echo '<table class="wp-list-table widefat fixed striped"><thead><tr>';
        echo '<th>' . esc_html__('Title', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Location', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Start', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('End', 'rt-event-manager') . '</th>';
        echo '<th></th></tr></thead><tbody>';
        foreach ($items as $i) {
            echo '<tr>';
            echo '<td>' . esc_html($i['title']) . '</td>';
            echo '<td>' . esc_html($i['location']) . '</td>';
            echo '<td>' . esc_html(str_replace('T', ' ', $i['start'])) . '</td>';
            echo '<td>' . esc_html(str_replace('T', ' ', $i['end'])) . '</td>';
            echo '<td><form method="post" onsubmit="return confirm(\'' . esc_js(__('Remove this agenda item?', 'rt-event-manager')) . '\');" style="margin:0;">';
            wp_nonce_field('rt_agenda_save');
            echo '<input type="hidden" name="rt_agenda_delete" value="' . esc_attr($i['id']) . '" />';
            echo '<button type="submit" class="button button-link-delete">' . esc_html__('Remove', 'rt-event-manager') . '</button>';
            echo '</form></td></tr>';
        }
        echo '</tbody></table></div>';
    }

    /**
     * @param int $product_id
     * @return bool True if the product is a Pretour ticket product.
     */
    public static function is_pretour_product($product_id) {
        $cat = self::get_pretour_category_id();
        return $cat && has_term($cat, 'product_cat', $product_id);
    }

    /**
     * @param int $product_id
     * @return bool True if the product is a Day Tour ticket product.
     */
    public static function is_daytour_product($product_id) {
        $cat = self::get_daytour_category_id();
        return $cat && has_term($cat, 'product_cat', $product_id);
    }

    /**
     * @param int $product_id
     * @return bool True if the product is a Future/minor ticket product.
     */
    public static function is_future_product($product_id) {
        $cat = self::get_future_category_id();
        return $cat && has_term($cat, 'product_cat', $product_id);
    }

    /**
     * Classify a ticket product into its kind. Future (minor) takes precedence
     * over Pretour, which takes precedence over the default Event ticket.
     *
     * @param int $product_id
     * @return string 'minor' | 'pretour' | 'event'
     */
    public static function get_ticket_kind_for_product($product_id) {
        if (self::is_future_product($product_id)) {
            return 'minor';
        }
        if (self::is_pretour_product($product_id)) {
            return 'pretour';
        }
        if (self::is_daytour_product($product_id)) {
            return 'daytour';
        }
        return 'event';
    }

    /**
     * Whether a product should create a ticket row. True when it is flagged as a
     * ticket (_rti_is_ticket) OR it is a Pretour / Future product (identified by
     * category) — those are ticket-generating even without the explicit flag.
     *
     * @param int $product_id
     * @return bool
     */
    public static function is_ticket_product($product_id) {
        if ('yes' === get_post_meta($product_id, '_rti_is_ticket', true)) {
            return true;
        }
        return self::is_pretour_product($product_id) || self::is_future_product($product_id) || self::is_daytour_product($product_id);
    }

    /**
     * Effective kind for a ticket row: prefer the stored ticket_kind, fall back
     * to deriving from the product (handles rows created before kind existed).
     *
     * @param array $row Ticket row (ARRAY_A)
     * @return string 'event' | 'pretour' | 'minor'
     */
    public static function get_ticket_kind($row) {
        $k = isset($row['ticket_kind']) ? $row['ticket_kind'] : '';
        if (in_array($k, array('pretour', 'daytour', 'minor'), true)) {
            return $k;
        }
        return self::get_ticket_kind_for_product(isset($row['product_id']) ? $row['product_id'] : 0);
    }

    /**
     * Human label for a ticket row's kind (minors show their gender).
     *
     * @param array $row
     * @return string
     */
    public static function ticket_kind_label($row) {
        $kind = self::get_ticket_kind($row);
        if ('minor' === $kind) {
            $mt = isset($row['minor_type']) ? $row['minor_type'] : '';
            return ('circler' === $mt) ? __('Future Circler', 'rt-event-manager') : __('Future Tabler', 'rt-event-manager');
        }
        if ('pretour' === $kind) {
            return __('Pretour', 'rt-event-manager');
        }
        if ('daytour' === $kind) {
            return __('Day tour', 'rt-event-manager');
        }
        return __('Event', 'rt-event-manager');
    }

    /**
     * Fetch a single ticket row by id, or null.
     *
     * @param int $ticket_id
     * @return array|null
     */
    public static function get_ticket_by_id($ticket_id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", absint($ticket_id)), ARRAY_A);
        return $row ?: null;
    }

    /**
     * Look up a ticket by its order id and 1-based ticket number (as encoded in
     * the check-in QR token; ticket_index is number - 1).
     *
     * @param int $order_id
     * @param int $number 1-based ticket number.
     * @return array|null
     */
    public static function get_ticket_by_order_and_number($order_id, $number) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'rti_tickets';
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE order_id = %d AND ticket_index = %d",
            absint($order_id),
            absint($number) - 1
        ), ARRAY_A);
        return $row ?: null;
    }

    /**
     * Whether an event/Future member ticket already hosts a pretour (one per
     * ticket). Counts stored pretour rows whose parent is this ticket and which
     * are not cancelled/invalid.
     *
     * @param int $ticket_id
     * @return bool
     */
    public static function ticket_has_pretour($ticket_id) {
        return self::ticket_has_tour($ticket_id, 'pretour');
    }

    /** Whether a host ticket already hosts a Day tour (one per ticket). */
    public static function ticket_has_daytour($ticket_id) {
        return self::ticket_has_tour($ticket_id, 'daytour');
    }

    /**
     * Whether a host ticket already hosts a tour of the given kind (one per
     * ticket per kind). Counts stored rows whose parent is this ticket and which
     * are not invalid.
     *
     * @param int    $ticket_id
     * @param string $kind 'pretour' | 'daytour'
     * @return bool
     */
    public static function ticket_has_tour($ticket_id, $kind = 'pretour') {
        global $wpdb;
        $ticket_id = absint($ticket_id);
        if (!$ticket_id) {
            return false;
        }
        $table_name = $wpdb->prefix . 'rti_tickets';
        $count = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table_name WHERE parent_ticket_id = %d AND ticket_kind = %s AND status <> %s",
            $ticket_id,
            $kind,
            'invalid'
        ));
        return $count > 0;
    }

    /**
     * The pretour tickets linked to a host ticket (event / Future member).
     */
    public static function get_child_pretours($ticket_id, $exclude_cancelled = true) {
        return self::get_child_tours($ticket_id, 'pretour', $exclude_cancelled);
    }

    /** The Day tour tickets linked to a host ticket. */
    public static function get_child_daytours($ticket_id, $exclude_cancelled = true) {
        return self::get_child_tours($ticket_id, 'daytour', $exclude_cancelled);
    }

    /**
     * Start / end timestamps for a tour product from its _rti_start/_rti_end
     * meta. Returns [start, end] as Unix timestamps; 0 when unset. End defaults
     * to start when missing and is never earlier than start.
     *
     * @param int $product_id
     * @return array{0:int,1:int}
     */
    public static function tour_product_range($product_id) {
        $s = get_post_meta($product_id, '_rti_start', true);
        $e = get_post_meta($product_id, '_rti_end', true);
        $s = ('' !== $s) ? (int) strtotime($s) : 0;
        $e = ('' !== $e) ? (int) strtotime($e) : 0;
        if (!$e) {
            $e = $s;
        }
        if ($s && $e && $e < $s) {
            $e = $s;
        }
        return array($s, $e);
    }

    /**
     * Whether two day-tour products conflict for the same person: the same
     * product twice, or overlapping time windows. Tours whose end equals the
     * other's start (back to back) do NOT conflict. When either product has no
     * times set, distinct products are allowed (only identical ones conflict).
     *
     * @param int $a Product id.
     * @param int $b Product id.
     * @return bool
     */
    public static function daytours_conflict($a, $b) {
        if (absint($a) === absint($b)) {
            return true;
        }
        list($as, $ae) = self::tour_product_range($a);
        list($bs, $be) = self::tour_product_range($b);
        if (!$as || !$bs) {
            return false; // unknown times: allow distinct products
        }
        return ($as < $be) && ($bs < $ae);
    }

    /**
     * Whether adding $new_product as a day tour for $host_id would conflict with
     * the host's existing day tours (optionally plus extra pending product ids,
     * e.g. items already in the cart).
     *
     * @param int   $host_id
     * @param int   $new_product
     * @param int[] $extra_products
     * @return bool
     */
    public static function host_daytour_conflict($host_id, $new_product, $extra_products = array()) {
        $products = array();
        foreach (self::get_child_daytours($host_id) as $c) {
            $products[] = absint($c['product_id']);
        }
        foreach ($extra_products as $p) {
            $products[] = absint($p);
        }
        foreach ($products as $p) {
            if (self::daytours_conflict($p, $new_product)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tour tickets of a given kind linked to a host ticket.
     *
     * @param int    $ticket_id
     * @param string $kind 'pretour' | 'daytour'
     * @param bool   $exclude_cancelled
     * @return array Ticket rows (ARRAY_A).
     */
    public static function get_child_tours($ticket_id, $kind = 'pretour', $exclude_cancelled = true) {
        global $wpdb;
        $ticket_id = absint($ticket_id);
        if (!$ticket_id) {
            return array();
        }
        $table_name = $wpdb->prefix . 'rti_tickets';
        $sql = $wpdb->prepare("SELECT * FROM $table_name WHERE parent_ticket_id = %d AND ticket_kind = %s", $ticket_id, $kind);
        if ($exclude_cancelled) {
            $sql .= " AND status <> 'cancelled'";
        }
        return $wpdb->get_results($sql, ARRAY_A);
    }

    /**
     * Look up a ticket by its pending transfer token.
     *
     * @param string $token
     * @return array|null Ticket row or null.
     */
    public static function get_ticket_by_transfer_token($token) {
        global $wpdb;
        $token = sanitize_text_field($token);
        if ('' === $token) {
            return null;
        }
        $table_name = $wpdb->prefix . 'rti_tickets';
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE transfer_token = %s",
            $token
        ), ARRAY_A);
        return $row ?: null;
    }

    /**
     * Short "parent" reference label for a ticket row, or '' if none.
     * Resolves the parent ticket's holder name when available.
     *
     * @param array $row
     * @return string
     */
    public static function ticket_parent_label($row) {
        $parent_id = isset($row['parent_ticket_id']) ? absint($row['parent_ticket_id']) : 0;
        if (!$parent_id) {
            return '';
        }
        $parent = self::get_ticket_by_id($parent_id);
        if ($parent && $parent['holder_name'] !== '') {
            return sprintf('%s (#%d)', $parent['holder_name'], $parent_id);
        }
        return '#' . $parent_id;
    }

    /**
     * Render the custom datetime field type for WooCommerce settings
     *
     * @param array $value Field settings
     */
    public function render_datetime_field($value) {
        $option_value = get_option($value['id'], $value['default']);
        $field_description = WC_Admin_Settings::get_field_description($value);
        ?>
        <tr valign="top">
            <th scope="row" class="titledesc">
                <label for="<?php echo esc_attr($value['id']); ?>"><?php echo esc_html($value['title']); ?> <?php echo $field_description['tooltip_html']; ?></label>
            </th>
            <td class="forminp forminp-datetime">
                <input
                    name="<?php echo esc_attr($value['id']); ?>"
                    id="<?php echo esc_attr($value['id']); ?>"
                    type="datetime-local"
                    value="<?php echo esc_attr($option_value); ?>"
                    class="regular-text"
                    style="width:220px;"
                />
                <?php echo $field_description['description']; ?>
            </td>
        </tr>
        <?php
    }

    /**
     * Save the custom datetime field type
     *
     * @param array $value Field settings
     */
    public function save_datetime_field($value) {
        $option_value = isset($_POST[$value['id']]) ? sanitize_text_field($_POST[$value['id']]) : '';
        update_option($value['id'], $option_value);
    }

    // =============================================
    // Frontend Ticket Display & Editing
    // =============================================

    /**
     * Check if frontend ticket editing is currently allowed (cutoff not passed)
     *
     * @return bool
     */
    public function is_frontend_editing_allowed() {
        $cutoff = get_option('wc_rti_ticket_edit_cutoff', '');

        if (empty($cutoff)) {
            return true; // No cutoff set — always allow
        }

        $cutoff_time = strtotime($cutoff);
        if (!$cutoff_time) {
            return true; // Invalid date — allow by default
        }

        return current_time('timestamp') < $cutoff_time;
    }

    /**
     * Render tickets on the frontend order view page (My Account > Orders > View Order)
     *
     * @param WC_Order $order Order object
     */
    public function render_frontend_tickets($order) {
        if (!is_user_logged_in()) {
            return;
        }

        $order_id = $order->get_id();

        // Verify current user owns this order
        if ($order->get_customer_id() !== get_current_user_id()) {
            return;
        }

        $tickets = self::get_tickets_for_order($order_id);

        if (empty($tickets)) {
            return;
        }

        $can_edit = $this->is_frontend_editing_allowed();
        $cutoff   = get_option('wc_rti_ticket_edit_cutoff', '');

        echo '<section class="rti-frontend-tickets-section">';
        echo '<h2>' . esc_html__('Tickets', 'rt-event-manager') . '</h2>';

        // Cutoff notice
        if (!empty($cutoff)) {
            $cutoff_time = strtotime($cutoff);
            if ($cutoff_time) {
                $formatted = date_i18n(get_option('date_format') . ' ' . get_option('time_format'), $cutoff_time);
                if ($can_edit) {
                    echo '<div class="rti-tickets-cutoff-notice rti-tickets-cutoff-info">';
                    echo '<p>' . esc_html(sprintf(
                        __('You can edit your tickets until %s.', 'rt-event-manager'),
                        $formatted
                    )) . '</p>';
                    echo '</div>';
                } else {
                    echo '<div class="rti-tickets-cutoff-notice rti-tickets-cutoff-expired">';
                    echo '<p>' . esc_html__('The ticket editing deadline has passed. Please contact us if you need to make changes.', 'rt-event-manager') . '</p>';
                    echo '</div>';
                }
            }
        }

        if ($can_edit) {
            wp_nonce_field('rti_frontend_save_tickets', 'rti_frontend_tickets_nonce');
            echo '<input type="hidden" id="rti-frontend-order-id" value="' . esc_attr($order_id) . '" />';
        }

        // Fetch order-level buyer info (shown only on the first ticket)
        $buyer_phone    = $order->get_billing_phone();
        $buyer_function = $order->get_meta('_rti_function');
        $coupon_codes   = $order->get_coupon_codes();
        $buyer_voucher  = !empty($coupon_codes) ? implode(', ', $coupon_codes) : '';

        echo '<table class="woocommerce-table shop_table rti-frontend-tickets-table">';
        echo '<thead><tr>';
        echo '<th>' . esc_html__('#', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Product', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Holder Name', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Ticket Phone', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('RTI Family', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Club', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Dietary', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Voucher', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Phone', 'rt-event-manager') . '</th>';
        echo '<th>' . esc_html__('Function / Role', 'rt-event-manager') . '</th>';
        echo '</tr></thead>';
        echo '<tbody>';

        foreach ($tickets as $ticket) {
            $ticket_num   = intval($ticket['ticket_index']) + 1;
            $product      = wc_get_product($ticket['product_id']);
            $product_name = $product ? $product->get_name() : __('(deleted)', 'rt-event-manager');
            $is_first_ticket = intval($ticket['ticket_index']) === 0;

            echo '<tr>';

            // Ticket number
            echo '<td data-title="' . esc_attr__('#', 'rt-event-manager') . '">' . esc_html($ticket_num) . '</td>';

            // Product name (always read-only)
            echo '<td data-title="' . esc_attr__('Product', 'rt-event-manager') . '">' . esc_html($product_name) . '</td>';

            if ($can_edit) {
                // Holder name (editable)
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">';
                echo '<input type="text" class="rti-frontend-ticket-field" name="rti_ft[' . esc_attr($ticket['id']) . '][holder_name]" value="' . esc_attr($ticket['holder_name']) . '" />';
                echo '</td>';

                // Phone (editable, international format required)
                $ticket_phone = isset($ticket['phone']) ? $ticket['phone'] : '';
                echo '<td data-title="' . esc_attr__('Ticket Phone', 'rt-event-manager') . '">';
                echo '<input type="tel" class="rti-frontend-ticket-field" name="rti_ft[' . esc_attr($ticket['id']) . '][phone]" value="' . esc_attr($ticket_phone) . '" required pattern="\+[0-9\s()\-]{7,}" inputmode="tel" placeholder="' . esc_attr__('+41 79 123 45 67', 'rt-event-manager') . '" title="' . esc_attr__('Enter the number in international format, e.g. +41791234567', 'rt-event-manager') . '" />';
                echo '</td>';

                // RTI Family (editable)
                echo '<td data-title="' . esc_attr__('RTI Family', 'rt-event-manager') . '">';
                echo '<select class="rti-frontend-ticket-field" name="rti_ft[' . esc_attr($ticket['id']) . '][rti_family]">';
                echo '<option value="">' . esc_html__('— Select —', 'rt-event-manager') . '</option>';
                foreach (self::$family_options as $key => $label) {
                    echo '<option value="' . esc_attr($key) . '" ' . selected($ticket['rti_family'], (string) $key, false) . '>' . esc_html($label) . '</option>';
                }
                echo '</select></td>';

                // Club (editable)
                echo '<td data-title="' . esc_attr__('Club', 'rt-event-manager') . '">';
                echo '<input type="text" class="rti-frontend-ticket-field" name="rti_ft[' . esc_attr($ticket['id']) . '][rti_club]" value="' . esc_attr($ticket['rti_club']) . '" />';
                echo '</td>';

                // Dietary (editable)
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">';
                echo '<select class="rti-frontend-ticket-field" name="rti_ft[' . esc_attr($ticket['id']) . '][dietary]">';
                $dietary_options = self::get_dietary_options(true);
                foreach ($dietary_options as $dkey => $dlabel) {
                    echo '<option value="' . esc_attr($dkey) . '" ' . selected($ticket['dietary'], $dkey, false) . '>' . esc_html($dlabel) . '</option>';
                }
                echo '</select></td>';

                // Buyer info columns (only on first ticket)
                echo '<td data-title="' . esc_attr__('Voucher', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_voucher ?: '—') : '') . '</td>';
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_phone ?: '—') : '') . '</td>';
                echo '<td data-title="' . esc_attr__('Function / Role', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_function ?: '—') : '') . '</td>';
            } else {
                // Read-only display
                echo '<td data-title="' . esc_attr__('Holder Name', 'rt-event-manager') . '">' . esc_html($ticket['holder_name']) . '</td>';

                echo '<td data-title="' . esc_attr__('Ticket Phone', 'rt-event-manager') . '">' . esc_html(!empty($ticket['phone']) ? $ticket['phone'] : '—') . '</td>';

                $family_label = (isset($ticket['rti_family']) && $ticket['rti_family'] !== '') ? self::get_family_label($ticket['rti_family']) : '—';
                echo '<td data-title="' . esc_attr__('RTI Family', 'rt-event-manager') . '">' . esc_html($family_label) . '</td>';

                echo '<td data-title="' . esc_attr__('Club', 'rt-event-manager') . '">' . esc_html($ticket['rti_club'] ?: '—') . '</td>';

                $dietary_label = $ticket['dietary'] ?: '—';
                if ($dietary_label === 'none') $dietary_label = 'None';
                if ($dietary_label === 'vegetarian') $dietary_label = 'Vegetarian';
                if ($dietary_label === 'allergies') {
                    $dietary_label = 'Allergies';
                    if (!empty($ticket['allergy_details'])) {
                        $dietary_label .= ' (' . $ticket['allergy_details'] . ')';
                    }
                }
                echo '<td data-title="' . esc_attr__('Dietary', 'rt-event-manager') . '">' . esc_html($dietary_label) . '</td>';

                // Buyer info columns (only on first ticket)
                echo '<td data-title="' . esc_attr__('Voucher', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_voucher ?: '—') : '') . '</td>';
                echo '<td data-title="' . esc_attr__('Phone', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_phone ?: '—') : '') . '</td>';
                echo '<td data-title="' . esc_attr__('Function / Role', 'rt-event-manager') . '">' . esc_html($is_first_ticket ? ($buyer_function ?: '—') : '') . '</td>';
            }

            echo '</tr>';
        }

        echo '</tbody></table>';

        // Save button and inline JS (only if editing allowed)
        if ($can_edit) {
            echo '<div class="rti-frontend-save-controls" style="margin-top:1em;">';
            echo '<button type="button" class="button" id="rti-frontend-save-tickets">' . esc_html__('Save Tickets', 'rt-event-manager') . '</button>';
            echo '<span id="rti-frontend-tickets-status" style="margin-left:10px;display:none;"></span>';
            echo '</div>';

            ?>
            <script type="text/javascript">
            jQuery(document).ready(function($) {
                var orderId = $('#rti-frontend-order-id').val();
                var nonce   = $('#rti_frontend_tickets_nonce').val();

                $('#rti-frontend-save-tickets').on('click', function(e) {
                    e.preventDefault();
                    var $btn    = $(this);
                    var $status = $('#rti-frontend-tickets-status');

                    var tickets = {};
                    var hasTickets = false;
                    $('.rti-frontend-tickets-table tbody tr').each(function() {
                        $(this).find('.rti-frontend-ticket-field').each(function() {
                            var name = $(this).attr('name');
                            var match = name.match(/rti_ft\[(\d+)\]\[([^\]]+)\]/);
                            if (match) {
                                var ticketId = match[1];
                                var field    = match[2];
                                if (!tickets[ticketId]) tickets[ticketId] = {};
                                tickets[ticketId][field] = $(this).val();
                                hasTickets = true;
                            }
                        });
                    });

                    if (!hasTickets) {
                        $status.text('<?php echo esc_js(__('Nothing to save.', 'rt-event-manager')); ?>').css('color', '#999').show();
                        setTimeout(function() { $status.fadeOut(); }, 2000);
                        return;
                    }

                    $btn.prop('disabled', true);
                    $status.text('<?php echo esc_js(__('Saving...', 'rt-event-manager')); ?>').css('color', '#666').show();

                    $.post('<?php echo esc_url(admin_url('admin-ajax.php')); ?>', {
                        action:   'rti_frontend_save_tickets',
                        order_id: orderId,
                        nonce:    nonce,
                        tickets:  tickets
                    }, function(response) {
                        $btn.prop('disabled', false);
                        if (response.success) {
                            $status.text('<?php echo esc_js(__('Tickets saved!', 'rt-event-manager')); ?>').css('color', '#46b450');
                            setTimeout(function() { $status.fadeOut(); }, 3000);
                        } else {
                            $status.text(response.data || '<?php echo esc_js(__('Error saving tickets.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                        }
                    }).fail(function() {
                        $btn.prop('disabled', false);
                        $status.text('<?php echo esc_js(__('Request failed.', 'rt-event-manager')); ?>').css('color', '#dc3232');
                    });
                });
            });
            </script>
            <?php
        }

        echo '</section>';
    }

    /**
     * AJAX handler for frontend ticket saves by customers
     */
    public function ajax_frontend_save_tickets() {
        check_ajax_referer('rti_frontend_save_tickets', 'nonce');

        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in.', 'rt-event-manager'));
        }

        $order_id = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;
        $tickets  = isset($_POST['tickets']) ? $_POST['tickets'] : array();

        if (!$order_id || empty($tickets)) {
            wp_send_json_error(__('Invalid data.', 'rt-event-manager'));
        }

        // Verify order exists
        $order = wc_get_order($order_id);
        if (!$order) {
            wp_send_json_error(__('Order not found.', 'rt-event-manager'));
        }

        // Verify current user owns this order
        if ($order->get_customer_id() !== get_current_user_id()) {
            wp_send_json_error(__('Permission denied.', 'rt-event-manager'));
        }

        // Enforce cutoff on server side
        if (!$this->is_frontend_editing_allowed()) {
            wp_send_json_error(__('The ticket editing deadline has passed.', 'rt-event-manager'));
        }

        // Verify tickets belong to this order
        $existing = self::get_tickets_for_order($order_id);
        $valid_ids = array_map('intval', array_column($existing, 'id'));

        // Map ticket id => ticket_index for human-friendly validation messages.
        $existing_index_map = array();
        foreach ($existing as $ex_row) {
            $existing_index_map[intval($ex_row['id'])] = intval($ex_row['ticket_index']);
        }

        foreach ($tickets as $ticket_id => $data) {
            $ticket_id = absint($ticket_id);
            if (!in_array($ticket_id, $valid_ids, true)) {
                continue;
            }

            // Customers can only edit: holder_name, phone, rti_family, rti_club, dietary
            // .WORLD ID is NOT editable by customers
            $allowed_data = array();
            if (isset($data['holder_name'])) {
                $allowed_data['holder_name'] = $data['holder_name'];
            }
            if (isset($data['phone'])) {
                $phone_raw = wp_unslash($data['phone']);
                if (trim($phone_raw) === '' || !self::is_valid_intl_phone($phone_raw)) {
                    wp_send_json_error(sprintf(
                        __('Please enter the phone number for Ticket %d in international format, e.g. +41791234567.', 'rt-event-manager'),
                        intval($existing_index_map[$ticket_id]) + 1
                    ));
                }
                $allowed_data['phone'] = $phone_raw;
            }
            if (isset($data['rti_family'])) {
                $allowed_data['rti_family'] = $data['rti_family'];
            }
            if (isset($data['rti_club'])) {
                $allowed_data['rti_club'] = $data['rti_club'];
            }
            if (isset($data['dietary'])) {
                $allowed_data['dietary'] = $data['dietary'];
            }

            if (!empty($allowed_data)) {
                $this->update_ticket($ticket_id, $allowed_data);
            }
        }

        // Recalculate ticket statuses (holder_name may have changed)
        $this->recalculate_order_ticket_statuses($order_id);

        wp_send_json_success();
    }
}
