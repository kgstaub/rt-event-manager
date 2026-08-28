<?php
/**
 * Event Staff module.
 *
 * Staff tickets are ticket rows with kind = 'staff' and no order (order_id = 0),
 * assigned by an administrator to a member account. Each carries a staff role
 * that grants event-management capabilities (check-in, open/close, profiles).
 *
 * Roles & capabilities:
 *   manager               — full access (everything below).
 *   registration_manager  — main-event check-in; view attendee profiles.
 *   event_operator        — pre/day-tour check-in; open/close events; view profiles.
 *   regular               — no management access.
 */

if (!defined('ABSPATH')) {
    exit;
}

class RT_Event_Manager_Staff {

    /** Role slugs. */
    const ROLE_MANAGER      = 'manager';
    const ROLE_REG_MANAGER  = 'registration_manager';
    const ROLE_OPERATOR     = 'event_operator';
    const ROLE_REGULAR      = 'regular';

    /** Capability slugs. */
    const CAP_MANAGE        = 'manage_staff';       // assign staff, full admin
    const CAP_CHECKIN_MAIN  = 'checkin_main';       // scan main-event check-ins
    const CAP_CHECKIN_TOURS = 'checkin_tours';      // scan pre/day-tour check-ins
    const CAP_OPEN_CLOSE    = 'open_close_event';   // open/close a check-in session
    const CAP_VIEW_PROFILES = 'view_profiles';      // see attendee/participant profiles

    /** Tour duty slugs (a staff member attached to a pre/day tour). */
    const DUTY_GUIDE      = 'guide';
    const DUTY_SUPERVISOR = 'supervisor';

    /** Menu slug. */
    const PAGE_SLUG = 'rt-event-manager-staff';

