<?php
/**
 * RT Event Manager — Group Import.
 *
 * Imports a group of people (e.g. an international board) and gives each one
 * an account and a full event ticket, paid by a coupon so a proper order /
 * invoice exists. When they later sign in with .WORLD they land in that
 * account and see their ticket like any other member.
 *
 * Sources:
 * - .WORLD: an admin signs in to the .WORLD API (developer.roundtable.world)
 *   with their own .WORLD credentials, picks a family and level (international
 *   by default) and loads that level's board. The API token is kept encrypted
 *   in a short-lived per-admin transient; the password is never stored.
 * - Excel / CSV: an uploaded sheet (template downloadable from the page).
 *
 * Every source ends in the same preview: one row per person with a checkbox,
 * an editable email (the .WORLD API only returns emails members share) and the
 * account match (existing / new / already has a ticket). The admin chooses the
 * ticket product and coupon and imports the ticked rows.
 *
 * Each imported person gets: a WordPress account (or their existing one, found
 * by .WORLD ID, else email), a Completed WooCommerce order for the ticket with
 * the coupon applied, and the event ticket row. No emails are sent.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Group_Import {

    /** @var RT_Event_Manager_Group_Import|null */
    private static $instance = null;

    const PAGE_SLUG = 'rt-event-manager-group-import';
    const CAP       = 'manage_woocommerce';
    const NONCE     = 'rti_group_import';
    const API_PROD  = 'https://api.roundtable.world/v1/app/';
    const API_DEMO  = 'https://api.roundtable-demo.world/v1/app/';
    const TTL       = 7200; // token / preview lifetime (seconds)

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'), 61);
        add_action('admin_init', array($this, 'handle_post'));
        add_action('admin_post_rti_group_import_template', array($this, 'download_template'));
        add_action('admin_post_rti_group_invoice_pdf', array($this, 'download_invoice'));
        add_action('admin_init', array($this, 'maybe_fix_world_ids'));
        add_action('admin_init', array($this, 'maybe_flag_merge_refunds'));
    }

    /**
     * One-time clean-up (2.5.2): imports before 2.5.2 stored the .WORLD API's
     * family-level member ID as `world_id`, which is not the (club-level) ID
     * members sign in with. For accounts the import ticketed that have never
     * signed in with .WORLD, move it to `world_member_id` and clear it from
     * their tickets, so it can neither mismatch nor show a wrong member QR.
     */
    /**
     * One-time (2.5.3): flag Group Import orders refunded by an earlier merge
     * (before `_rti_merge_refunded` existed) so their tickets are hidden from
     * the kept account.
     */
    public function maybe_flag_merge_refunds() {
        if (get_option('rt_event_manager_gi_merge_flag_v1') || !function_exists('wc_get_orders')) {
            return;
        }
        update_option('rt_event_manager_gi_merge_flag_v1', 1, false);
        $orders = wc_get_orders(array(
            'status'     => array('refunded'),
            'limit'      => -1,
            'meta_key'   => '_rti_group_import',
            'meta_compare' => 'EXISTS',
        ));
        foreach ((array) $orders as $order) {
            if ('yes' === $order->get_meta('_rti_merge_refunded')) {
                continue;
            }
            foreach (wc_get_order_notes(array('order_id' => $order->get_id())) as $note) {
                if (false !== strpos($note->content, 'already holds a ticket')) {
                    $order->update_meta_data('_rti_merge_refunded', 'yes');
                    $order->save();
                    break;
                }
            }
        }
    }

    public function maybe_fix_world_ids() {
        if ('yes' === get_option('rt_event_manager_gi_worldid_fix_v1') || !current_user_can(self::CAP)) {
            return;
        }
        global $wpdb;
        foreach (self::imported_customer_ids() as $uid) {
            if (self::signed_in_with_world($uid)) {
                continue;
            }
            $wid = (string) get_user_meta($uid, 'world_id', true);
            if ('' === $wid) {
                continue;
            }
            if ('' === (string) get_user_meta($uid, 'world_member_id', true)) {
                update_user_meta($uid, 'world_member_id', $wid);
            }
            delete_user_meta($uid, 'world_id');
            $wpdb->query($wpdb->prepare(
                "UPDATE {$wpdb->prefix}rti_tickets SET world_id = '', qr_code_url = '' WHERE owner_user_id = %d AND world_id = %s",
                $uid, $wid
            ));
        }
        update_option('rt_event_manager_gi_worldid_fix_v1', 'yes', false);
    }

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Group Import', 'rt-event-manager'),
            __('Group Import', 'rt-event-manager'),
            self::CAP,
            self::PAGE_SLUG,
            array($this, 'render_page')
        );
    }

    /* ---------------------------------------------------------------------
     * Helpers
     * ------------------------------------------------------------------- */

    /** Family id → short code (same as tickets / wallet passes). */
    public static function families() {
        return array(
            '0' => 'RT',
            '1' => 'C41',
            '2' => 'LC',
            '3' => 'AC',
            '4' => 'TC',
        );
    }

    private static function family_names() {
        return array(
            '0' => __('Round Table', 'rt-event-manager'),
            '1' => __('41 Club', 'rt-event-manager'),
            '2' => __('Ladies Circle', 'rt-event-manager'),
            '3' => __('Agora Club', 'rt-event-manager'),
            '4' => __('Tangent Club', 'rt-event-manager'),
        );
    }

    /** Parse "RT", "41", "C41", "Ladies Circle", "2" … into a family id ('' if unknown). */
    private static function parse_family($value) {
        $v = strtolower(trim((string) $value));
        if ('' === $v) {
            return '';
        }
        if (in_array($v, array('0', '1', '2', '3', '4'), true)) {
            return $v;
        }
        $map = array(
            'rt' => '0', 'round table' => '0', 'roundtable' => '0',
            'c41' => '1', '41' => '1', '41 club' => '1', '41club' => '1', 'club 41' => '1',
            'lc' => '2', 'ladies circle' => '2', 'ladiescircle' => '2',
            'ac' => '3', 'agora' => '3', 'agora club' => '3',
            'tc' => '4', 'tangent' => '4', 'tangent club' => '4',
        );
        return isset($map[$v]) ? $map[$v] : '';
    }

    private static function parse_country($value) {
        $v = trim((string) $value);
        if ('' === $v || !function_exists('WC') || !WC()->countries) {
            return '';
        }
        $countries = WC()->countries->get_countries();
        $up = strtoupper($v);
        if (2 === strlen($up) && isset($countries[$up])) {
            return $up;
        }
        foreach ($countries as $code => $name) {
            if (0 === strcasecmp(html_entity_decode($name, ENT_QUOTES, 'UTF-8'), $v)) {
                return $code;
            }
        }
        return '';
    }

    private static function uid() {
        return get_current_user_id();
    }

    private function page_url($args = array()) {
        return add_query_arg(array_merge(array('page' => self::PAGE_SLUG), $args), admin_url('admin.php'));
    }

    private function redirect($args = array()) {
        wp_safe_redirect($this->page_url($args));
        exit;
    }

    private function flash($type, $message) {
        set_transient('rti_gi_flash_' . self::uid(), array('type' => $type, 'message' => $message), 120);
    }

    /* ---------------------------------------------------------------------
     * Per-admin state (preview rows, .WORLD session)
     * ------------------------------------------------------------------- */

    private function get_rows() {
        $rows = get_transient('rti_gi_rows_' . self::uid());
        return is_array($rows) ? $rows : array();
    }

    private function set_rows($rows, $source_label) {
        set_transient('rti_gi_rows_' . self::uid(), array_values($rows), self::TTL);
        set_transient('rti_gi_source_' . self::uid(), $source_label, self::TTL);
    }

    private function clear_rows() {
        delete_transient('rti_gi_rows_' . self::uid());
        delete_transient('rti_gi_source_' . self::uid());
    }

    private static function encrypt($plain) {
        return class_exists('RT_Event_Manager_Helpdesk') ? RT_Event_Manager_Helpdesk::encrypt($plain) : base64_encode($plain);
    }

    private static function decrypt($cipher) {
        return class_exists('RT_Event_Manager_Helpdesk') ? RT_Event_Manager_Helpdesk::decrypt($cipher) : base64_decode($cipher);
    }

    /** The admin's .WORLD API session: {token, base, name} or null. */
    private function world_session() {
        $raw = get_transient('rti_gi_world_' . self::uid());
        if (!$raw) {
            return null;
        }
        $data = json_decode((string) self::decrypt($raw), true);
        return (is_array($data) && !empty($data['token'])) ? $data : null;
    }

    private function set_world_session($data) {
        set_transient('rti_gi_world_' . self::uid(), self::encrypt(wp_json_encode($data)), self::TTL);
    }

    /* ---------------------------------------------------------------------
     * .WORLD API
     * ------------------------------------------------------------------- */

    /**
     * Call the .WORLD API. Returns decoded JSON or WP_Error.
     *
     * @param string     $method
     * @param string     $path   Relative path, must end with "/".
     * @param array|null $body
     * @param array|null $session {token, base}; null for unauthenticated calls.
     * @param string     $base   API base when no session is given.
     */
    private function api($method, $path, $body = null, $session = null, $base = '') {
        $base = $session ? $session['base'] : ($base ? $base : self::API_PROD);
        $args = array(
            'method'  => $method,
            'timeout' => 25,
            'headers' => array(
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ),
        );
        if ($session) {
            $args['headers']['Authorization'] = 'Token ' . $session['token'];
        }
        if (null !== $body) {
            $args['body'] = wp_json_encode($body);
        }
        $res = wp_remote_request($base . ltrim($path, '/'), $args);
        if (is_wp_error($res)) {
            return $res;
        }
        $code = (int) wp_remote_retrieve_response_code($res);
        $data = json_decode(wp_remote_retrieve_body($res), true);
        if ($code >= 200 && $code < 300) {
            return is_array($data) ? $data : array();
        }
        $msg = '';
        if (is_array($data)) {
            foreach (array('error_message', 'detail', 'error_code', 'message') as $k) {
                if (!empty($data[$k]) && is_string($data[$k])) {
                    $msg = $data[$k];
                    break;
                }
            }
        }
        if (429 === $code) {
            $msg = __('The .WORLD API rate limit was reached. Please wait a minute and try again.', 'rt-event-manager');
        } elseif (403 === $code && '' === $msg) {
            $msg = __('Access denied by .WORLD (your session may have expired, or you lack access to this level).', 'rt-event-manager');
        }
        $err_code = (is_array($data) && !empty($data['error_code'])) ? (string) $data['error_code'] : 'http_' . $code;
        return new WP_Error($err_code, '' !== $msg ? $msg : sprintf(__('.WORLD API error (HTTP %d).', 'rt-event-manager'), $code));
    }

    /** Families (top-level organisations) — cached per session. */
    private function world_families($session) {
        $key = 'rti_gi_fam_' . md5($session['base']);
        $cached = get_transient($key);
        if (is_array($cached)) {
            return $cached;
        }
        $res = $this->api('GET', 'directory/all-families/', null, $session);
        if (is_wp_error($res)) {
            return $res;
        }
        $list = isset($res['results']) && is_array($res['results']) ? $res['results'] : $res;
        set_transient($key, $list, HOUR_IN_SECONDS);
        return $list;
    }

    /** First non-empty scalar among $keys in $arr. */
    private static function pick($arr, $keys) {
        foreach ($keys as $k) {
            if (is_array($arr) && isset($arr[$k]) && is_scalar($arr[$k]) && '' !== trim((string) $arr[$k])) {
                return trim((string) $arr[$k]);
            }
        }
        return '';
    }

    /** Walk any nested profile data and collect values whose key matches. */
    private static function collect($data, $needle, &$out, $key = '') {
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                self::collect($v, $needle, $out, is_string($k) ? $k : $key);
            }
        } elseif (is_scalar($data) && '' !== trim((string) $data) && false !== stripos($key, $needle)) {
            $out[] = trim((string) $data);
        }
    }

    /** Normalise one board entry → [id, first, last, function, club, club_domain]. */
    private static function parse_board_entry($item) {
        $person = (isset($item['member']) && is_array($item['member'])) ? $item['member'] : $item;
        $function = '';
        foreach (array('function', 'function_name', 'role', 'title', 'position') as $k) {
            if (isset($item[$k])) {
                $function = is_array($item[$k]) ? self::pick($item[$k], array('name', 'title')) : trim((string) $item[$k]);
                if ('' !== $function) {
                    break;
                }
            }
        }
        $level = (isset($person['level']) && is_array($person['level'])) ? $person['level'] : array();
        $first = self::pick($person, array('first_name', 'firstname'));
        $last  = self::pick($person, array('last_name', 'lastname'));
        if ('' === $first && '' === $last) {
            $parts = preg_split('/\s+/', self::pick($person, array('name', 'full_name')), 2);
            $first = isset($parts[0]) ? $parts[0] : '';
            $last  = isset($parts[1]) ? $parts[1] : '';
        }
        return array(
            'world_id'    => self::pick($person, array('id', 'member_id', 'user_id')),
            'first_name'  => $first,
            'last_name'   => $last,
            'function'    => $function,
            'club'        => self::pick($level, array('name')),
            'club_domain' => self::pick($level, array('subdomain')),
            'path'        => self::pick($level, array('path')),
        );
    }

    /**
     * Association code from a .WORLD level path ("rt/be/92" → "be"). The
     * plugin derives the association label from this code (see
     * RT_Event_Manager::association_from_club()), as it does from a club
     * subdomain ("92-be") for members who signed in with .WORLD.
     */
    private static function code_from_path($path) {
        $parts = array_values(array_filter(explode('/', strtolower(trim((string) $path))), 'strlen'));
        return isset($parts[1]) ? $parts[1] : '';
    }

    /** A member's club level (name, subdomain, path) via the member search. */
    private function lookup_member_level($session, $world_id, $first, $last) {
        $query = trim($first . ' ' . $last);
        if ('' === $query) {
            return array();
        }
        $res = $this->api('POST', 'members/search/', array('query' => $query, 'order_by' => 'last_name'), $session);
        if (is_wp_error($res) || empty($res['results']) || !is_array($res['results'])) {
            return array();
        }
        foreach ($res['results'] as $m) {
            if (is_array($m) && isset($m['id']) && (string) $m['id'] === (string) $world_id && !empty($m['level']) && is_array($m['level'])) {
                return $m['level'];
            }
        }
        return array();
    }

    /** Whether the current admin has a live .WORLD API session (Group Import sign-in). */
    public function has_world_session() {
        return null !== $this->world_session();
    }

    /** Group Import page URL (for the .WORLD sign-in link). */
    public static function world_signin_url() {
        return add_query_arg(array('page' => self::PAGE_SLUG, 'source' => 'world'), admin_url('admin.php'));
    }

    /**
     * Find a member's association on .WORLD (for delegate requests): searches
     * the member directory by name and derives each match's association from
     * its club level. A match on the account's .WORLD ID is flagged exact.
     *
     * @param int $user_id
     * @return array[]|WP_Error Candidates { name, club, path, association, family, exact }.
     */
    public function world_lookup_association($user_id) {
        $session = $this->world_session();
        if (!$session) {
            return new WP_Error('no_session', __('Sign in to .WORLD on the Group Import page first.', 'rt-event-manager'));
        }
        $u = get_userdata($user_id);
        if (!$u) {
            return new WP_Error('no_user', __('Member not found.', 'rt-event-manager'));
        }
        $first = trim((string) $u->first_name);
        $last  = trim((string) $u->last_name);
        if ('' === $first && '' === $last) {
            $first = trim((string) $u->display_name);
        }
        $query = trim($first . ' ' . $last);
        if ('' === $query) {
            return new WP_Error('no_name', __('The account has no name to search for.', 'rt-event-manager'));
        }
        $res = $this->api('POST', 'members/search/', array('query' => $query, 'order_by' => 'last_name'), $session);
        if (is_wp_error($res)) {
            return $res;
        }
        $world_ids = array_filter(array(
            (string) get_user_meta($user_id, 'world_id', true),
            (string) get_user_meta($user_id, 'world_member_id', true),
        ), 'strlen');
        $user_fam = (string) get_user_meta($user_id, 'rti_family', true);
        $out = array();
        foreach ((isset($res['results']) && is_array($res['results'])) ? $res['results'] : array() as $m) {
            if (!is_array($m)) {
                continue;
            }
            $level  = (!empty($m['level']) && is_array($m['level'])) ? $m['level'] : array();
            $path   = self::pick($level, array('path'));
            $parts  = array_values(array_filter(explode('/', strtolower($path)), 'strlen'));
            $family = isset($parts[0]) ? self::parse_family($parts[0]) : '';
            if ('' === $family) {
                $family = $user_fam;
            }
            $domain = self::pick($level, array('subdomain'));
            if ('' === $domain) {
                $domain = self::code_from_path($path);
            }
            $assoc = RT_Event_Manager::association_from_club($domain, '' === $family ? 0 : (int) $family);
            $name  = trim(self::pick($m, array('first_name')) . ' ' . self::pick($m, array('last_name')));
            if ('' === $name) {
                $name = self::pick($m, array('name', 'full_name'));
            }
            $out[] = array(
                'name'        => $name,
                'club'        => self::pick($level, array('name')),
                'path'        => $path,
                'association' => $assoc,
                'family'      => $family,
                'exact'       => isset($m['id']) && in_array((string) $m['id'], $world_ids, true),
            );
        }
        // Exact .WORLD ID matches first, then the rest as returned.
        usort($out, function ($a, $b) {
            return (int) $b['exact'] - (int) $a['exact'];
        });
        return array_slice($out, 0, 10);
    }

    /**
     * Load a level's board from .WORLD into preview rows.
     *
     * @return array|WP_Error Rows.
     */
    /** Club label for an international board: "RTI Board", "41I Board", "LCI Board", … */
    public static function international_board_club($family) {
        $map = array('0' => 'RTI', '1' => '41I', '2' => 'LCI', '3' => 'ACI', '4' => 'TCI');
        $f   = (string) $family;
        return trim((isset($map[$f]) ? $map[$f] : '') . ' ' . __('Board', 'rt-event-manager'));
    }

    /** Whether a function title is a (sitting) President — not Vice / Past. */
    private static function is_president($function) {
        $f = strtolower((string) $function);
        return (bool) preg_match('/presid/u', $f)
            && !preg_match('/vice|past|former|immediate|ipp|ehemalig|alt|vize|vice-|deputy/u', $f);
    }

    /**
     * The President of each area below a level (areas are .WORLD levels with
     * sync_level 2 — their presidents sit on the area's own board, not on the
     * association board). Each entry is tagged with its area name.
     *
     * @return array Board entries.
     */
    private function area_president_entries($session, $level) {
        $out = array();
        foreach ((array) (isset($level['children']) ? $level['children'] : array()) as $child) {
            if (!is_array($child) || empty($child['id'])) {
                continue;
            }
            if (isset($child['sync_level']) && 2 !== (int) $child['sync_level']) {
                continue; // a club or another non-area level
            }
            $area = $this->api('GET', 'directory/' . absint($child['id']) . '/', null, $session);
            if (is_wp_error($area) || (isset($area['sync_level']) && 2 !== (int) $area['sync_level'])) {
                continue;
            }
            $area_name = isset($area['name']) ? (string) $area['name'] : (isset($child['name']) ? (string) $child['name'] : '');
            foreach ((array) (isset($area['board']) ? $area['board'] : array()) as $item) {
                if (!is_array($item)) {
                    continue;
                }
                $e = self::parse_board_entry($item);
                if (self::is_president($e['function'])) {
                    $item['_rti_area'] = $area_name;
                    $out[] = $item;
                }
            }
        }
        return $out;
    }

    private function world_board_rows($session, $level_id, $with_assistants, $with_area_presidents = false) {
        $level = $this->api('GET', 'directory/' . absint($level_id) . '/', null, $session);
        if (is_wp_error($level)) {
            return $level;
        }
        $family = isset($level['sync_family']) ? (string) absint($level['sync_family']) : '';
        // Loading a national (association) board: everyone in it — including the
        // area presidents below it — belongs to that association.
        $assoc_code = '';
        if (isset($level['sync_level']) && 3 === (int) $level['sync_level']) {
            $assoc_code = self::pick($level, array('subdomain'));
            if ('' === $assoc_code) {
                $assoc_code = self::code_from_path(self::pick($level, array('path')));
            }
        }
        // Loading an international (family-level) board: these members keep
        // their home association (derived from their club below), but their
        // club is "RTI Board" — locked so a later .WORLD sign-in does not
        // replace it with their home club.
        $is_international = isset($level['sync_level']) && 4 === (int) $level['sync_level'];
        $board_club       = $is_international ? self::international_board_club($family) : '';
        $board  = isset($level['board']) && is_array($level['board']) ? $level['board'] : array();
        if ($with_assistants && !empty($level['board_assistants']) && is_array($level['board_assistants'])) {
            $board = array_merge($board, $level['board_assistants']);
        }
        if ($with_area_presidents) {
            $board = array_merge($board, $this->area_president_entries($session, $level));
        }
        if (empty($board)) {
            return new WP_Error('empty', __('This level has no board members in .WORLD (or they are not visible to your account).', 'rt-event-manager'));
        }

        $rows = array();
        $seen = array();
        foreach ($board as $item) {
            if (!is_array($item)) {
                continue;
            }
            $e = self::parse_board_entry($item);
            if ('' === $e['world_id'] || isset($seen[$e['world_id']])) {
                continue;
            }
            if (!empty($item['_rti_area'])) {
                // Area president: label with the area ("President — Area 5").
                $e['function'] = trim(('' !== $e['function'] ? $e['function'] : __('President', 'rt-event-manager')) . ' — ' . $item['_rti_area']);
            }
            $seen[$e['world_id']] = true;

            // Profile: names, shared email / phone (privacy-filtered by .WORLD).
            $email      = '';
            $all_emails = array();
            $phone      = '';
            $profile = $this->api('GET', 'members/' . rawurlencode($e['world_id']) . '/', null, $session);
            if (!is_wp_error($profile) && is_array($profile)) {
                foreach ((array) (isset($profile['profile_categories']) ? $profile['profile_categories'] : array()) as $cat) {
                    $vals = isset($cat['values']) ? $cat['values'] : array();
                    if (isset($cat['code']) && 'personal' === $cat['code']) {
                        $e['first_name'] = self::pick($vals, array('first_name')) ?: $e['first_name'];
                        $e['last_name']  = self::pick($vals, array('last_name')) ?: $e['last_name'];
                    }
                }
                $found = array();
                self::collect($profile, 'email', $found);
                foreach ($found as $em) {
                    $em = strtolower(trim($em));
                    if (is_email($em) && !in_array($em, $all_emails, true)) {
                        $all_emails[] = $em;
                    }
                }
                // Prefer the email that already belongs to an account, then the
                // member's .world address (what .WORLD sign-in uses as the
                // username), else the first one.
                foreach ($all_emails as $em) {
                    if (self::user_by_email($em)) {
                        $email = $em;
                        break;
                    }
                }
                if ('' === $email) {
                    foreach ($all_emails as $em) {
                        if (self::is_world_address($em)) {
                            $email = $em;
                            break;
                        }
                    }
                }
                if ('' === $email && !empty($all_emails)) {
                    $email = $all_emails[0];
                }
                $phones = array();
                self::collect($profile, 'mobile', $phones);
                if (empty($phones)) {
                    self::collect($profile, 'phone', $phones);
                }
                foreach ($phones as $ph) {
                    if (preg_match('/\d{5,}/', preg_replace('/\s+/', '', $ph))) {
                        $phone = $ph;
                        break;
                    }
                }
            }

            // Club / association code: from the board entry, else the national
            // level being loaded, else the member's club via the member search.
            $club_domain = $e['club_domain'];
            if ('' === $club_domain && '' !== $e['path']) {
                $club_domain = self::code_from_path($e['path']);
            }
            if ('' === $club_domain && '' !== $assoc_code) {
                $club_domain = $assoc_code;
            }
            if ('' === $club_domain || '' === $e['club']) {
                $lvl = $this->lookup_member_level($session, $e['world_id'], $e['first_name'], $e['last_name']);
                if (!empty($lvl)) {
                    if ('' === $e['club']) {
                        $e['club'] = self::pick($lvl, array('name'));
                    }
                    if ('' === $club_domain) {
                        $club_domain = self::pick($lvl, array('subdomain'));
                        if ('' === $club_domain) {
                            $club_domain = self::code_from_path(self::pick($lvl, array('path')));
                        }
                    }
                }
            }

            $intl = $is_international && empty($item['_rti_area']);
            $rows[] = array(
                // The API returns the family-level account ID, which is NOT the
                // (club-level) .WORLD ID members sign in with — keep it apart.
                'world_id'        => '',
                'world_member_id' => $e['world_id'],
                'emails'          => $all_emails,
                'first_name'  => $e['first_name'],
                'last_name'   => $e['last_name'],
                'email'       => $email,
                'phone'       => $phone,
                'family'      => $family,
                'club'        => $intl ? $board_club : $e['club'],
                'club_domain' => $club_domain,
                'association' => '',
                'org_lock'    => $intl ? 1 : 0,
                'function'    => $e['function'],
                'country'     => '',
            );
        }
        return $rows;
    }

    /* ---------------------------------------------------------------------
     * Excel / CSV
     * ------------------------------------------------------------------- */

    private static function header_map() {
        return array(
            'first_name' => array('first name', 'firstname', 'first', 'vorname', 'prénom', 'prenom', 'given name'),
            'last_name'  => array('last name', 'lastname', 'last', 'surname', 'nachname', 'nom', 'family name'),
            'email'      => array('email', 'e-mail', 'mail', 'email address', 'e-mail address'),
            'world_id'   => array('.world id', 'world id', 'world_id', 'worldid', '.world', 'member id'),
            'family'     => array('family', 'organisation', 'organization', 'familie'),
            'club'       => array('club'),
            'association' => array('association', 'national association', 'verband', 'association nationale'),
            'function'   => array('function', 'role', 'position', 'funktion'),
            'phone'      => array('phone', 'mobile', 'telephone', 'telefon', 'phone number'),
            'country'    => array('country', 'land', 'pays'),
        );
    }

    /** @return array|WP_Error Rows parsed from an uploaded sheet. */
    private function excel_rows($file) {
        if (!class_exists('\PhpOffice\PhpSpreadsheet\IOFactory')) {
            return new WP_Error('lib', __('The spreadsheet library is missing (vendor/ not installed).', 'rt-event-manager'));
        }
        $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, array('xlsx', 'xls', 'csv'), true)) {
            return new WP_Error('type', __('Please upload an .xlsx, .xls or .csv file.', 'rt-event-manager'));
        }
        try {
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('csv' === $ext ? 'Csv' : ('xls' === $ext ? 'Xls' : 'Xlsx'));
            $reader->setReadDataOnly(true);
            $sheet = $reader->load($file['tmp_name'])->getActiveSheet()->toArray(null, true, true, false);
        } catch (\Throwable $e) {
            return new WP_Error('read', sprintf(__('Could not read the file: %s', 'rt-event-manager'), $e->getMessage()));
        }
        if (count($sheet) < 2) {
            return new WP_Error('empty', __('The file has no data rows.', 'rt-event-manager'));
        }

        // Map columns by header name.
        $cols = array();
        foreach ((array) $sheet[0] as $i => $h) {
            $h = strtolower(trim((string) $h));
            foreach (self::header_map() as $field => $aliases) {
                if (in_array($h, $aliases, true) && !isset($cols[$field])) {
                    $cols[$field] = $i;
                }
            }
        }
        if (!isset($cols['first_name'], $cols['last_name'], $cols['email'])) {
            return new WP_Error('headers', __('The first row must contain at least the columns "First name", "Last name" and "Email". Download the template for the expected layout.', 'rt-event-manager'));
        }

        $rows = array();
        for ($r = 1; $r < count($sheet); $r++) {
            $line = $sheet[$r];
            $get = function ($f) use ($cols, $line) {
                return isset($cols[$f], $line[$cols[$f]]) ? trim((string) $line[$cols[$f]]) : '';
            };
            if ('' === $get('first_name') . $get('last_name') . $get('email')) {
                continue; // blank line
            }
            $rows[] = array(
                'world_id'    => $get('world_id'),
                'first_name'  => $get('first_name'),
                'last_name'   => $get('last_name'),
                'email'       => sanitize_email($get('email')),
                'phone'       => $get('phone'),
                'family'      => self::parse_family($get('family')),
                'club'        => $get('club'),
                'club_domain' => '',
                'association' => $get('association'),
                'org_lock'    => preg_match('/\bboard\s*$/i', $get('club')) ? 1 : 0,
                'function'    => $get('function'),
                'country'     => self::parse_country($get('country')),
            );
        }
        return $rows;
    }

    public function download_template() {
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('Not allowed.', 'rt-event-manager'));
        }
        check_admin_referer(self::NONCE);
        if (!class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet')) {
            wp_die(esc_html__('The spreadsheet library is missing (vendor/ not installed).', 'rt-event-manager'));
        }
        $book  = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $book->getActiveSheet();
        $sheet->setTitle('Group import');
        $sheet->fromArray(array(
            array('First name', 'Last name', 'Email', '.WORLD ID', 'Family', 'Club', 'Association', 'Function', 'Phone', 'Country'),
            array('Jane', 'Example', 'jane@example.org', '', 'RT', 'RT 1 Example', 'RT Switzerland', 'President', '+41 79 000 00 00', 'CH'),
        ), null, 'A1');
        $sheet->getStyle('A1:J1')->getFont()->setBold(true);
        foreach (range('A', 'J') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        nocache_headers();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="group-import-template.xlsx"');
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($book);
        $writer->save('php://output');
        exit;
    }

    /* ---------------------------------------------------------------------
     * Account matching
     * ------------------------------------------------------------------- */

    /** A member's .WORLD address, e.g. first.last@34-ch.roundtable.world. */
    private static function is_world_address($email) {
        return (bool) preg_match('/@[^@\s]+\.world$/i', trim((string) $email));
    }

    /**
     * An account by login email, by username (.WORLD sign-in uses the member's
     * .world address as the username), else by billing email.
     */
    private static function user_by_email($email) {
        $email = trim((string) $email);
        if ('' === $email || !is_email($email)) {
            return null;
        }
        $u = get_user_by('email', $email);
        if ($u) {
            return $u;
        }
        $u = get_user_by('login', $email);
        if ($u) {
            return $u;
        }
        $ids = get_users(array('meta_key' => 'billing_email', 'meta_value' => $email, 'number' => 1, 'fields' => 'ID'));
        return !empty($ids) ? get_userdata((int) $ids[0]) : null;
    }

    private static function user_by_meta($key, $value) {
        if ('' === (string) $value) {
            return null;
        }
        $ids = get_users(array('meta_key' => $key, 'meta_value' => (string) $value, 'number' => 1, 'fields' => 'ID'));
        return !empty($ids) ? get_userdata((int) $ids[0]) : null;
    }

    /** Accounts with exactly this first + last name (case-insensitive). */
    private static function users_by_name($first, $last, $exclude = 0) {
        $first = trim((string) $first);
        $last  = trim((string) $last);
        if ('' === $first || '' === $last) {
            return array();
        }
        $ids = get_users(array(
            'meta_query' => array(
                'relation' => 'AND',
                array('key' => 'first_name', 'value' => $first),
                array('key' => 'last_name', 'value' => $last),
            ),
            'exclude' => $exclude ? array((int) $exclude) : array(),
            'number'  => 10,
            'fields'  => 'ID',
        ));
        return array_map('intval', (array) $ids);
    }

    /** Whether the account has ever signed in with .WORLD (SSO). */
    private static function signed_in_with_world($user_id) {
        return '' !== (string) get_user_meta($user_id, 'oauth_sso_provider', true);
    }

    /**
     * Best same-name account for a row that matched nothing by email: an
     * account that has signed in with .WORLD first, else any.
     */
    private static function name_match($row, $exclude = 0) {
        $ids = self::users_by_name(isset($row['first_name']) ? $row['first_name'] : '', isset($row['last_name']) ? $row['last_name'] : '', $exclude);
        foreach ($ids as $id) {
            if (self::signed_in_with_world($id)) {
                return get_userdata($id);
            }
        }
        return !empty($ids) ? get_userdata($ids[0]) : null;
    }

    /**
     * Existing user for a row. The .WORLD email is the unique key: the row's
     * email, then any other email .WORLD returned for the person; only then a
     * .WORLD ID given in a spreadsheet, and finally the .WORLD member ID an
     * earlier import stored.
     */
    private static function find_user($row) {
        $emails = array();
        if (!empty($row['email'])) {
            $emails[] = $row['email'];
        }
        foreach ((array) (isset($row['emails']) ? $row['emails'] : array()) as $em) {
            $emails[] = $em;
        }
        foreach (array_unique($emails) as $em) {
            $u = self::user_by_email($em);
            if ($u) {
                return $u;
            }
        }
        if (!empty($row['world_id'])) {
            $u = self::user_by_meta('world_id', $row['world_id']);
            if ($u) {
                return $u;
            }
        }
        if (!empty($row['world_member_id'])) {
            $u = self::user_by_meta('world_member_id', $row['world_member_id']);
            if ($u) {
                return $u;
            }
        }
        return null;
    }

    /* ---------------------------------------------------------------------
     * POST handling (Post/Redirect/Get)
     * ------------------------------------------------------------------- */

    public function handle_post() {
        if (empty($_POST['rti_gi_action']) || !isset($_GET['page']) || self::PAGE_SLUG !== $_GET['page']) {
            return;
        }
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('Not allowed.', 'rt-event-manager'));
        }
        check_admin_referer(self::NONCE);
        $action = sanitize_key(wp_unslash($_POST['rti_gi_action']));

        switch ($action) {
            case 'world_login':
                $this->post_world_login();
                break;
            case 'world_logout':
                delete_transient('rti_gi_world_' . self::uid());
                $this->flash('success', __('Signed out of .WORLD.', 'rt-event-manager'));
                $this->redirect(array('source' => 'world'));
                break;
            case 'world_board':
                $this->post_world_board();
                break;
            case 'excel_upload':
                $this->post_excel_upload();
                break;
            case 'import':
                $this->post_import();
                break;
            case 'clear':
                $this->clear_rows();
                $this->redirect();
                break;
            case 'merge':
                $this->post_merge();
                break;
            case 'invoice':
                $this->post_invoice();
                break;
            case 'refund_dup':
                $this->post_refund_duplicate();
                break;
        }
    }

    /* ---------------------------------------------------------------------
     * Duplicates created by earlier imports
     * ------------------------------------------------------------------- */

    /** Customers of Group Import orders (the accounts the import ticketed). */
    private static function imported_customer_ids() {
        if (!function_exists('wc_get_orders')) {
            return array();
        }
        $ids = wc_get_orders(array(
            'limit'      => -1,
            'return'     => 'ids',
            'meta_key'   => '_rti_group_import',
            'meta_compare' => 'EXISTS',
        ));
        $out = array();
        foreach ((array) $ids as $oid) {
            $o = wc_get_order($oid);
            if ($o && $o->get_customer_id()) {
                $out[(int) $o->get_customer_id()] = true;
            }
        }
        foreach (get_users(array('meta_key' => 'rti_group_import', 'meta_compare' => 'EXISTS', 'fields' => 'ID', 'number' => 2000)) as $uid) {
            $out[(int) $uid] = true;
        }
        return array_keys($out);
    }

    /**
     * Pairs [duplicate, existing]: an account ticketed by the Group Import that
     * has never signed in with .WORLD, and another account with the same name.
     */
    private static function duplicate_pairs() {
        $pairs = array();
        foreach (self::imported_customer_ids() as $dup) {
            if (self::signed_in_with_world($dup)) {
                continue;
            }
            $u = get_userdata($dup);
            if (!$u) {
                continue;
            }
            // Another account whose username is this account's email (the
            // member's .WORLD sign-in account, e.g. first.last@171-de.roundtable.world).
            $target = null;
            if (is_email($u->user_email)) {
                $by_login = get_user_by('login', $u->user_email);
                if ($by_login && (int) $by_login->ID !== (int) $dup) {
                    $target = $by_login;
                }
            }
            if (!$target) {
                $target = self::name_match(array('first_name' => $u->first_name, 'last_name' => $u->last_name), $dup);
            }
            if ($target) {
                $pairs[] = array('dup' => $u, 'target' => $target);
            }
        }
        return $pairs;
    }

    /** Holder name normalised for comparison (case, accents, spacing). */
    private static function norm_name($name) {
        $name = remove_accents(strtolower(trim((string) $name)));
        return preg_replace('/\s+/', ' ', $name);
    }

    /**
     * Group Import tickets that duplicate another live event ticket for the
     * same person (same holder name or .WORLD ID) — whichever accounts or
     * orders they sit on. Catches what the account-pair list cannot: the
     * person's own ticket bought on someone else's order, an imported account
     * that has since signed in, or both tickets on one account.
     *
     * @return array[] { import: ticket row, other: ticket row }
     */
    private static function duplicate_tickets() {
        global $wpdb;
        $import_orders = array();
        foreach ((array) wc_get_orders(array('limit' => -1, 'return' => 'ids', 'meta_key' => '_rti_group_import', 'meta_compare' => 'EXISTS')) as $oid) {
            $import_orders[(int) $oid] = true;
        }
        if (empty($import_orders)) {
            return array();
        }
        $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rti_tickets WHERE ticket_kind = 'event' AND status NOT IN ('refunded','cancelled','invalid')", ARRAY_A);
        $by_name  = array();
        $by_world = array();
        foreach ((array) $rows as $r) {
            $n = self::norm_name($r['holder_name']);
            if ('' !== $n) {
                $by_name[$n][] = $r;
            }
            $w = isset($r['world_id']) ? trim((string) $r['world_id']) : '';
            if ('' !== $w) {
                $by_world[$w][] = $r;
            }
        }
        $out  = array();
        $seen = array();
        foreach ((array) $rows as $r) {
            if (empty($import_orders[(int) $r['order_id']])) {
                continue;
            }
            $cands = array();
            $n = self::norm_name($r['holder_name']);
            if ('' !== $n && isset($by_name[$n])) {
                $cands = array_merge($cands, $by_name[$n]);
            }
            $w = isset($r['world_id']) ? trim((string) $r['world_id']) : '';
            if ('' !== $w && isset($by_world[$w])) {
                $cands = array_merge($cands, $by_world[$w]);
            }
            foreach ($cands as $c) {
                if ((int) $c['id'] === (int) $r['id'] || isset($seen[(int) $r['id']])) {
                    continue;
                }
                // Prefer pairing with a ticket that is NOT itself from an import.
                $other_is_import = !empty($import_orders[(int) $c['order_id']]);
                if ($other_is_import && (int) $c['id'] > (int) $r['id']) {
                    continue; // two imports: keep the older, report the newer one
                }
                $out[] = array('import' => $r, 'other' => $c);
                $seen[(int) $r['id']] = true;
            }
        }
        return $out;
    }

    /** Refund one duplicate Group Import ticket's order (keeps both accounts). */
    private function post_refund_duplicate() {
        $oid   = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;
        $keep  = isset($_POST['keep_ticket']) ? absint($_POST['keep_ticket']) : 0;
        $order = $oid ? wc_get_order($oid) : null;
        if (!$order || '' === (string) $order->get_meta('_rti_group_import')) {
            $this->flash('error', __('Only Group Import orders can be refunded here.', 'rt-event-manager'));
            $this->redirect(array('source' => 'merge'));
        }
        $kept = $keep ? RT_Event_Manager::get_ticket_by_id($keep) : null;
        if (!$kept || in_array($kept['status'], array('refunded', 'cancelled', 'invalid'), true)) {
            $this->flash('error', __('The ticket to keep is no longer active — nothing was refunded.', 'rt-event-manager'));
            $this->redirect(array('source' => 'merge'));
        }
        $this->mute_emails(true);
        $this->refund_import_order($order, sprintf(
            /* translators: 1: kept ticket number */
            __('Duplicate of event ticket %s, which already holds a ticket — Group Import ticket refunded.', 'rt-event-manager'),
            '#' . absint($kept['order_id']) . ' · ' . (absint($kept['ticket_index']) + 1)
        ));
        $this->mute_emails(false);
        $this->flash('success', sprintf(__('Group Import order #%s refunded; the duplicate ticket is hidden.', 'rt-event-manager'), $order->get_order_number()));
        $this->redirect(array('source' => 'merge'));
    }

    /** An account from an ID, email or username. */
    private static function resolve_user($ref) {
        $ref = trim((string) $ref);
        if ('' === $ref) {
            return null;
        }
        if (ctype_digit($ref)) {
            $u = get_userdata((int) $ref);
            if ($u) {
                return $u;
            }
        }
        $u = get_user_by('email', $ref);
        return $u ? $u : get_user_by('login', $ref);
    }

    /**
     * Refund a Group Import order (coupon-paid, so a zero-amount refund that
     * restocks the ticket); its tickets become refunded via the order-refund
     * handling. Falls back to setting the status when WooCommerce declines a
     * zero refund.
     */
    private function refund_import_order($order, $reason) {
        if (!$order || in_array($order->get_status(), array('refunded', 'cancelled'), true)) {
            return;
        }
        // Marks the ticket as a merge leftover, hidden from the kept account.
        $order->update_meta_data('_rti_merge_refunded', 'yes');
        $order->save();
        $items = array();
        foreach ($order->get_items() as $item_id => $item) {
            $items[$item_id] = array('qty' => $item->get_quantity(), 'refund_total' => 0, 'refund_tax' => array());
        }
        $refund = wc_create_refund(array(
            'order_id'       => $order->get_id(),
            'amount'         => 0,
            'reason'         => $reason,
            'line_items'     => $items,
            'restock_items'  => true,
            'refund_payment' => false,
        ));
        $order = wc_get_order($order->get_id());
        if ($order && 'refunded' !== $order->get_status()) {
            if (is_wp_error($refund)) {
                // No refund object — put the ticket place back ourselves.
                if (function_exists('wc_increase_stock_levels')) {
                    wc_increase_stock_levels($order);
                }
            }
            $order->update_status('refunded', $reason);
        }
    }

    private function post_merge() {
        $dup    = isset($_POST['dup']) ? get_userdata(absint($_POST['dup'])) : null;
        $target = isset($_POST['target']) ? get_userdata(absint($_POST['target'])) : null;
        if (isset($_POST['dup_ref'])) {
            $dup = self::resolve_user(wp_unslash($_POST['dup_ref']));
        }
        if (isset($_POST['target_ref'])) {
            $target = self::resolve_user(wp_unslash($_POST['target_ref']));
        }
        $dup_id    = $dup ? (int) $dup->ID : 0;
        $target_id = $target ? (int) $target->ID : 0;
        if (!$dup || !$target) {
            $this->flash('error', __('Account not found — enter an ID, email or username for both accounts.', 'rt-event-manager'));
            $this->redirect(array('source' => 'merge'));
        }
        if ($dup_id === $target_id || user_can($dup_id, 'manage_options') || $dup_id === get_current_user_id()) {
            $this->flash('error', __('These accounts cannot be merged (same account, or the duplicate is an administrator / you).', 'rt-event-manager'));
            $this->redirect(array('source' => 'merge'));
        }
        global $wpdb;
        $this->mute_emails(true);

        // Does the kept account already hold its own event ticket? Then the
        // duplicate's Group Import ticket is refunded rather than added.
        $target_had_ticket = RT_Event_Manager::instance()->user_has_event_ticket($target_id);
        $refunded = 0;

        // Tickets, parking permits, coin claims → kept account.
        $wpdb->query($wpdb->prepare("UPDATE {$wpdb->prefix}rti_tickets SET owner_user_id = %d WHERE owner_user_id = %d", $target_id, $dup_id));

        // Orders → kept account (Group Import orders refunded when it already had a ticket).
        foreach ((array) wc_get_orders(array('customer_id' => $dup_id, 'limit' => -1)) as $order) {
            $order->set_customer_id($target_id);
            $order->add_order_note(sprintf(__('Customer merged from duplicate account #%1$d into #%2$d.', 'rt-event-manager'), $dup_id, $target_id));
            $order->save();
            if ($target_had_ticket && '' !== (string) $order->get_meta('_rti_group_import')) {
                $this->refund_import_order($order, sprintf(__('Duplicate account #%1$d merged into #%2$d, which already holds a ticket — Group Import ticket refunded.', 'rt-event-manager'), $dup_id, $target_id));
                $refunded++;
            }
        }
        foreach (array('rti_parking_permits', 'rti_coin_claims') as $t) {
            $table = $wpdb->prefix . $t;
            if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table) {
                $wpdb->query($wpdb->prepare("UPDATE $table SET user_id = %d WHERE user_id = %d", $target_id, $dup_id));
            }
        }
        // The existing account's real .WORLD ID on the moved tickets.
        $wid = (string) get_user_meta($target_id, 'world_id', true);
        if ('' !== $wid) {
            $wpdb->query($wpdb->prepare(
                "UPDATE {$wpdb->prefix}rti_tickets SET world_id = %s, qr_code_url = %s WHERE owner_user_id = %d AND ticket_kind IN ('event','staff') AND (world_id = '' OR world_id = %s)",
                $wid, 'tablerworld:///member?id=' . $wid, $target_id, (string) get_user_meta($dup_id, 'world_id', true)
            ));
        }
        // Delegate status, RTI Board club lock and gaps.
        if ('delegate' === get_user_meta($dup_id, 'rti_delegate', true)) {
            update_user_meta($target_id, 'rti_delegate', 'delegate');
            delete_user_meta($target_id, 'rti_delegate_requested');
        }
        if ('yes' === get_user_meta($dup_id, 'rti_org_locked', true)) {
            update_user_meta($target_id, 'rti_org_locked', 'yes');
            update_user_meta($target_id, 'rti_club', (string) get_user_meta($dup_id, 'rti_club', true));
            $wpdb->query($wpdb->prepare(
                "UPDATE {$wpdb->prefix}rti_tickets SET rti_club = %s WHERE owner_user_id = %d AND ticket_kind = 'event' AND parent_ticket_id = 0",
                (string) get_user_meta($target_id, 'rti_club', true), $target_id
            ));
        }
        foreach (array('world_member_id', 'rti_family', 'rti_club_domain', 'rti_association', 'rti_function', 'billing_phone', 'billing_country') as $k) {
            $v = (string) get_user_meta($dup_id, $k, true);
            if ('' !== $v && '' === (string) get_user_meta($target_id, $k, true)) {
                update_user_meta($target_id, $k, $v);
            }
        }

        // Remove the duplicate (anything it authored goes to the kept account).
        require_once ABSPATH . 'wp-admin/includes/user.php';
        wp_delete_user($dup_id, $target_id);
        $this->mute_emails(false);

        $msg = sprintf(__('Merged duplicate account #%1$d into %2$s (#%3$d).', 'rt-event-manager'), $dup_id, $target->display_name, $target_id);
        if ($refunded) {
            $msg .= ' ' . sprintf(_n('%d Group Import ticket was refunded because the account already had a ticket.', '%d Group Import tickets were refunded because the account already had a ticket.', $refunded, 'rt-event-manager'), $refunded);
        }
        $this->flash('success', $msg);
        $this->redirect(array('source' => 'merge'));
    }

    private function render_merge() {
        $pairs = self::duplicate_pairs();
        echo '<p class="description" style="max-width:820px">' . esc_html__('Merging moves orders, tickets, parking permits, delegate status and the RTI Board club from the duplicate to the kept account, then deletes the duplicate. If the kept account already holds an event ticket, the duplicate\'s Group Import ticket is refunded (no emails are sent).', 'rt-event-manager') . '</p>';

        // Manual merge of any two accounts.
        echo '<h3>' . esc_html__('Merge two accounts', 'rt-event-manager') . '</h3>';
        echo '<form method="post" action="' . esc_url($this->page_url(array('source' => 'merge'))) . '" onsubmit="return confirm(\'' . esc_js(__('Merge the duplicate into the kept account and delete the duplicate? This cannot be undone.', 'rt-event-manager')) . '\');">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="merge" />';
        echo '<p><label>' . esc_html__('Duplicate (will be deleted)', 'rt-event-manager') . '<br /><input type="text" name="dup_ref" class="regular-text" placeholder="' . esc_attr__('ID, email or username', 'rt-event-manager') . '" required /></label></p>';
        echo '<p><label>' . esc_html__('Keep (receives everything)', 'rt-event-manager') . '<br /><input type="text" name="target_ref" class="regular-text" placeholder="' . esc_attr__('ID, email or username', 'rt-event-manager') . '" required /></label></p>';
        echo '<p><button class="button button-primary">' . esc_html__('Merge', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        $this->render_duplicate_tickets();

        echo '<h3>' . esc_html__('Likely duplicates from the Group Import', 'rt-event-manager') . '</h3>';
        echo '<p class="description" style="max-width:820px">' . esc_html__('Accounts the Group Import ticketed that have never signed in with .WORLD, next to another account with the same name — usually the same person, who signs in with a different email.', 'rt-event-manager') . '</p>';
        if (empty($pairs)) {
            echo '<p><strong>' . esc_html__('No duplicates found.', 'rt-event-manager') . '</strong></p>';
            return;
        }
        $orders = function ($uid) {
            return count((array) wc_get_orders(array('customer_id' => $uid, 'limit' => -1, 'return' => 'ids')));
        };
        echo '<table class="widefat striped" style="max-width:1100px"><thead><tr><th>' . esc_html__('Imported (duplicate)', 'rt-event-manager') . '</th><th>' . esc_html__('Existing account', 'rt-event-manager') . '</th><th></th></tr></thead><tbody>';
        foreach ($pairs as $p) {
            $d = $p['dup'];
            $t = $p['target'];
            echo '<tr>';
            echo '<td><a href="' . esc_url(get_edit_user_link($d->ID)) . '">#' . esc_html($d->ID) . ' ' . esc_html($d->display_name) . '</a><br /><small>' . esc_html($d->user_email) . ' · ' . esc_html(sprintf(_n('%d order', '%d orders', $orders($d->ID), 'rt-event-manager'), $orders($d->ID))) . '</small></td>';
            echo '<td><a href="' . esc_url(get_edit_user_link($t->ID)) . '">#' . esc_html($t->ID) . ' ' . esc_html($t->display_name) . '</a><br /><small>' . esc_html($t->user_email) . ' · '
                . (self::signed_in_with_world($t->ID) ? esc_html__('signed in with .WORLD', 'rt-event-manager') : esc_html__('never signed in with .WORLD', 'rt-event-manager'))
                . ' · ' . esc_html(sprintf(_n('%d order', '%d orders', $orders($t->ID), 'rt-event-manager'), $orders($t->ID))) . '</small></td>';
            echo '<td><form method="post" action="' . esc_url($this->page_url(array('source' => 'merge'))) . '" onsubmit="return confirm(\'' . esc_js(sprintf(__('Merge #%1$d into #%2$d and delete #%1$d? This cannot be undone.', 'rt-event-manager'), $d->ID, $t->ID)) . '\');">';
            wp_nonce_field(self::NONCE);
            echo '<input type="hidden" name="rti_gi_action" value="merge" /><input type="hidden" name="dup" value="' . esc_attr($d->ID) . '" /><input type="hidden" name="target" value="' . esc_attr($t->ID) . '" />';
            echo '<button class="button button-primary">' . esc_html__('Merge into existing', 'rt-event-manager') . '</button></form></td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
    }

    private function render_duplicate_tickets() {
        $dups = self::duplicate_tickets();
        echo '<h3>' . esc_html__('Duplicate tickets', 'rt-event-manager') . '</h3>';
        echo '<p class="description" style="max-width:820px">' . esc_html__('Group Import tickets for a person who already holds another active event ticket (same holder name or .WORLD ID) — on any account or order. Refund the Group Import ticket to keep the existing one; merge the accounts too when they are different accounts of the same person.', 'rt-event-manager') . '</p>';
        if (empty($dups)) {
            echo '<p><strong>' . esc_html__('No duplicate tickets found.', 'rt-event-manager') . '</strong></p>';
            return;
        }
        $acct = function ($t) {
            $uid = absint($t['owner_user_id']);
            if (!$uid && !empty($t['order_id'])) {
                $o   = wc_get_order(absint($t['order_id']));
                $uid = $o ? absint($o->get_customer_id()) : 0;
            }
            $u = $uid ? get_userdata($uid) : null;
            return $u;
        };
        $label = function ($t, $u) {
            $o = wc_get_order(absint($t['order_id']));
            $buyer = $o ? trim($o->get_billing_first_name() . ' ' . $o->get_billing_last_name()) : '';
            $h  = '<strong>' . esc_html('#' . absint($t['order_id']) . ' · ' . (absint($t['ticket_index']) + 1)) . '</strong> ' . esc_html($t['holder_name']);
            $h .= '<br /><small>' . esc_html(RT_Event_Manager::product_title(absint($t['product_id'])));
            if ($u) {
                $h .= ' · <a href="' . esc_url(get_edit_user_link($u->ID)) . '">' . esc_html(sprintf(__('account #%1$d %2$s', 'rt-event-manager'), $u->ID, $u->user_email)) . '</a>';
                $h .= ' · ' . (self::signed_in_with_world($u->ID) ? esc_html__('signed in with .WORLD', 'rt-event-manager') : esc_html__('never signed in with .WORLD', 'rt-event-manager'));
            }
            if ('' !== $buyer && self::norm_name($buyer) !== self::norm_name($t['holder_name'])) {
                $h .= ' · ' . esc_html(sprintf(__('bought by %s', 'rt-event-manager'), $buyer));
            }
            return $h . '</small>';
        };
        echo '<table class="widefat striped" style="max-width:1100px"><thead><tr><th>' . esc_html__('Group Import ticket', 'rt-event-manager') . '</th><th>' . esc_html__('Existing ticket (kept)', 'rt-event-manager') . '</th><th></th></tr></thead><tbody>';
        foreach ($dups as $d) {
            $iu = $acct($d['import']);
            $ou = $acct($d['other']);
            echo '<tr><td>' . $label($d['import'], $iu) . '</td><td>' . $label($d['other'], $ou) . '</td><td>';
            echo '<form method="post" style="display:inline-block;margin:2px" action="' . esc_url($this->page_url(array('source' => 'merge'))) . '" onsubmit="return confirm(\'' . esc_js(__('Refund the Group Import ticket and keep the existing ticket? No emails are sent.', 'rt-event-manager')) . '\');">';
            wp_nonce_field(self::NONCE);
            echo '<input type="hidden" name="rti_gi_action" value="refund_dup" /><input type="hidden" name="order_id" value="' . esc_attr(absint($d['import']['order_id'])) . '" /><input type="hidden" name="keep_ticket" value="' . esc_attr(absint($d['other']['id'])) . '" />';
            echo '<button class="button">' . esc_html__('Refund Group Import ticket', 'rt-event-manager') . '</button></form>';
            if ($iu && $ou && $iu->ID !== $ou->ID && !user_can($iu->ID, 'manage_options')) {
                echo '<form method="post" style="display:inline-block;margin:2px" action="' . esc_url($this->page_url(array('source' => 'merge'))) . '" onsubmit="return confirm(\'' . esc_js(sprintf(__('Merge #%1$d into #%2$d and delete #%1$d? This cannot be undone.', 'rt-event-manager'), $iu->ID, $ou->ID)) . '\');">';
                wp_nonce_field(self::NONCE);
                echo '<input type="hidden" name="rti_gi_action" value="merge" /><input type="hidden" name="dup" value="' . esc_attr($iu->ID) . '" /><input type="hidden" name="target" value="' . esc_attr($ou->ID) . '" />';
                echo '<button class="button button-primary">' . esc_html(sprintf(__('Merge account #%1$d into #%2$d', 'rt-event-manager'), $iu->ID, $ou->ID)) . '</button></form>';
            }
            echo '</td></tr>';
        }
        echo '</tbody></table>';
    }

    private function post_world_login() {
        $username = isset($_POST['world_username']) ? sanitize_text_field(wp_unslash($_POST['world_username'])) : '';
        $password = isset($_POST['world_password']) ? (string) wp_unslash($_POST['world_password']) : '';
        $family   = isset($_POST['world_family']) ? absint($_POST['world_family']) : 0;
        $tfa      = isset($_POST['world_tfa']) ? sanitize_text_field(wp_unslash($_POST['world_tfa'])) : '';
        $base     = (isset($_POST['world_env']) && 'demo' === $_POST['world_env']) ? self::API_DEMO : self::API_PROD;

        if ('' === $username || '' === $password) {
            $this->flash('error', __('Please enter your .WORLD username and password.', 'rt-event-manager'));
            $this->redirect(array('source' => 'world'));
        }
        $res = $this->api('POST', 'login/', array(
            'username'    => $username,
            'password'    => $password,
            'sync_family' => $family,
            'tfa_code'    => $tfa,
        ), null, $base);
        unset($password);

        if (is_wp_error($res)) {
            $msg = ('tfa_required' === $res->get_error_code())
                ? __('Your .WORLD account uses two-factor authentication — please enter the current 2FA code.', 'rt-event-manager')
                : $res->get_error_message();
            $this->flash('error', $msg);
            $this->redirect(array('source' => 'world'));
        }
        if (empty($res['global_auth_token'])) {
            $this->flash('error', __('.WORLD did not return an access token.', 'rt-event-manager'));
            $this->redirect(array('source' => 'world'));
        }
        $me = isset($res['me']) && is_array($res['me']) ? $res['me'] : array();
        $this->set_world_session(array(
            'token' => (string) $res['global_auth_token'],
            'base'  => $base,
            'name'  => trim(self::pick($me, array('first_name')) . ' ' . self::pick($me, array('last_name'))),
        ));
        $this->flash('success', __('Signed in to .WORLD.', 'rt-event-manager'));
        $this->redirect(array('source' => 'world'));
    }

    private function post_world_board() {
        $session = $this->world_session();
        if (!$session) {
            $this->flash('error', __('Your .WORLD session has expired — please sign in again.', 'rt-event-manager'));
            $this->redirect(array('source' => 'world'));
        }
        $level = isset($_POST['world_level_manual']) ? absint($_POST['world_level_manual']) : 0;
        if (!$level && isset($_POST['world_level'])) {
            $level = absint($_POST['world_level']);
        }
        if (!$level) {
            $this->flash('error', __('Please choose a level.', 'rt-event-manager'));
            $this->redirect(array('source' => 'world'));
        }
        $rows = $this->world_board_rows($session, $level, !empty($_POST['world_assistants']), !empty($_POST['world_area_presidents']));
        if (is_wp_error($rows)) {
            if ('http_403' === $rows->get_error_code()) {
                delete_transient('rti_gi_world_' . self::uid());
            }
            $this->flash('error', $rows->get_error_message());
            $this->redirect(array('source' => 'world'));
        }
        $label = isset($_POST['world_level_label']) ? sanitize_text_field(wp_unslash($_POST['world_level_label'])) : '';
        $this->set_rows($rows, sprintf(__('.WORLD board: %s', 'rt-event-manager'), '' !== $label ? $label : '#' . $level));
        $this->redirect();
    }

    private function post_excel_upload() {
        if (empty($_FILES['rti_gi_file']) || !empty($_FILES['rti_gi_file']['error'])) {
            $this->flash('error', __('Please choose a file to upload.', 'rt-event-manager'));
            $this->redirect(array('source' => 'excel'));
        }
        $rows = $this->excel_rows($_FILES['rti_gi_file']);
        if (is_wp_error($rows)) {
            $this->flash('error', $rows->get_error_message());
            $this->redirect(array('source' => 'excel'));
        }
        $this->set_rows($rows, sprintf(__('Spreadsheet: %s', 'rt-event-manager'), sanitize_file_name($_FILES['rti_gi_file']['name'])));
        $this->redirect();
    }

    /* ---------------------------------------------------------------------
     * Import
     * ------------------------------------------------------------------- */

    private function post_import() {
        $rows       = $this->get_rows();
        $selected   = isset($_POST['rti_gi_sel']) ? array_map('absint', (array) $_POST['rti_gi_sel']) : array();
        $emails     = isset($_POST['rti_gi_email']) ? (array) wp_unslash($_POST['rti_gi_email']) : array();
        $delegates  = isset($_POST['rti_gi_delegate']) ? array_map('absint', array_keys((array) $_POST['rti_gi_delegate'])) : array();
        $links      = isset($_POST['rti_gi_link']) ? array_map('absint', (array) $_POST['rti_gi_link']) : array();
        $product_id = isset($_POST['rti_gi_product']) ? absint($_POST['rti_gi_product']) : 0;
        $coupon     = isset($_POST['rti_gi_coupon']) ? wc_format_coupon_code(wp_unslash($_POST['rti_gi_coupon'])) : '';
        $product    = $product_id ? wc_get_product($product_id) : null;

        if (empty($rows) || empty($selected)) {
            $this->flash('error', __('Please tick at least one person to import.', 'rt-event-manager'));
            $this->redirect();
        }
        if (!$product || !RT_Event_Manager::is_ticket_product($product_id) || 'event' !== RT_Event_Manager::get_ticket_kind_for_product($product_id)) {
            $this->flash('error', __('Please choose the event ticket product.', 'rt-event-manager'));
            $this->redirect();
        }
        if ('' === $coupon || !wc_get_coupon_id_by_code($coupon)) {
            $this->flash('error', __('Please choose a valid coupon.', 'rt-event-manager'));
            $this->redirect();
        }

        // Keep edited emails on the rows (so a failed run can be retried).
        foreach ($emails as $i => $em) {
            $i = absint($i);
            if (isset($rows[$i])) {
                $rows[$i]['email'] = sanitize_email($em);
            }
        }
        $this->set_rows($rows, (string) get_transient('rti_gi_source_' . self::uid()));

        $batch   = 'GI-' . current_time('Ymd-His');
        $results = array();
        $this->mute_emails(true);
        foreach ($selected as $i) {
            if (!isset($rows[$i])) {
                continue;
            }
            $results[] = $this->import_row($rows[$i], $product, $coupon, $batch, in_array($i, $delegates, true), isset($links[$i]) ? $links[$i] : 0);
        }
        $this->mute_emails(false);

        set_transient('rti_gi_result_' . self::uid(), array('batch' => $batch, 'rows' => $results), self::TTL);
        $this->redirect(array('done' => 1));
    }

    /** Suppress WooCommerce emails while importing (no notifications). */
    private function mute_emails($on) {
        $ids = array('new_order', 'customer_processing_order', 'customer_completed_order', 'customer_on_hold_order', 'customer_invoice', 'customer_new_account', 'customer_note', 'customer_refunded_order', 'customer_partially_refunded_order', 'cancelled_order');
        foreach ($ids as $id) {
            if ($on) {
                add_filter('woocommerce_email_enabled_' . $id, '__return_false', 999);
            } else {
                remove_filter('woocommerce_email_enabled_' . $id, '__return_false', 999);
            }
        }
    }

    /**
     * Import one person: account + Completed order (with coupon) + ticket.
     *
     * @return array {name, email, outcome: created|linked|skipped|error, message, user_id, order_id}
     */
    private function import_row($row, $product, $coupon, $batch, $make_delegate = false, $link_user_id = 0) {
        $name = trim($row['first_name'] . ' ' . $row['last_name']);
        $out  = array('name' => $name, 'email' => $row['email'], 'outcome' => 'error', 'message' => '', 'user_id' => 0, 'order_id' => 0);

        if ('' === $name) {
            $out['message'] = __('No name.', 'rt-event-manager');
            return $out;
        }
        // 1) Account: existing (by email, then IDs), else the same-name account
        // ticked in the preview, else a new one.
        $user    = self::find_user($row);
        $created = false;
        if (!$user && $link_user_id) {
            $user = get_userdata($link_user_id);
            if ($user && (empty($row['email']) || !is_email($row['email']))) {
                $row['email']  = $user->user_email;
                $out['email']  = $user->user_email;
            }
        }
        if (!$user && (empty($row['email']) || !is_email($row['email']))) {
            $out['message'] = __('No valid email address.', 'rt-event-manager');
            return $out;
        }
        if (!$user) {
            // Username = the member's .world address, as .WORLD sign-in creates
            // it, so both paths land on the same account.
            $world_login = '';
            foreach (array_merge(array($row['email']), (array) (isset($row['emails']) ? $row['emails'] : array())) as $em) {
                if (self::is_world_address($em)) {
                    $world_login = strtolower(trim($em));
                    break;
                }
            }
            $login = sanitize_user('' !== $world_login ? $world_login : $row['email'], true);
            if ('' === $login) {
                $login = sanitize_user(current(explode('@', $row['email'])), true);
            }
            if ('' === $login) {
                $login = 'member';
            }
            $base_login = $login;
            $n = 1;
            while (username_exists($login)) {
                $login = $base_login . $n++;
            }
            $uid = wp_insert_user(array(
                'user_login'           => $login,
                'user_email'           => $row['email'],
                'user_pass'            => wp_generate_password(24, true, true),
                'first_name'           => $row['first_name'],
                'last_name'            => $row['last_name'],
                'display_name'         => $name,
                'role'                 => get_role('customer') ? 'customer' : get_option('default_role', 'subscriber'),
                'show_admin_bar_front' => false,
            ));
            if (is_wp_error($uid)) {
                $out['message'] = $uid->get_error_message();
                return $out;
            }
            $user    = get_userdata($uid);
            $created = true;
        }
        $uid = (int) $user->ID;
        $out['user_id'] = $uid;

        // Profile data: fill gaps only, never overwrite what the member has.
        $meta = array(
            'world_id'           => $row['world_id'],
            'world_member_id'    => isset($row['world_member_id']) ? $row['world_member_id'] : '',
            'rti_family'         => $row['family'],
            'rti_club'           => $row['club'],
            'rti_club_domain'    => $row['club_domain'],
            'rti_association'    => isset($row['association']) ? $row['association'] : '',
            'rti_function'       => $row['function'],
            'billing_first_name' => $row['first_name'],
            'billing_last_name'  => $row['last_name'],
            'billing_email'      => $row['email'],
            'billing_phone'      => $row['phone'],
            'billing_country'    => $row['country'],
        );
        foreach ($meta as $k => $v) {
            if ('' !== (string) $v && '' === (string) get_user_meta($uid, $k, true)) {
                update_user_meta($uid, $k, $v);
            }
        }
        if ($created) {
            update_user_meta($uid, 'rti_group_import', $batch);
        }

        // International board: club "RTI Board" (always set, even on existing
        // accounts) and locked against .WORLD sign-in. The association stays
        // their home association.
        if (!empty($row['org_lock'])) {
            update_user_meta($uid, 'rti_club', '' !== $row['club'] ? $row['club'] : self::international_board_club($row['family']));
            update_user_meta($uid, 'rti_org_locked', 'yes');
            // Undo an earlier "… International" association label.
            if (preg_match('/\binternational\s*$/i', (string) get_user_meta($uid, 'rti_association', true))) {
                if ('' !== (string) $row['association']) {
                    update_user_meta($uid, 'rti_association', $row['association']);
                } else {
                    delete_user_meta($uid, 'rti_association');
                }
            }
            // Keep their existing event ticket in step (re-runs of the import).
            global $wpdb;
            $wpdb->query($wpdb->prepare(
                "UPDATE {$wpdb->prefix}rti_tickets SET rti_club = %s, association = %s
                 WHERE owner_user_id = %d AND ticket_kind = 'event' AND parent_ticket_id = 0 AND LOWER(holder_name) = LOWER(%s)",
                (string) get_user_meta($uid, 'rti_club', true), RT_Event_Manager::delegate_user_association($uid), $uid, $name
            ));
        }

        // Delegate (ticked in the preview): same rules as RT Event → Delegates.
        // Unticked never removes an existing delegate status.
        $delegate_note = '';
        if ($make_delegate) {
            if ('delegate' === RT_Event_Manager::get_delegate_status($uid)) {
                $delegate_note = __('Already a delegate.', 'rt-event-manager');
            } elseif (method_exists('RT_Event_Manager', 'can_manage_delegate') && !RT_Event_Manager::can_manage_delegate()) {
                $delegate_note = __('Not set as delegate: you are not allowed to manage delegates.', 'rt-event-manager');
            } else {
                $reason = RT_Event_Manager::delegate_block_reason($uid);
                if ('' === $reason) {
                    update_user_meta($uid, 'rti_delegate', 'delegate');
                    delete_user_meta($uid, 'rti_delegate_requested');
                    $delegate_note = __('Set as delegate.', 'rt-event-manager');
                } else {
                    /* translators: %s: reason */
                    $delegate_note = sprintf(__('Not set as delegate: %s', 'rt-event-manager'), $reason);
                }
            }
        }
        $out['message'] = $delegate_note;

        // 2) Already holds an event ticket → nothing to do.
        if (RT_Event_Manager::instance()->user_has_event_ticket($uid)) {
            $out['outcome'] = 'skipped';
            $out['message'] = trim(__('Already has an event ticket.', 'rt-event-manager') . ' ' . $delegate_note);
            return $out;
        }

        // 3) Order with the ticket, coupon applied, Completed.
        try {
            $order = wc_create_order(array('customer_id' => $uid, 'created_via' => 'rt-group-import'));
            if (is_wp_error($order)) {
                throw new \Exception($order->get_error_message());
            }
            $order->add_product($product, 1);
            $order->set_billing_first_name($row['first_name']);
            $order->set_billing_last_name($row['last_name']);
            $order->set_billing_email($row['email']);
            if ('' !== $row['phone']) {
                $order->set_billing_phone($row['phone']);
            }
            if ('' !== $row['country']) {
                $order->set_billing_country($row['country']);
            }
            $order->calculate_totals();
            $applied = $order->apply_coupon($coupon);
            if (is_wp_error($applied)) {
                throw new \Exception($applied->get_error_message());
            }
            $order->calculate_totals();
            if ((float) $order->get_total() > 0.0) {
                throw new \Exception(sprintf(
                    /* translators: %s: remaining amount */
                    __('The coupon leaves %s to pay, so the order was not created. Use a coupon that covers the full ticket price.', 'rt-event-manager'),
                    wp_strip_all_tags(wc_price($order->get_total(), array('currency' => $order->get_currency())))
                ));
            }
            $order->set_payment_method_title(__('Group import (coupon)', 'rt-event-manager'));
            $order->update_meta_data('_rti_group_import', $batch);
            $order->save();
            $order->update_status('completed', sprintf(__('Created by Group Import (%s).', 'rt-event-manager'), $batch));
        } catch (\Exception $e) {
            if (isset($order) && $order instanceof WC_Order && $order->get_id()) {
                $order->delete(true);
            }
            $out['message'] = trim($e->getMessage() . ' ' . $delegate_note);
            return $out;
        }
        $out['order_id'] = $order->get_id();

        // 4) The ticket row, owned by the member.
        $world_id = (string) get_user_meta($uid, 'world_id', true);
        $assoc    = method_exists('RT_Event_Manager', 'delegate_user_association') ? RT_Event_Manager::delegate_user_association($uid) : '';
        RT_Event_Manager::instance()->create_ticket_row(array(
            'order_id'      => $order->get_id(),
            'product_id'    => $product->get_id(),
            'ticket_kind'   => 'event',
            'ticket_index'  => 0,
            'holder_name'   => $name,
            'phone'         => $row['phone'],
            'rti_family'    => (string) get_user_meta($uid, 'rti_family', true),
            'rti_club'      => (string) get_user_meta($uid, 'rti_club', true),
            'association'   => $assoc,
            'function_role' => (string) get_user_meta($uid, 'rti_function', true),
            'world_id'      => $world_id,
            'qr_code_url'   => '' !== $world_id ? 'tablerworld:///member?id=' . $world_id : '',
            'status'        => rt_event_manager_determine_ticket_status($order, $name),
            'owner_user_id' => $uid,
        ));

        $out['outcome'] = $created ? 'created' : 'linked';
        return $out;
    }

    /* ---------------------------------------------------------------------
     * Coupon invoices — every ticket issued under a coupon, invoiced as one
     * PDF; the coupon is then disabled so nothing more can be added to it.
     * ------------------------------------------------------------------- */

    const INVOICE_META = '_rti_gi_invoice';

    /** Coupons for the invoice picker (published + already invoiced drafts). */
    private function invoice_coupons() {
        return get_posts(array(
            'post_type'      => 'shop_coupon',
            'post_status'    => array('publish', 'draft'),
            'posts_per_page' => 300,
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));
    }

    /** IDs of orders that used a coupon code (order items table — HPOS-safe). */
    private static function coupon_order_ids($code) {
        global $wpdb;
        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT order_id FROM {$wpdb->prefix}woocommerce_order_items WHERE order_item_type = 'coupon' AND LOWER(order_item_name) = %s ORDER BY order_id ASC",
            strtolower($code)
        ));
        return array_map('absint', (array) $ids);
    }

    /**
     * Billable orders under a coupon: one row per order with its live tickets
     * and the amount the coupon covered. Refunded / cancelled orders (incl.
     * tickets refunded by an account merge) are left out.
     */
    private function coupon_invoice_rows($code) {
        $rows = array();
        foreach (self::coupon_order_ids($code) as $oid) {
            $order = wc_get_order($oid);
            if (!$order || in_array($order->get_status(), array('refunded', 'cancelled', 'failed', 'trash', 'checkout-draft', 'pending'), true)) {
                continue;
            }
            if ('yes' === $order->get_meta('_rti_merge_refunded')) {
                continue;
            }
            $tickets = array();
            foreach (RT_Event_Manager::get_tickets_for_order($oid) as $t) {
                if (in_array($t['status'], array('refunded', 'cancelled', 'invalid'), true)) {
                    continue;
                }
                $p = wc_get_product($t['product_id']);
                $tickets[] = array(
                    'id'      => absint($t['id']),
                    'number'  => '#' . absint($t['order_id']) . ' · ' . (absint($t['ticket_index']) + 1),
                    'holder'  => ('' !== $t['holder_name']) ? $t['holder_name'] : __('Unassigned', 'rt-event-manager'),
                    'product' => $p ? RT_Event_Manager::product_title($p->get_id()) : RT_Event_Manager::ticket_kind_label($t),
                    'club'    => isset($t['rti_club']) ? trim((string) $t['rti_club']) : '',
                );
            }
            if (empty($tickets)) {
                continue;
            }
            // Amount the coupon covered on this order (net discount + its tax).
            $net = 0.0;
            $tax = 0.0;
            foreach ($order->get_items('coupon') as $ci) {
                if (strtolower($ci->get_code()) === strtolower($code)) {
                    $net += (float) $ci->get_discount();
                    $tax += (float) $ci->get_discount_tax();
                }
            }
            $created = $order->get_date_created();
            $rows[] = array(
                'order_id' => $oid,
                'order_no' => $order->get_order_number(),
                'date'     => $created ? $created->date('Y-m-d') : '',
                'customer' => trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()),
                'tickets'  => $tickets,
                'net'      => round($net, 2),
                'tax'      => round($tax, 2),
                'currency' => $order->get_currency(),
            );
        }
        return $rows;
    }

    private static function invoice_totals($rows) {
        $net = 0.0;
        $tax = 0.0;
        $n   = 0;
        foreach ($rows as $r) {
            $net += $r['net'];
            $tax += $r['tax'];
            $n   += count($r['tickets']);
        }
        return array('net' => round($net, 2), 'tax' => round($tax, 2), 'total' => round($net + $tax, 2), 'tickets' => $n);
    }

    /** Next invoice number, e.g. GI-2026-001. */
    private static function next_invoice_number() {
        $year = gmdate('Y');
        $seq  = get_option('rt_event_manager_gi_invoice_seq', array());
        $seq  = is_array($seq) ? $seq : array();
        $n    = isset($seq[$year]) ? absint($seq[$year]) + 1 : 1;
        $seq[$year] = $n;
        update_option('rt_event_manager_gi_invoice_seq', $seq, false);
        return sprintf('GI-%s-%03d', $year, $n);
    }

    private function invoice_download_url($coupon_id) {
        return wp_nonce_url(add_query_arg(array('action' => 'rti_group_invoice_pdf', 'coupon' => absint($coupon_id)), admin_url('admin-post.php')), self::NONCE);
    }

    private function render_invoices() {
        $coupons = $this->invoice_coupons();
        $cid     = isset($_GET['coupon']) ? absint($_GET['coupon']) : 0;

        echo '<p class="description" style="max-width:780px">' . esc_html__('Choose a coupon to see every ticket issued under it. Generate one PDF invoice for the coupon — the coupon is then disabled, so no further tickets can be issued with it.', 'rt-event-manager') . '</p>';
        echo '<form method="get" action="' . esc_url(admin_url('admin.php')) . '" style="margin:12px 0">';
        echo '<input type="hidden" name="page" value="' . esc_attr(self::PAGE_SLUG) . '" /><input type="hidden" name="source" value="invoices" />';
        echo '<select name="coupon" onchange="this.form.submit()"><option value="">' . esc_html__('— Choose a coupon —', 'rt-event-manager') . '</option>';
        foreach ($coupons as $c) {
            $inv   = get_post_meta($c->ID, self::INVOICE_META, true);
            $label = $c->post_title . (is_array($inv) && !empty($inv['number']) ? ' — ' . sprintf(__('invoiced %s', 'rt-event-manager'), $inv['number']) : '');
            echo '<option value="' . esc_attr($c->ID) . '"' . selected($cid, $c->ID, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select> <noscript><button class="button">' . esc_html__('Show', 'rt-event-manager') . '</button></noscript></form>';

        $post = $cid ? get_post($cid) : null;
        if (!$post || 'shop_coupon' !== $post->post_type) {
            return;
        }
        $code    = wc_format_coupon_code($post->post_title);
        $invoice = get_post_meta($cid, self::INVOICE_META, true);
        $invoice = is_array($invoice) && !empty($invoice['number']) ? $invoice : null;
        $rows    = $invoice ? $invoice['rows'] : $this->coupon_invoice_rows($code);
        $tot     = self::invoice_totals($rows);
        $cur     = $rows ? $rows[0]['currency'] : get_woocommerce_currency();
        $money   = function ($v) use ($cur) {
            return wp_kses_post(wc_price($v, array('currency' => $cur)));
        };

        if ($invoice) {
            echo '<div class="notice notice-info inline"><p>'
                . esc_html(sprintf(__('Invoice %1$s generated on %2$s — the coupon is disabled. The list below is the invoiced snapshot.', 'rt-event-manager'), $invoice['number'], date_i18n(get_option('date_format'), strtotime($invoice['date']))))
                . ' <a class="button button-primary" href="' . esc_url($this->invoice_download_url($cid)) . '">' . esc_html__('Download PDF invoice', 'rt-event-manager') . '</a></p></div>';
        } elseif ('publish' !== $post->post_status) {
            echo '<div class="notice notice-warning inline"><p>' . esc_html__('This coupon is not published (disabled).', 'rt-event-manager') . '</p></div>';
        }

        echo '<h3>' . esc_html(sprintf(_n('%1$d ticket issued under “%2$s”', '%1$d tickets issued under “%2$s”', $tot['tickets'], 'rt-event-manager'), $tot['tickets'], $post->post_title)) . '</h3>';
        if (empty($rows)) {
            echo '<p>' . esc_html__('No active tickets were issued with this coupon.', 'rt-event-manager') . '</p>';
            return;
        }
        echo '<table class="widefat striped" style="max-width:1100px"><thead><tr>'
            . '<th>' . esc_html__('Ticket', 'rt-event-manager') . '</th>'
            . '<th>' . esc_html__('Holder', 'rt-event-manager') . '</th>'
            . '<th>' . esc_html__('Club', 'rt-event-manager') . '</th>'
            . '<th>' . esc_html__('Product', 'rt-event-manager') . '</th>'
            . '<th>' . esc_html__('Order', 'rt-event-manager') . '</th>'
            . '<th style="text-align:right">' . esc_html__('Amount', 'rt-event-manager') . '</th>'
            . '</tr></thead><tbody>';
        foreach ($rows as $r) {
            $first = true;
            foreach ($r['tickets'] as $t) {
                $order_link = $first
                    ? '<a href="' . esc_url(class_exists('\\Automattic\\WooCommerce\\Utilities\\OrderUtil') ? \Automattic\WooCommerce\Utilities\OrderUtil::get_order_admin_edit_url(absint($r['order_id'])) : admin_url('post.php?post=' . absint($r['order_id']) . '&action=edit')) . '">#' . esc_html($r['order_no']) . '</a>'
                    : '';
                echo '<tr><td>' . esc_html($t['number']) . '</td><td>' . esc_html($t['holder']) . '</td><td>' . esc_html($t['club']) . '</td><td>' . esc_html($t['product']) . '</td>'
                    . '<td>' . $order_link . '</td><td style="text-align:right">' . ($first ? $money($r['net'] + $r['tax']) : '') . '</td></tr>';
                $first = false;
            }
        }
        echo '</tbody><tfoot><tr><th colspan="5" style="text-align:right">' . esc_html__('Total', 'rt-event-manager') . '</th><th style="text-align:right">' . $money($tot['total']) . '</th></tr></tfoot></table>';

        if ($invoice) {
            return;
        }

        // Invoice form.
        $last = get_option('rt_event_manager_gi_invoice_defaults', array());
        $last = is_array($last) ? $last : array();
        echo '<h3 style="margin-top:24px">' . esc_html__('Generate invoice', 'rt-event-manager') . '</h3>';
        echo '<form method="post" action="' . esc_url($this->page_url(array('source' => 'invoices', 'coupon' => $cid))) . '" onsubmit="return confirm(\'' . esc_js(__('Generate the invoice and disable this coupon? No further tickets can be issued with it.', 'rt-event-manager')) . '\');">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="invoice" /><input type="hidden" name="coupon" value="' . esc_attr($cid) . '" />';
        echo '<table class="form-table" role="presentation">';
        echo '<tr><th><label for="rti_inv_to">' . esc_html__('Bill to', 'rt-event-manager') . '</label></th><td><textarea name="rti_inv_to" id="rti_inv_to" rows="5" cols="60" required placeholder="' . esc_attr__("Organisation\nContact\nStreet\nPostcode City\nCountry", 'rt-event-manager') . '"></textarea></td></tr>';
        echo '<tr><th><label for="rti_inv_ref">' . esc_html__('Reference / PO', 'rt-event-manager') . '</label></th><td><input type="text" class="regular-text" name="rti_inv_ref" id="rti_inv_ref" /></td></tr>';
        echo '<tr><th><label for="rti_inv_due">' . esc_html__('Payment due (days)', 'rt-event-manager') . '</label></th><td><input type="number" min="0" max="365" name="rti_inv_due" id="rti_inv_due" value="' . esc_attr(isset($last['due']) ? $last['due'] : 30) . '" /></td></tr>';
        echo '<tr><th><label for="rti_inv_notes">' . esc_html__('Payment details / notes', 'rt-event-manager') . '</label></th><td><textarea name="rti_inv_notes" id="rti_inv_notes" rows="5" cols="60" placeholder="' . esc_attr__('Bank, IBAN, payment terms… (remembered for the next invoice)', 'rt-event-manager') . '">' . esc_textarea(isset($last['notes']) ? $last['notes'] : '') . '</textarea></td></tr>';
        echo '</table>';
        submit_button(__('Generate invoice and disable coupon', 'rt-event-manager'));
        echo '</form>';
    }

    private function post_invoice() {
        $cid  = isset($_POST['coupon']) ? absint($_POST['coupon']) : 0;
        $post = $cid ? get_post($cid) : null;
        if (!$post || 'shop_coupon' !== $post->post_type) {
            $this->flash('error', __('Coupon not found.', 'rt-event-manager'));
            $this->redirect(array('source' => 'invoices'));
        }
        $back = array('source' => 'invoices', 'coupon' => $cid);
        $existing = get_post_meta($cid, self::INVOICE_META, true);
        if (is_array($existing) && !empty($existing['number'])) {
            $this->flash('error', __('This coupon has already been invoiced.', 'rt-event-manager'));
            $this->redirect($back);
        }
        $to = isset($_POST['rti_inv_to']) ? sanitize_textarea_field(wp_unslash($_POST['rti_inv_to'])) : '';
        if ('' === trim($to)) {
            $this->flash('error', __('Enter who the invoice is addressed to.', 'rt-event-manager'));
            $this->redirect($back);
        }
        $code = wc_format_coupon_code($post->post_title);
        $rows = $this->coupon_invoice_rows($code);
        if (empty($rows)) {
            $this->flash('error', __('No active tickets were issued with this coupon — nothing to invoice.', 'rt-event-manager'));
            $this->redirect($back);
        }
        $notes = isset($_POST['rti_inv_notes']) ? sanitize_textarea_field(wp_unslash($_POST['rti_inv_notes'])) : '';
        $due   = isset($_POST['rti_inv_due']) ? min(365, absint($_POST['rti_inv_due'])) : 30;
        update_option('rt_event_manager_gi_invoice_defaults', array('notes' => $notes, 'due' => $due), false);

        $now     = current_time('Y-m-d');
        $invoice = array(
            'number'   => self::next_invoice_number(),
            'date'     => $now,
            'due_date' => gmdate('Y-m-d', strtotime($now . ' +' . $due . ' days')),
            'coupon'   => $post->post_title,
            'bill_to'  => $to,
            'ref'      => isset($_POST['rti_inv_ref']) ? sanitize_text_field(wp_unslash($_POST['rti_inv_ref'])) : '',
            'notes'    => $notes,
            'currency' => $rows[0]['currency'],
            'rows'     => $rows,
            'totals'   => self::invoice_totals($rows),
            'by'       => get_current_user_id(),
        );
        update_post_meta($cid, self::INVOICE_META, $invoice);

        // Disable the coupon: unpublished + usage capped at what was used.
        $coupon = new WC_Coupon($cid);
        $coupon->set_usage_limit(max(1, (int) $coupon->get_usage_count()));
        $coupon->set_description(trim($coupon->get_description() . "\n" . sprintf(__('Invoiced %1$s on %2$s — disabled.', 'rt-event-manager'), $invoice['number'], $now)));
        $coupon->save();
        wp_update_post(array('ID' => $cid, 'post_status' => 'draft'));

        foreach ($rows as $r) {
            $order = wc_get_order($r['order_id']);
            if ($order) {
                $order->update_meta_data('_rti_gi_invoice_no', $invoice['number']);
                $order->add_order_note(sprintf(__('Invoiced on coupon invoice %s.', 'rt-event-manager'), $invoice['number']));
                $order->save();
            }
        }

        $this->flash('success', sprintf(__('Invoice %s generated; the coupon is now disabled.', 'rt-event-manager'), $invoice['number']));
        $this->redirect($back);
    }

    /** admin-post: stream the PDF for an invoiced coupon. */
    public function download_invoice() {
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('Not allowed.', 'rt-event-manager'));
        }
        check_admin_referer(self::NONCE);
        $cid     = isset($_GET['coupon']) ? absint($_GET['coupon']) : 0;
        $invoice = $cid ? get_post_meta($cid, self::INVOICE_META, true) : null;
        if (!is_array($invoice) || empty($invoice['number']) || !class_exists('RT_Event_Manager_Receipt')) {
            wp_die(esc_html__('Invoice not found.', 'rt-event-manager'));
        }
        $pdf = RT_Event_Manager_Receipt::instance()->render_document_pdf($this->invoice_pdf_body($invoice));
        if (!$pdf) {
            wp_die(esc_html__('The PDF could not be generated.', 'rt-event-manager'));
        }
        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="invoice-' . sanitize_file_name($invoice['number']) . '.pdf"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf; // phpcs:ignore WordPress.Security.EscapeOutput
        exit;
    }

    private function invoice_pdf_body($inv) {
        $cur   = $inv['currency'];
        $money = function ($v) use ($cur) {
            return wp_kses_post(wc_price($v, array('currency' => $cur)));
        };
        $fmt = function ($d) {
            return $d ? date_i18n(get_option('date_format'), strtotime($d)) : '';
        };
        $t = $inv['totals'];
        $h  = '<div class="header"><h1>' . esc_html(get_bloginfo('name')) . '</h1><div class="muted">' . esc_html__('Invoice', 'rt-event-manager') . '</div></div>';
        $h .= '<table class="meta">';
        $h .= '<tr><td class="label">' . esc_html__('Invoice no.', 'rt-event-manager') . '</td><td>' . esc_html($inv['number']) . '</td>'
            . '<td class="label">' . esc_html__('Date', 'rt-event-manager') . '</td><td>' . esc_html($fmt($inv['date'])) . '</td></tr>';
        $h .= '<tr><td class="label">' . esc_html__('Coupon', 'rt-event-manager') . '</td><td>' . esc_html($inv['coupon']) . '</td>'
            . '<td class="label">' . esc_html__('Due', 'rt-event-manager') . '</td><td>' . esc_html($fmt($inv['due_date'])) . '</td></tr>';
        if ('' !== $inv['ref']) {
            $h .= '<tr><td class="label">' . esc_html__('Reference', 'rt-event-manager') . '</td><td colspan="3">' . esc_html($inv['ref']) . '</td></tr>';
        }
        $h .= '<tr><td class="label">' . esc_html__('Billed to', 'rt-event-manager') . '</td><td colspan="3">' . nl2br(esc_html($inv['bill_to'])) . '</td></tr>';
        $h .= '</table>';

        $h .= '<table class="items"><thead><tr><th>' . esc_html__('Ticket', 'rt-event-manager') . '</th><th>' . esc_html__('Holder', 'rt-event-manager') . '</th><th>' . esc_html__('Item', 'rt-event-manager') . '</th><th class="num">' . esc_html__('Amount', 'rt-event-manager') . '</th></tr></thead><tbody>';
        foreach ($inv['rows'] as $r) {
            $first = true;
            foreach ($r['tickets'] as $tk) {
                $h .= '<tr><td>' . esc_html($tk['number']) . '</td><td>' . esc_html($tk['holder'])
                    . ('' !== $tk['club'] ? '<div class="item-dates">' . esc_html($tk['club']) . '</div>' : '')
                    . '</td><td>' . esc_html($tk['product']) . '</td><td class="num">' . ($first ? $money($r['net'] + $r['tax']) : '') . '</td></tr>';
                $first = false;
            }
        }
        $h .= '</tbody></table>';

        $h .= '<table class="totals">';
        $h .= '<tr><td>' . esc_html(sprintf(_n('%d ticket', '%d tickets', $t['tickets'], 'rt-event-manager'), $t['tickets'])) . '</td><td class="num"></td></tr>';
        if ($t['tax'] > 0) {
            $h .= '<tr><td>' . esc_html__('Subtotal', 'rt-event-manager') . '</td><td class="num">' . $money($t['net']) . '</td></tr>';
            $h .= '<tr><td>' . esc_html__('Tax', 'rt-event-manager') . '</td><td class="num">' . $money($t['tax']) . '</td></tr>';
        }
        $h .= '<tr class="grand"><td>' . esc_html__('Total due', 'rt-event-manager') . '</td><td class="num">' . $money($t['total']) . '</td></tr>';
        $h .= '</table>';

        if ('' !== trim($inv['notes'])) {
            $h .= '<div style="margin-top:24px"><strong>' . esc_html__('Payment details', 'rt-event-manager') . '</strong><br>' . nl2br(esc_html($inv['notes'])) . '</div>';
        }
        return $h;
    }

    /* ---------------------------------------------------------------------
     * Page
     * ------------------------------------------------------------------- */

    /** Event ticket products for the product picker (main admissions first). */
    private function ticket_products() {
        $ids = get_posts(array(
            'post_type'      => 'product',
            'post_status'    => array('publish', 'private'),
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));
        $out = array();
        foreach ($ids as $id) {
            if (RT_Event_Manager::is_ticket_product($id) && 'event' === RT_Event_Manager::get_ticket_kind_for_product($id)) {
                $out[] = wc_get_product($id);
            }
        }
        usort($out, function ($a, $b) {
            $ma = RT_Event_Manager::is_main_admission_product($a->get_id()) ? 0 : 1;
            $mb = RT_Event_Manager::is_main_admission_product($b->get_id()) ? 0 : 1;
            return $ma <=> $mb;
        });
        return array_filter($out);
    }

    private function coupons() {
        return get_posts(array(
            'post_type'      => 'shop_coupon',
            'post_status'    => 'publish',
            'posts_per_page' => 200,
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));
    }

    /**
     * Loading indicator: a form marked data-rti-loading shows a spinner and its
     * message next to the submit button, and its buttons are disabled so the
     * (slow) .WORLD queries / import are not submitted twice.
     */
    private function loading_script() {
        ?>
        <style>
            .rti-gi-loading { display: inline-flex; align-items: center; gap: 6px; margin-left: 10px; color: #50575e; font-style: italic; vertical-align: middle; }
            .rti-gi-loading .spinner { float: none; margin: 0; visibility: visible; }
        </style>
        <script>
        document.addEventListener('submit', function (e) {
            var form = e.target;
            if (!form || !form.getAttribute || !form.hasAttribute('data-rti-loading')) { return; }
            if (form.getAttribute('data-rti-busy')) { e.preventDefault(); return; }
            form.setAttribute('data-rti-busy', '1');
            var btn = e.submitter || form.querySelector('[type="submit"]');
            var note = document.createElement('span');
            note.className = 'rti-gi-loading';
            note.setAttribute('role', 'status');
            note.innerHTML = '<span class="spinner is-active"></span>';
            note.appendChild(document.createTextNode(form.getAttribute('data-rti-loading')));
            if (btn && btn.parentNode) { btn.parentNode.insertBefore(note, btn.nextSibling); } else { form.appendChild(note); }
            // Disable after the submit has been captured, so the button's value is still sent.
            setTimeout(function () {
                Array.prototype.forEach.call(form.querySelectorAll('button, input[type="submit"]'), function (b) { b.disabled = true; });
            }, 0);
        }, true);
        </script>
        <?php
    }

    public function render_page() {
        if (!current_user_can(self::CAP)) {
            return;
        }
        $this->loading_script();
        $source = isset($_GET['source']) ? sanitize_key(wp_unslash($_GET['source'])) : 'world';
        if (!in_array($source, array('world', 'excel', 'merge', 'invoices'), true)) {
            $source = 'world';
        }
        $rows   = $this->get_rows();

        echo '<div class="wrap rti-group-import"><h1>' . esc_html__('Group Import', 'rt-event-manager') . '</h1>';
        echo '<p class="description" style="max-width:780px">' . esc_html__('Import a group — for example an international board — from .WORLD or a spreadsheet. Each ticked person gets an account and a full event ticket on a Completed order paid by the coupon you choose. No emails are sent. When they sign in with .WORLD they find their account and ticket.', 'rt-event-manager') . '</p>';

        $flash = get_transient('rti_gi_flash_' . self::uid());
        if ($flash) {
            delete_transient('rti_gi_flash_' . self::uid());
            echo '<div class="notice notice-' . ('error' === $flash['type'] ? 'error' : 'success') . ' is-dismissible"><p>' . esc_html($flash['message']) . '</p></div>';
        }

        if (!empty($_GET['done'])) {
            $this->render_results();
        }

        if (!empty($rows) && !in_array($source, array('merge', 'invoices'), true)) {
            $this->render_preview($rows);
            echo '</div>';
            return;
        }

        echo '<h2 class="nav-tab-wrapper">';
        echo '<a class="nav-tab' . ('world' === $source ? ' nav-tab-active' : '') . '" href="' . esc_url($this->page_url(array('source' => 'world'))) . '">' . esc_html__('From .WORLD', 'rt-event-manager') . '</a>';
        echo '<a class="nav-tab' . ('excel' === $source ? ' nav-tab-active' : '') . '" href="' . esc_url($this->page_url(array('source' => 'excel'))) . '">' . esc_html__('From Excel / CSV', 'rt-event-manager') . '</a>';
        echo '<a class="nav-tab' . ('merge' === $source ? ' nav-tab-active' : '') . '" href="' . esc_url($this->page_url(array('source' => 'merge'))) . '">' . esc_html__('Merge duplicates', 'rt-event-manager') . '</a>';
        echo '<a class="nav-tab' . ('invoices' === $source ? ' nav-tab-active' : '') . '" href="' . esc_url($this->page_url(array('source' => 'invoices'))) . '">' . esc_html__('Coupon invoices', 'rt-event-manager') . '</a>';
        echo '</h2>';

        if ('invoices' === $source) {
            $this->render_invoices();
        } elseif ('merge' === $source) {
            $this->render_merge();
        } elseif ('excel' === $source) {
            $this->render_excel_form();
        } else {
            $this->render_world_form();
        }
        echo '</div>';
    }

    private function render_world_form() {
        $session = $this->world_session();
        if (!$session) {
            echo '<h3>' . esc_html__('Sign in to .WORLD', 'rt-event-manager') . '</h3>';
            echo '<p class="description" style="max-width:780px">' . esc_html__('Sign in with your own .WORLD account to read board members through the .WORLD API. Your password is sent to .WORLD only and is not stored; the access token is kept encrypted for 2 hours for your admin account.', 'rt-event-manager') . '</p>';
            echo '<form method="post" action="' . esc_url($this->page_url(array('source' => 'world'))) . '" autocomplete="off" data-rti-loading="' . esc_attr__('Signing in to .WORLD…', 'rt-event-manager') . '">';
            wp_nonce_field(self::NONCE);
            echo '<input type="hidden" name="rti_gi_action" value="world_login" />';
            echo '<table class="form-table" role="presentation">';
            echo '<tr><th><label for="world_family">' . esc_html__('Family', 'rt-event-manager') . '</label></th><td><select name="world_family" id="world_family">';
            foreach (self::family_names() as $id => $label) {
                echo '<option value="' . esc_attr($id) . '">' . esc_html($label) . '</option>';
            }
            echo '</select></td></tr>';
            echo '<tr><th><label for="world_username">' . esc_html__('.WORLD username', 'rt-event-manager') . '</label></th><td><input type="text" name="world_username" id="world_username" class="regular-text" autocomplete="username" /></td></tr>';
            echo '<tr><th><label for="world_password">' . esc_html__('Password', 'rt-event-manager') . '</label></th><td><input type="password" name="world_password" id="world_password" class="regular-text" autocomplete="current-password" /></td></tr>';
            echo '<tr><th><label for="world_tfa">' . esc_html__('2FA code', 'rt-event-manager') . '</label></th><td><input type="text" name="world_tfa" id="world_tfa" class="small-text" inputmode="numeric" autocomplete="one-time-code" /> <span class="description">' . esc_html__('Only if your .WORLD account uses two-factor authentication.', 'rt-event-manager') . '</span></td></tr>';
            echo '<tr><th>' . esc_html__('Environment', 'rt-event-manager') . '</th><td><label><input type="radio" name="world_env" value="prod" checked /> ' . esc_html__('Production', 'rt-event-manager') . '</label> &nbsp; <label><input type="radio" name="world_env" value="demo" /> ' . esc_html__('Demo (testing)', 'rt-event-manager') . '</label></td></tr>';
            echo '</table>';
            submit_button(__('Sign in to .WORLD', 'rt-event-manager'));
            echo '</form>';
            return;
        }

        // Signed in: choose family → level → load board.
        echo '<form method="post" action="' . esc_url($this->page_url(array('source' => 'world'))) . '" style="margin:12px 0">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="world_logout" />';
        echo '<p>' . esc_html(sprintf(__('Signed in to .WORLD as %s.', 'rt-event-manager'), '' !== $session['name'] ? $session['name'] : __('your account', 'rt-event-manager')))
            . (self::API_DEMO === $session['base'] ? ' <strong>' . esc_html__('(Demo)', 'rt-event-manager') . '</strong>' : '')
            . ' <button class="button button-small">' . esc_html__('Sign out', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        $families = $this->world_families($session);
        if (is_wp_error($families)) {
            echo '<div class="notice notice-error"><p>' . esc_html($families->get_error_message()) . '</p></div>';
            $families = array();
        }
        $fam_level = isset($_GET['family_level']) ? absint($_GET['family_level']) : 0;

        // Step 1: family (international level).
        echo '<form method="get" action="' . esc_url(admin_url('admin.php')) . '" data-rti-loading="' . esc_attr__('Loading levels from .WORLD…', 'rt-event-manager') . '">';
        echo '<input type="hidden" name="page" value="' . esc_attr(self::PAGE_SLUG) . '" /><input type="hidden" name="source" value="world" />';
        echo '<p><label for="family_level"><strong>' . esc_html__('Family', 'rt-event-manager') . '</strong></label> <select name="family_level" id="family_level">';
        echo '<option value="">' . esc_html__('— Choose —', 'rt-event-manager') . '</option>';
        foreach ((array) $families as $f) {
            if (!is_array($f) || empty($f['id'])) {
                continue;
            }
            echo '<option value="' . esc_attr($f['id']) . '"' . selected($fam_level, (int) $f['id'], false) . '>' . esc_html(isset($f['name']) ? $f['name'] : ('#' . $f['id'])) . '</option>';
        }
        echo '</select> <button class="button">' . esc_html__('Show levels', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        if (!$fam_level) {
            return;
        }

        // Step 2: level (the international level itself, or a child such as a national association).
        $level = $this->api('GET', 'directory/' . $fam_level . '/', null, $session);
        if (is_wp_error($level)) {
            echo '<div class="notice notice-error"><p>' . esc_html($level->get_error_message()) . '</p></div>';
            return;
        }
        $fam_name = isset($level['name']) ? (string) $level['name'] : ('#' . $fam_level);
        echo '<form method="post" action="' . esc_url($this->page_url(array('source' => 'world'))) . '" data-rti-loading="' . esc_attr__('Loading the board from .WORLD — this can take up to a minute with area presidents…', 'rt-event-manager') . '">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="world_board" />';
        echo '<table class="form-table" role="presentation">';
        echo '<tr><th><label for="world_level">' . esc_html__('Board of', 'rt-event-manager') . '</label></th><td><select name="world_level" id="world_level" onchange="this.form.world_level_label.value=this.options[this.selectedIndex].text">';
        echo '<option value="' . esc_attr($fam_level) . '">' . esc_html(sprintf(__('%s (international board)', 'rt-event-manager'), $fam_name)) . '</option>';
        foreach ((array) (isset($level['children']) ? $level['children'] : array()) as $c) {
            if (is_array($c) && !empty($c['id'])) {
                echo '<option value="' . esc_attr($c['id']) . '">' . esc_html(isset($c['name']) ? $c['name'] : ('#' . $c['id'])) . '</option>';
            }
        }
        echo '</select><input type="hidden" name="world_level_label" value="' . esc_attr(sprintf(__('%s (international board)', 'rt-event-manager'), $fam_name)) . '" />';
        echo '<p class="description">' . esc_html__('Or enter a .WORLD level ID directly:', 'rt-event-manager') . ' <input type="number" name="world_level_manual" class="small-text" min="1" /></p></td></tr>';
        echo '<tr><th>' . esc_html__('Include', 'rt-event-manager') . '</th><td>'
            . '<label><input type="checkbox" name="world_assistants" value="1" /> ' . esc_html__('Board assistants', 'rt-event-manager') . '</label><br />'
            . '<label><input type="checkbox" name="world_area_presidents" value="1" /> ' . esc_html__('Area presidents', 'rt-event-manager') . '</label>'
            . '<p class="description">' . esc_html__('For a national level: also loads the President of each area below it (they sit on the area board, not the national board). Takes a little longer.', 'rt-event-manager') . '</p>'
            . '</td></tr>';
        echo '</table>';
        submit_button(__('Load board', 'rt-event-manager'));
        echo '</form>';
    }

    private function render_excel_form() {
        $tpl = wp_nonce_url(admin_url('admin-post.php?action=rti_group_import_template'), self::NONCE);
        echo '<p style="max-width:780px">' . esc_html__('Upload an .xlsx, .xls or .csv file with one person per row. Required columns: First name, Last name, Email. Optional: .WORLD ID, Family (RT, C41, LC, AC, TC), Club, Association (needed to make someone a delegate), Function, Phone, Country.', 'rt-event-manager')
            . ' <a href="' . esc_url($tpl) . '">' . esc_html__('Download the template', 'rt-event-manager') . '</a>.</p>';
        echo '<p class="description" style="max-width:780px">' . esc_html__('Tip: include the .WORLD ID where you know it — members are then matched to their account on .WORLD sign-in even if their .WORLD email differs from the one in the sheet.', 'rt-event-manager') . '</p>';
        echo '<form method="post" enctype="multipart/form-data" action="' . esc_url($this->page_url(array('source' => 'excel'))) . '" data-rti-loading="' . esc_attr__('Reading the spreadsheet…', 'rt-event-manager') . '">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="excel_upload" />';
        echo '<p><input type="file" name="rti_gi_file" accept=".xlsx,.xls,.csv" required /></p>';
        submit_button(__('Upload and preview', 'rt-event-manager'));
        echo '</form>';
    }

    private function render_preview($rows) {
        $source_label = (string) get_transient('rti_gi_source_' . self::uid());
        $families     = self::families();
        $products     = $this->ticket_products();
        $coupons      = $this->coupons();

        echo '<h2>' . esc_html__('Preview', 'rt-event-manager') . ($source_label ? ' <span style="font-weight:400;color:#646970">— ' . esc_html($source_label) . '</span>' : '') . '</h2>';
        echo '<p class="description">' . esc_html__('Tick the people to import. Emails can be edited — .WORLD only returns emails members share, so fill in any that are missing. Tick "Delegate" to make someone a delegate (off by default; the usual delegate rules apply — hosting family, two per association).', 'rt-event-manager') . '</p>';

        echo '<form method="post" action="' . esc_url($this->page_url()) . '" data-rti-loading="' . esc_attr__('Creating accounts, orders and tickets — please keep this page open…', 'rt-event-manager') . '">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="import" />';

        echo '<table class="widefat striped" style="margin-top:8px"><thead><tr>';
        echo '<td class="check-column"><input type="checkbox" onclick="var c=this.checked;this.closest(\'table\').querySelectorAll(\'tbody input.rti-gi-sel:not(:disabled)\').forEach(function(x){x.checked=c;});" /></td>';
        foreach (array(__('Name', 'rt-event-manager'), __('Email', 'rt-event-manager'), __('.WORLD ID', 'rt-event-manager'), __('Family / Club', 'rt-event-manager'), __('Function', 'rt-event-manager')) as $h) {
            echo '<th>' . esc_html($h) . '</th>';
        }
        // Delegate column: select-all for the changeable delegate checkboxes.
        echo '<th><label style="white-space:nowrap"><input type="checkbox" title="' . esc_attr__('Select all delegates', 'rt-event-manager') . '" onclick="var c=this.checked;this.closest(\'table\').querySelectorAll(\'tbody input.rti-gi-dl:not(:disabled)\').forEach(function(x){x.checked=c;});" /> '
            . esc_html__('Delegate', 'rt-event-manager') . '</label></th>';
        echo '<th>' . esc_html__('Account', 'rt-event-manager') . '</th>';
        echo '</tr></thead><tbody>';
        foreach ($rows as $i => $r) {
            $user   = self::find_user($r);
            $cand   = $user ? null : self::name_match($r);
            $has    = $user && RT_Event_Manager::instance()->user_has_event_ticket($user->ID);
            if ($user) {
                $status = $has
                    ? '<span style="color:#996800">' . esc_html__('Existing — already has a ticket (only profile and delegate are updated)', 'rt-event-manager') . '</span>'
                    : '<a href="' . esc_url(get_edit_user_link($user->ID)) . '">' . esc_html(sprintf(__('Existing account #%d', 'rt-event-manager'), $user->ID)) . '</a>';
            } elseif ($cand) {
                // No email match, but an account with the same name exists —
                // most likely the same person signed in with another email.
                $cand_has = RT_Event_Manager::instance()->user_has_event_ticket($cand->ID);
                $status = '<label style="color:#996800"><input type="checkbox" name="rti_gi_link[' . esc_attr($i) . ']" value="' . esc_attr($cand->ID) . '" checked /> '
                    . esc_html(sprintf(__('Use existing account #%1$d (same name, %2$s)', 'rt-event-manager'), $cand->ID, $cand->user_email)) . '</label>'
                    . ($cand_has ? '<br /><small>' . esc_html__('It already has a ticket — only profile and delegate are updated.', 'rt-event-manager') . '</small>' : '')
                    . '<br /><small>' . esc_html__('Untick to create a separate new account.', 'rt-event-manager') . '</small>';
                $has = $cand_has;
            } else {
                $status = esc_html__('New account', 'rt-event-manager');
            }
            $fam = (isset($r['family']) && '' !== $r['family'] && isset($families[$r['family']])) ? $families[$r['family']] : '';
            echo '<tr>';
            echo '<th scope="row" class="check-column"><input type="checkbox" class="rti-gi-sel" name="rti_gi_sel[]" value="' . esc_attr($i) . '"' . ($has ? '' : ' checked') . ' /></th>';
            echo '<td><strong>' . esc_html(trim($r['first_name'] . ' ' . $r['last_name'])) . '</strong></td>';
            echo '<td><input type="email" name="rti_gi_email[' . esc_attr($i) . ']" value="' . esc_attr($r['email']) . '" class="regular-text"' . ('' === $r['email'] ? ' placeholder="' . esc_attr__('Email required', 'rt-event-manager') . '" style="border-color:#d63638"' : '') . ' /></td>';
            echo '<td>' . esc_html('' !== (string) $r['world_id'] ? $r['world_id'] : (isset($r['world_member_id']) ? $r['world_member_id'] : '')) . '</td>';
            // Association the member will have (needed for delegate status).
            $assoc = $user ? RT_Event_Manager::delegate_user_association($user->ID) : '';
            if (!empty($r['org_lock']) && preg_match('/\binternational\s*$/i', $assoc)) {
                $assoc = ''; // an earlier "… International" label — replaced by the home association
            }
            if ('' === $assoc) {
                $assoc = RT_Event_Manager::association_from_club(isset($r['club_domain']) ? $r['club_domain'] : '', isset($r['family']) ? $r['family'] : '');
            }
            if ('' === $assoc && !empty($r['association'])) {
                $assoc = $r['association'];
            }
            echo '<td>' . esc_html(trim($fam . ' ' . $r['club']))
                . '<br /><small style="color:' . ('' === $assoc ? '#d63638' : '#646970') . '">'
                . esc_html('' !== $assoc ? $assoc : __('No association — cannot be a delegate', 'rt-event-manager')) . '</small></td>';
            echo '<td>' . esc_html($r['function']) . '</td>';
            $is_dl = $user && 'delegate' === RT_Event_Manager::get_delegate_status($user->ID);
            echo '<td>' . ($is_dl
                ? '<span title="' . esc_attr__('Already a delegate', 'rt-event-manager') . '">✓ ' . esc_html__('Delegate', 'rt-event-manager') . '</span>'
                : '<label><input type="checkbox" class="rti-gi-dl" name="rti_gi_delegate[' . esc_attr($i) . ']" value="1" /> ' . esc_html__('Delegate', 'rt-event-manager') . '</label>') . '</td>';
            echo '<td>' . $status . '</td>'; // phpcs:ignore -- escaped above
            echo '</tr>';
        }
        echo '</tbody></table>';

        echo '<table class="form-table" role="presentation">';
        echo '<tr><th><label for="rti_gi_product">' . esc_html__('Ticket', 'rt-event-manager') . '</label></th><td><select name="rti_gi_product" id="rti_gi_product" required>';
        foreach ($products as $p) {
            echo '<option value="' . esc_attr($p->get_id()) . '">' . esc_html($p->get_name()) . ' — ' . esc_html(wp_strip_all_tags($p->get_price_html())) . '</option>';
        }
        echo '</select></td></tr>';
        echo '<tr><th><label for="rti_gi_coupon">' . esc_html__('Coupon', 'rt-event-manager') . '</label></th><td><select name="rti_gi_coupon" id="rti_gi_coupon" required>';
        echo '<option value="">' . esc_html__('— Choose a coupon —', 'rt-event-manager') . '</option>';
        foreach ($coupons as $c) {
            $wc = new WC_Coupon($c->ID);
            $amount = ('percent' === $wc->get_discount_type()) ? $wc->get_amount() . '%' : wp_strip_all_tags(wc_price($wc->get_amount()));
            echo '<option value="' . esc_attr($wc->get_code()) . '">' . esc_html(strtoupper($wc->get_code()) . ' — ' . $amount) . '</option>';
        }
        echo '</select><p class="description">' . esc_html__('The coupon must cover the full ticket price (e.g. 100% off). Each order is created as Completed with the coupon applied, so it appears on the invoice.', 'rt-event-manager') . '</p></td></tr>';
        echo '</table>';

        echo '<p class="submit"><button type="submit" class="button button-primary" onclick="return confirm(\'' . esc_js(__('Create accounts, orders and tickets for the ticked people?', 'rt-event-manager')) . '\');">' . esc_html__('Import selected', 'rt-event-manager') . '</button></p>';
        echo '</form>';

        echo '<form method="post" action="' . esc_url($this->page_url()) . '">';
        wp_nonce_field(self::NONCE);
        echo '<input type="hidden" name="rti_gi_action" value="clear" /><button class="button">' . esc_html__('Start over', 'rt-event-manager') . '</button>';
        echo '</form>';
    }

    private function render_results() {
        $res = get_transient('rti_gi_result_' . self::uid());
        if (!is_array($res) || empty($res['rows'])) {
            return;
        }
        $labels = array(
            'created' => __('Account created, ticket issued', 'rt-event-manager'),
            'linked'  => __('Existing account, ticket issued', 'rt-event-manager'),
            'skipped' => __('No new ticket', 'rt-event-manager'),
            'error'   => __('Error', 'rt-event-manager'),
        );
        $counts = array_count_values(wp_list_pluck($res['rows'], 'outcome'));
        echo '<div class="notice notice-info"><p><strong>' . esc_html(sprintf(__('Import %s finished.', 'rt-event-manager'), $res['batch'])) . '</strong> '
            . esc_html(sprintf(
                /* translators: 1: created, 2: linked, 3: skipped, 4: errors */
                __('%1$d new accounts, %2$d existing accounts ticketed, %3$d skipped, %4$d errors.', 'rt-event-manager'),
                isset($counts['created']) ? $counts['created'] : 0,
                isset($counts['linked']) ? $counts['linked'] : 0,
                isset($counts['skipped']) ? $counts['skipped'] : 0,
                isset($counts['error']) ? $counts['error'] : 0
            )) . '</p></div>';
        echo '<table class="widefat striped" style="max-width:1000px;margin-bottom:24px"><thead><tr><th>' . esc_html__('Name', 'rt-event-manager') . '</th><th>' . esc_html__('Email', 'rt-event-manager') . '</th><th>' . esc_html__('Result', 'rt-event-manager') . '</th><th>' . esc_html__('Order', 'rt-event-manager') . '</th></tr></thead><tbody>';
        foreach ($res['rows'] as $r) {
            $order = $r['order_id'] ? wc_get_order($r['order_id']) : null;
            echo '<tr><td>' . ($r['user_id'] ? '<a href="' . esc_url(get_edit_user_link($r['user_id'])) . '">' . esc_html($r['name']) . '</a>' : esc_html($r['name'])) . '</td>';
            echo '<td>' . esc_html($r['email']) . '</td>';
            echo '<td>' . esc_html($labels[$r['outcome']]) . ('' !== $r['message'] ? ' — ' . esc_html($r['message']) : '') . '</td>';
            echo '<td>' . ($order ? '<a href="' . esc_url($order->get_edit_order_url()) . '">#' . esc_html($order->get_order_number()) . '</a>' : '—') . '</td></tr>';
        }
        echo '</tbody></table>';
    }
}
