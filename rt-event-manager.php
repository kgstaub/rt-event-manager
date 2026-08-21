<?php
/**
 * Plugin Name: RT Event Manager
 * Plugin URI: https://www.staub.ee
 * Description: Round Table International event management for WooCommerce — attendee tickets with a full member account portal (dashboard, profile, tours, calendar, visa letters, shop), pretours &amp; day tours, ticket transfers &amp; refunds, Apple &amp; Google Wallet passes with live push updates, and a staff QR check-in web app.
 * Version: 2.0.2
 * Author: Kenneth Staub, RT Switzerland
 * Author URI: https://www.staub.ee
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: rt-event-manager
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

defined('ABSPATH') || exit;

// Define plugin constants
define('RT_EVENT_MANAGER_VERSION', '2.0.2');
define('RT_EVENT_MANAGER_DB_VERSION', '2.4.0');
define('RT_EVENT_MANAGER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RT_EVENT_MANAGER_PLUGIN_URL', plugin_dir_url(__FILE__));

// Constants for the merged "Sign in with .WORLD" SSO module. Its code uses the
// WORLD_SSO_* / MULTI_OAUTH_SSO_* constants for versioning and asset paths;
// point them at this plugin so its assets (assets/admin.css, admin.js, icon.svg)
// resolve correctly.
define('WORLD_SSO_VERSION', '1.2.0');
define('WORLD_SSO_PLUGIN_DIR', RT_EVENT_MANAGER_PLUGIN_DIR);
define('WORLD_SSO_PLUGIN_URL', RT_EVENT_MANAGER_PLUGIN_URL);
define('MULTI_OAUTH_SSO_VERSION', WORLD_SSO_VERSION);
define('MULTI_OAUTH_SSO_PLUGIN_DIR', WORLD_SSO_PLUGIN_DIR);
define('MULTI_OAUTH_SSO_PLUGIN_URL', WORLD_SSO_PLUGIN_URL);

// Load Composer autoloader for badge generation dependencies (DOMPDF, QR Code)
$composer_autoload = RT_EVENT_MANAGER_PLUGIN_DIR . 'vendor/autoload.php';
if (file_exists($composer_autoload)) {
    require_once $composer_autoload;
}

// Load the merged .WORLD SSO module (independent of WooCommerce). Required at
// file scope so the classes are available during activation.
require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-oauth-client.php';
require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-attribute-mapper.php';
require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-admin-settings.php';
require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-user-handler.php';
require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-world-sso.php';

// Boot the SSO module (registers login buttons, OAuth callback, avatar, etc.).
add_action('plugins_loaded', function () {
    if (class_exists('Multi_OAuth_SSO')) {
        Multi_OAuth_SSO::get_instance();
    }
}, 5);

/**
 * Check if WooCommerce is active
 */
function rt_event_manager_check_woocommerce() {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', 'rt_event_manager_woocommerce_notice');
        return false;
    }
    return true;
}

/**
 * Admin notice for missing WooCommerce
 */
function rt_event_manager_woocommerce_notice() {
    ?>
    <div class="error">
        <p><?php esc_html_e('RT Event Manager requires WooCommerce to be installed and active.', 'rt-event-manager'); ?></p>
    </div>
    <?php
}

/**
 * Initialize the plugin
 */
function rt_event_manager_init() {
    if (!rt_event_manager_check_woocommerce()) {
        return;
    }

    // Check if DB needs to be updated
    rt_event_manager_install_db();

    // Load the main class
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager.php';

    // Load badge template classes (requires Composer autoload for DOMPDF/QR Code)
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-badge-template.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-badge-generator.php';

    // Load customer account portal + PDF receipt generator
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-receipt.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-account.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-visa.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-ticket-pass.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-apple-wallet.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-google-wallet.php';
    require_once RT_EVENT_MANAGER_PLUGIN_DIR . 'includes/class-rt-event-manager-checkin.php';

    // Initialize
    RT_Event_Manager::instance();

    // Initialize badge template handler
    RT_Event_Manager_Badge_Template::instance();

    // Initialize customer account portal (shortcode + AJAX)
    RT_Event_Manager_Account::instance();

    // Initialize visa letter of invitation handler
    RT_Event_Manager_Visa::instance();

    // Initialize the QR check-in ticket generator
    RT_Event_Manager_Ticket_Pass::instance();

    // Initialize Apple Wallet pass generator
    RT_Event_Manager_Apple_Wallet::instance();

    // Initialize Google Wallet save-link generator
    RT_Event_Manager_Google_Wallet::instance();

    // Initialize the staff check-in PWA
    RT_Event_Manager_Checkin::instance();

    // Run one-time ticket migration for old orders
    rt_event_manager_migrate_tickets();
}
add_action('plugins_loaded', 'rt_event_manager_init');

