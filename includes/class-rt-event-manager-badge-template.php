<?php
/**
 * RTI Badge Template Settings Handler
 *
 * Manages badge template configuration for attendee badges.
 * Provides settings page for configuring badge layout, field positions,
 * background images, and other badge appearance options.
 *
 * @package RT_Event_Manager
 * @since 1.3.0
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Badge_Template {

    /**
     * Singleton instance
     *
     * @var RT_Event_Manager_Badge_Template|null
     */
    private static $instance = null;

    /**
     * Option key for storing badge template settings
     */
    const OPTION_KEY = 'rti_badge_template_settings';

    /**
     * DIN A6 width in millimeters
     */
    const BADGE_WIDTH_MM = 105;

    /**
     * DIN A6 height in millimeters
     */
    const BADGE_HEIGHT_MM = 148;

    /**
     * Get singleton instance
     *
     * @return RT_Event_Manager_Badge_Template
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
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_ajax_rti_save_badge_template', array($this, 'ajax_save_settings'));
    }

    /**
     * Get default badge template settings
     *
     * @return array Default settings structure
     */
    public static function get_defaults() {
        return array(
            'background_image_id' => 0,
            'badge_width_mm'      => self::BADGE_WIDTH_MM,
            'badge_height_mm'     => self::BADGE_HEIGHT_MM,
            'fields'              => array(
                'holder_name' => array(
                    'enabled'     => true,
                    'x'           => 52.5,
                    'y'           => 25,
                    'font_size'   => 18,
                    'font_weight' => 'bold',
                    'alignment'   => 'center',
                ),
                'country' => array(
                    'enabled'     => true,
                    'x'           => 52.5,
                    'y'           => 38,
                    'font_size'   => 10,
                    'font_weight' => 'normal',
                    'alignment'   => 'center',
                ),
                'rti_family' => array(
                    'enabled'     => true,
                    'x'           => 52.5,
                    'y'           => 48,
                    'font_size'   => 12,
                    'font_weight' => 'normal',
                    'alignment'   => 'center',
                ),
                'rti_club' => array(
                    'enabled'     => true,
                    'x'           => 52.5,
                    'y'           => 58,
                    'font_size'   => 12,
                    'font_weight' => 'normal',
                    'alignment'   => 'center',
                ),
                'qr_code' => array(
                    'enabled' => true,
                    'x'       => 35,
                    'y'       => 70,
                    'size'    => 35,
                ),
                'combination' => array(
                    'enabled'     => true,
                    'x'           => 52.5,
                    'y'           => 120,
                    'font_size'   => 10,
                    'font_weight' => 'normal',
                    'alignment'   => 'center',
                ),
            ),
        );
    }

    /**
     * Get current badge template settings merged with defaults
     *
     * @return array Current settings
     */
    public static function get_settings() {
        $saved = get_option(self::OPTION_KEY, array());
        $defaults = self::get_defaults();

        // Deep merge fields
        if (isset($saved['fields']) && is_array($saved['fields'])) {
            foreach ($defaults['fields'] as $key => $default_field) {
                if (isset($saved['fields'][$key]) && is_array($saved['fields'][$key])) {
                    $saved['fields'][$key] = wp_parse_args($saved['fields'][$key], $default_field);
                } else {
                    $saved['fields'][$key] = $default_field;
                }
            }
        } else {
            $saved['fields'] = $defaults['fields'];
        }

        return wp_parse_args($saved, $defaults);
    }

    /**
     * Save badge template settings
     *
     * @param array $data Settings data to save
     * @return bool Success status
     */
    public static function save_settings($data) {
        $sanitized = self::sanitize_settings($data);
        return update_option(self::OPTION_KEY, $sanitized);
    }

    /**
     * Sanitize settings data before saving
     *
     * @param array $data Raw settings data
     * @return array Sanitized settings
     */
    private static function sanitize_settings($data) {
        $clean = array();

        $clean['background_image_id'] = isset($data['background_image_id'])
            ? absint($data['background_image_id'])
            : 0;
        $clean['badge_width_mm'] = self::BADGE_WIDTH_MM;
        $clean['badge_height_mm'] = self::BADGE_HEIGHT_MM;

        $clean['fields'] = array();
        $field_keys = array('holder_name', 'country', 'rti_family', 'rti_club', 'qr_code', 'combination');

        foreach ($field_keys as $key) {
            if (!isset($data['fields'][$key])) {
                continue;
            }

            $field = $data['fields'][$key];
            $clean['fields'][$key] = array(
                'enabled'   => !empty($field['enabled']),
                'x'         => isset($field['x']) ? floatval($field['x']) : 0,
                'y'         => isset($field['y']) ? floatval($field['y']) : 0,
            );

            // QR code has size instead of font properties
            if ($key === 'qr_code') {
                $clean['fields'][$key]['size'] = isset($field['size']) ? absint($field['size']) : 35;
            } else {
                $clean['fields'][$key]['font_size'] = isset($field['font_size']) ? absint($field['font_size']) : 12;
                $clean['fields'][$key]['font_weight'] = isset($field['font_weight']) && $field['font_weight'] === 'bold'
                    ? 'bold'
                    : 'normal';
                $clean['fields'][$key]['alignment'] = isset($field['alignment']) && in_array($field['alignment'], array('left', 'center', 'right'), true)
                    ? $field['alignment']
                    : 'center';
            }
        }

        return $clean;
    }

    /**
     * Enqueue admin assets for badge template settings page
     *
     * @param string $hook Current admin page hook
     */
    public function enqueue_admin_assets($hook) {
        // Only load on badge template page
        if ($hook !== 'rt-event-manager_page_rt-event-badge-template') {
            return;
        }

        // WordPress media library
        wp_enqueue_media();

        // Custom styles
        wp_enqueue_style(
            'rti-badge-admin',
            RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/badge-admin.css',
            array(),
            RT_EVENT_MANAGER_VERSION
        );

        // Custom scripts
        wp_enqueue_script(
            'rti-badge-admin',
            RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/badge-admin.js',
            array('jquery', 'wp-util'),
            RT_EVENT_MANAGER_VERSION,
            true
        );

        // Localize script data
        wp_localize_script('rti-badge-admin', 'rtiBadgeAdmin', array(
            'ajaxUrl'  => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('rti_badge_template'),
            'settings' => self::get_settings(),
            'badgeWidth' => self::BADGE_WIDTH_MM,
            'badgeHeight' => self::BADGE_HEIGHT_MM,
            'i18n'     => array(
                'selectImage' => __('Select Background Image', 'rt-event-manager'),
                'useImage'    => __('Use this image', 'rt-event-manager'),
                'removeImage' => __('Remove', 'rt-event-manager'),
                'saving'      => __('Saving...', 'rt-event-manager'),
                'saved'       => __('Settings saved!', 'rt-event-manager'),
                'error'       => __('Error saving settings.', 'rt-event-manager'),
            ),
        ));
    }

    /**
     * AJAX handler for saving badge template settings
     */
    public function ajax_save_settings() {
        check_ajax_referer('rti_badge_template', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Permission denied.', 'rt-event-manager'));
        }

        // Parse the form data
        $form_data = array();
        if (isset($_POST['settings'])) {
            parse_str($_POST['settings'], $form_data);
        }

        // Build settings array from form data
        $data = array(
            'background_image_id' => isset($form_data['background_image_id']) ? absint($form_data['background_image_id']) : 0,
            'fields' => array(),
        );

        // Process field settings
        $field_keys = array('holder_name', 'rti_family', 'rti_club', 'qr_code', 'combination');
        foreach ($field_keys as $key) {
            if (isset($form_data['fields'][$key])) {
                $data['fields'][$key] = $form_data['fields'][$key];
            }
        }

        if (self::save_settings($data)) {
            wp_send_json_success(array('message' => __('Settings saved successfully.', 'rt-event-manager')));
        } else {
            wp_send_json_error(__('Failed to save settings.', 'rt-event-manager'));
        }
    }
}