    protected static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'), 23);
        add_action('admin_init', array($this, 'handle_post'));
    }

    /* ------------------------------------------------------------------ *
     * Roles & capabilities
     * ------------------------------------------------------------------ */

    /** Role slug => human label. Ordered high → low privilege. */
    public static function roles() {
        return array(
            self::ROLE_MANAGER     => __('Manager (full access)', 'rt-event-manager'),
            self::ROLE_REG_MANAGER => __('Registration manager', 'rt-event-manager'),
            self::ROLE_OPERATOR    => __('Event operator', 'rt-event-manager'),
            self::ROLE_REGULAR     => __('Regular staff (no access)', 'rt-event-manager'),
        );
    }

    public static function role_label($role) {
        $roles = self::roles();
        return isset($roles[$role]) ? $roles[$role] : __('Regular staff (no access)', 'rt-event-manager');
    }

    /**
     * The label to show for a staff ticket's role: an admin-set custom display
     * name (stored in the ticket's rti_club column) if present, else the role's
     * standard label.
     *
     * @param array $ticket Staff ticket row.
     * @return string
     */
    public static function display_role($ticket) {
        $custom = isset($ticket['rti_club']) ? trim((string) $ticket['rti_club']) : '';
        if ('' !== $custom) {
            return $custom;
        }
        return self::role_label(isset($ticket['staff_role']) ? $ticket['staff_role'] : '');
    }

    /** Which capabilities each role grants. */
    public static function caps_for_role($role) {
        switch ($role) {
            case self::ROLE_MANAGER:
                return array(
                    self::CAP_MANAGE        => true,
                    self::CAP_CHECKIN_MAIN  => true,
                    self::CAP_CHECKIN_TOURS => true,
                    self::CAP_OPEN_CLOSE    => true,
                    self::CAP_VIEW_PROFILES => true,
                );
            case self::ROLE_REG_MANAGER:
                return array(
                    self::CAP_CHECKIN_MAIN  => true,
                    self::CAP_VIEW_PROFILES => true,
                );
            case self::ROLE_OPERATOR:
                return array(
                    self::CAP_CHECKIN_TOURS => true,
                    self::CAP_OPEN_CLOSE    => true,
                    self::CAP_VIEW_PROFILES => true,
                );
            case self::ROLE_REGULAR:
            default:
                return array();
        }
    }

    /**
     * The effective staff role for a user — the highest-privilege role across
     * their staff tickets, or '' if they have none.
     *
     * @param int $user_id
     * @return string
     */
    public static function get_user_staff_role($user_id) {
        $user_id = absint($user_id);
        if (!$user_id) {
            return '';
        }
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $roles = $wpdb->get_col($wpdb->prepare(
            "SELECT staff_role FROM $table WHERE ticket_kind = 'staff' AND owner_user_id = %d",
            $user_id
        ));
        $priority = array_keys(self::roles()); // high → low
        foreach ($priority as $r) {
            if (in_array($r, $roles, true)) {
                return $r;
            }
        }
        return '';
    }

    /**
     * Whether a user may perform a staff capability. WordPress shop managers /
     * admins implicitly have every capability.
     *
     * @param int    $user_id
     * @param string $cap  One of the CAP_* constants.
     * @return bool
     */
    public static function user_can_staff($user_id, $cap) {
        $user_id = absint($user_id);
        if (!$user_id) {
            return false;
        }
        if (user_can($user_id, 'manage_woocommerce') || user_can($user_id, 'manage_options')) {
            return true;
        }
        $caps = self::caps_for_role(self::get_user_staff_role($user_id));
        return !empty($caps[$cap]);
    }

    /** Convenience: is this user event staff at all (any assigned role)? */
    public static function is_staff($user_id) {
        return '' !== self::get_user_staff_role($user_id);
    }

    /* ------------------------------------------------------------------ *
     * Staff ticket CRUD
     * ------------------------------------------------------------------ */

    /** All staff tickets, newest first, with the owner's user object attached. */
    public static function get_staff_tickets() {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $rows  = $wpdb->get_results("SELECT * FROM $table WHERE ticket_kind = 'staff' ORDER BY id DESC", ARRAY_A);
        return $rows ?: array();
    }

    /** The staff ticket row for a user, or null. */
    public static function get_staff_ticket_for_user($user_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE ticket_kind = 'staff' AND owner_user_id = %d ORDER BY id DESC LIMIT 1",
            absint($user_id)
        ), ARRAY_A);
        return $row ?: null;
    }

    /** Next free ticket_index in the order_id = 0 (no-order) namespace. */
    private static function next_staff_index() {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $max = (int) $wpdb->get_var("SELECT MAX(ticket_index) FROM $table WHERE order_id = 0");
        return $max + 1;
    }

    /**
     * Assign (or update) a staff ticket for a user. One staff ticket per user:
     * if one exists, its role/holder are updated in place.
     *
     * @param int    $user_id
     * @param string $role   A valid role slug.
     * @param string $holder Display name for the ticket (optional).
     * @return int|false Ticket id, or false on failure.
     */
    public static function assign($user_id, $role, $holder = '', $role_display = '') {
        global $wpdb;
        $user_id = absint($user_id);
        if (!$user_id || !array_key_exists($role, self::roles())) {
            return false;
        }
        $table = $wpdb->prefix . 'rti_tickets';

        if ('' === $holder) {
            $user = get_userdata($user_id);
            if ($user) {
                // Prefer the full name (first + last); fall back to display name.
                $full   = trim($user->first_name . ' ' . $user->last_name);
                $holder = ('' !== $full) ? $full : $user->display_name;
            }
        }
        // Custom role display name is stored in the (otherwise unused) rti_club.
        $role_display = sanitize_text_field($role_display);

        $existing = self::get_staff_ticket_for_user($user_id);
        if ($existing) {
            $wpdb->update(
                $table,
                array('staff_role' => $role, 'holder_name' => $holder, 'rti_club' => $role_display, 'status' => 'valid'),
                array('id' => absint($existing['id'])),
                array('%s', '%s', '%s', '%s'),
                array('%d')
            );
            return absint($existing['id']);
        }

        $ok = $wpdb->insert(
            $table,
            array(
                'order_id'      => 0,
                'product_id'    => 0,
                'ticket_kind'   => 'staff',
                'ticket_index'  => self::next_staff_index(),
                'holder_name'   => $holder,
                'rti_club'      => $role_display,
                'status'        => 'valid',
                'owner_user_id' => $user_id,
                'staff_role'    => $role,
            ),
            array('%d', '%d', '%s', '%d', '%s', '%s', '%s', '%d', '%s')
        );
        return $ok ? absint($wpdb->insert_id) : false;
    }

    /* ------------------------------------------------------------------ *
     * Tour duties — attach a pre/day tour to a staff ticket as guide/supervisor
     * ------------------------------------------------------------------ */

    public static function duties() {
        return array(
            self::DUTY_GUIDE      => __('Guide', 'rt-event-manager'),
            self::DUTY_SUPERVISOR => __('Supervisor', 'rt-event-manager'),
        );
    }

    public static function duty_label($duty) {
        $d = self::duties();
        return isset($d[$duty]) ? $d[$duty] : '';
    }

    /** Published pre/day-tour products, for the assignment picker. */
    public static function tour_products() {
        $cats = array_filter(array(
            RT_Event_Manager::get_pretour_category_id(),
            RT_Event_Manager::get_daytour_category_id(),
        ));
        if (empty($cats)) {
            return array();
        }
        $ids = get_posts(array(
            'post_type'      => 'product',
            'numberposts'    => -1,
            'post_status'    => 'publish',
            'fields'         => 'ids',
            'tax_query'      => array(array(
                'taxonomy' => 'product_cat',
                'field'    => 'term_id',
                'terms'    => $cats,
            )),
        ));
        $out = array();
        foreach ($ids as $pid) {
            $kind = RT_Event_Manager::get_ticket_kind_for_product($pid);
            if (!in_array($kind, array('pretour', 'daytour'), true)) {
                continue;
            }
            $p = function_exists('wc_get_product') ? wc_get_product($pid) : null;
            $out[] = array('id' => absint($pid), 'name' => $p ? RT_Event_Manager::product_title($p->get_id()) : ('#' . $pid), 'kind' => $kind);
        }
        usort($out, function ($a, $b) { return strcmp($a['name'], $b['name']); });
        return $out;
    }

    /**
     * Tour product ids a user guides / supervises (their own duty rows). Used to
     * scope which attendees an event guide may view.
     *
     * @param int $user_id
     * @return int[]
     */
    public static function operator_tour_products($user_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT product_id FROM $table WHERE owner_user_id = %d AND staff_role IN ('guide','supervisor') AND product_id > 0",
            absint($user_id)
        ));
        return array_map('absint', $ids);
    }

    /** The tour duties currently attached to a staff ticket. */
    public static function get_staff_tour_assignments($staff_ticket_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE parent_ticket_id = %d AND staff_role IN ('guide','supervisor') ORDER BY id ASC",
            absint($staff_ticket_id)
        ), ARRAY_A);
        return $rows ?: array();
    }

    /**
     * Attach a pre/day tour to a staff ticket as guide or supervisor. Creates a
     * tour ticket row parented to the staff ticket (so it shows on the staff
     * member's dashboard and in the tour's check-in roster).
     *
     * @return int|false Tour ticket id or false.
     */
    public static function assign_tour($staff_ticket_id, $product_id, $duty) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        $staff = RT_Event_Manager::get_ticket_by_id($staff_ticket_id);
        if (!$staff || 'staff' !== RT_Event_Manager::get_ticket_kind($staff)) {
            return false;
        }
        if (!array_key_exists($duty, self::duties())) {
            return false;
        }
        $kind = RT_Event_Manager::get_ticket_kind_for_product($product_id);
        if (!in_array($kind, array('pretour', 'daytour'), true)) {
            return false;
        }
        // One assignment per (staff, tour product) — update the duty if it exists.
        $dup = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE parent_ticket_id = %d AND product_id = %d AND staff_role IN ('guide','supervisor')",
            absint($staff_ticket_id), absint($product_id)
        ));
        if ($dup) {
            $wpdb->update($table, array('staff_role' => $duty), array('id' => absint($dup)), array('%s'), array('%d'));
            return absint($dup);
        }
        // A staff member cannot cover two tours whose times overlap.
        if (RT_Event_Manager::host_tour_overlap($staff_ticket_id, $product_id)) {
            return new WP_Error('overlap', __('That tour overlaps another duty already assigned to this staff member.', 'rt-event-manager'));
        }
        $ok = $wpdb->insert($table, array(
            'order_id'         => 0,
            'product_id'       => absint($product_id),
            'ticket_kind'      => $kind,
            'ticket_index'     => self::next_staff_index(),
            'parent_ticket_id' => absint($staff_ticket_id),
            'holder_name'      => $staff['holder_name'],
            'status'           => 'valid',
            'owner_user_id'    => absint($staff['owner_user_id']),
            'staff_role'       => $duty,
        ), array('%d', '%d', '%s', '%d', '%d', '%s', '%s', '%d', '%s'));
        return $ok ? absint($wpdb->insert_id) : false;
    }

    /** Remove a tour duty (only guide/supervisor tour rows). */
    public static function remove_tour($tour_ticket_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        return (bool) $wpdb->query($wpdb->prepare(
            "DELETE FROM $table WHERE id = %d AND staff_role IN ('guide','supervisor')",
            absint($tour_ticket_id)
        ));
    }

    /** Remove a staff ticket by id (with its tour duties). */
    public static function revoke($ticket_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'rti_tickets';
        // Drop any tour duties attached to this staff ticket first.
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $table WHERE parent_ticket_id = %d AND staff_role IN ('guide','supervisor')",
            absint($ticket_id)
        ));
        return (bool) $wpdb->delete(
            $table,
            array('id' => absint($ticket_id), 'ticket_kind' => 'staff'),
            array('%d', '%s')
        );
    }

    /* ------------------------------------------------------------------ *
     * Admin page (RT Event → Event Staff)
     * ------------------------------------------------------------------ */

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Event Staff', 'rt-event-manager'),
            __('Event Staff', 'rt-event-manager'),
            'manage_woocommerce',
            self::PAGE_SLUG,
            array($this, 'render_page')
        );
    }

    /** Process assign / revoke on admin_init (Post/Redirect/Get). */
    public function handle_post() {
        if (!is_admin() || !current_user_can('manage_woocommerce')) {
            return;
        }

        // Assign / update.
        if (isset($_POST['rti_staff_assign'])) {
            check_admin_referer('rti_staff_assign');
            $ident = trim((string) wp_unslash($_POST['staff_account'] ?? ''));
            $role  = sanitize_key(wp_unslash($_POST['staff_role'] ?? ''));
            $name  = sanitize_text_field(wp_unslash($_POST['staff_name'] ?? ''));
            $rlbl  = sanitize_text_field(wp_unslash($_POST['staff_role_display'] ?? ''));

            $user = self::resolve_user($ident);
            if (!$user) {
                RT_Event_Manager::push_admin_notice(
                    sprintf(__('No account found for "%s". Enter an existing account\'s email, username or ID.', 'rt-event-manager'), $ident),
                    'error'
                );
            } elseif (!array_key_exists($role, self::roles())) {
                RT_Event_Manager::push_admin_notice(__('Please choose a staff role.', 'rt-event-manager'), 'error');
            } else {
                $id = self::assign($user->ID, $role, $name, $rlbl);
                if ($id) {
                    RT_Event_Manager::push_admin_notice(sprintf(
                        __('%1$s is now %2$s.', 'rt-event-manager'),
                        $user->display_name,
                        self::role_label($role)
                    ), 'success');
                } else {
                    RT_Event_Manager::push_admin_notice(__('Could not assign the staff ticket.', 'rt-event-manager'), 'error');
                }
            }
            $this->redirect();
        }

        // Revoke.
        if (isset($_POST['rti_staff_revoke'])) {
            check_admin_referer('rti_staff_revoke');
            $tid = absint($_POST['staff_ticket_id'] ?? 0);
            if ($tid && self::revoke($tid)) {
                RT_Event_Manager::push_admin_notice(__('Staff ticket revoked.', 'rt-event-manager'), 'success');
            }
            $this->redirect();
        }

        // Assign a tour duty (guide / supervisor).
        if (isset($_POST['rti_staff_tour_assign'])) {
            check_admin_referer('rti_staff_tour_assign');
            $sid  = absint($_POST['staff_ticket_id'] ?? 0);
            $pid  = absint($_POST['tour_product'] ?? 0);
            $duty = sanitize_key(wp_unslash($_POST['tour_duty'] ?? ''));
            $res  = self::assign_tour($sid, $pid, $duty);
            if (is_wp_error($res)) {
                RT_Event_Manager::push_admin_notice($res->get_error_message(), 'error');
            } elseif ($res) {
                RT_Event_Manager::push_admin_notice(__('Tour duty assigned.', 'rt-event-manager'), 'success');
            } else {
                RT_Event_Manager::push_admin_notice(__('Could not assign that tour duty (pick a pre/day tour and a duty).', 'rt-event-manager'), 'error');
            }
            $this->redirect();
        }

        // Remove a tour duty.
        if (isset($_POST['rti_staff_tour_remove'])) {
            check_admin_referer('rti_staff_tour_remove');
            $tid = absint($_POST['tour_ticket_id'] ?? 0);
            if ($tid && self::remove_tour($tid)) {
                RT_Event_Manager::push_admin_notice(__('Tour duty removed.', 'rt-event-manager'), 'success');
            }
            $this->redirect();
        }
    }

    private function redirect() {
        wp_safe_redirect(add_query_arg('page', self::PAGE_SLUG, admin_url('admin.php')));
        exit;
    }

    /** Resolve an account by email, username or numeric ID. */
    private static function resolve_user($ident) {
        $ident = trim($ident);
        if ('' === $ident) {
            return false;
        }
        if (is_numeric($ident)) {
            $u = get_user_by('id', absint($ident));
            if ($u) {
                return $u;
            }
        }
        if (is_email($ident)) {
            $u = get_user_by('email', $ident);
            if ($u) {
                return $u;
            }
        }
        return get_user_by('login', $ident) ?: false;
    }

    public function render_page() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }

        echo '<div class="wrap"><h1>' . esc_html__('Event Staff', 'rt-event-manager') . '</h1>';
        if (method_exists('RT_Event_Manager', 'flush_admin_notices')) {
            RT_Event_Manager::flush_admin_notices();
        }
        echo '<p class="description">' . esc_html__('Assign staff tickets to member accounts and set each person\'s access level. Staff tickets appear in the member\'s account like an event ticket (with a QR for check-in).', 'rt-event-manager') . '</p>';

        // --- Role reference ---
        echo '<h2>' . esc_html__('Roles', 'rt-event-manager') . '</h2>';
        echo '<ul style="list-style:disc;margin-left:20px;max-width:720px;">';
        echo '<li><strong>' . esc_html__('Manager', 'rt-event-manager') . '</strong> — ' . esc_html__('full access to every staff function.', 'rt-event-manager') . '</li>';
        echo '<li><strong>' . esc_html__('Registration manager', 'rt-event-manager') . '</strong> — ' . esc_html__('manage main-event check-ins and view attendee profiles.', 'rt-event-manager') . '</li>';
        echo '<li><strong>' . esc_html__('Event operator', 'rt-event-manager') . '</strong> — ' . esc_html__('manage pre/day-tour check-ins, open and close events, and view participant profiles.', 'rt-event-manager') . '</li>';
        echo '<li><strong>' . esc_html__('Regular staff', 'rt-event-manager') . '</strong> — ' . esc_html__('a staff ticket with no management access.', 'rt-event-manager') . '</li>';
        echo '</ul>';

        // --- Assign form ---
        echo '<h2>' . esc_html__('Assign a staff ticket', 'rt-event-manager') . '</h2>';
        echo '<form method="post" style="margin:12px 0 24px;padding:16px;background:#fff;border:1px solid #ccd0d4;max-width:640px;">';
        wp_nonce_field('rti_staff_assign');
        echo '<table class="form-table" role="presentation">';
        echo '<tr><th scope="row"><label for="staff_account">' . esc_html__('Account', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="text" name="staff_account" id="staff_account" class="regular-text" placeholder="' . esc_attr__('email, username or user ID', 'rt-event-manager') . '" required />';
        echo '<p class="description">' . esc_html__('The member account to make staff. If they already have a staff ticket, its role is updated.', 'rt-event-manager') . '</p></td></tr>';
        echo '<tr><th scope="row"><label for="staff_role">' . esc_html__('Role', 'rt-event-manager') . '</label></th><td><select name="staff_role" id="staff_role">';
        foreach (self::roles() as $slug => $label) {
            echo '<option value="' . esc_attr($slug) . '">' . esc_html($label) . '</option>';
        }
        echo '</select></td></tr>';
        echo '<tr><th scope="row"><label for="staff_role_display">' . esc_html__('Role label (optional)', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="text" name="staff_role_display" id="staff_role_display" class="regular-text" placeholder="' . esc_attr__('e.g. Event Director, Head of Registration', 'rt-event-manager') . '" />';
        echo '<p class="description">' . esc_html__('Overrides the role name shown on the ticket and wallet pass. The access level still follows the Role above.', 'rt-event-manager') . '</p></td></tr>';
        echo '<tr><th scope="row"><label for="staff_name">' . esc_html__('Display name', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="text" name="staff_name" id="staff_name" class="regular-text" placeholder="' . esc_attr__('(defaults to the account name)', 'rt-event-manager') . '" /></td></tr>';
        echo '</table>';
        echo '<p><button type="submit" name="rti_staff_assign" value="1" class="button button-primary">' . esc_html__('Assign staff ticket', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        // --- Existing staff ---
        echo '<h2>' . esc_html__('Current staff', 'rt-event-manager') . '</h2>';
        $rows = self::get_staff_tickets();
        if (empty($rows)) {
            echo '<p>' . esc_html__('No staff assigned yet.', 'rt-event-manager') . '</p>';
        } else {
            $tour_products = self::tour_products();
            $duties = self::duties();
            echo '<table class="wp-list-table widefat striped" style="max-width:1100px;">';
            echo '<thead><tr>';
            echo '<th>' . esc_html__('Name', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Account', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Role', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Tour duties', 'rt-event-manager') . '</th>';
            echo '<th>' . esc_html__('Actions', 'rt-event-manager') . '</th>';
            echo '</tr></thead><tbody>';
            foreach ($rows as $r) {
                $uid  = absint($r['owner_user_id']);
                $user = $uid ? get_userdata($uid) : null;
                echo '<tr>';
                echo '<td>' . esc_html($r['holder_name'] !== '' ? $r['holder_name'] : '—') . '</td>';
                echo '<td>' . ($user ? esc_html($user->user_email . ' (' . $user->user_login . ')') : esc_html__('(unknown account)', 'rt-event-manager')) . '</td>';
                $disp = self::display_role($r);
                $base = self::role_label($r['staff_role']);
                echo '<td>' . esc_html($disp) . ($disp !== $base ? ' <span class="description">(' . esc_html($base) . ')</span>' : '') . '</td>';

                // Tour duties: current list + an inline add form.
                echo '<td>';
                $assignments = self::get_staff_tour_assignments($r['id']);
                if ($assignments) {
                    echo '<ul style="margin:0 0 6px;padding:0;list-style:none;">';
                    foreach ($assignments as $a) {
                        $p = function_exists('wc_get_product') ? wc_get_product($a['product_id']) : null;
                        $pn = $p ? RT_Event_Manager::product_title($p->get_id()) : ('#' . absint($a['product_id']));
                        echo '<li style="margin:0 0 3px;">' . esc_html($pn) . ' <em>· ' . esc_html(self::duty_label($a['staff_role'])) . '</em> ';
                        echo '<form method="post" style="display:inline">';
                        wp_nonce_field('rti_staff_tour_remove');
                        echo '<input type="hidden" name="tour_ticket_id" value="' . esc_attr($a['id']) . '" />';
                        echo '<button type="submit" name="rti_staff_tour_remove" value="1" class="button-link button-link-delete" title="' . esc_attr__('Remove', 'rt-event-manager') . '">&times;</button>';
                        echo '</form></li>';
                    }
                    echo '</ul>';
                }
                if (!empty($tour_products)) {
                    echo '<form method="post" style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">';
                    wp_nonce_field('rti_staff_tour_assign');
                    echo '<input type="hidden" name="staff_ticket_id" value="' . esc_attr($r['id']) . '" />';
                    echo '<select name="tour_product">';
                    foreach ($tour_products as $tp) {
                        echo '<option value="' . esc_attr($tp['id']) . '">' . esc_html($tp['name']) . '</option>';
                    }
                    echo '</select>';
                    echo '<select name="tour_duty">';
                    foreach ($duties as $slug => $label) {
                        echo '<option value="' . esc_attr($slug) . '">' . esc_html($label) . '</option>';
                    }
                    echo '</select>';
                    echo '<button type="submit" name="rti_staff_tour_assign" value="1" class="button button-small">' . esc_html__('Add', 'rt-event-manager') . '</button>';
                    echo '</form>';
                } else {
                    echo '<span class="description">' . esc_html__('No tour products found.', 'rt-event-manager') . '</span>';
                }
                echo '</td>';

                echo '<td><form method="post" style="display:inline" onsubmit="return confirm(\'' . esc_js(__('Revoke this staff ticket?', 'rt-event-manager')) . '\');">';
                wp_nonce_field('rti_staff_revoke');
                echo '<input type="hidden" name="staff_ticket_id" value="' . esc_attr($r['id']) . '" />';
                echo '<button type="submit" name="rti_staff_revoke" value="1" class="button button-link-delete">' . esc_html__('Revoke', 'rt-event-manager') . '</button>';
                echo '</form></td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        }

        echo '</div>';
    }
}