/**
 * One-time migration: generate tickets for old orders that have ticket-type products
 * but no entries in the rti_tickets table.
 */
function rt_event_manager_migrate_tickets() {
    if (get_option('wc_rti_tickets_migrated_v2')) {
        return;
    }

    // Run on admin init to ensure WooCommerce is fully loaded
    add_action('admin_init', function() {
        if (get_option('wc_rti_tickets_migrated_v2')) {
            return;
        }

        global $wpdb;
        $tickets_table = $wpdb->prefix . 'rti_tickets';

        // Get all product IDs that are ticket-type
        $ticket_product_ids = get_posts(array(
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => array('publish', 'private', 'draft'),
            'meta_query'     => array(
                array(
                    'key'   => '_rti_is_ticket',
                    'value' => 'yes',
                ),
            ),
            'fields'         => 'ids',
        ));

        if (empty($ticket_product_ids)) {
            update_option('wc_rti_tickets_migrated_v2', '1');
            return;
        }

        // Get all orders (using wc_get_orders for HPOS compatibility)
        $orders = wc_get_orders(array(
            'limit'  => -1,
            'status' => array('wc-processing', 'wc-completed', 'wc-on-hold', 'wc-pending'),
            'return' => 'ids',
        ));

        foreach ($orders as $order_id) {
            // Check for existing tickets
            $existing_tickets = $wpdb->get_results($wpdb->prepare(
                "SELECT id, holder_name, world_id FROM $tickets_table WHERE order_id = %d",
                $order_id
            ), ARRAY_A);

            if (!empty($existing_tickets)) {
                // Check if tickets have data (not empty from a failed migration)
                $has_data = false;
                foreach ($existing_tickets as $et) {
                    if (!empty($et['holder_name']) || !empty($et['world_id'])) {
                        $has_data = true;
                        break;
                    }
                }

                if ($has_data) {
                    // Tickets already have data, skip this order
                    continue;
                }

                // Delete empty tickets from previous failed migration so we can recreate them
                $wpdb->delete($tickets_table, array('order_id' => $order_id), array('%d'));
            }

            $order = wc_get_order($order_id);
            if (!$order) {
                continue;
            }

            $customer_id = $order->get_customer_id();

            // Get buyer name from order billing details
            $buyer_name = trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name());

            // Get RTI details from order meta first (what was submitted at checkout)
            $buyer_family   = $order->get_meta('_rti_family');
            $buyer_club     = $order->get_meta('_rti_club');
            $buyer_world_id = $order->get_meta('_rti_world_id');

            // Fall back to user meta if order meta is empty
            if ($customer_id) {
                if (empty($buyer_family) || $buyer_family === '') {
                    $buyer_family = get_user_meta($customer_id, 'rti_family', true);
                }
                if (empty($buyer_club)) {
                    $buyer_club = get_user_meta($customer_id, 'rti_club', true);
                }
                if (empty($buyer_world_id)) {
                    $buyer_world_id = get_user_meta($customer_id, 'world_id', true);
                }
                if (empty($buyer_name)) {
                    $user_obj = get_userdata($customer_id);
                    if ($user_obj) {
                        $buyer_name = trim($user_obj->first_name . ' ' . $user_obj->last_name);
                        if (empty($buyer_name)) {
                            $buyer_name = $user_obj->display_name;
                        }
                    }
                }
            }

            $ticket_index = 0;
            $has_tickets = false;

            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();

                if (!in_array($product_id, $ticket_product_ids)) {
                    continue;
                }

                $has_tickets = true;
                $quantity = $item->get_quantity();
                $product = wc_get_product($product_id);
                $require_dietary = $product ? get_post_meta($product_id, '_rti_ticket_dietary', true) === 'yes' : false;

                for ($i = 0; $i < $quantity; $i++) {
                    $is_first = ($ticket_index === 0);

                    $holder_name  = $is_first ? $buyer_name : '';
                    $ticket_family = $is_first ? $buyer_family : '9';
                    $ticket_club   = $is_first ? $buyer_club : '';
                    $world_id     = ($is_first && !empty($buyer_world_id)) ? $buyer_world_id : '';
                    $qr_code_url  = !empty($world_id) ? 'tablerworld:///member?id=' . $world_id : '';

                    $wpdb->insert(
                        $tickets_table,
                        array(
                            'order_id'     => $order_id,
                            'product_id'   => $product_id,
                            'ticket_index' => $ticket_index,
                            'holder_name'  => sanitize_text_field($holder_name),
                            'rti_family'   => sanitize_text_field($ticket_family),
                            'rti_club'     => sanitize_text_field($ticket_club),
                            'dietary'      => '',
                            'world_id'     => sanitize_text_field($world_id),
                            'qr_code_url'  => sanitize_text_field($qr_code_url),
                        ),
                        array('%d', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s')
                    );

                    $ticket_index++;
                }
            }
        }

        update_option('wc_rti_tickets_migrated_v2', '1');
    });
}

