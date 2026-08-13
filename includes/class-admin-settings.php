<?php
/**
 * Admin Settings Page
 */

if (!defined('ABSPATH')) {
    exit;
}

class Multi_OAuth_SSO_Admin_Settings {

    /**
     * Hardcoded .WORLD SSO providers
     * Endpoints are constructed from base_url + endpoint path
     */
    public static function get_default_providers() {
        $providers_config = array(
            array(
                'name' => 'TABLER.WORLD',
                'display_order' => 0,
                'base_url' => 'https://rti.roundtable.world/en/integrations/oauth/',
                'scope' => 'me',
                'button_text' => 'Login with TABLER.WORLD',
                'button_bg_color' => '#FFA600',
                'button_text_color' => '#000000',
            ),
            array(
                'name' => '41ER.WORLD',
                'display_order' => 1,
                'base_url' => 'https://41int.41er.world/en/integrations/oauth/',
                'scope' => 'me',
                'button_text' => 'Login with 41ER.WORLD',
                'button_bg_color' => '#2B5796',
                'button_text_color' => '#ffffff',
            ),
            array(
                'name' => 'CIRCLER.WORLD',
                'display_order' => 2,
                'base_url' => 'https://lci.ladiescircle.world/en/integrations/oauth/',
                'scope' => 'me',
                'button_text' => 'Login with CIRCLER.WORLD',
                'button_bg_color' => '#08004b',
                'button_text_color' => '#ffffff',
            ),
            array(
                'name' => 'AGORACLUB.WORLD',
                'display_order' => 3,
                'base_url' => 'https://aci.agoraclub.world/en/integrations/oauth/',
                'scope' => 'me',
                'button_text' => 'Login with AGORACLUB.WORLD',
                'button_bg_color' => '#487730',
                'button_text_color' => '#ffffff',
            ),
            array(
                'name' => 'TANGENTCLUB.WORLD',
                'display_order' => 4,
                'base_url' => 'https://tci.tangentclub.world/en/integrations/oauth/',
                'scope' => 'me',
                'button_text' => 'Login with TANGENTCLUB.WORLD',
                'button_bg_color' => '#C8C7C5',
                'button_text_color' => '#000000',
            ),
        );

        // Build full endpoints from base_url
        $providers = array();
        foreach ($providers_config as $config) {
            $base_url = rtrim($config['base_url'], '/') . '/';
            $providers[] = array(
                'name' => $config['name'],
                'display_order' => $config['display_order'],
                'base_url' => $base_url,
                'authorization_endpoint' => $base_url . 'authorize',
                'token_endpoint' => $base_url . 'token/',
                'userinfo_endpoint' => $base_url . 'profile',
                'scope' => $config['scope'],
                'button_text' => $config['button_text'],
                'button_bg_color' => $config['button_bg_color'],
                'button_text_color' => $config['button_text_color'],
                'button_hover_bg_color' => $config['button_bg_color'],
                'button_hover_text_color' => $config['button_text_color'],
            );
        }

        return $providers;
    }

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_ajax_save_oauth_client', array($this, 'ajax_save_oauth_client'));
        add_action('wp_ajax_toggle_oauth_client', array($this, 'ajax_toggle_oauth_client'));
        add_action('wp_ajax_get_oauth_client', array($this, 'ajax_get_oauth_client'));
        add_action('wp_ajax_save_redirect_uri', array($this, 'ajax_save_redirect_uri'));
        add_action('wp_ajax_save_local_registration', array($this, 'ajax_save_local_registration'));
    }

    public function add_admin_menu() {
        // Get the SVG icon and encode it for use in the menu
        $icon_svg = file_get_contents(WORLD_SSO_PLUGIN_DIR . 'assets/icon.svg');
        $icon_base64 = 'data:image/svg+xml;base64,' . base64_encode($icon_svg);

        add_menu_page(
            __('.WORLD SSO Settings', 'world-sso'),
            __('.WORLD SSO', 'world-sso'),
            'manage_options',
            'world-sso',
            array($this, 'settings_page'),
            $icon_base64,
            80 // Position after Settings
        );
    }

    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'toplevel_page_world-sso') {
            return;
        }

        wp_enqueue_style('world-sso-admin', WORLD_SSO_PLUGIN_URL . 'assets/admin.css', array(), WORLD_SSO_VERSION);
        wp_enqueue_script('world-sso-admin', WORLD_SSO_PLUGIN_URL . 'assets/admin.js', array('jquery'), WORLD_SSO_VERSION, true);

        wp_localize_script('world-sso-admin', 'multiOAuthSSO', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('multi_oauth_sso_nonce')
        ));
    }

    public function settings_page() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $clients = $wpdb->get_results("SELECT * FROM $table_name ORDER BY display_order ASC, id ASC");
        $global_redirect_url = get_option('world_sso_redirect_url', '');
        $current_redirect_uri = !empty($global_redirect_url) ? $global_redirect_url : home_url('/');

        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Sign in with .WORLD', 'world-sso'); ?></h1>

            <div class="oauth-sso-settings-container">
                <div class="oauth-sso-clients-list">
                    <h2><?php esc_html_e('.WORLD Identity Providers', 'world-sso'); ?></h2>
                    <p class="description"><?php esc_html_e('Configure your .WORLD SSO connections below. Enter your Client ID and Client Secret for each provider you want to enable.', 'world-sso'); ?></p>

                    <table class="wp-list-table widefat fixed striped" style="margin-top: 20px;">
                        <thead>
                            <tr>
                                <th style="width: 5%;"><?php esc_html_e('Order', 'world-sso'); ?></th>
                                <th style="width: 20%;"><?php esc_html_e('Provider', 'world-sso'); ?></th>
                                <th style="width: 25%;"><?php esc_html_e('Client ID', 'world-sso'); ?></th>
                                <th style="width: 15%;"><?php esc_html_e('Status', 'world-sso'); ?></th>
                                <th style="width: 35%;"><?php esc_html_e('Actions', 'world-sso'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($clients)): ?>
                                <tr>
                                    <td colspan="5"><?php esc_html_e('No providers configured. Please deactivate and reactivate the plugin.', 'world-sso'); ?></td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($clients as $client): ?>
                                    <?php
                                    $has_credentials = !empty($client->client_id) && !empty($client->client_secret);
                                    $status_class = $client->enabled ? 'enabled' : 'disabled';
                                    $status_text = $client->enabled ? __('Enabled', 'world-sso') : __('Disabled', 'world-sso');
                                    ?>
                                    <tr>
                                        <td><strong><?php echo esc_html($client->display_order); ?></strong></td>
                                        <td>
                                            <strong style="color: <?php echo esc_attr($client->button_bg_color); ?>;">
                                                <?php echo esc_html($client->name); ?>
                                            </strong>
                                        </td>
                                        <td>
                                            <?php if (!empty($client->client_id)): ?>
                                                <code><?php echo esc_html(substr($client->client_id, 0, 20)); ?>...</code>
                                            <?php else: ?>
                                                <em style="color: #999;"><?php esc_html_e('Not configured', 'world-sso'); ?></em>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <span class="status-badge <?php echo esc_attr($status_class); ?>">
                                                <?php echo esc_html($status_text); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" class="button edit-client" data-id="<?php echo esc_attr($client->id); ?>">
                                                <?php esc_html_e('Configure', 'world-sso'); ?>
                                            </button>
                                            <?php if ($has_credentials): ?>
                                                <button type="button" class="button toggle-client" data-id="<?php echo esc_attr($client->id); ?>" data-enabled="<?php echo esc_attr($client->enabled); ?>">
                                                    <?php echo $client->enabled ? esc_html__('Disable', 'world-sso') : esc_html__('Enable', 'world-sso'); ?>
                                                </button>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <div class="oauth-sso-info-box">
                    <h3><?php esc_html_e('How to Use', 'world-sso'); ?></h3>
                    <p><?php esc_html_e('1. Click "Configure" on a provider', 'world-sso'); ?></p>
                    <p><?php esc_html_e('2. Enter your Client ID and Client Secret', 'world-sso'); ?></p>
                    <p><?php esc_html_e('3. Configure attribute mapping if needed', 'world-sso'); ?></p>
                    <p><?php esc_html_e('4. Save and Enable the provider', 'world-sso'); ?></p>

                    <h3><?php esc_html_e('Redirect URI (OAuth Callback)', 'world-sso'); ?></h3>
                    <p><?php esc_html_e('Use this URL when configuring your OAuth application:', 'world-sso'); ?></p>

                    <div id="redirect-uri-display" class="redirect-uri-container">
                        <code id="redirect-uri-text" style="word-break: break-all;"><?php echo esc_html($current_redirect_uri); ?></code>
                        <button type="button" id="edit-redirect-uri" class="button-link" title="<?php esc_attr_e('Edit', 'world-sso'); ?>" style="margin-left: 8px; vertical-align: middle;">
                            <span class="dashicons dashicons-edit" style="font-size: 16px; width: 16px; height: 16px;"></span>
                        </button>
                    </div>

                    <div id="redirect-uri-edit" class="redirect-uri-container" style="display: none;">
                        <input type="url" id="redirect-uri-input" value="<?php echo esc_attr($current_redirect_uri); ?>" class="regular-text" style="width: 100%; margin-bottom: 8px;" placeholder="<?php echo esc_attr(home_url('/')); ?>">
                        <div>
                            <button type="button" id="save-redirect-uri" class="button button-small button-primary" title="<?php esc_attr_e('Save', 'world-sso'); ?>">
                                <span class="dashicons dashicons-yes" style="font-size: 16px; width: 16px; height: 16px; line-height: 1.4;"></span>
                            </button>
                            <button type="button" id="cancel-redirect-uri" class="button button-small" title="<?php esc_attr_e('Cancel', 'world-sso'); ?>">
                                <span class="dashicons dashicons-no" style="font-size: 16px; width: 16px; height: 16px; line-height: 1.4;"></span>
                            </button>
                            <button type="button" id="reset-redirect-uri" class="button button-small button-link" title="<?php esc_attr_e('Reset to default', 'world-sso'); ?>" style="margin-left: 5px;">
                                <?php esc_html_e('Reset', 'world-sso'); ?>
                            </button>
                        </div>
                        <p class="description" style="margin-top: 8px;"><?php esc_html_e('Where users are redirected after login. Leave empty or reset to use homepage.', 'world-sso'); ?></p>
                    </div>

                    <input type="hidden" id="default-redirect-uri" value="<?php echo esc_attr(home_url('/')); ?>">

                    <h3><?php esc_html_e('Shortcodes', 'world-sso'); ?></h3>
                    <p><?php esc_html_e('Display login buttons anywhere:', 'world-sso'); ?></p>
                    <code>[world_sso_login]</code>
                    <p style="margin-top: 10px;"><?php esc_html_e('Display guest registration form:', 'world-sso'); ?></p>
                    <code>[world_sso_register]</code>

                    <h3><?php esc_html_e('Local Registration', 'world-sso'); ?></h3>
                    <p><?php esc_html_e('Allow guests without a .WORLD account to register a local WordPress account.', 'world-sso'); ?></p>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="world-sso-local-registration" <?php checked(get_option('world_sso_local_registration', false)); ?>>
                        <?php esc_html_e('Enable "Register Local Account" button', 'world-sso'); ?>
                    </label>
                    <p class="description" style="margin-top: 6px;"><?php esc_html_e('When enabled, a registration button is shown on the login page. Family organization is required during registration.', 'world-sso'); ?></p>
                </div>
            </div>
        </div>

        <!-- Client Editor Modal -->
        <div id="oauth-client-modal" class="oauth-modal" style="display: none;">
            <div class="oauth-modal-content">
                <span class="oauth-modal-close">&times;</span>
                <h2 id="modal-title"><?php esc_html_e('Configure Provider', 'world-sso'); ?></h2>

                <form id="oauth-client-form">
                    <input type="hidden" id="client-id" name="client_id" value="">

                    <table class="form-table">
                        <tr>
                            <th><label for="client-name"><?php esc_html_e('Provider', 'world-sso'); ?></label></th>
                            <td><input type="text" id="client-name" name="name" class="regular-text" readonly></td>
                        </tr>
                        <tr>
                            <th><label for="oauth-client-id"><?php esc_html_e('Client ID', 'world-sso'); ?> *</label></th>
                            <td><input type="text" id="oauth-client-id" name="oauth_client_id" class="regular-text" required></td>
                        </tr>
                        <tr>
                            <th><label for="client-secret"><?php esc_html_e('Client Secret', 'world-sso'); ?> *</label></th>
                            <td><input type="password" id="client-secret" name="client_secret" class="regular-text" required></td>
                        </tr>
                    </table>

                    <h3><?php esc_html_e('Attribute Mapping', 'world-sso'); ?></h3>
                    <p><?php esc_html_e('Drag OAuth profile fields below and drop them into the corresponding WordPress fields, or type manually.', 'world-sso'); ?></p>

                    <div id="oauth-profile-fields" class="oauth-profile-tags">
                        <h4><?php esc_html_e('Available OAuth Profile Fields', 'world-sso'); ?></h4>
                        <p class="description"><?php esc_html_e('Drag these tags to the mapping fields below:', 'world-sso'); ?></p>
                        <div class="oauth-tags-container">
                            <span class="oauth-tag" draggable="true" data-value="email">email</span>
                            <span class="oauth-tag" draggable="true" data-value="first_name">first_name</span>
                            <span class="oauth-tag" draggable="true" data-value="last_name">last_name</span>
                            <span class="oauth-tag" draggable="true" data-value="name">name</span>
                            <span class="oauth-tag" draggable="true" data-value="id">id</span>
                            <span class="oauth-tag" draggable="true" data-value="profile_pic">profile_pic</span>
                            <span class="oauth-tag" draggable="true" data-value="club.name">club.name</span>
                            <span class="oauth-tag" draggable="true" data-value="club.family">club.family</span>
                            <span class="oauth-tag" draggable="true" data-value="club.subdomain">club.subdomain</span>
                            <span class="oauth-tag" draggable="true" data-value="club.level">club.level</span>
                            <span class="oauth-tag" draggable="true" data-value="address.street1">address.street1</span>
                            <span class="oauth-tag" draggable="true" data-value="address.street2">address.street2</span>
                            <span class="oauth-tag" draggable="true" data-value="address.city">address.city</span>
                            <span class="oauth-tag" draggable="true" data-value="address.postal_code">address.postal_code</span>
                            <span class="oauth-tag" draggable="true" data-value="address.country">address.country</span>
                        </div>
                    </div>

                    <div id="attribute-mapping">
                        <?php $this->render_attribute_mapping_fields(); ?>
                    </div>

                    <p class="submit">
                        <button type="submit" class="button button-primary"><?php esc_html_e('Save Configuration', 'world-sso'); ?></button>
                        <button type="button" class="button" id="cancel-client-form"><?php esc_html_e('Cancel', 'world-sso'); ?></button>
                    </p>
                </form>
            </div>
        </div>
        <?php
    }

    private function render_attribute_mapping_fields() {
        $all_fields = Multi_OAuth_SSO_Attribute_Mapper::get_all_fields();

        foreach ($all_fields as $group_name => $fields) {
            if (empty($fields)) {
                continue;
            }

            echo '<h4>' . esc_html($group_name) . '</h4>';
            echo '<table class="form-table attribute-mapping-table">';

            foreach ($fields as $field_key => $field_label) {
                echo '<tr>';
                echo '<th><label for="map-' . esc_attr($field_key) . '">' . esc_html($field_label) . '</label></th>';
                echo '<td><input type="text" id="map-' . esc_attr($field_key) . '" name="mapping[' . esc_attr($field_key) . ']" class="regular-text oauth-mapping-input" placeholder="' . esc_attr__('Drop tag here or type field path', 'world-sso') . '"></td>';
                echo '</tr>';
            }

            echo '</table>';
        }
    }

    public function ajax_save_oauth_client() {
        check_ajax_referer('multi_oauth_sso_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Unauthorized', 'world-sso'));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $client_id = isset($_POST['client_id']) ? intval($_POST['client_id']) : 0;

        if ($client_id <= 0) {
            wp_send_json_error(__('Invalid client', 'world-sso'));
            return;
        }

        // Get existing client to preserve non-editable fields
        $existing = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $client_id));
        if (!$existing) {
            wp_send_json_error(__('Client not found', 'world-sso'));
            return;
        }

        // Validate required fields
        if (empty($_POST['oauth_client_id']) || empty($_POST['client_secret'])) {
            wp_send_json_error(__('Client ID and Client Secret are required', 'world-sso'));
            return;
        }

        $oauth_client_id = sanitize_text_field($_POST['oauth_client_id']);
        $client_secret = sanitize_text_field($_POST['client_secret']);

        // Process attribute mapping
        $mapping = array();
        if (isset($_POST['mapping']) && is_array($_POST['mapping'])) {
            foreach ($_POST['mapping'] as $key => $value) {
                if (!empty($value)) {
                    $mapping[sanitize_text_field($key)] = sanitize_text_field($value);
                }
            }
        }

        // Use global redirect URI or default to home
        $global_redirect_url = get_option('world_sso_redirect_url', '');
        $redirect_uri = !empty($global_redirect_url) ? $global_redirect_url : home_url('/');

        $data = array(
            'client_id' => $oauth_client_id,
            'client_secret' => $client_secret,
            'attribute_mapping' => json_encode($mapping),
            'redirect_uri' => $redirect_uri,
        );

        $result = $wpdb->update($table_name, $data, array('id' => $client_id));

        if ($result === false) {
            wp_send_json_error(__('Database update failed', 'world-sso') . ': ' . $wpdb->last_error);
            return;
        }

        wp_send_json_success(__('Configuration saved successfully', 'world-sso'));
    }

    public function ajax_toggle_oauth_client() {
        check_ajax_referer('multi_oauth_sso_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Unauthorized', 'world-sso'));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $client_id = intval($_POST['client_id']);
        $current_enabled = intval($_POST['enabled']);

        // Get client to check if it has credentials
        $client = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $client_id));

        if (!$client) {
            wp_send_json_error(__('Client not found', 'world-sso'));
            return;
        }

        // Only allow enabling if credentials are set
        if ($current_enabled === 0 && (empty($client->client_id) || empty($client->client_secret))) {
            wp_send_json_error(__('Please configure Client ID and Client Secret before enabling', 'world-sso'));
            return;
        }

        $new_enabled = $current_enabled === 1 ? 0 : 1;

        $wpdb->update($table_name, array('enabled' => $new_enabled), array('id' => $client_id));

        wp_send_json_success(array('enabled' => $new_enabled));
    }

    public function ajax_get_oauth_client() {
        check_ajax_referer('multi_oauth_sso_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Unauthorized', 'world-sso'));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $client_id = intval($_POST['client_id']);
        $client = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $client_id));

        if ($client) {
            wp_send_json_success($client);
        } else {
            wp_send_json_error(__('Client not found', 'world-sso'));
        }
    }

    public function ajax_save_redirect_uri() {
        check_ajax_referer('multi_oauth_sso_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Unauthorized', 'world-sso'));
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'oauth_sso_clients';

        $redirect_uri = isset($_POST['redirect_uri']) ? esc_url_raw($_POST['redirect_uri']) : '';

        // If empty, use homepage
        if (empty($redirect_uri)) {
            $redirect_uri = home_url('/');
        }

        // Save to options
        update_option('world_sso_redirect_url', $redirect_uri === home_url('/') ? '' : $redirect_uri);

        // Update all clients in database
        $wpdb->query($wpdb->prepare(
            "UPDATE $table_name SET redirect_uri = %s",
            $redirect_uri
        ));

        wp_send_json_success(array(
            'redirect_uri' => $redirect_uri,
            'message' => __('Redirect URI updated for all providers.', 'world-sso')
        ));
    }

    public function ajax_save_local_registration() {
        check_ajax_referer('multi_oauth_sso_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Unauthorized', 'world-sso'));
        }

        $enabled = isset($_POST['enabled']) && $_POST['enabled'] === '1';
        update_option('world_sso_local_registration', $enabled);

        wp_send_json_success(array(
            'enabled' => $enabled,
            'message' => $enabled
                ? __('Local registration enabled.', 'world-sso')
                : __('Local registration disabled.', 'world-sso')
        ));
    }
}
