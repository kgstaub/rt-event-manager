<?php
/**
 * User Handler for creating and updating WordPress users
 */

if (!defined('ABSPATH')) {
    exit;
}

class Multi_OAuth_SSO_User_Handler {

    /**
     * Family organization options
     */
    public static $family_options = array(
        '0' => 'Round Table',
        '1' => 'Club 41',
        '2' => 'Ladies Circle',
        '3' => 'Agora Club',
        '4' => 'Tangent Club',
        '9' => 'Guest/Partner',
    );

    /**
     * RTI/Organization fields configuration
     * Uses rti_ prefix for compatibility with WC RTI Customer Fields plugin
     */
    private static $rti_fields = array(
        'world_id' => array(
            'label' => '.WORLD ID',
            'type' => 'text',
            'placeholder' => '',
            'section' => 'organization',
            'readonly' => true,
        ),
        'rti_family' => array(
            'label' => 'Family Organization',
            'type' => 'select',
            'section' => 'organization',
        ),
        'rti_club' => array(
            'label' => 'Club',
            'type' => 'text',
            'placeholder' => 'e.g., 123 - Example City',
            'section' => 'organization',
        ),
        'rti_club_domain' => array(
            'label' => 'Club Domain',
            'type' => 'text',
            'placeholder' => 'e.g., rt123.tabler.world',
            'section' => 'organization',
        ),
        'rti_function' => array(
            'label' => 'Function / Role',
            'type' => 'text',
            'placeholder' => 'e.g., President, Secretary, Member',
            'section' => 'organization',
        ),
        'rti_partner_name' => array(
            'label' => 'Partner Name',
            'type' => 'text',
            'placeholder' => '',
            'section' => 'additional',
        ),
        'rti_dietary' => array(
            'label' => 'Dietary Restrictions',
            'type' => 'text',
            'placeholder' => 'e.g., Vegetarian, Gluten-free',
            'section' => 'additional',
        ),
        'rti_emergency_contact' => array(
            'label' => 'Emergency Contact',
            'type' => 'text',
            'placeholder' => 'Name, Phone, Email',
            'section' => 'additional',
        ),
    );

    /**
     * Check if the RTI customer-fields owner is active.
     *
     * Now that the SSO code is merged into RT Event Manager, RT Event Manager
     * owns all WooCommerce/checkout/profile RTI fields, so this returns true
     * whenever its main class is present — keeping the SSO handler's own
     * WC field rendering deferred to avoid duplicates. (The legacy
     * WC_RTI_Customer_Fields class name is kept for older installs.)
     */
    public static function is_rti_plugin_active() {
        return class_exists('RT_Event_Manager') || class_exists('WC_RTI_Customer_Fields');
    }

    /**
     * Initialize hooks for displaying RTI fields
     */
    public static function init_hooks() {
        // Disable password change for SSO users
        if (class_exists('WooCommerce')) {
            add_action('wp_head', array(__CLASS__, 'maybe_add_password_hide_css'));
            add_action('wp_footer', array(__CLASS__, 'maybe_add_password_hide_js'));
            add_filter('woocommerce_save_account_details_required_fields', array(__CLASS__, 'remove_password_required_for_sso'));
        }

        // Only add profile fields if RTI plugin is NOT active (to avoid duplicates)
        if (!self::is_rti_plugin_active()) {
            // WordPress User Profile hooks (admin)
            add_action('show_user_profile', array(__CLASS__, 'display_rti_fields_in_profile'), 20);
            add_action('edit_user_profile', array(__CLASS__, 'display_rti_fields_in_profile'), 20);
            add_action('personal_options_update', array(__CLASS__, 'save_rti_fields_from_profile'));
            add_action('edit_user_profile_update', array(__CLASS__, 'save_rti_fields_from_profile'));

            // WooCommerce hooks (if WC is active but RTI plugin is not)
            if (class_exists('WooCommerce')) {
                // My Account edit profile
                add_action('woocommerce_edit_account_form', array(__CLASS__, 'display_rti_fields_in_my_account'));
                add_action('woocommerce_save_account_details', array(__CLASS__, 'save_rti_fields_from_my_account'));

                // Checkout fields
                add_filter('woocommerce_checkout_fields', array(__CLASS__, 'add_rti_checkout_fields'));
                add_action('woocommerce_checkout_update_order_meta', array(__CLASS__, 'save_rti_checkout_fields'));

                // Prefill checkout from user meta
                add_filter('woocommerce_checkout_get_value', array(__CLASS__, 'prefill_checkout_fields'), 10, 2);

                // Admin order billing fields
                add_filter('woocommerce_admin_billing_fields', array(__CLASS__, 'add_admin_billing_fields'));

                // Formatted billing address display
                add_filter('woocommerce_order_formatted_billing_address', array(__CLASS__, 'add_rti_to_formatted_billing_address'), 10, 2);
                add_filter('woocommerce_my_account_my_address_formatted_address', array(__CLASS__, 'add_rti_to_my_account_address'), 10, 3);
                add_filter('woocommerce_localisation_address_formats', array(__CLASS__, 'add_rti_address_format'));
                add_filter('woocommerce_formatted_address_replacements', array(__CLASS__, 'add_rti_address_replacements'), 10, 2);

                // Add RTI details in admin order view
                add_action('woocommerce_admin_order_data_after_billing_address', array(__CLASS__, 'display_rti_in_admin_order'));

                // My Account billing address fields (for editing)
                add_filter('woocommerce_billing_fields', array(__CLASS__, 'add_rti_billing_fields'), 20);
                add_action('woocommerce_customer_save_address', array(__CLASS__, 'save_rti_billing_address_fields'), 10, 2);

                // Prefill billing fields from user meta (multiple hooks for compatibility)
                add_filter('woocommerce_my_account_edit_address_field_value', array(__CLASS__, 'prefill_billing_address_fields'), 10, 3);
                add_filter('default_checkout_billing_rti_family', array(__CLASS__, 'get_default_rti_family'));
                add_filter('default_checkout_billing_rti_club', array(__CLASS__, 'get_default_rti_club'));
                add_filter('default_checkout_billing_rti_function', array(__CLASS__, 'get_default_rti_function'));
            }
        }
    }