/**
 * Create or update the tickets database table
 */
function rt_event_manager_install_db() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'rti_tickets';
    $installed_version = get_option('wc_rti_customer_fields_db_version');

    if ($installed_version !== RT_EVENT_MANAGER_DB_VERSION) {
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            order_id bigint(20) unsigned NOT NULL,
            product_id bigint(20) unsigned NOT NULL,
            combination_id bigint(20) unsigned NOT NULL DEFAULT 0,
            parent_ticket_id bigint(20) unsigned NOT NULL DEFAULT 0,
            ticket_kind varchar(20) NOT NULL DEFAULT 'event',
            minor_type varchar(20) NOT NULL DEFAULT '',
            ticket_index int(11) unsigned NOT NULL DEFAULT 0,
            holder_name varchar(255) NOT NULL DEFAULT '',
            phone varchar(32) NOT NULL DEFAULT '',
            dob varchar(10) NOT NULL DEFAULT '',
            rti_family varchar(50) NOT NULL DEFAULT '',
            rti_club varchar(255) NOT NULL DEFAULT '',
            dietary varchar(50) NOT NULL DEFAULT '',
            allergy_details varchar(255) NOT NULL DEFAULT '',
            world_id varchar(100) NOT NULL DEFAULT '',
            qr_code_url varchar(500) NOT NULL DEFAULT '',
            status varchar(20) NOT NULL DEFAULT 'draft',
            owner_user_id bigint(20) unsigned NOT NULL DEFAULT 0,
            transfer_token varchar(64) NOT NULL DEFAULT '',
            transfer_email varchar(255) NOT NULL DEFAULT '',
            transfer_requested_at datetime NULL DEFAULT NULL,
            refund_status varchar(20) NOT NULL DEFAULT '',
            refund_note varchar(500) NOT NULL DEFAULT '',
            transferred_from_user_id bigint(20) unsigned NOT NULL DEFAULT 0,
            transferred_at datetime NULL DEFAULT NULL,
            checked_in_at datetime NULL DEFAULT NULL,
            checked_in_by bigint(20) unsigned NOT NULL DEFAULT 0,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY order_ticket (order_id, ticket_index),
            KEY order_id (order_id),
            KEY product_id (product_id),
            KEY status (status),
            KEY parent_ticket_id (parent_ticket_id),
            KEY ticket_kind (ticket_kind),
            KEY owner_user_id (owner_user_id),
            KEY transfer_token (transfer_token)
        ) $charset_collate;";

        // Dedupe existing rows on upgrade so the UNIQUE KEY can be applied.
        // Keep the highest id per (order_id, ticket_index) — the latest submission wins,
        // and rt_event_manager_recalculate_all_ticket_statuses will normalise status afterwards.
        $table_exists_pre = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name));
        if ($table_exists_pre) {
            $wpdb->query("
                DELETE t1 FROM $table_name t1
                INNER JOIN $table_name t2
                  ON t1.order_id = t2.order_id
                  AND t1.ticket_index = t2.ticket_index
                  AND t1.id < t2.id
            ");
        }

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);

        // dbDelta is unreliable for adding UNIQUE KEYs to existing tables — add explicitly if missing.
        if ($table_exists_pre) {
            $has_unique = $wpdb->get_var($wpdb->prepare(
                "SHOW INDEX FROM $table_name WHERE Key_name = %s",
                'order_ticket'
            ));
            if (!$has_unique) {
                $wpdb->query("ALTER TABLE $table_name ADD UNIQUE KEY order_ticket (order_id, ticket_index)");
            }
        }

        // Schedule status recalculation for later when WooCommerce is fully loaded
        update_option('wc_rti_needs_status_recalc', 'yes');

        update_option('wc_rti_customer_fields_db_version', RT_EVENT_MANAGER_DB_VERSION);
    }

    // Always ensure combination_id column exists, regardless of version check.
    $table_exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name));
    if ($table_exists) {
        $col_exists = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'combination_id'");
        if (empty($col_exists)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN `combination_id` bigint(20) unsigned NOT NULL DEFAULT 0 AFTER `product_id`");
        }

        // Always ensure the per-ticket phone column exists, regardless of version check.
        $phone_col_exists = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'phone'");
        if (empty($phone_col_exists)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN `phone` varchar(32) NOT NULL DEFAULT '' AFTER `holder_name`");
        }

        // Ensure the ticket-relationship columns exist (pretour / minor linking).
        $relationship_columns = array(
            'parent_ticket_id' => "ADD COLUMN `parent_ticket_id` bigint(20) unsigned NOT NULL DEFAULT 0 AFTER `combination_id`",
            'ticket_kind'      => "ADD COLUMN `ticket_kind` varchar(20) NOT NULL DEFAULT 'event' AFTER `parent_ticket_id`",
            'minor_type'       => "ADD COLUMN `minor_type` varchar(20) NOT NULL DEFAULT '' AFTER `ticket_kind`",
            'dob'              => "ADD COLUMN `dob` varchar(10) NOT NULL DEFAULT '' AFTER `phone`",
            'allergy_details'  => "ADD COLUMN `allergy_details` varchar(255) NOT NULL DEFAULT '' AFTER `dietary`",
            // Ownership + transfer (added in 2.0.0). owner_user_id is the current
            // holder of the ticket; it can differ from the order customer after a
            // transfer. transfer_* hold a pending transfer offer.
            'owner_user_id'         => "ADD COLUMN `owner_user_id` bigint(20) unsigned NOT NULL DEFAULT 0 AFTER `status`",
            'transfer_token'        => "ADD COLUMN `transfer_token` varchar(64) NOT NULL DEFAULT '' AFTER `owner_user_id`",
            'transfer_email'        => "ADD COLUMN `transfer_email` varchar(255) NOT NULL DEFAULT '' AFTER `transfer_token`",
            'transfer_requested_at' => "ADD COLUMN `transfer_requested_at` datetime NULL DEFAULT NULL AFTER `transfer_email`",
            // Refund tracking for cancelled tickets (added in 2.1.0).
            'refund_status'         => "ADD COLUMN `refund_status` varchar(20) NOT NULL DEFAULT '' AFTER `transfer_requested_at`",
            // Reason recorded when an organiser declines a refund (added in 2.4.0).
            'refund_note'           => "ADD COLUMN `refund_note` varchar(500) NOT NULL DEFAULT '' AFTER `refund_status`",
            // Completed-transfer record (added in 2.2.0).
            'transferred_from_user_id' => "ADD COLUMN `transferred_from_user_id` bigint(20) unsigned NOT NULL DEFAULT 0 AFTER `refund_status`",
            'transferred_at'        => "ADD COLUMN `transferred_at` datetime NULL DEFAULT NULL AFTER `transferred_from_user_id`",
            // Check-in audit (added in 2.3.0).
            'checked_in_at'         => "ADD COLUMN `checked_in_at` datetime NULL DEFAULT NULL AFTER `transferred_at`",
            'checked_in_by'         => "ADD COLUMN `checked_in_by` bigint(20) unsigned NOT NULL DEFAULT 0 AFTER `checked_in_at`",
        );
        foreach ($relationship_columns as $column => $ddl) {
            $exists = $wpdb->get_results($wpdb->prepare("SHOW COLUMNS FROM $table_name LIKE %s", $column));
            if (empty($exists)) {
                $wpdb->query("ALTER TABLE $table_name $ddl");
            }
        }
    }
}

