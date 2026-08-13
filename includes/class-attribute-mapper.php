<?php
/**
 * Attribute Mapper for WordPress fields
 */

if (!defined('ABSPATH')) {
    exit;
}

class Multi_OAuth_SSO_Attribute_Mapper {

    private $client;
    private $mapping;

    public function __construct($client) {
        $this->client = $client;
        $this->mapping = !empty($client->attribute_mapping) ? json_decode($client->attribute_mapping, true) : array();
    }

    /**
     * Map OAuth attributes to WordPress user fields
     */
    public function map_attributes($user_info) {
        $mapped_data = array(
            'core' => array(),
            'meta' => array(),
            'rti_custom' => array(),
            'wc_address' => array()
        );

        // Map core WordPress fields
        $core_fields = $this->get_core_fields();
        foreach ($core_fields as $wp_field => $label) {
            if (isset($this->mapping[$wp_field])) {
                $oauth_field = $this->mapping[$wp_field];
                $value = $this->get_nested_value($user_info, $oauth_field);
                if ($value !== null) {
                    $mapped_data['core'][$wp_field] = $value;
                }
            }
        }

        // Map WordPress meta fields
        $meta_fields = $this->get_meta_fields();
        foreach ($meta_fields as $meta_key => $label) {
            if (isset($this->mapping[$meta_key])) {
                $oauth_field = $this->mapping[$meta_key];
                $value = $this->get_nested_value($user_info, $oauth_field);
                if ($value !== null) {
                    $mapped_data['meta'][$meta_key] = $value;
                }
            }
        }

        // Map RTI/Organization Custom Fields (always available)
        $rti_fields = self::get_rti_custom_fields();
        foreach ($rti_fields as $field_key => $label) {
            if (isset($this->mapping[$field_key])) {
                $oauth_field = $this->mapping[$field_key];
                $value = $this->get_nested_value($user_info, $oauth_field);
                if ($value !== null) {
                    $mapped_data['rti_custom'][$field_key] = $value;
                }
            }
        }

        // Map WooCommerce billing fields
        $billing_fields = self::get_wc_billing_fields();
        foreach ($billing_fields as $field_key => $label) {
            if (isset($this->mapping[$field_key])) {
                $oauth_field = $this->mapping[$field_key];
                $value = $this->get_nested_value($user_info, $oauth_field);
                if ($value !== null) {
                    $mapped_data['wc_address'][$field_key] = $value;
                }
            }
        }

        // Map WooCommerce shipping fields
        $shipping_fields = self::get_wc_shipping_fields();
        foreach ($shipping_fields as $field_key => $label) {
            if (isset($this->mapping[$field_key])) {
                $oauth_field = $this->mapping[$field_key];
                $value = $this->get_nested_value($user_info, $oauth_field);
                if ($value !== null) {
                    $mapped_data['wc_address'][$field_key] = $value;
                }
            }
        }

        return apply_filters('multi_oauth_sso_mapped_data', $mapped_data, $user_info, $this->client);
    }

    /**
     * Get value from nested array using dot notation
     */
    private function get_nested_value($array, $path) {
        if (empty($path)) {
            return null;
        }

        $keys = explode('.', $path);
        $value = $array;

        foreach ($keys as $key) {
            if (is_array($value) && isset($value[$key])) {
                $value = $value[$key];
            } else {
                return null;
            }
        }

        return $value;
    }

    /**
     * Get WordPress core user fields
     */
    public static function get_core_fields() {
        return array(
            'user_login' => 'Username',
            'user_email' => 'Email Address',
            'user_nicename' => 'Nice Name',
            'user_url' => 'Website URL',
            'display_name' => 'Display Name',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'description' => 'Biographical Info',
            'role' => 'User Role',
            'profile_picture' => 'Profile Picture URL'
        );
    }

    /**
     * Get WordPress user meta fields
     */
    public static function get_meta_fields() {
        return array(
            'nickname' => 'Nickname',
            'locale' => 'Locale',
        );
    }

    /**
     * Get WooCommerce billing address fields
     */
    public static function get_wc_billing_fields() {
        return array(
            'billing_first_name' => 'First Name',
            'billing_last_name' => 'Last Name',
            'billing_company' => 'Company',
            'billing_address_1' => 'Address Line 1',
            'billing_address_2' => 'Address Line 2',
            'billing_city' => 'City',
            'billing_state' => 'State / County',
            'billing_postcode' => 'Postcode / ZIP',
            'billing_country' => 'Country',
            'billing_email' => 'Email',
            'billing_phone' => 'Phone',
        );
    }

    /**
     * Get WooCommerce shipping address fields
     */
    public static function get_wc_shipping_fields() {
        return array(
            'shipping_first_name' => 'First Name',
            'shipping_last_name' => 'Last Name',
            'shipping_company' => 'Company',
            'shipping_address_1' => 'Address Line 1',
            'shipping_address_2' => 'Address Line 2',
            'shipping_city' => 'City',
            'shipping_state' => 'State / County',
            'shipping_postcode' => 'Postcode / ZIP',
            'shipping_country' => 'Country',
        );
    }

    /**
     * Get RTI/Organization Custom Fields
     * These fields are compatible with the wc-rti-customer-fields plugin
     * and are always available regardless of whether WooCommerce is installed
     */
    public static function get_rti_custom_fields() {
        return array(
            'world_id' => '.WORLD ID',
            'rti_family' => 'Family Organization (Select: 0=Round Table, 1=Club 41, 2=Ladies Circle, 3=Agora Club, 4=Tangent Club, 9=Guest/Partner)',
            'rti_club' => 'Club (Text)',
            'rti_club_domain' => 'Club Domain (Text)',
            'rti_function' => 'Function / Role (Text)',
            'rti_partner_name' => 'Partner Name (Text)',
            'rti_dietary' => 'Dietary Restrictions (Text)',
            'rti_emergency_contact' => 'Emergency Contact (Text)',
        );
    }

    /**
     * Check if WC RTI Customer Fields plugin is active
     */
    public static function is_rti_plugin_active() {
        return class_exists('WC_RTI_Customer_Fields');
    }

    /**
     * Get all available fields for mapping
     */
    public static function get_all_fields() {
        $fields = array(
            'RTI Organization Fields' => self::get_rti_custom_fields(),
            'WordPress Core Fields' => self::get_core_fields(),
        );

        if (class_exists('WooCommerce')) {
            $fields['WooCommerce Billing Address'] = self::get_wc_billing_fields();
            $fields['WooCommerce Shipping Address'] = self::get_wc_shipping_fields();
        }

        return $fields;
    }

    /**
     * Validate mapped data
     */
    public function validate_mapped_data($mapped_data) {
        $errors = array();

        // Email is required
        if (empty($mapped_data['core']['user_email'])) {
            $errors[] = 'Email address is required';
        } elseif (!is_email($mapped_data['core']['user_email'])) {
            $errors[] = 'Invalid email address';
        }

        // Username is required (if not set, will be generated from email)
        if (empty($mapped_data['core']['user_login'])) {
            // Generate username from email
            $mapped_data['core']['user_login'] = sanitize_user(
                current(explode('@', $mapped_data['core']['user_email']))
            );
        }

        // Validate role
        if (!empty($mapped_data['core']['role'])) {
            $valid_roles = array_keys(wp_roles()->get_names());
            if (!in_array($mapped_data['core']['role'], $valid_roles)) {
                $errors[] = 'Invalid user role: ' . $mapped_data['core']['role'];
                unset($mapped_data['core']['role']);
            }
        }

        return array(
            'valid' => empty($errors),
            'errors' => $errors,
            'data' => $mapped_data
        );
    }
}