    /**
     * Check if current user is an SSO user
     */
    public static function is_sso_user($user_id = null) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }
        if (!$user_id) {
            return false;
        }
        $provider = get_user_meta($user_id, 'oauth_sso_provider', true);
        return !empty($provider);
    }

    /**
     * Check if we're on the edit account page
     */
    private static function is_edit_account_page() {
        global $wp;
        if (function_exists('is_account_page') && is_account_page()) {
            if (isset($wp->query_vars['edit-account']) ||
                (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'edit-account') !== false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add CSS to hide password fields for SSO users
     */
    public static function maybe_add_password_hide_css() {
        if (!self::is_sso_user() || !self::is_edit_account_page()) {
            return;
        }
        ?>
        <style id="world-sso-hide-password-css">
            /* Hide all password-related elements */
            .woocommerce-EditAccountForm fieldset,
            .edit-account fieldset,
            #password_current,
            #password_1,
            #password_2,
            input[type="password"],
            input[name="password_current"],
            input[name="password_1"],
            input[name="password_2"],
            label[for="password_current"],
            label[for="password_1"],
            label[for="password_2"] {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
            }
        </style>
        <?php
    }

    /**
     * Add JS to hide password fields for SSO users (runs in footer)
     */
    public static function maybe_add_password_hide_js() {
        if (!self::is_sso_user() || !self::is_edit_account_page()) {
            return;
        }

        $provider = get_user_meta(get_current_user_id(), 'oauth_sso_provider', true);
        ?>
        <script type="text/javascript">
        (function() {
            function hidePasswordFields() {
                // Find the form
                var form = document.querySelector('.woocommerce-EditAccountForm, form.edit-account');
                if (!form) return;

                // Add SSO message at the top of the form if not already added
                if (!document.getElementById('world-sso-message')) {
                    var msg = document.createElement('div');
                    msg.id = 'world-sso-message';
                    msg.className = 'woocommerce-message';
                    msg.style.marginBottom = '20px';
                    msg.innerHTML = '<?php printf(esc_js(__('Your account is managed via %s SSO. Password changes are not available.', 'world-sso')), '<strong>' . esc_js($provider) . '</strong>'); ?>';
                    form.insertBefore(msg, form.firstChild);
                }

                // Hide all fieldsets (password change section)
                form.querySelectorAll('fieldset').forEach(function(fs) {
                    fs.style.display = 'none';
                });

                // Hide all password type inputs and their containers
                document.querySelectorAll('input[type="password"]').forEach(function(input) {
                    var el = input;
                    for (var i = 0; i < 6; i++) {
                        if (el && el.tagName !== 'FORM') {
                            el.style.display = 'none';
                            el = el.parentElement;
                        }
                    }
                });

                // Hide by specific IDs
                ['password_current', 'password_1', 'password_2'].forEach(function(id) {
                    var input = document.getElementById(id);
                    if (input) {
                        var el = input;
                        for (var i = 0; i < 6; i++) {
                            if (el && el.tagName !== 'FORM') {
                                el.style.display = 'none';
                                el = el.parentElement;
                            }
                        }
                    }
                    // Also hide labels
                    var label = document.querySelector('label[for="' + id + '"]');
                    if (label) {
                        var el = label;
                        for (var i = 0; i < 6; i++) {
                            if (el && el.tagName !== 'FORM') {
                                el.style.display = 'none';
                                el = el.parentElement;
                            }
                        }
                    }
                });
            }

            // Run multiple times to ensure it works
            hidePasswordFields();
            document.addEventListener('DOMContentLoaded', hidePasswordFields);
            setTimeout(hidePasswordFields, 100);
            setTimeout(hidePasswordFields, 300);
            setTimeout(hidePasswordFields, 600);
            setTimeout(hidePasswordFields, 1000);
        })();
        </script>
        <?php
    }

    /**
     * Remove password fields from required fields for SSO users
     */
    public static function remove_password_required_for_sso($required_fields) {
        if (self::is_sso_user()) {
            unset($required_fields['password_current']);
            unset($required_fields['password_1']);
            unset($required_fields['password_2']);
        }
        return $required_fields;
    }

    /**
     * Get family label from ID
     */
    public static function get_family_label($family_id) {
        return isset(self::$family_options[$family_id]) ? self::$family_options[$family_id] : '';
    }

    /**
     * Display RTI fields in WordPress user profile (admin)
     */
    public static function display_rti_fields_in_profile($user) {
        ?>
        <h3><?php esc_html_e('RTI Organization Details', 'world-sso'); ?></h3>
        <table class="form-table">
            <?php foreach (self::$rti_fields as $field_key => $field_config):
                if ($field_config['section'] !== 'organization') continue;
                $value = get_user_meta($user->ID, $field_key, true);
                $is_readonly = !empty($field_config['readonly']);
            ?>
                <tr>
                    <th><label for="<?php echo esc_attr($field_key); ?>"><?php echo esc_html($field_config['label']); ?></label></th>
                    <td>
                        <?php if ($field_config['type'] === 'select'): ?>
                            <select name="<?php echo esc_attr($field_key); ?>" id="<?php echo esc_attr($field_key); ?>" class="regular-text">
                                <option value=""><?php esc_html_e('— Select Organization —', 'world-sso'); ?></option>
                                <?php foreach (self::$family_options as $opt_value => $opt_label): ?>
                                    <option value="<?php echo esc_attr($opt_value); ?>" <?php selected($value, $opt_value); ?>><?php echo esc_html($opt_label); ?></option>
                                <?php endforeach; ?>
                            </select>
                        <?php else: ?>
                            <input type="text" name="<?php echo esc_attr($field_key); ?>" id="<?php echo esc_attr($field_key); ?>" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="<?php echo esc_attr($field_config['placeholder'] ?? ''); ?>"<?php echo $is_readonly ? ' readonly="readonly" style="background-color: #f0f0f1;"' : ''; ?>>
                            <?php if ($is_readonly && !empty($value)): ?>
                                <p class="description"><?php esc_html_e('This field is automatically populated from .WORLD SSO.', 'world-sso'); ?></p>
                            <?php endif; ?>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>

        <h3><?php esc_html_e('Additional Information', 'world-sso'); ?></h3>
        <table class="form-table">
            <?php foreach (self::$rti_fields as $field_key => $field_config):
                if ($field_config['section'] !== 'additional') continue;
                $value = get_user_meta($user->ID, $field_key, true);
            ?>
                <tr>
                    <th><label for="<?php echo esc_attr($field_key); ?>"><?php echo esc_html($field_config['label']); ?></label></th>
                    <td>
                        <input type="text" name="<?php echo esc_attr($field_key); ?>" id="<?php echo esc_attr($field_key); ?>" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="<?php echo esc_attr($field_config['placeholder'] ?? ''); ?>">
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
        <?php
    }

    /**
     * Save RTI fields from WordPress user profile
     */
    public static function save_rti_fields_from_profile($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return false;
        }

        foreach (self::$rti_fields as $field_key => $field_config) {
            if (isset($_POST[$field_key])) {
                update_user_meta($user_id, $field_key, sanitize_text_field($_POST[$field_key]));
            }
        }
    }

    /**
     * Display RTI fields in WooCommerce My Account
     */
    public static function display_rti_fields_in_my_account() {
        $user_id = get_current_user_id();
        ?>
        <fieldset>
            <legend><?php esc_html_e('Organization Details', 'world-sso'); ?></legend>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="rti_family"><?php esc_html_e('Family Organization', 'world-sso'); ?></label>
                <select name="rti_family" id="rti_family" class="woocommerce-Select select">
                    <option value=""><?php esc_html_e('— Select Organization —', 'world-sso'); ?></option>
                    <?php
                    $current_family = get_user_meta($user_id, 'rti_family', true);
                    foreach (self::$family_options as $value => $label): ?>
                        <option value="<?php echo esc_attr($value); ?>" <?php selected($current_family, $value); ?>><?php echo esc_html($label); ?></option>
                    <?php endforeach; ?>
                </select>
            </p>

            <?php foreach (self::$rti_fields as $field_key => $field_config):
                if ($field_config['type'] === 'select') continue;
                if ($field_config['section'] !== 'organization') continue;
                $value = get_user_meta($user_id, $field_key, true);
            ?>
                <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                    <label for="<?php echo esc_attr($field_key); ?>"><?php echo esc_html($field_config['label']); ?></label>
                    <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="<?php echo esc_attr($field_key); ?>" id="<?php echo esc_attr($field_key); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($field_config['placeholder'] ?? ''); ?>">
                </p>
            <?php endforeach; ?>
        </fieldset>

        <fieldset>
            <legend><?php esc_html_e('Additional Information', 'world-sso'); ?></legend>
            <?php foreach (self::$rti_fields as $field_key => $field_config):
                if ($field_config['section'] !== 'additional') continue;
                $value = get_user_meta($user_id, $field_key, true);
            ?>
                <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                    <label for="<?php echo esc_attr($field_key); ?>"><?php echo esc_html($field_config['label']); ?></label>
                    <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="<?php echo esc_attr($field_key); ?>" id="<?php echo esc_attr($field_key); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($field_config['placeholder'] ?? ''); ?>">
                </p>
            <?php endforeach; ?>
        </fieldset>
        <?php
    }

    /**
     * Save RTI fields from WooCommerce My Account
     */
    public static function save_rti_fields_from_my_account($user_id) {
        foreach (self::$rti_fields as $field_key => $field_config) {
            if (isset($_POST[$field_key])) {
                update_user_meta($user_id, $field_key, sanitize_text_field($_POST[$field_key]));
            }
        }
    }

    /**
     * Add RTI fields to WooCommerce checkout
     */
    public static function add_rti_checkout_fields($fields) {
        // Add to billing section
        $fields['billing']['billing_rti_family'] = array(
            'type' => 'select',
            'label' => __('Family Organization', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 25,
            'options' => array('' => __('— Select Organization —', 'world-sso')) + self::$family_options,
        );

        $fields['billing']['billing_rti_club'] = array(
            'type' => 'text',
            'label' => __('Club', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 26,
            'placeholder' => __('e.g., 123 - Example City', 'world-sso'),
        );

        $fields['billing']['billing_rti_function'] = array(
            'type' => 'text',
            'label' => __('Function / Role', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 27,
            'placeholder' => __('e.g., President, Secretary, Member', 'world-sso'),
        );

        return $fields;
    }

    /**
     * Prefill checkout fields from user meta
     */
    public static function prefill_checkout_fields($value, $input) {
        $user_id = get_current_user_id();
        if (!$user_id) {
            return $value;
        }

        $field_map = array(
            'billing_rti_family' => 'rti_family',
            'billing_rti_club' => 'rti_club',
            'billing_rti_function' => 'rti_function',
        );

        if (isset($field_map[$input])) {
            $meta_value = get_user_meta($user_id, $field_map[$input], true);
            if ($meta_value) {
                return $meta_value;
            }
        }

        return $value;
    }

    /**
     * Save RTI fields from checkout
     */
    public static function save_rti_checkout_fields($order_id) {
        $order = wc_get_order($order_id);
        $user_id = $order->get_user_id();

        $checkout_fields = array(
            'billing_rti_family' => 'rti_family',
            'billing_rti_club' => 'rti_club',
            'billing_rti_function' => 'rti_function',
        );

        foreach ($checkout_fields as $checkout_key => $meta_key) {
            if (isset($_POST[$checkout_key])) {
                $value = sanitize_text_field($_POST[$checkout_key]);

                // Save to order meta
                $order->update_meta_data('_' . $meta_key, $value);

                // Save to user meta if logged in
                if ($user_id) {
                    update_user_meta($user_id, $meta_key, $value);
                }
            }
        }

        $order->save();
    }

    /**
     * Add RTI fields to admin order billing section
     */
    public static function add_admin_billing_fields($fields) {
        $fields['rti_family'] = array(
            'label' => __('Family Organization', 'world-sso'),
            'show' => true,
            'type' => 'select',
            'options' => array('' => __('— Select —', 'world-sso')) + self::$family_options,
        );

        $fields['rti_club'] = array(
            'label' => __('Club', 'world-sso'),
            'show' => true,
        );

        $fields['rti_function'] = array(
            'label' => __('Function / Role', 'world-sso'),
            'show' => true,
        );

        return $fields;
    }

    /**
     * Add RTI fields to formatted billing address on orders
     */
    public static function add_rti_to_formatted_billing_address($address, $order) {
        // Get RTI data from order meta
        $rti_family = $order->get_meta('_rti_family');
        $rti_club = $order->get_meta('_rti_club');
        $rti_function = $order->get_meta('_rti_function');

        // Build RTI info string
        $rti_info = self::build_rti_info_string($rti_family, $rti_club, $rti_function);

        $address['rti_info'] = $rti_info;

        return $address;
    }

    /**
     * Add RTI fields to My Account address display
     */
    public static function add_rti_to_my_account_address($address, $customer_id, $address_type) {
        if ($address_type !== 'billing') {
            $address['rti_info'] = '';
            return $address;
        }

        // Get RTI data from user meta
        $rti_family = get_user_meta($customer_id, 'rti_family', true);
        $rti_club = get_user_meta($customer_id, 'rti_club', true);
        $rti_function = get_user_meta($customer_id, 'rti_function', true);

        // Build RTI info string
        $rti_info = self::build_rti_info_string($rti_family, $rti_club, $rti_function);

        $address['rti_info'] = $rti_info;

        return $address;
    }

    /**
     * Build RTI info string for address display
     */
    private static function build_rti_info_string($rti_family, $rti_club, $rti_function) {
        $parts = array();

        // Add family organization name
        if (!empty($rti_family) && isset(self::$family_options[$rti_family])) {
            $parts[] = self::$family_options[$rti_family];
        }

        // Add club
        if (!empty($rti_club)) {
            $parts[] = $rti_club;
        }

        // Add function/role
        if (!empty($rti_function)) {
            $parts[] = $rti_function;
        }

        return implode(' · ', $parts);
    }

    /**
     * Add RTI placeholder to address formats
     */
    public static function add_rti_address_format($formats) {
        // Add RTI info line to all address formats (after name, before company)
        foreach ($formats as $country => $format) {
            // Insert RTI info after the first line (name)
            $formats[$country] = str_replace(
                "{name}\n",
                "{name}\n{rti_info}\n",
                $format
            );
        }

        return $formats;
    }

    /**
     * Add RTI replacements for address formatting
     */
    public static function add_rti_address_replacements($replacements, $args) {
        $rti_info = isset($args['rti_info']) ? $args['rti_info'] : '';

        $replacements['{rti_info}'] = $rti_info;
        $replacements['{rti_info_upper}'] = strtoupper($rti_info);

        return $replacements;
    }

    /**
     * Add RTI fields to WooCommerce billing address form (My Account)
     */
    public static function add_rti_billing_fields($fields) {
        $user_id = get_current_user_id();

        // Get values - check both billing_ prefixed and non-prefixed meta keys
        $family = '';
        $club = '';
        $function = '';

        if ($user_id) {
            $family = get_user_meta($user_id, 'billing_rti_family', true);
            if (empty($family)) {
                $family = get_user_meta($user_id, 'rti_family', true);
            }

            $club = get_user_meta($user_id, 'billing_rti_club', true);
            if (empty($club)) {
                $club = get_user_meta($user_id, 'rti_club', true);
            }

            $function = get_user_meta($user_id, 'billing_rti_function', true);
            if (empty($function)) {
                $function = get_user_meta($user_id, 'rti_function', true);
            }
        }

        $fields['billing_rti_family'] = array(
            'type' => 'select',
            'label' => __('Family Organization', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 25,
            'options' => array('' => __('— Select Organization —', 'world-sso')) + self::$family_options,
            'default' => $family,
        );

        $fields['billing_rti_club'] = array(
            'type' => 'text',
            'label' => __('Club', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 26,
            'placeholder' => __('e.g., 123 - Example City', 'world-sso'),
            'default' => $club,
        );

        $fields['billing_rti_function'] = array(
            'type' => 'text',
            'label' => __('Function / Role', 'world-sso'),
            'required' => false,
            'class' => array('form-row-wide'),
            'priority' => 27,
            'placeholder' => __('e.g., President, Secretary, Member', 'world-sso'),
            'default' => $function,
        );

        return $fields;
    }

    /**
     * Save RTI billing address fields from My Account
     */
    public static function save_rti_billing_address_fields($user_id, $address_type) {
        if ($address_type !== 'billing') {
            return;
        }

        $fields = array(
            'billing_rti_family' => 'rti_family',
            'billing_rti_club' => 'rti_club',
            'billing_rti_function' => 'rti_function',
        );

        foreach ($fields as $post_key => $meta_key) {
            if (isset($_POST[$post_key])) {
                $value = sanitize_text_field($_POST[$post_key]);
                // Save both with billing_ prefix (for WooCommerce) and without (for our plugin)
                update_user_meta($user_id, $post_key, $value);
                update_user_meta($user_id, $meta_key, $value);
            }
        }
    }

    /**
     * Prefill RTI billing address fields from user meta
     */
    public static function prefill_billing_address_fields($value, $key, $load_address) {
        if ($load_address !== 'billing') {
            return $value;
        }

        $field_map = array(
            'billing_rti_family' => 'rti_family',
            'billing_rti_club' => 'rti_club',
            'billing_rti_function' => 'rti_function',
        );

        if (isset($field_map[$key])) {
            $user_id = get_current_user_id();
            if ($user_id) {
                $meta_value = get_user_meta($user_id, $field_map[$key], true);
                if ($meta_value !== '') {
                    return $meta_value;
                }
            }
        }

        return $value;
    }

    /**
     * Get default value for RTI Family field
     */
    public static function get_default_rti_family($value) {
        $user_id = get_current_user_id();
        if ($user_id) {
            $meta_value = get_user_meta($user_id, 'rti_family', true);
            if ($meta_value !== '') {
                return $meta_value;
            }
        }
        return $value;
    }

    /**
     * Get default value for RTI Club field
     */
    public static function get_default_rti_club($value) {
        $user_id = get_current_user_id();
        if ($user_id) {
            $meta_value = get_user_meta($user_id, 'rti_club', true);
            if ($meta_value !== '') {
                return $meta_value;
            }
        }
        return $value;
    }

    /**
     * Get default value for RTI Function field
     */
    public static function get_default_rti_function($value) {
        $user_id = get_current_user_id();
        if ($user_id) {
            $meta_value = get_user_meta($user_id, 'rti_function', true);
            if ($meta_value !== '') {
                return $meta_value;
            }
        }
        return $value;
    }

    /**
     * Display RTI fields in admin order billing section
     */
    public static function display_rti_in_admin_order($order) {
        $rti_family = $order->get_meta('_rti_family');
        $rti_club = $order->get_meta('_rti_club');
        $rti_function = $order->get_meta('_rti_function');

        // Only display if we have RTI data
        if (empty($rti_family) && empty($rti_club) && empty($rti_function)) {
            return;
        }

        echo '<div class="address" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e5e5;">';
        echo '<p><strong>' . esc_html__('RTI Organization', 'world-sso') . '</strong></p>';

        if (!empty($rti_family) && isset(self::$family_options[$rti_family])) {
            echo '<p><strong>' . esc_html__('Family:', 'world-sso') . '</strong> ' . esc_html(self::$family_options[$rti_family]) . '</p>';
        }

        if (!empty($rti_club)) {
            echo '<p><strong>' . esc_html__('Club:', 'world-sso') . '</strong> ' . esc_html($rti_club) . '</p>';
        }

        if (!empty($rti_function)) {
            echo '<p><strong>' . esc_html__('Function / Role:', 'world-sso') . '</strong> ' . esc_html($rti_function) . '</p>';
        }

        echo '</div>';
    }

    /**
     * Handle user login/registration
     */
    public function handle_user($mapped_data, $user_info, $client) {
        // Validate mapped data
        $attribute_mapper = new Multi_OAuth_SSO_Attribute_Mapper($client);
        $validation = $attribute_mapper->validate_mapped_data($mapped_data);

        if (!$validation['valid']) {
            throw new Exception('Invalid user data: ' . implode(', ', $validation['errors']));
        }

        $mapped_data = $validation['data'];

        // Check if user exists
        $user_email = $mapped_data['core']['user_email'];
        $user = get_user_by('email', $user_email);

        if ($user) {
            // Update existing user
            $user_id = $this->update_user($user->ID, $mapped_data);
        } else {
            // Create new user
            $user_id = $this->create_user($mapped_data);
        }

        // Store OAuth provider information
        $this->store_oauth_meta($user_id, $user_info, $client);

        do_action('multi_oauth_sso_user_authenticated', $user_id, $user_info, $client);

        return $user_id;
    }

    /**
     * Create new WordPress user
     */
    private function create_user($mapped_data) {
        $user_data = array(
            'user_login' => $this->generate_unique_username($mapped_data['core']['user_login']),
            'user_email' => $mapped_data['core']['user_email'],
            'user_pass' => wp_generate_password(20, true, true),
            'show_admin_bar_front' => false
        );

        // Add optional core fields
        $optional_core_fields = array('user_nicename', 'user_url', 'display_name', 'first_name', 'last_name', 'description');
        foreach ($optional_core_fields as $field) {
            if (!empty($mapped_data['core'][$field])) {
                $user_data[$field] = $mapped_data['core'][$field];
            }
        }

        // Set default display name if not provided
        if (empty($user_data['display_name'])) {
            if (!empty($user_data['first_name']) && !empty($user_data['last_name'])) {
                $user_data['display_name'] = $user_data['first_name'] . ' ' . $user_data['last_name'];
            } elseif (!empty($user_data['first_name'])) {
                $user_data['display_name'] = $user_data['first_name'];
            } else {
                $user_data['display_name'] = $user_data['user_login'];
            }
        }

        // Set role
        if (!empty($mapped_data['core']['role'])) {
            $user_data['role'] = $mapped_data['core']['role'];
        } else {
            $user_data['role'] = get_option('default_role', 'subscriber');
        }

        $user_id = wp_insert_user($user_data);

        if (is_wp_error($user_id)) {
            throw new Exception('Failed to create user: ' . $user_id->get_error_message());
        }

        // Add user meta
        $this->update_user_meta($user_id, $mapped_data['meta']);

        // Handle profile picture if provided
        if (!empty($mapped_data['core']['profile_picture'])) {
            $this->handle_profile_picture($user_id, $mapped_data['core']['profile_picture']);
        }

        // Add RTI/Organization Custom Fields
        if (!empty($mapped_data['rti_custom'])) {
            $this->update_user_meta($user_id, $mapped_data['rti_custom']);
        }

        // Save WooCommerce address fields
        if (!empty($mapped_data['wc_address'])) {
            $this->update_user_meta($user_id, $mapped_data['wc_address']);
        }

        do_action('multi_oauth_sso_user_created', $user_id, $mapped_data);

        return $user_id;
    }

    /**
     * Update existing WordPress user
     */
    private function update_user($user_id, $mapped_data) {
        $user_data = array('ID' => $user_id);

        // Update core fields (exclude user_login and user_email)
        $updatable_core_fields = array('user_nicename', 'user_url', 'display_name', 'first_name', 'last_name', 'description');
        foreach ($updatable_core_fields as $field) {
            if (!empty($mapped_data['core'][$field])) {
                $user_data[$field] = $mapped_data['core'][$field];
            }
        }

        // Update role if provided
        if (!empty($mapped_data['core']['role'])) {
            $user_data['role'] = $mapped_data['core']['role'];
        }

        if (count($user_data) > 1) {
            $result = wp_update_user($user_data);

            if (is_wp_error($result)) {
                throw new Exception('Failed to update user: ' . $result->get_error_message());
            }
        }

        // Update user meta
        $this->update_user_meta($user_id, $mapped_data['meta']);

        // Handle profile picture if provided
        if (!empty($mapped_data['core']['profile_picture'])) {
            $this->handle_profile_picture($user_id, $mapped_data['core']['profile_picture']);
        }

        // Update RTI/Organization Custom Fields
        if (!empty($mapped_data['rti_custom'])) {
            $this->update_user_meta($user_id, $mapped_data['rti_custom']);
        }

        // Update WooCommerce address fields
        if (!empty($mapped_data['wc_address'])) {
            $this->update_user_meta($user_id, $mapped_data['wc_address']);
        }

        do_action('multi_oauth_sso_user_updated', $user_id, $mapped_data);

        return $user_id;
    }

    /**
     * Update user meta fields
     */
    private function update_user_meta($user_id, $meta_data) {
        foreach ($meta_data as $meta_key => $meta_value) {
            update_user_meta($user_id, $meta_key, $meta_value);
        }
    }

    /**
     * Store OAuth provider metadata
     */
    private function store_oauth_meta($user_id, $user_info, $client) {
        update_user_meta($user_id, 'oauth_sso_provider', $client->name);
        update_user_meta($user_id, 'oauth_sso_provider_id', $client->id);
        update_user_meta($user_id, 'oauth_sso_last_login', current_time('mysql'));

        // Store provider's user ID if available
        if (!empty($user_info['sub'])) {
            update_user_meta($user_id, 'oauth_sso_provider_user_id', $user_info['sub']);
        } elseif (!empty($user_info['id'])) {
            update_user_meta($user_id, 'oauth_sso_provider_user_id', $user_info['id']);
        }
    }

    /**
     * Generate unique username
     */
    private function generate_unique_username($username) {
        $username = sanitize_user($username, true);

        if (username_exists($username)) {
            $counter = 1;
            $new_username = $username . $counter;

            while (username_exists($new_username)) {
                $counter++;
                $new_username = $username . $counter;
            }

            return $new_username;
        }

        return $username;
    }

    /**
     * Handle profile picture from OAuth provider
     */
    private function handle_profile_picture($user_id, $picture_url) {
        if (empty($picture_url) || !filter_var($picture_url, FILTER_VALIDATE_URL)) {
            return;
        }

        // Check if we should update (don't re-download if URL hasn't changed)
        $stored_url = get_user_meta($user_id, 'oauth_sso_profile_picture_url', true);
        if ($stored_url === $picture_url) {
            return; // URL hasn't changed, no need to re-download
        }

        // Download the image
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $tmp = download_url($picture_url);

        if (is_wp_error($tmp)) {
            error_log('OAuth SSO: Failed to download profile picture: ' . $tmp->get_error_message());
            return;
        }

        // Get file extension from URL or content type
        $file_extension = $this->get_image_extension($picture_url, $tmp);

        // Prepare file array
        $file_array = array(
            'name' => 'oauth-profile-' . $user_id . '.' . $file_extension,
            'tmp_name' => $tmp
        );

        // Upload to media library
        $attachment_id = media_handle_sideload($file_array, 0, 'OAuth Profile Picture');

        // Clean up temp file
        if (file_exists($tmp)) {
            @unlink($tmp);
        }

        if (is_wp_error($attachment_id)) {
            error_log('OAuth SSO: Failed to upload profile picture: ' . $attachment_id->get_error_message());
            return;
        }

        // Delete old profile picture if exists
        $old_attachment_id = get_user_meta($user_id, 'oauth_sso_profile_picture_id', true);
        if ($old_attachment_id && $old_attachment_id != $attachment_id) {
            wp_delete_attachment($old_attachment_id, true);
        }

        // Store the attachment ID and URL
        update_user_meta($user_id, 'oauth_sso_profile_picture_id', $attachment_id);
        update_user_meta($user_id, 'oauth_sso_profile_picture_url', $picture_url);

        // Also store in WP User Avatar meta keys for compatibility with avatar plugins
        update_user_meta($user_id, 'wp_user_avatar', $attachment_id);

        // Store as simple local avatars format (used by Simple Local Avatars plugin)
        $avatar_data = array(
            'media_id' => $attachment_id,
            'full' => wp_get_attachment_url($attachment_id)
        );
        update_user_meta($user_id, 'simple_local_avatar', $avatar_data);

        do_action('multi_oauth_sso_profile_picture_updated', $user_id, $attachment_id, $picture_url);
    }

    /**
     * Get image extension from URL or file
     */
    private function get_image_extension($url, $file_path) {
        // Try to get from URL first
        $path_parts = pathinfo(parse_url($url, PHP_URL_PATH));
        if (!empty($path_parts['extension'])) {
            $ext = strtolower($path_parts['extension']);
            if (in_array($ext, array('jpg', 'jpeg', 'png', 'gif', 'webp'))) {
                return $ext;
            }
        }

        // Try to get from file mime type
        $mime_type = mime_content_type($file_path);
        $mime_to_ext = array(
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp'
        );

        if (isset($mime_to_ext[$mime_type])) {
            return $mime_to_ext[$mime_type];
        }

        // Default to jpg
        return 'jpg';
    }
}