/**
 * Run deferred status recalculation after WooCommerce is fully loaded.
 * Hooked to 'init' so wc_get_order() and HPOS are available.
 */
add_action('init', function () {
    if (get_option('wc_rti_needs_status_recalc') === 'yes') {
        delete_option('wc_rti_needs_status_recalc');
        if (function_exists('rt_event_manager_recalculate_all_ticket_statuses')) {
            rt_event_manager_recalculate_all_ticket_statuses();
        }
    }
}, 20);

/**
 * Recalculate ticket statuses for all tickets based on order status and assignment.
 *
 * Status logic:
 *  - "valid"      = order is completed AND ticket has a holder name
 *  - "draft"      = order is pending payment OR ticket has no holder name
 *  - "invalid"    = order is cancelled, failed, refunded, deleted, or trashed
 *  - "checked_in" = reserved for future use (manual check-in at event)
 */
function rt_event_manager_recalculate_all_ticket_statuses() {
    global $wpdb;
    $tickets_table = $wpdb->prefix . 'rti_tickets';

    $order_ids = $wpdb->get_col("SELECT DISTINCT order_id FROM $tickets_table");

    foreach ($order_ids as $order_id) {
        $order = wc_get_order($order_id);

        $tickets = $wpdb->get_results($wpdb->prepare(
            "SELECT id, holder_name, status FROM $tickets_table WHERE order_id = %d",
            $order_id
        ), ARRAY_A);

        foreach ($tickets as $ticket) {
            // Never overwrite terminal states set deliberately.
            if (isset($ticket['status']) && in_array($ticket['status'], array('checked_in', 'cancelled', 'refunded'), true)) {
                continue;
            }
            $status = rt_event_manager_determine_ticket_status($order, $ticket['holder_name']);
            $wpdb->update(
                $tickets_table,
                array('status' => $status),
                array('id' => absint($ticket['id'])),
                array('%s'),
                array('%d')
            );
        }
    }
}

