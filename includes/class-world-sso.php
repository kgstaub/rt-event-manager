<?php
/**
 * "Sign in with .WORLD" OAuth 2.0 SSO — merged into RT Event Manager.
 *
 * Originally the standalone "Sign in with .WORLD" plugin (v1.2.0) by
 * Kenneth Staub. The WORLD_SSO_* constants, the include files and the
 * bootstrapping/activation are now provided by rt-event-manager.php.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class Multi_OAuth_SSO {

    private static $instance = null;

    /**
     * SVG icon for buttons (without inline styles - styles applied via CSS)
     */
    const BUTTON_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459 336.2c11.6 0 21 9.4 21 21C480 424.9 424.9 480 357.1 480c-11.6 0-21-9.4-21-21s9.4-21 21-21c44.6 0 80.9-36.3 80.9-80.9c0-11.6 9.4-21 21-21zM53 336.2c11.6 0 21 9.4 21 21c0 44.6 36.3 80.9 80.9 80.9c11.6 0 21 9.4 21 21s-9.4 21-21 21C87.1 480 32 424.9 32 357.1c0-11.6 9.4-21 21-21zm203-197c10.5 0 19.3 7.8 20.7 17.9l.2 3.1 0 75.6 75.7 0c11.6 0 21 9.4 21 21s-9.4 21-21 21l-75.7 0 0 75.7c0 11.6-9.4 21-21 21s-21-9.4-21-21l0-75.7-75.7 0c-11.6 0-21-9.4-21-21s9.4-21 21-21l75.7 0 0-75.6c0-11.6 9.4-21 21-21zM154.9 32c11.6 0 21 9.4 21 21s-9.4 21-21 21c-44.6 0-80.9 36.3-80.9 80.9c0 11.6-9.4 21-21 21c-11.6 0-21-9.4-21-21C32 87.1 87.1 32 154.9 32zm202.3 0C424.9 32 480 87.1 480 154.9c0 11.6-9.4 21-21 21s-21-9.4-21-21c0-44.6-36.3-80.9-80.9-80.9c-11.6 0-21-9.4-21-21s9.4-21 21-21z"/></svg>';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        // Activation is handled by rt-event-manager.php. check_upgrade() (below)
        // also self-heals the OAuth clients table and default providers on
        // admin_init, so no register_activation_hook(__FILE__) is needed here.

        // Check for upgrades on admin init
        add_action('admin_init', array($this, 'check_upgrade'));

        // Initialize admin settings
        if (is_admin()) {
            new Multi_OAuth_SSO_Admin_Settings();
        }

        // Add login button to WordPress login form
        add_action('login_form', array($this, 'add_login_buttons'));

        // Add login button to WordPress registration form (allows OAuth registration)
        add_action('register_form', array($this, 'add_login_buttons'));

        // Add family dropdown to registration form and handle validation/saving
        add_action('register_form', array($this, 'add_registration_family_field'));
        add_filter('registration_errors', array($this, 'validate_registration_family_field'), 10, 3);
        add_action('user_register', array($this, 'save_registration_family_field'));

        // Handle OAuth callbacks
        add_action('init', array($this, 'handle_oauth_callback'));

        // Add shortcode for login buttons
        add_shortcode('world_sso_login', array($this, 'login_buttons_shortcode'));
        // Keep legacy shortcode for backward compatibility
        add_shortcode('oauth_sso_login', array($this, 'login_buttons_shortcode'));

        // Add shortcode for guest registration form
        add_shortcode('world_sso_register', array($this, 'register_form_shortcode'));

        // Handle front-end registration form submission
        add_action('init', array($this, 'handle_frontend_registration'));

        // Add avatar filter
        add_filter('get_avatar_url', array($this, 'get_oauth_avatar_url'), 10, 3);
        add_filter('get_avatar', array($this, 'get_oauth_avatar'), 10, 6);

        // Initialize RTI custom fields display in user profile
        Multi_OAuth_SSO_User_Handler::init_hooks();

        // Initialize YOOtheme Pro integration
        $this->init_yootheme_integration();
    }

    /**
     * Initialize YOOtheme Pro integration if available
     */
    private function init_yootheme_integration() {
        // Wait for YOOtheme to be fully loaded
        add_action('after_setup_theme', function() {
            // Check if YOOtheme Pro is available
            if (!class_exists('YOOtheme\Application') || !function_exists('YOOtheme\app')) {
                return;
            }

            // Try YOOtheme's Event system
            if (class_exists('YOOtheme\Event')) {
                \YOOtheme\Event::on('source.init', [self::class, 'register_rti_source_static'], -100);
            }
        }, 20);
    }

    /**
     * Static method to register RTI source (for YOOtheme Event compatibility)
     */
    public static function register_rti_source_static($source) {
        $instance = self::get_instance();
        $instance->register_rti_source($source);
    }

    /**
     * Register RTI custom source with YOOtheme
     */
    private function register_rti_source($source) {
        // Register the RTI User object type
        $source->objectType('RTICurrentUser', [
            'fields' => [
                'world_id' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => '.WORLD ID',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_family' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Family Organization (ID)',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_family_name' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Family Organization (Name)',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_club' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Club',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_club_domain' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Club Domain',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_function' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Function / Role',
                        'group' => 'RTI Organization',
                    ],
                ],
                'rti_partner_name' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Partner Name',
                        'group' => 'RTI Additional',
                    ],
                ],
                'rti_dietary' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Dietary Restrictions',
                        'group' => 'RTI Additional',
                    ],
                ],
                'rti_emergency_contact' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Emergency Contact',
                        'group' => 'RTI Additional',
                    ],
                ],
                'display_name' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Display Name',
                        'group' => 'User Info',
                    ],
                ],
                'first_name' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'First Name',
                        'group' => 'User Info',
                    ],
                ],
                'last_name' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Last Name',
                        'group' => 'User Info',
                    ],
                ],
                'email' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Email',
                        'group' => 'User Info',
                    ],
                ],
                'profile_pic' => [
                    'type' => 'String',
                    'metadata' => [
                        'label' => 'Profile Picture URL',
                        'group' => 'User Info',
                    ],
                ],
                'is_logged_in' => [
                    'type' => 'Boolean',
                    'metadata' => [
                        'label' => 'Is Logged In',
                        'group' => 'User Info',
                    ],
                ],
            ],
            'metadata' => [
                'type' => true,
                'label' => 'RTI Current User',
            ],
        ]);

        // Register the query type
        $source->queryType([
            'fields' => [
                'rtiCurrentUser' => [
                    'type' => 'RTICurrentUser',
                    'metadata' => [
                        'label' => 'RTI Current User',
                        'group' => '.WORLD SSO',
                    ],
                    'extensions' => [
                        'call' => [$this, 'resolveRtiCurrentUser'],
                    ],
                ],
            ],
        ]);
    }

    /**
     * Resolve RTI current user data
     */
    public function resolveRtiCurrentUser() {
        $family_options = [
            '0' => 'Round Table',
            '1' => 'Club 41',
            '2' => 'Ladies Circle',
            '3' => 'Agora Club',
            '4' => 'Tangent Club',
            '9' => 'Guest/Partner',
        ];

        if (!is_user_logged_in()) {
            return [
                'is_logged_in' => false,
                'world_id' => '',
                'rti_family' => '',
                'rti_family_name' => '',
                'rti_club' => '',
                'rti_club_domain' => '',
                'rti_function' => '',
                'rti_partner_name' => '',
                'rti_dietary' => '',
                'rti_emergency_contact' => '',
                'display_name' => '',
                'first_name' => '',
                'last_name' => '',
                'email' => '',
                'profile_pic' => '',
            ];
        }

        $user_id = get_current_user_id();
        $user = get_userdata($user_id);
        $family_id = get_user_meta($user_id, 'rti_family', true);

        // Get profile picture URL
        $profile_pic = '';
        $attachment_id = get_user_meta($user_id, 'oauth_sso_profile_picture_id', true);
        if ($attachment_id) {
            $profile_pic = wp_get_attachment_image_url($attachment_id, 'medium');
        }
        if (empty($profile_pic)) {
            $profile_pic = get_avatar_url($user_id, ['size' => 256]);
        }

        return [
            'is_logged_in' => true,
            'world_id' => get_user_meta($user_id, 'world_id', true),
            'rti_family' => $family_id,
            'rti_family_name' => isset($family_options[$family_id]) ? $family_options[$family_id] : '',
            'rti_club' => get_user_meta($user_id, 'rti_club', true),
            'rti_club_domain' => get_user_meta($user_id, 'rti_club_domain', true),
            'rti_function' => get_user_meta($user_id, 'rti_function', true),
            'rti_partner_name' => get_user_meta($user_id, 'rti_partner_name', true),
            'rti_dietary' => get_user_meta($user_id, 'rti_dietary', true),
            'rti_emergency_contact' => get_user_meta($user_id, 'rti_emergency_contact', true),
            'display_name' => $user->display_name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->user_email,
            'profile_pic' => $profile_pic,
        ];
    }

    public function activate() {
        $this->create_table();
        $this->seed_default_providers();
        update_option('world_sso_version', WORLD_SSO_VERSION);
    }

    /**
     * Create the database table
     */
    private function create_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';
        $charset_collate = $wpdb->get_charset_collate();

        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;

        if (!$table_exists) {
            $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                name varchar(255) NOT NULL,
                client_id varchar(255) NOT NULL DEFAULT '',
                client_secret text NOT NULL,
                authorization_endpoint text NOT NULL,
                token_endpoint text NOT NULL,
                userinfo_endpoint text NOT NULL,
                scope varchar(500) DEFAULT 'me',
                redirect_uri text NOT NULL,
                attribute_mapping longtext,
                enabled tinyint(1) DEFAULT 0,
                display_order int(11) DEFAULT 0,
                button_text varchar(255) DEFAULT 'Login with OAuth',
                button_icon text,
                button_bg_color varchar(20) DEFAULT '#0073aa',
                button_text_color varchar(20) DEFAULT '#ffffff',
                button_border_color varchar(20) DEFAULT '#0073aa',
                button_border_radius varchar(10) DEFAULT '25px',
                button_hover_bg_color varchar(20) DEFAULT '#005a87',
                button_hover_text_color varchar(20) DEFAULT '#ffffff',
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY name (name),
                KEY display_order (display_order)
            ) $charset_collate;";

            $wpdb->query($sql);

            if ($wpdb->last_error) {
                error_log('World SSO: Table creation failed - ' . $wpdb->last_error);
            }
        }
    }

    /**
     * Seed default .WORLD providers
     * Preserves existing client_id, client_secret, enabled status, and attribute_mapping
     */
    private function seed_default_providers() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $providers = Multi_OAuth_SSO_Admin_Settings::get_default_providers();

        foreach ($providers as $provider) {
            // Check if provider already exists by name
            $existing = $wpdb->get_row($wpdb->prepare(
                "SELECT id, client_id, client_secret, enabled, attribute_mapping FROM $table_name WHERE name = %s",
                $provider['name']
            ));

            if ($existing) {
                // Update provider but preserve credentials, enabled status, and mapping
                $update_data = array(
                    'display_order' => $provider['display_order'],
                    'authorization_endpoint' => $provider['authorization_endpoint'],
                    'token_endpoint' => $provider['token_endpoint'],
                    'userinfo_endpoint' => $provider['userinfo_endpoint'],
                    'scope' => $provider['scope'],
                    'redirect_uri' => home_url('/'),
                    'button_text' => $provider['button_text'],
                    'button_bg_color' => $provider['button_bg_color'],
                    'button_text_color' => $provider['button_text_color'],
                    'button_border_color' => $provider['button_bg_color'], // Match bg color (no visible border)
                    'button_border_radius' => '25px',
                    'button_hover_bg_color' => $provider['button_hover_bg_color'],
                    'button_hover_text_color' => $provider['button_hover_text_color'],
                );

                $wpdb->update($table_name, $update_data, array('id' => $existing->id));
            } else {
                // Default attribute mapping for .WORLD providers
                // Uses rti_ prefix for compatibility with WC RTI Customer Fields plugin
                $default_mapping = array(
                    'world_id' => 'id',
                    'rti_family' => 'club.family',
                    'rti_club' => 'club.name',
                    'user_email' => 'email',
                    'first_name' => 'first_name',
                    'last_name' => 'last_name',
                    'display_name' => 'name',
                    'profile_picture' => 'profile_pic',
                );

                // Insert new provider (disabled by default, no credentials)
                $insert_data = array(
                    'name' => $provider['name'],
                    'display_order' => $provider['display_order'],
                    'client_id' => '',
                    'client_secret' => '',
                    'authorization_endpoint' => $provider['authorization_endpoint'],
                    'token_endpoint' => $provider['token_endpoint'],
                    'userinfo_endpoint' => $provider['userinfo_endpoint'],
                    'scope' => $provider['scope'],
                    'redirect_uri' => home_url('/'),
                    'attribute_mapping' => json_encode($default_mapping),
                    'enabled' => 0,
                    'button_text' => $provider['button_text'],
                    'button_icon' => '',
                    'button_bg_color' => $provider['button_bg_color'],
                    'button_text_color' => $provider['button_text_color'],
                    'button_border_color' => $provider['button_bg_color'],
                    'button_border_radius' => '25px',
                    'button_hover_bg_color' => $provider['button_hover_bg_color'],
                    'button_hover_text_color' => $provider['button_hover_text_color'],
                );

                $wpdb->insert($table_name, $insert_data);
            }
        }
    }

    public function deactivate() {
        // Cleanup if needed - don't delete data to preserve settings
    }

    /**
     * Check and run upgrades if needed
     */
    public function check_upgrade() {
        $current_version = get_option('world_sso_version', '1.0.0');

        if (version_compare($current_version, WORLD_SSO_VERSION, '<')) {
            // Run activation to ensure table and providers exist
            $this->create_table();
            $this->seed_default_providers();

            update_option('world_sso_version', WORLD_SSO_VERSION);
            add_action('admin_notices', array($this, 'upgrade_notice'));
        }
    }

    /**
     * Display upgrade notice
     */
    public function upgrade_notice() {
        ?>
        <div class="notice notice-success is-dismissible">
            <p><strong><?php esc_html_e('Sign in with .WORLD:', 'world-sso'); ?></strong> <?php printf(esc_html__('Plugin updated to version %s.', 'world-sso'), WORLD_SSO_VERSION); ?></p>
        </div>
        <?php
    }

    public function add_login_buttons($hide_local = false, $hide_heading = false) {
        $clients = $this->get_enabled_clients();
        $has_local_registration = get_option('world_sso_local_registration', false);

        // Nothing to show if no SSO providers and no local registration
        if (empty($clients) && !$has_local_registration) {
            return;
        }

        // Determine if we're on a registration page
        $is_registration = (isset($_GET['action']) && $_GET['action'] === 'register') ||
                           (function_exists('is_account_page') && is_account_page() && isset($_GET['action']) && $_GET['action'] === 'register');

        $section_text = $is_registration ? __('Or register with .WORLD', 'world-sso') : __('Or sign in with .WORLD', 'world-sso');

        if (isset($_GET['oauth_error']) && $_GET['oauth_error'] === 'invalid_state') {
            echo '<div style="margin: 10px auto; max-width: 450px; padding: 10px; background: #fef0f0; border-left: 4px solid #d63638; color: #8a1f1f;">';
            echo esc_html__('Login session expired. Please try again.', 'world-sso');
            echo '</div>';
        }

        echo '<div class="world-sso-buttons" style="margin: 20px auto; max-width: 450px; display: flex; flex-direction: column; align-items: center;">';

        if (!empty($clients)) {
        if (!$hide_heading) {
            echo '<div style="text-align: center; margin: 15px 0; position: relative;">';
            echo '<span style="padding: 0 15px; position: relative; z-index: 1; color: #666; font-size: 14px;">' . esc_html($section_text) . '</span>';
            echo '</div>';
        }

        // Add inline styles for buttons
        echo '<style>';
        foreach ($clients as $client) {
            $button_class = 'world-sso-button-' . $client->id;

            $bg_color = !empty($client->button_bg_color) ? $client->button_bg_color : '#0073aa';
            $text_color = !empty($client->button_text_color) ? $client->button_text_color : '#ffffff';

            echo ".{$button_class} {";
            echo "display: flex;";
            echo "align-items: stretch;";
            echo "width: 100%;";
            echo "max-width: 450px;";
            echo "padding: 0;";
            echo "margin: 10px auto;";
            echo "text-decoration: none;";
            echo "background: {$bg_color};";
            echo "color: {$text_color};";
            echo "border: none;";
            echo "border-radius: 25px;";
            echo "font-weight: 600;";
            echo "font-size: 15px;";
            echo "transition: opacity 0.3s ease, transform 0.2s ease;";
            echo "box-sizing: border-box;";
            echo "cursor: pointer;";
            echo "overflow: hidden;";
            echo "}";

            echo ".{$button_class}:hover {";
            echo "opacity: 0.9;";
            echo "color: {$text_color};";
            echo "text-decoration: none;";
            echo "transform: translateY(-1px);";
            echo "}";

            echo ".{$button_class}:focus {";
            echo "outline: none;";
            echo "box-shadow: 0 0 0 3px rgba(0,0,0,0.1);";
            echo "}";

            // Icon container on left with equal padding and right border
            echo ".{$button_class} .world-sso-icon {";
            echo "display: flex;";
            echo "align-items: center;";
            echo "justify-content: center;";
            echo "padding: 12px;";
            echo "border-right: 1px solid {$text_color};";
            echo "}";

            echo ".{$button_class} .world-sso-icon svg {";
            echo "width: 20px;";
            echo "height: 20px;";
            echo "fill: {$text_color};";
            echo "}";

            // Text container
            echo ".{$button_class} .world-sso-text {";
            echo "display: flex;";
            echo "align-items: center;";
            echo "justify-content: center;";
            echo "flex: 1;";
            echo "padding: 12px 20px;";
            echo "color: {$text_color};";
            echo "}";

            // Ensure text color doesn't change on hover
            echo ".{$button_class}:hover .world-sso-text {";
            echo "color: {$text_color};";
            echo "}";

            echo ".{$button_class}:hover .world-sso-icon svg {";
            echo "fill: {$text_color};";
            echo "}";
        }
        echo '</style>';

        foreach ($clients as $client) {
            $auth_url = $this->get_authorization_url($client);
            $button_class = 'world-sso-button world-sso-button-' . $client->id;

            echo '<a href="' . esc_url($auth_url) . '" class="' . esc_attr($button_class) . '">';
            // Icon container on left edge
            echo '<span class="world-sso-icon">' . self::BUTTON_ICON_SVG . '</span>';
            // Text container
            echo '<span class="world-sso-text">' . esc_html($client->button_text) . '</span>';
            echo '</a>';
        }
        } // end if (!empty($clients))

        // Show "Register Local Account" button on login page only (not on registration page)
        // Controlled by admin option: .WORLD SSO > Local Registration
        if (!$is_registration && !$hide_local && get_option('world_sso_local_registration', false)) {
            $register_url = wp_registration_url();
            echo '<div style="text-align: center; margin: 20px 0 5px; position: relative;">';
            echo '<span style="padding: 0 15px; position: relative; z-index: 1; color: #666; font-size: 14px;">' . esc_html__('No .WORLD account?', 'world-sso') . '</span>';
            echo '</div>';
            echo '<style>';
            echo '.world-sso-register-local {';
            echo 'display: flex; align-items: stretch; width: 100%; max-width: 450px;';
            echo 'padding: 0; margin: 10px auto; text-decoration: none;';
            echo 'background: #ffffff; color: #50575e;';
            echo 'border: 2px solid #c3c4c7; border-radius: 25px;';
            echo 'font-weight: 600; font-size: 15px;';
            echo 'transition: opacity 0.3s ease, transform 0.2s ease;';
            echo 'box-sizing: border-box; cursor: pointer; overflow: hidden;';
            echo '}';
            echo '.world-sso-register-local:hover {';
            echo 'opacity: 0.9; color: #2c3338; text-decoration: none;';
            echo 'transform: translateY(-1px); border-color: #8c8f94;';
            echo '}';
            echo '.world-sso-register-local:focus {';
            echo 'outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0.1);';
            echo '}';
            echo '.world-sso-register-local .world-sso-icon {';
            echo 'display: flex; align-items: center; justify-content: center;';
            echo 'padding: 12px; border-right: 1px solid #c3c4c7;';
            echo '}';
            echo '.world-sso-register-local .world-sso-icon svg {';
            echo 'width: 20px; height: 20px; fill: #50575e;';
            echo '}';
            echo '.world-sso-register-local .world-sso-text {';
            echo 'display: flex; align-items: center; justify-content: center;';
            echo 'flex: 1; padding: 12px 20px; color: #50575e;';
            echo '}';
            echo '.world-sso-register-local:hover .world-sso-text { color: #2c3338; }';
            echo '.world-sso-register-local:hover .world-sso-icon svg { fill: #2c3338; }';
            echo '</style>';

            $register_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>';

            echo '<a href="' . esc_url($register_url) . '" class="world-sso-register-local">';
            echo '<span class="world-sso-icon">' . $register_icon . '</span>';
            echo '<span class="world-sso-text">' . esc_html__('Register Local Account', 'world-sso') . '</span>';
            echo '</a>';
        }

        echo '</div>';
    }

    public function login_buttons_shortcode($atts) {
        // Don't render if user is already logged in
        if (is_user_logged_in()) {
            return '';
        }

        $a = shortcode_atts(array('hide_local' => '', 'hide_heading' => ''), $atts, 'world_sso_login');

        ob_start();
        $this->add_login_buttons(!empty($a['hide_local']), !empty($a['hide_heading']));
        return ob_get_clean();
    }

    /**
     * Add family organization dropdown to WordPress registration form
     */
    public function add_registration_family_field() {
        $family_options = Multi_OAuth_SSO_User_Handler::$family_options;
        $selected = isset($_POST['rti_family']) ? sanitize_text_field($_POST['rti_family']) : '';
        ?>
        <p>
            <label for="rti_family"><?php esc_html_e('Family Organization', 'world-sso'); ?> <span class="required" aria-hidden="true">*</span></label>
            <select name="rti_family" id="rti_family" class="input" style="width: 100%; padding: 3px 5px; font-size: 14px;">
                <option value=""><?php esc_html_e('— Select Organization —', 'world-sso'); ?></option>
                <?php foreach ($family_options as $value => $label): ?>
                    <option value="<?php echo esc_attr($value); ?>" <?php selected($selected, $value); ?>><?php echo esc_html($label); ?></option>
                <?php endforeach; ?>
            </select>
        </p>
        <?php
    }

    /**
     * Validate family organization is selected during registration
     */
    public function validate_registration_family_field($errors, $sanitized_user_login, $user_email) {
        if (empty($_POST['rti_family']) && $_POST['rti_family'] !== '0') {
            $errors->add('rti_family_error', __('<strong>Error:</strong> Please select a Family Organization.', 'world-sso'));
        } elseif (!array_key_exists($_POST['rti_family'], Multi_OAuth_SSO_User_Handler::$family_options)) {
            $errors->add('rti_family_error', __('<strong>Error:</strong> Invalid Family Organization selected.', 'world-sso'));
        }
        return $errors;
    }

    /**
     * Save family organization on user registration
     */
    public function save_registration_family_field($user_id) {
        if (isset($_POST['rti_family'])) {
            $family = sanitize_text_field($_POST['rti_family']);
            if (array_key_exists($family, Multi_OAuth_SSO_User_Handler::$family_options)) {
                update_user_meta($user_id, 'rti_family', $family);
            }
        }
    }

    /**
     * Handle front-end registration form submission (from shortcode)
     */
    public function handle_frontend_registration() {
        if (!isset($_POST['world_sso_register_nonce']) || !wp_verify_nonce($_POST['world_sso_register_nonce'], 'world_sso_register')) {
            return;
        }

        if (is_user_logged_in()) {
            return;
        }

        $errors = new WP_Error();

        $username = isset($_POST['user_login']) ? sanitize_user($_POST['user_login']) : '';
        $email = isset($_POST['user_email']) ? sanitize_email($_POST['user_email']) : '';
        $password = isset($_POST['user_password']) ? $_POST['user_password'] : '';
        $password_confirm = isset($_POST['user_password_confirm']) ? $_POST['user_password_confirm'] : '';
        $family = isset($_POST['rti_family']) ? sanitize_text_field($_POST['rti_family']) : '';

        // Validate username
        if (empty($username)) {
            $errors->add('empty_username', __('<strong>Error:</strong> Please enter a username.', 'world-sso'));
        } elseif (!validate_username($username)) {
            $errors->add('invalid_username', __('<strong>Error:</strong> This username is invalid. Please enter a valid username.', 'world-sso'));
        } elseif (username_exists($username)) {
            $errors->add('username_exists', __('<strong>Error:</strong> This username is already registered.', 'world-sso'));
        }

        // Validate email
        if (empty($email)) {
            $errors->add('empty_email', __('<strong>Error:</strong> Please enter an email address.', 'world-sso'));
        } elseif (!is_email($email)) {
            $errors->add('invalid_email', __('<strong>Error:</strong> Please enter a valid email address.', 'world-sso'));
        } elseif (email_exists($email)) {
            $errors->add('email_exists', __('<strong>Error:</strong> This email address is already registered.', 'world-sso'));
        }

        // Validate password
        if (empty($password)) {
            $errors->add('empty_password', __('<strong>Error:</strong> Please enter a password.', 'world-sso'));
        } elseif (strlen($password) < 8) {
            $errors->add('short_password', __('<strong>Error:</strong> Password must be at least 8 characters long.', 'world-sso'));
        } elseif ($password !== $password_confirm) {
            $errors->add('password_mismatch', __('<strong>Error:</strong> Passwords do not match.', 'world-sso'));
        }

        // Validate family
        if ($family === '' && $family !== '0') {
            $errors->add('empty_family', __('<strong>Error:</strong> Please select a Family Organization.', 'world-sso'));
        } elseif (!array_key_exists($family, Multi_OAuth_SSO_User_Handler::$family_options)) {
            $errors->add('invalid_family', __('<strong>Error:</strong> Invalid Family Organization selected.', 'world-sso'));
        }

        // Allow other plugins to add validation
        $errors = apply_filters('world_sso_registration_errors', $errors, $username, $email);

        if ($errors->has_errors()) {
            // Store errors in transient for the shortcode to pick up
            set_transient('world_sso_register_errors_' . wp_hash($_SERVER['REMOTE_ADDR']), $errors, 60);
            return;
        }

        // Create the user with the chosen password
        $user_id = wp_create_user($username, $password, $email);

        if (is_wp_error($user_id)) {
            set_transient('world_sso_register_errors_' . wp_hash($_SERVER['REMOTE_ADDR']), $user_id, 60);
            return;
        }

        // Save family
        update_user_meta($user_id, 'rti_family', $family);

        // Send welcome notification to admin only (account is already active)
        wp_new_user_notification($user_id, null, 'admin');

        // Log the user in immediately
        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id, true);

        // Redirect to appropriate page
        $redirect_to = get_option('world_sso_redirect_url', '');
        if (empty($redirect_to)) {
            $redirect_to = home_url('/');
        }
        $redirect_to = apply_filters('world_sso_registration_redirect', $redirect_to, $user_id);
        wp_safe_redirect($redirect_to);
        exit;
    }

    /**
     * Registration form shortcode [world_sso_register]
     */
    public function register_form_shortcode($atts) {
        // Don't render if user is already logged in
        if (is_user_logged_in()) {
            return '<p>' . esc_html__('You are already logged in.', 'world-sso') . '</p>';
        }

        // Check if local registration is enabled
        if (!get_option('world_sso_local_registration', false)) {
            return '';
        }

        $transient_key = wp_hash($_SERVER['REMOTE_ADDR']);

        // Get any errors from the previous submission
        $errors = get_transient('world_sso_register_errors_' . $transient_key);
        delete_transient('world_sso_register_errors_' . $transient_key);

        $username = isset($_POST['user_login']) ? esc_attr(sanitize_user($_POST['user_login'])) : '';
        $email = isset($_POST['user_email']) ? esc_attr(sanitize_email($_POST['user_email'])) : '';
        $selected_family = isset($_POST['rti_family']) ? sanitize_text_field($_POST['rti_family']) : '';
        $family_options = Multi_OAuth_SSO_User_Handler::$family_options;

        ob_start();

        // Show errors
        if ($errors && is_wp_error($errors) && $errors->has_errors()) {
            echo '<div class="world-sso-register-errors" style="padding: 15px; background: #fef0f0; border-left: 4px solid #d63638; margin-bottom: 20px;">';
            foreach ($errors->get_error_messages() as $message) {
                echo '<p style="margin: 5px 0;">' . wp_kses_post($message) . '</p>';
            }
            echo '</div>';
        }

        ?>
        <form method="post" class="world-sso-register-form" style="max-width: 450px;">
            <?php wp_nonce_field('world_sso_register', 'world_sso_register_nonce'); ?>

            <p>
                <label for="world_sso_user_login"><?php esc_html_e('Username', 'world-sso'); ?> <span style="color: #d63638;">*</span></label><br>
                <input type="text" name="user_login" id="world_sso_user_login" value="<?php echo $username; ?>" required
                       style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #8c8f94; border-radius: 4px;">
            </p>

            <p>
                <label for="world_sso_user_email"><?php esc_html_e('Email', 'world-sso'); ?> <span style="color: #d63638;">*</span></label><br>
                <input type="email" name="user_email" id="world_sso_user_email" value="<?php echo $email; ?>" required
                       style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #8c8f94; border-radius: 4px;">
            </p>

            <p>
                <label for="world_sso_user_password"><?php esc_html_e('Password', 'world-sso'); ?> <span style="color: #d63638;">*</span></label><br>
                <input type="password" name="user_password" id="world_sso_user_password" required autocomplete="new-password" minlength="8"
                       style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #8c8f94; border-radius: 4px;">
                <span style="color: #666; font-size: 12px;"><?php esc_html_e('Minimum 8 characters.', 'world-sso'); ?></span>
            </p>

            <p>
                <label for="world_sso_user_password_confirm"><?php esc_html_e('Confirm Password', 'world-sso'); ?> <span style="color: #d63638;">*</span></label><br>
                <input type="password" name="user_password_confirm" id="world_sso_user_password_confirm" required autocomplete="new-password"
                       style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #8c8f94; border-radius: 4px;">
            </p>

            <p>
                <label for="world_sso_rti_family"><?php esc_html_e('Family Organization', 'world-sso'); ?> <span style="color: #d63638;">*</span></label><br>
                <select name="rti_family" id="world_sso_rti_family" required
                        style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #8c8f94; border-radius: 4px;">
                    <option value=""><?php esc_html_e('— Select Organization —', 'world-sso'); ?></option>
                    <?php foreach ($family_options as $value => $label): ?>
                        <option value="<?php echo esc_attr($value); ?>" <?php selected($selected_family, (string) $value); ?>><?php echo esc_html($label); ?></option>
                    <?php endforeach; ?>
                </select>
            </p>

            <p>
                <button type="submit" style="width: 100%; padding: 10px 20px; font-size: 15px; font-weight: 600;
                        background: #2271b1; color: #fff; border: none; border-radius: 25px; cursor: pointer;
                        transition: opacity 0.3s ease, transform 0.2s ease;"
                        onmouseover="this.style.opacity='0.9';this.style.transform='translateY(-1px)'"
                        onmouseout="this.style.opacity='1';this.style.transform='none'">
                    <?php esc_html_e('Register', 'world-sso'); ?>
                </button>
            </p>
        </form>
        <?php

        return ob_get_clean();
    }

    private function get_enabled_clients() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        return $wpdb->get_results("SELECT * FROM $table_name WHERE enabled = 1 ORDER BY display_order ASC, id ASC");
    }

    private function get_authorization_url($client) {
        $state = wp_generate_password(32, false);
        set_transient('oauth_sso_state_' . $state, $client->id, 1800);

        $params = array(
            'client_id' => $client->client_id,
            'redirect_uri' => $client->redirect_uri,
            'response_type' => 'code',
            'scope' => $client->scope,
            'state' => $state
        );

        return $client->authorization_endpoint . '?' . http_build_query($params);
    }

    public function handle_oauth_callback() {
        if (!isset($_GET['code']) || !isset($_GET['state'])) {
            return;
        }

        $state = sanitize_text_field($_GET['state']);
        $code = sanitize_text_field($_GET['code']);

        // Verify state
        $client_id = get_transient('oauth_sso_state_' . $state);
        if (!$client_id) {
            $login_url = wp_login_url();
            $login_url = add_query_arg('oauth_error', 'invalid_state', $login_url);
            wp_safe_redirect($login_url);
            exit;
        }

        // Get client configuration
        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';
        $client = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $client_id));

        if (!$client) {
            wp_die(__('Invalid OAuth client', 'world-sso'));
        }

        try {
            // Exchange code for token
            $oauth_client = new Multi_OAuth_SSO_Client($client);
            $token_data = $oauth_client->exchange_code_for_token($code);

            // State validated and token exchanged successfully — delete transient
            delete_transient('oauth_sso_state_' . $state);

            // Get user info
            $user_info = $oauth_client->get_user_info($token_data['access_token']);

            // Map attributes and create/update user
            $attribute_mapper = new Multi_OAuth_SSO_Attribute_Mapper($client);
            $mapped_data = $attribute_mapper->map_attributes($user_info);

            // Handle user login/registration
            $user_handler = new Multi_OAuth_SSO_User_Handler();
            $user_id = $user_handler->handle_user($mapped_data, $user_info, $client);

            // Log the user in
            wp_set_auth_cookie($user_id, true);

            // Redirect to appropriate page
            // Priority: 1) Global setting, 2) Filter, 3) Homepage
            $global_redirect = get_option('world_sso_redirect_url', '');
            $redirect_to = !empty($global_redirect) ? $global_redirect : home_url();
            $redirect_to = apply_filters('world_sso_login_redirect', $redirect_to);
            wp_safe_redirect($redirect_to);
            exit;

        } catch (Exception $e) {
            wp_die(__('OAuth authentication failed:', 'world-sso') . ' ' . esc_html($e->getMessage()));
        }
    }

    /**
     * Filter avatar URL to use OAuth profile picture
     */
    public function get_oauth_avatar_url($url, $id_or_email, $args) {
        $user = false;

        if (is_numeric($id_or_email)) {
            $user = get_user_by('id', $id_or_email);
        } elseif (is_object($id_or_email) && isset($id_or_email->user_id)) {
            $user = get_user_by('id', $id_or_email->user_id);
        } elseif (is_string($id_or_email)) {
            $user = get_user_by('email', $id_or_email);
        }

        if ($user) {
            $attachment_id = get_user_meta($user->ID, 'oauth_sso_profile_picture_id', true);
            if ($attachment_id) {
                $image_url = wp_get_attachment_image_url($attachment_id, 'thumbnail');
                if ($image_url) {
                    return $image_url;
                }
            }
        }

        return $url;
    }

    /**
     * Filter avatar HTML to use OAuth profile picture
     */
    public function get_oauth_avatar($avatar, $id_or_email, $size, $default, $alt, $args) {
        $user = false;

        if (is_numeric($id_or_email)) {
            $user = get_user_by('id', $id_or_email);
        } elseif (is_object($id_or_email) && isset($id_or_email->user_id)) {
            $user = get_user_by('id', $id_or_email->user_id);
        } elseif (is_string($id_or_email)) {
            $user = get_user_by('email', $id_or_email);
        }

        if ($user) {
            $attachment_id = get_user_meta($user->ID, 'oauth_sso_profile_picture_id', true);
            if ($attachment_id) {
                $image = wp_get_attachment_image($attachment_id, array($size, $size), false, array(
                    'alt' => $alt,
                    'class' => 'avatar avatar-' . $size . ' photo oauth-avatar'
                ));

                if ($image) {
                    return $image;
                }
            }
        }

        return $avatar;
    }
}
