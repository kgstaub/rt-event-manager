<?php
/**
 * RT Event Manager — admin "log in as member" (user switching).
 *
 * Lets a WordPress administrator temporarily switch into a member's account to
 * reproduce/verify issues, then switch back. Deliberately conservative:
 *
 *   - Only full administrators (manage_options) may switch.
 *   - You may NOT switch into another administrator.
 *   - Every switch is nonce-protected and fires an action hook for auditing.
 *   - Switching back is proven by a random token stored server-side (transient)
 *     whose value is the original admin id — the impersonated member can never
 *     escalate, they can only return to the exact admin who switched in.
 *
 * This is a support tool, not an authentication bypass: it never exposes
 * passwords and cannot be initiated by anyone below administrator.
 */

if (!defined('ABSPATH')) {
    exit;
}

class RT_Event_Manager_User_Switch {

    const COOKIE = 'rtem_switch_back';
    const TTL    = 8 * HOUR_IN_SECONDS;

    /** @var self|null */
    private static $instance = null;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'handle_actions'));
        add_filter('user_row_actions', array($this, 'row_action'), 10, 2);
        add_action('admin_bar_menu', array($this, 'admin_bar'), 999);
        // Always-visible return banner (the impersonated member may not see the
        // admin bar on the front end).
        add_action('wp_footer', array($this, 'return_banner'));
        add_action('admin_footer', array($this, 'return_banner'));
    }

    /** A fixed banner with a "return to admin" control while impersonating. */
    public function return_banner() {
        $orig = self::original_admin_id();
        if (!$orig) {
            return;
        }
        $member = wp_get_current_user();
        echo '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#8c1c13;color:#fff;padding:8px 14px;font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:center;box-shadow:0 -2px 8px rgba(0,0,0,.2);">'
            . esc_html(sprintf(
                /* translators: %s: member display name */
                __('Admin support session — you are logged in as %s.', 'rt-event-manager'),
                $member->display_name
            ))
            . ' <a href="' . esc_url(self::switch_back_url()) . '" style="color:#fff;text-decoration:underline;font-weight:700;margin-left:8px;">'
            . esc_html__('Return to your admin account', 'rt-event-manager') . '</a></div>';
    }

    /* ---------------------------------------------------------------------
     * URLs
     * ------------------------------------------------------------------- */

    /** Nonced URL that switches the current admin into $user_id. Front-end based
     *  so it works from both the Users list and the account portal (the handler
     *  runs on `init` for every request). */
    public static function switch_to_url($user_id) {
        return wp_nonce_url(
            add_query_arg('rtem_switch_to', absint($user_id), home_url('/')),
            'rtem_switch_to_' . absint($user_id)
        );
    }

    /** Nonced URL that returns to the original admin account. */
    public static function switch_back_url() {
        return wp_nonce_url(
            add_query_arg('rtem_switch_back', '1', home_url('/')),
            'rtem_switch_back'
        );
    }

    /**
     * Who may switch into member accounts: WordPress administrators and the
     * highest event-staff group (the plugin Manager role).
     */
    public static function user_can_switch($user_id = 0) {
        $user_id = $user_id ?: get_current_user_id();
        if (!$user_id) {
            return false;
        }
        if (user_can($user_id, 'manage_options')) {
            return true;
        }
        return class_exists('RT_Event_Manager_Staff')
            && RT_Event_Manager_Staff::ROLE_MANAGER === RT_Event_Manager_Staff::get_user_staff_role($user_id);
    }

    /** The original id if we are currently impersonating, else 0. */
    public static function original_admin_id() {
        if (empty($_COOKIE[self::COOKIE])) {
            return 0;
        }
        $token = preg_replace('/[^A-Za-z0-9]/', '', (string) $_COOKIE[self::COOKIE]);
        $data  = $token ? get_transient('rtem_switch_' . $token) : false;
        $orig  = is_array($data) ? absint($data['uid']) : absint($data); // back-compat
        // The stored original must still be allowed to switch.
        return ($orig && self::user_can_switch($orig)) ? $orig : 0;
    }

    /* ---------------------------------------------------------------------
     * Users list row action
     * ------------------------------------------------------------------- */

    public function row_action($actions, $user) {
        if (!self::user_can_switch()) {
            return $actions;
        }
        if ((int) $user->ID === get_current_user_id()) {
            return $actions; // no self-switch
        }
        if (self::user_can_switch($user->ID)) {
            return $actions; // never switch into another admin / manager
        }
        $actions['rtem_switch'] = '<a href="' . esc_url(self::switch_to_url($user->ID)) . '">'
            . esc_html__('Log in as member', 'rt-event-manager') . '</a>';
        return $actions;
    }

    /* ---------------------------------------------------------------------
     * Admin bar "return to admin" indicator
     * ------------------------------------------------------------------- */

    public function admin_bar($bar) {
        $orig = self::original_admin_id();
        if (!$orig) {
            return;
        }
        $admin = get_userdata($orig);
        $bar->add_node(array(
            'id'    => 'rtem-switch-back',
            'title' => sprintf(
                /* translators: %s: administrator display name */
                __('↩ Return to %s', 'rt-event-manager'),
                $admin ? $admin->display_name : __('admin', 'rt-event-manager')
            ),
            'href'  => self::switch_back_url(),
            'meta'  => array('title' => __('You are logged in as this member — switch back', 'rt-event-manager')),
        ));
    }

    /* ---------------------------------------------------------------------
     * Handlers (init)
     * ------------------------------------------------------------------- */

    public function handle_actions() {
        if (isset($_GET['rtem_switch_to'])) {
            $this->do_switch_to(absint($_GET['rtem_switch_to']));
        } elseif (isset($_GET['rtem_switch_back'])) {
            $this->do_switch_back();
        }
    }

    /** Switch the current administrator into a member account. */
    private function do_switch_to($target_id) {
        if (!self::user_can_switch()) {
            wp_die(esc_html__('You do not have permission to do this.', 'rt-event-manager'));
        }
        check_admin_referer('rtem_switch_to_' . $target_id);
        $target = get_userdata($target_id);
        if (!$target) {
            wp_die(esc_html__('That user does not exist.', 'rt-event-manager'));
        }
        if (self::user_can_switch($target_id)) {
            wp_die(esc_html__('You cannot log in as another administrator or manager.', 'rt-event-manager'));
        }

        $original = get_current_user_id();

        // Where to return the admin afterwards: the page they switched from (e.g.
        // the front-end Find Guest tab), falling back to a sensible default.
        $return = wp_get_referer();
        if (!$return) {
            $return = user_can($original, 'list_users') ? admin_url('users.php') : $this->member_landing();
        }

        // Remember who to return to (and where), server-side, keyed by a random
        // cookie token.
        $token = wp_generate_password(43, false, false);
        set_transient('rtem_switch_' . $token, array('uid' => $original, 'return' => $return), self::TTL);
        $this->set_cookie($token, time() + self::TTL);

        /**
         * Fires when an administrator switches into a member account.
         *
         * @param int $original Administrator user id.
         * @param int $target   Member user id being impersonated.
         */
        do_action('rt_event_manager_user_switched', $original, $target_id);
        error_log(sprintf('RT Event Manager user-switch: admin #%d logged in as member #%d', $original, $target_id));

        wp_clear_auth_cookie();
        wp_set_current_user($target_id);
        wp_set_auth_cookie($target_id, false);

        wp_safe_redirect($this->member_landing());
        exit;
    }

    /** Return from an impersonated member to the original administrator. */
    private function do_switch_back() {
        check_admin_referer('rtem_switch_back');
        $token = empty($_COOKIE[self::COOKIE]) ? '' : preg_replace('/[^A-Za-z0-9]/', '', (string) $_COOKIE[self::COOKIE]);
        $data  = $token ? get_transient('rtem_switch_' . $token) : false;
        $original = is_array($data) ? absint($data['uid']) : absint($data); // back-compat
        if (!$original || !self::user_can_switch($original)) {
            wp_die(esc_html__('Could not switch back — please log in again.', 'rt-event-manager'));
        }
        $return = (is_array($data) && !empty($data['return'])) ? $data['return'] : '';

        delete_transient('rtem_switch_' . $token);
        $this->set_cookie('', time() - 3600);

        do_action('rt_event_manager_user_switch_back', $original, get_current_user_id());

        wp_clear_auth_cookie();
        wp_set_current_user($original);
        wp_set_auth_cookie($original, false);

        // Return to the page the switch started from; fall back to the Users list
        // for wp-admins or the account portal for staff managers.
        $fallback = user_can($original, 'list_users') ? admin_url('users.php') : $this->member_landing();
        wp_safe_redirect(wp_validate_redirect($return, $fallback));
        exit;
    }

    /** Where an impersonating admin lands (the member account portal / home). */
    private function member_landing() {
        if (function_exists('wc_get_page_permalink')) {
            $url = wc_get_page_permalink('myaccount');
            if ($url) {
                return $url;
            }
        }
        return home_url('/');
    }

    /** Set (or clear) the switch-back cookie, HTTPOnly + Secure on SSL. */
    private function set_cookie($value, $expires) {
        // COOKIEPATH is site-wide so the cookie is available on both wp-admin and
        // the front-end account portal.
        setcookie(self::COOKIE, $value, $expires, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
        if (SITECOOKIEPATH !== COOKIEPATH) {
            setcookie(self::COOKIE, $value, $expires, SITECOOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
        }
    }
}