/**
 * Determine the ticket status based on order status and holder assignment.
 *
 * @param WC_Order|false $order       Order object or false if not found
 * @param string         $holder_name Ticket holder name
 * @return string "valid", "draft", "invalid", or "checked_in"
 */
function rt_event_manager_determine_ticket_status($order, $holder_name) {
    if (!$order) {
        return 'invalid';
    }

    $order_status = $order->get_status();

    // Cancelled, failed, refunded, trashed, pending payment = invalid
    if (in_array($order_status, array('cancelled', 'failed', 'refunded', 'trash', 'pending'), true)) {
        return 'invalid';
    }

    // Ticket has no holder = draft
    if (empty(trim($holder_name))) {
        return 'draft';
    }

    // Completed + assigned = valid
    if ($order_status === 'completed' && !empty(trim($holder_name))) {
        return 'valid';
    }

    // All other statuses (on-hold, processing, confirmed, etc.) with a holder = draft
    return 'draft';
}

/**
 * Notify the wallet services that a ticket changed so saved passes update.
 * Safe to call with a ticket array or id; no-ops when nothing is configured.
 *
 * @param array|int $ticket
 */
function rt_event_manager_notify_wallets($ticket) {
    if (!is_array($ticket)) {
        $ticket = RT_Event_Manager::get_ticket_by_id(absint($ticket));
    }
    if (!$ticket) {
        return;
    }
    // Only event/minor tickets carry a wallet pass. A pretour/day tour is shown
    // on its host's pass, so a change to a tour must refresh the HOST's pass.
    $kind = RT_Event_Manager::get_ticket_kind($ticket);
    if (in_array($kind, array('pretour', 'daytour'), true) && absint($ticket['parent_ticket_id'])) {
        $host = RT_Event_Manager::get_ticket_by_id(absint($ticket['parent_ticket_id']));
        if (!$host) {
            return;
        }
        $ticket = $host;
    }
    if (class_exists('RT_Event_Manager_Apple_Wallet') && RT_Event_Manager_Apple_Wallet::is_configured()) {
        RT_Event_Manager_Apple_Wallet::instance()->notify($ticket);
    }
    if (class_exists('RT_Event_Manager_Google_Wallet') && RT_Event_Manager_Google_Wallet::is_configured()) {
        RT_Event_Manager_Google_Wallet::instance()->notify($ticket);
    }
}

/**
 * Activation hook
 */
function rt_event_manager_activate() {
    rt_event_manager_install_db();

    // Set up the merged .WORLD SSO module: create its OAuth clients table and
    // seed the default .WORLD providers. (check_upgrade() also self-heals this
    // on admin_init, but do it immediately on activation.)
    if (class_exists('Multi_OAuth_SSO')) {
        Multi_OAuth_SSO::get_instance()->activate();
    }

    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'rt_event_manager_activate');

/**
 * Deactivation hook
 */
function rt_event_manager_deactivate() {
    // Flush rewrite rules on deactivation
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'rt_event_manager_deactivate');

/**
 * Declare HPOS compatibility
 */
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});
