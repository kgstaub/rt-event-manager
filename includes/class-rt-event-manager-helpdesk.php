<?php
/**
 * Helpdesk integration — FreeScout (self-hosted) support tickets.
 *
 * Adds a "Get help" tab to the member account portal where a member can:
 *   - open a new support request (choosing a topic), which is pushed to
 *     FreeScout as a conversation with the member's details attached;
 *   - see their previous tickets and their status;
 *   - open a ticket in a chat-style view, read staff replies and reply back,
 *     including file attachments (images, PDF, Word, Excel).
 *
 * All member-facing calls are proxied server-side so the FreeScout base URL and
 * API key never reach the browser, and every read/reply is checked to belong to
 * the logged-in member (by customer email) before anything is returned.
 *
 * Requires the FreeScout "API & Webhooks" module. The bundled WooCommerce module
 * links the member's orders in the FreeScout sidebar automatically (by email).
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_Helpdesk {

    /** @var RT_Event_Manager_Helpdesk|null */
    private static $instance = null;

    /** Option keys. */
    const OPT_ENABLED = 'rt_event_manager_helpdesk_enabled';
    const OPT_URL     = 'rt_event_manager_helpdesk_url';
    const OPT_KEY     = 'rt_event_manager_helpdesk_api_key'; // stored encrypted
    const OPT_MAILBOX = 'rt_event_manager_helpdesk_mailbox';
    const OPT_NUM_PREFIX = 'rt_event_manager_helpdesk_num_prefix';
    const OPT_NUM_SUFFIX = 'rt_event_manager_helpdesk_num_suffix';

    // Defaults mirror the FreeScout Ticket Number module .env config
    // (TICKETNUMBER_PREFIX / TICKETNUMBER_SUFFIX) for this event.
    const DEFAULT_NUM_PREFIX = 'RTIHYM27-';
    const DEFAULT_NUM_SUFFIX = '-CS';

    /** Upload limits. */
    const MAX_FILES    = 5;
    const MAX_FILE_MB  = 10;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Admin: settings page + save handler.
        add_action('admin_menu', array($this, 'add_admin_menu'), 30);
        add_action('admin_init', array($this, 'handle_settings_post'));

        // Member AJAX (logged-in only).
        add_action('wp_ajax_rt_help_create', array($this, 'ajax_create'));
        add_action('wp_ajax_rt_help_list', array($this, 'ajax_list'));
        add_action('wp_ajax_rt_help_thread', array($this, 'ajax_thread'));
        add_action('wp_ajax_rt_help_reply', array($this, 'ajax_reply'));
        add_action('wp_ajax_rt_help_attachment', array($this, 'ajax_attachment'));
        add_action('wp_ajax_rt_help_delete', array($this, 'ajax_delete'));
    }

    /* ---------------------------------------------------------------------
     * Configuration
     * ------------------------------------------------------------------- */

    /** The support topics offered on the new-request form (slug => label). */
    public static function topics() {
        return array(
            'general' => __('General question', 'rt-event-manager'),
            'tours'   => __('Question regarding pre- or day tours', 'rt-event-manager'),
            'hym'     => __('Questions regarding the HYM', 'rt-event-manager'),
            'payment' => __('Questions regarding payment and refunds', 'rt-event-manager'),
            'travel'  => __('Questions regarding travel support', 'rt-event-manager'),
        );
    }

    public static function is_enabled() {
        return 'yes' === get_option(self::OPT_ENABLED, 'no');
    }

    /**
     * The attendees a member can point a question at: their own + companion
     * ticket holders (unique names), keyed by name, plus an "all" option.
     *
     * @param int $user_id
     * @return array value => label
     */
    private function attendee_options($user_id) {
        $options = array('all' => __('All attendees', 'rt-event-manager'));
        if (!class_exists('RT_Event_Manager')) {
            return $options;
        }
        foreach ((array) RT_Event_Manager::get_tickets_for_user($user_id) as $t) {
            $name = isset($t['holder_name']) ? trim((string) $t['holder_name']) : '';
            if ('' === $name) {
                continue;
            }
            // Key by a normalised name so duplicates across tickets collapse.
            $key = strtolower($name);
            if (!isset($options[$key])) {
                $options[$key] = $name;
            }
        }
        return $options;
    }

    /** Base URL without a trailing slash, e.g. https://help.rtihym2027.ch */
    public function base_url() {
        return untrailingslashit(trim((string) get_option(self::OPT_URL, '')));
    }

    public function mailbox_id() {
        return absint(get_option(self::OPT_MAILBOX, 0));
    }

    /**
     * Format a conversation number to match the FreeScout Ticket Number module's
     * display, applying the admin-configured prefix and suffix.
     */
    public function format_ticket_number($number) {
        $number = absint($number);
        $prefix = (string) get_option(self::OPT_NUM_PREFIX, self::DEFAULT_NUM_PREFIX);
        $suffix = (string) get_option(self::OPT_NUM_SUFFIX, self::DEFAULT_NUM_SUFFIX);
        if ('' === $prefix && '' === $suffix) {
            return '#' . $number; // both explicitly cleared
        }
        return $prefix . $number . $suffix;
    }

    public function api_key() {
        return self::decrypt((string) get_option(self::OPT_KEY, ''));
    }

    /** Configured = enabled + has URL, key and a mailbox. */
    public function is_configured() {
        return $this->base_url() !== '' && $this->api_key() !== '' && $this->mailbox_id() > 0;
    }

    /** Available to members = enabled and fully configured. */
    public static function is_available() {
        $i = self::instance();
        return self::is_enabled() && $i->is_configured();
    }

    /**
     * Number of the member's open tickets whose last message is from support
     * (i.e. awaiting the member). Checked live on each call so the nav badge is
     * always current; a short timeout keeps a slow/unreachable helpdesk from
     * holding up the portal, and any error simply counts as 0 (no badge).
     *
     * @param int $user_id
     * @return int
     */
    public function unread_reply_count($user_id) {
        $user_id = absint($user_id);
        if (!$user_id || !self::is_available()) {
            return 0;
        }
        $user = get_userdata($user_id);
        if (!$user) {
            return 0;
        }

        $path = '/api/conversations?embed=threads&pageSize=50'
            . '&mailboxId=' . $this->mailbox_id()
            . '&customerEmail=' . rawurlencode($user->user_email);
        $res = $this->api('GET', $path, null, 8);
        if (is_wp_error($res)) {
            return 0;
        }

        $map    = $this->get_read_map($user_id);
        $hidden = $this->get_hidden($user_id);
        $count  = 0;
        foreach ($this->extract($res, 'conversations') as $c) {
            if (!$this->conversation_belongs_to($c, $user->user_email)) {
                continue;
            }
            $cid = isset($c['id']) ? absint($c['id']) : 0;
            if (in_array($cid, $hidden, true) || $this->is_deleted($c)) {
                continue;
            }
            $status = isset($c['status']) ? strtolower((string) $c['status']) : '';
            if ('closed' === $status) {
                continue;
            }
            $meta = $this->last_message_meta($c);
            if ('support' === $meta['from'] && !$this->is_read($map, $cid, $meta['time'])) {
                $count++;
            }
        }
        return $count;
    }

    /* ---------------------------------------------------------------------
     * Encryption (mirrors the visa module; the API key is a secret)
     * ------------------------------------------------------------------- */

    private static function key() {
        if (defined('RT_HELPDESK_ENC_KEY') && RT_HELPDESK_ENC_KEY) {
            return hash('sha256', (string) RT_HELPDESK_ENC_KEY, true);
        }
        return hash('sha256', wp_salt('secure_auth') . '|rt-event-helpdesk', true);
    }

    public static function encrypt($plaintext) {
        $plaintext = (string) $plaintext;
        if ('' === $plaintext || !function_exists('openssl_encrypt')) {
            return $plaintext;
        }
        $iv = openssl_random_pseudo_bytes(16);
        $ct = openssl_encrypt($plaintext, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv);
        return (false === $ct) ? '' : base64_encode($iv . $ct);
    }

    public static function decrypt($b64) {
        $b64 = (string) $b64;
        if ('' === $b64 || !function_exists('openssl_decrypt')) {
            return $b64;
        }
        $raw = base64_decode($b64, true);
        if (false === $raw || strlen($raw) < 17) {
            return '';
        }
        $iv = substr($raw, 0, 16);
        $ct = substr($raw, 16);
        $pt = openssl_decrypt($ct, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv);
        return (false === $pt) ? '' : $pt;
    }

    /* ---------------------------------------------------------------------
     * FreeScout API client
     * ------------------------------------------------------------------- */

    /**
     * Perform an API request.
     *
     * @param string     $method GET|POST|PUT
     * @param string     $path   e.g. '/api/conversations'
     * @param array|null $body   JSON body for POST/PUT
     * @return array|WP_Error Decoded JSON (array) on success, WP_Error otherwise.
     */
    private function api($method, $path, $body = null, $timeout = 25) {
        $base = $this->base_url();
        $key  = $this->api_key();
        if ('' === $base || '' === $key) {
            return new WP_Error('rt_help_unconfigured', __('The helpdesk is not configured.', 'rt-event-manager'));
        }
        $args = array(
            'method'  => $method,
            'timeout' => $timeout,
            'headers' => array(
                'X-FreeScout-API-Key' => $key,
                'Accept'              => 'application/json',
            ),
        );
        if (null !== $body) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body'] = wp_json_encode($body);
        }
        $resp = wp_remote_request($base . $path, $args);
        if (is_wp_error($resp)) {
            return $resp;
        }
        $code = wp_remote_retrieve_response_code($resp);
        $raw  = wp_remote_retrieve_body($resp);
        $data = json_decode($raw, true);
        if ($code < 200 || $code >= 300) {
            $msg = is_array($data) && isset($data['message']) ? $data['message'] : ('HTTP ' . $code);
            return new WP_Error('rt_help_http', $msg, array('status' => $code, 'body' => $raw));
        }
        return is_array($data) ? $data : array();
    }

    /** List the mailboxes (used by the settings page to pick one). */
    public function get_mailboxes() {
        $data = $this->api('GET', '/api/mailboxes?pageSize=100');
        if (is_wp_error($data)) {
            return $data;
        }
        return $this->extract($data, 'mailboxes');
    }

    /**
     * Pull a named embedded collection out of a FreeScout HAL response, whether
     * it arrived under _embedded.<name>, a flat <name> key, or as a bare list.
     */
    private function extract($data, $name) {
        if (isset($data['_embedded'][$name]) && is_array($data['_embedded'][$name])) {
            return $data['_embedded'][$name];
        }
        if (isset($data[$name]) && is_array($data[$name])) {
            return $data[$name];
        }
        // A bare list (e.g. GET /mailboxes returning an array).
        if (is_array($data) && isset($data[0])) {
            return $data;
        }
        return array();
    }

    /* ---------------------------------------------------------------------
     * Member context gathered for the helpdesk
     * ------------------------------------------------------------------- */

    /** Build the "member details" block that staff see on a new ticket. */
    private function member_context($user_id) {
        $user = get_userdata($user_id);
        if (!$user) {
            return array('lines' => array(), 'first' => '', 'last' => '', 'email' => '');
        }
        $first = $user->first_name;
        $last  = $user->last_name;
        $name  = trim($first . ' ' . $last);
        if ('' === $name) {
            $name = $user->display_name;
        }

        $function   = (string) get_user_meta($user_id, 'rti_function', true);
        $club       = (string) get_user_meta($user_id, 'rti_club', true);
        $family_raw = (string) get_user_meta($user_id, 'rti_family', true);
        $family     = ('' !== $family_raw && class_exists('RT_Event_Manager'))
            ? RT_Event_Manager::get_family_label($family_raw) : '';
        $world_id   = (string) get_user_meta($user_id, 'world_id', true);

        $lines = array();
        $lines[] = sprintf(__('Name: %s', 'rt-event-manager'), $name !== '' ? $name : '—');
        $lines[] = sprintf(__('Email: %s', 'rt-event-manager'), $user->user_email);
        if ('' !== $function) {
            $lines[] = sprintf(__('Function: %s', 'rt-event-manager'), $function);
        }
        if ('' !== $club || '' !== $family) {
            $lines[] = sprintf(__('Club: %s', 'rt-event-manager'), trim($club . ($family !== '' ? ' (' . $family . ')' : '')));
        }
        $association = (string) get_user_meta($user_id, 'rti_association', true);
        if ('' === $association) {
            $association = RT_Event_Manager::association_from_club(
                get_user_meta($user_id, 'rti_club_domain', true),
                $family_raw
            );
        }
        if ('' !== $association) {
            $lines[] = sprintf(__('Association: %s', 'rt-event-manager'), $association);
        }
        if ('' !== $world_id) {
            $lines[] = sprintf(__('.WORLD ID: %s', 'rt-event-manager'), $world_id);
        }

        // Orders.
        if (function_exists('wc_get_orders')) {
            $order_ids = wc_get_orders(array(
                'customer_id' => $user_id,
                'limit'       => 30,
                'return'      => 'ids',
                'orderby'     => 'date',
                'order'       => 'DESC',
            ));
            $order_bits = array();
            foreach ((array) $order_ids as $oid) {
                $o = wc_get_order($oid);
                if ($o) {
                    $order_bits[] = '#' . $o->get_order_number() . ' (' . wc_get_order_status_name($o->get_status()) . ')';
                }
            }
            if (!empty($order_bits)) {
                $lines[] = sprintf(__('Orders: %s', 'rt-event-manager'), implode(', ', $order_bits));
            }
        }

        // Tickets — also derive FreeScout tags from confirmed tickets held.
        $tags      = array();
        $type_tags = array();
        $confirmed = false;
        if (class_exists('RT_Event_Manager')) {
            // Statuses that count as a confirmed (held) ticket.
            $confirmed_statuses = array('valid', 'checked_in', 'on_tour', 'attended');
            // Ticket kind => tag.
            $kind_tag = array(
                'pretour' => 'PRE',
                'daytour' => 'DAY',
                'event'   => 'EVENT',
                'minor'   => 'EVENT',
                'staff'   => 'EVENT',
            );

            $tickets = RT_Event_Manager::get_tickets_for_user($user_id);
            $tbits   = array();
            foreach ((array) $tickets as $t) {
                $pid   = isset($t['product_id']) ? absint($t['product_id']) : 0;
                $pname = $pid ? get_the_title($pid) : '';
                $hold  = isset($t['holder_name']) ? $t['holder_name'] : '';
                $label = $pname !== '' ? $pname : __('Ticket', 'rt-event-manager');
                if ('' !== $hold) {
                    $label .= ' — ' . $hold;
                }
                $tbits[] = $label;

                $status = isset($t['status']) ? $t['status'] : '';
                if (in_array($status, $confirmed_statuses, true)) {
                    $confirmed = true;
                    $kind = RT_Event_Manager::get_ticket_kind($t);
                    if (isset($kind_tag[$kind])) {
                        $type_tags[$kind_tag[$kind]] = true;
                    }
                }
            }
            if (!empty($tbits)) {
                $lines[] = sprintf(__('Tickets: %s', 'rt-event-manager'), implode('; ', $tbits));
            }
        }

        // Tag confirmed attendees + the ticket types they hold (stable literals,
        // not translated, so FreeScout filtering stays consistent per site).
        if ($confirmed) {
            $tags[] = 'Confirmed Attendee';
            foreach (array('EVENT', 'PRE', 'DAY') as $tt) {
                if (isset($type_tags[$tt])) {
                    $tags[] = $tt;
                }
            }
        }

        return array('lines' => $lines, 'first' => $first, 'last' => $last, 'email' => $user->user_email, 'name' => $name, 'tags' => $tags);
    }

    /* ---------------------------------------------------------------------
     * File handling
     * ------------------------------------------------------------------- */

    /** Allowed upload types: images, PDF, Word, Excel. */
    private function allowed_mimes() {
        return array(
            'jpg|jpeg' => 'image/jpeg',
            'png'      => 'image/png',
            'gif'      => 'image/gif',
            'webp'     => 'image/webp',
            'heic'     => 'image/heic',
            'pdf'      => 'application/pdf',
            'doc'      => 'application/msword',
            'docx'     => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls'      => 'application/vnd.ms-excel',
            'xlsx'     => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
    }

    /**
     * Read the posted $_FILES['files'] into FreeScout attachment payloads
     * ({ fileName, mimeType, data }). Returns [attachments[], error|''].
     */
    private function collect_attachments() {
        $out = array();
        if (empty($_FILES['files']) || empty($_FILES['files']['name'])) {
            return array($out, '');
        }
        $files  = $_FILES['files'];
        $count  = is_array($files['name']) ? count($files['name']) : 0;
        if ($count > self::MAX_FILES) {
            return array($out, sprintf(__('Please attach at most %d files.', 'rt-event-manager'), self::MAX_FILES));
        }
        $allowed = $this->allowed_mimes();
        $max     = self::MAX_FILE_MB * 1024 * 1024;

        for ($i = 0; $i < $count; $i++) {
            if (!isset($files['error'][$i]) || UPLOAD_ERR_NO_FILE === $files['error'][$i]) {
                continue;
            }
            if (UPLOAD_ERR_OK !== $files['error'][$i]) {
                return array($out, __('One of the files failed to upload. Please try again.', 'rt-event-manager'));
            }
            $tmp  = $files['tmp_name'][$i];
            $name = sanitize_file_name($files['name'][$i]);
            if (!is_uploaded_file($tmp)) {
                return array($out, __('Invalid upload.', 'rt-event-manager'));
            }
            if (filesize($tmp) > $max) {
                return array($out, sprintf(__('"%1$s" is larger than the %2$d MB limit.', 'rt-event-manager'), $name, self::MAX_FILE_MB));
            }
            $check = wp_check_filetype_and_ext($tmp, $name, $allowed);
            $type  = $check['type'] ? $check['type'] : '';
            if ('' === $type || !in_array($type, $allowed, true)) {
                return array($out, sprintf(__('"%s" is not an allowed file type. Allowed: images, PDF, Word, Excel.', 'rt-event-manager'), $name));
            }
            $bytes = file_get_contents($tmp);
            if (false === $bytes) {
                return array($out, __('Could not read an uploaded file.', 'rt-event-manager'));
            }
            $out[] = array(
                'fileName' => $name,
                'mimeType' => $type,
                'data'     => base64_encode($bytes),
            );
        }
        return array($out, '');
    }

    /* ---------------------------------------------------------------------
     * AJAX: create a ticket
     * ------------------------------------------------------------------- */

    private function require_member() {
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => __('Please sign in.', 'rt-event-manager')), 403);
        }
        check_ajax_referer('rt_help', 'nonce');
        if (!self::is_available()) {
            wp_send_json_error(array('message' => __('The helpdesk is currently unavailable.', 'rt-event-manager')), 503);
        }
    }

    public function ajax_create() {
        $this->require_member();
        $uid    = get_current_user_id();
        $topics = self::topics();
        $topic  = isset($_POST['topic']) ? sanitize_key(wp_unslash($_POST['topic'])) : '';
        $subject_in = isset($_POST['subject']) ? sanitize_text_field(wp_unslash($_POST['subject'])) : '';
        $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';

        if (!isset($topics[$topic])) {
            wp_send_json_error(array('message' => __('Please choose a topic.', 'rt-event-manager')));
        }
        if ('' === trim($subject_in)) {
            wp_send_json_error(array('message' => __('Please enter a subject.', 'rt-event-manager')));
        }
        if ('' === trim($message)) {
            wp_send_json_error(array('message' => __('Please describe your question.', 'rt-event-manager')));
        }

        list($attachments, $file_err) = $this->collect_attachments();
        if ('' !== $file_err) {
            wp_send_json_error(array('message' => $file_err));
        }

        // Which attendee the question is about (validated against the member's
        // own attendees; defaults to "all").
        $attendees = $this->attendee_options($uid);
        $attendee  = isset($_POST['attendee']) ? sanitize_text_field(wp_unslash($_POST['attendee'])) : 'all';
        $attendee_key = strtolower($attendee);
        if (!isset($attendees[$attendee_key])) {
            $attendee_key = 'all';
        }
        $attendee_label = $attendees[$attendee_key];

        $ctx     = $this->member_context($uid);
        // Subject: "Question type - subject".
        $subject = $topics[$topic] . ' - ' . $subject_in;

        // Compose the thread body: the member's message, then a details block so
        // the helpdesk always receives the member's context (name, function,
        // club, orders, tickets) even without the WooCommerce sidebar module.
        $body  = '<p>' . nl2br(esc_html($message)) . '</p>';
        $body .= '<p><strong>' . esc_html__('Topic', 'rt-event-manager') . ':</strong> ' . esc_html($topics[$topic]) . '</p>';
        $body .= '<p><strong>' . esc_html__('Question relates to attendee:', 'rt-event-manager') . '</strong> ' . esc_html($attendee_label) . '</p>';
        if (!empty($ctx['lines'])) {
            $body .= '<hr><p><strong>' . esc_html__('Member details', 'rt-event-manager') . '</strong></p><ul>';
            foreach ($ctx['lines'] as $line) {
                $body .= '<li>' . esc_html($line) . '</li>';
            }
            $body .= '</ul>';
        }

        $customer_thread = array(
            'type' => 'customer',
            'text' => $body,
        );
        if (!empty($attachments)) {
            $customer_thread['attachments'] = $attachments;
        }

        $payload = array(
            'type'      => 'email',
            'mailboxId' => $this->mailbox_id(),
            'subject'   => $subject,
            'customer'  => array(
                'email'     => $ctx['email'],
                'firstName' => $ctx['first'],
                'lastName'  => $ctx['last'],
            ),
            'threads'   => array($customer_thread),
            'status'    => 'active',
            'imported'  => false, // send notifications / auto-reply as normal
        );

        $res = $this->api('POST', '/api/conversations', $payload);
        if (is_wp_error($res)) {
            wp_send_json_error(array('message' => $this->friendly_error($res)));
        }

        $conv_id = isset($res['id']) ? absint($res['id']) : 0;

        // Tags are set with a separate call (FreeScout Tags module): only
        // "Confirmed Attendee" and the ticket types held (EVENT/PRE/DAY) when the
        // member has a confirmed ticket. The create endpoint ignores an inline
        // tags field.
        $tags = isset($ctx['tags']) ? array_values(array_unique($ctx['tags'])) : array();
        if ($conv_id && !empty($tags)) {
            $tag_res = $this->api('PUT', '/api/conversations/' . $conv_id . '/tags', array('tags' => $tags));
            if (is_wp_error($tag_res)) {
                error_log('[RT Helpdesk] tag update failed for #' . $conv_id . ': ' . $tag_res->get_error_message());
            }
        }

        wp_send_json_success(array(
            'id'      => $conv_id,
            'message' => __('Your request has been sent. Our team will get back to you by email and here.', 'rt-event-manager'),
        ));
    }

    /* ---------------------------------------------------------------------
     * AJAX: list the member's tickets
     * ------------------------------------------------------------------- */

    public function ajax_list() {
        $this->require_member();
        $email = wp_get_current_user()->user_email;

        $path = '/api/conversations?embed=threads&pageSize=50&sortField=updatedAt&sortOrder=desc'
            . '&mailboxId=' . $this->mailbox_id()
            . '&customerEmail=' . rawurlencode($email);
        $res = $this->api('GET', $path);
        if (is_wp_error($res)) {
            wp_send_json_error(array('message' => $this->friendly_error($res)));
        }

        $map    = $this->get_read_map(get_current_user_id());
        $hidden = $this->get_hidden(get_current_user_id());
        $items  = array();
        foreach ($this->extract($res, 'conversations') as $c) {
            // Defensive: only surface conversations that belong to this member.
            if (!$this->conversation_belongs_to($c, $email)) {
                continue;
            }
            $cid = isset($c['id']) ? absint($c['id']) : 0;
            // Skip conversations the member removed, or that an agent deleted.
            if (in_array($cid, $hidden, true) || $this->is_deleted($c)) {
                continue;
            }
            $meta = $this->last_message_meta($c);
            // "read" only matters when support replied last; otherwise treat as read.
            $read = ('support' === $meta['from']) ? $this->is_read($map, $cid, $meta['time']) : true;
            $items[] = array(
                'id'        => $cid,
                'ref'       => $this->format_ticket_number(isset($c['number']) ? $c['number'] : 0),
                'subject'   => isset($c['subject']) ? (string) $c['subject'] : __('(no subject)', 'rt-event-manager'),
                'status'    => isset($c['status']) ? (string) $c['status'] : '',
                'lastFrom'  => $meta['from'],
                'read'      => $read,
                'updatedAt' => isset($c['updatedAt']) ? (string) $c['updatedAt'] : (isset($c['createdAt']) ? (string) $c['createdAt'] : ''),
            );
        }

        wp_send_json_success(array('conversations' => $items));
    }

    /* ---------------------------------------------------------------------
     * AJAX: one conversation's messages (chat view)
     * ------------------------------------------------------------------- */

    public function ajax_thread() {
        $this->require_member();
        $id    = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $email = wp_get_current_user()->user_email;
        if (!$id) {
            wp_send_json_error(array('message' => __('Missing ticket.', 'rt-event-manager')));
        }

        $conv = $this->api('GET', '/api/conversations/' . $id . '?embed=threads');
        if (is_wp_error($conv)) {
            wp_send_json_error(array('message' => $this->friendly_error($conv)));
        }
        if (!$this->conversation_belongs_to($conv, $email)) {
            wp_send_json_error(array('message' => __('You do not have access to this ticket.', 'rt-event-manager')), 403);
        }
        if ($this->is_deleted($conv) || in_array($id, $this->get_hidden(get_current_user_id()), true)) {
            wp_send_json_error(array('message' => __('This ticket is no longer available.', 'rt-event-manager'), 'gone' => true), 410);
        }

        // Reading the conversation marks it read up to its newest message. Report
        // whether it counted as an unread support reply so the nav badge can drop.
        $uid    = get_current_user_id();
        $status = isset($conv['status']) ? strtolower((string) $conv['status']) : '';
        $meta   = $this->last_message_meta($conv);
        $map    = $this->get_read_map($uid);
        $was_unread = ('closed' !== $status)
            && ('support' === $meta['from'])
            && !$this->is_read($map, $id, $meta['time']);
        $this->mark_read($uid, $id, $meta['time']);

        wp_send_json_success(array(
            'id'         => $id,
            'ref'        => $this->format_ticket_number(isset($conv['number']) ? $conv['number'] : 0),
            'subject'    => isset($conv['subject']) ? (string) $conv['subject'] : '',
            'status'     => isset($conv['status']) ? (string) $conv['status'] : '',
            'lastFrom'   => $meta['from'],
            'read'       => true,
            'wasUnread'  => $was_unread,
            'messages'   => $this->format_threads($conv, $id),
        ));
    }

    /* ---------------------------------------------------------------------
     * AJAX: reply to a conversation
     * ------------------------------------------------------------------- */

    public function ajax_reply() {
        $this->require_member();
        $id    = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $email = wp_get_current_user()->user_email;
        $text  = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';
        if (!$id) {
            wp_send_json_error(array('message' => __('Missing ticket.', 'rt-event-manager')));
        }

        list($attachments, $file_err) = $this->collect_attachments();
        if ('' !== $file_err) {
            wp_send_json_error(array('message' => $file_err));
        }
        if ('' === trim($text) && empty($attachments)) {
            wp_send_json_error(array('message' => __('Please write a message.', 'rt-event-manager')));
        }

        // Ownership check before writing.
        $conv = $this->api('GET', '/api/conversations/' . $id . '?embed=threads');
        if (is_wp_error($conv)) {
            wp_send_json_error(array('message' => $this->friendly_error($conv)));
        }
        if (!$this->conversation_belongs_to($conv, $email)) {
            wp_send_json_error(array('message' => __('You do not have access to this ticket.', 'rt-event-manager')), 403);
        }

        $thread = array(
            'type'     => 'customer',
            'text'     => nl2br(esc_html($text !== '' ? $text : '(' . __('see attachment', 'rt-event-manager') . ')')),
            'customer' => array('email' => $email),
        );
        if (!empty($attachments)) {
            $thread['attachments'] = $attachments;
        }

        $res = $this->api('POST', '/api/conversations/' . $id . '/threads', $thread);
        if (is_wp_error($res)) {
            wp_send_json_error(array('message' => $this->friendly_error($res)));
        }

        // Re-fetch to return the updated, canonical message list.
        $conv2 = $this->api('GET', '/api/conversations/' . $id . '?embed=threads');
        $messages = is_wp_error($conv2) ? array() : $this->format_threads($conv2, $id);

        wp_send_json_success(array('id' => $id, 'messages' => $messages));
    }

    /* ---------------------------------------------------------------------
     * AJAX: remove a conversation from the member's list
     * ------------------------------------------------------------------- */

    public function ajax_delete() {
        $this->require_member();
        $id    = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $email = wp_get_current_user()->user_email;
        if (!$id) {
            wp_send_json_error(array('message' => __('Missing ticket.', 'rt-event-manager')));
        }

        // Verify ownership when we can still read it. If it can't be fetched
        // (e.g. already deleted by an agent), hiding it is harmless.
        $conv = $this->api('GET', '/api/conversations/' . $id . '?embed=threads');
        if (!is_wp_error($conv) && !$this->conversation_belongs_to($conv, $email)) {
            wp_send_json_error(array('message' => __('You do not have access to this ticket.', 'rt-event-manager')), 403);
        }

        $this->hide_conversation(get_current_user_id(), $id);
        wp_send_json_success(array('id' => $id));
    }

    /** True when a conversation has been deleted (agent moved it to Deleted). */
    private function is_deleted($conv) {
        $state  = isset($conv['state']) ? strtolower((string) $conv['state']) : '';
        $status = isset($conv['status']) ? strtolower((string) $conv['status']) : '';
        return 'deleted' === $state || 'deleted' === $status;
    }

    /* ---------------------------------------------------------------------
     * AJAX: stream an attachment (owner only, key stays server-side)
     * ------------------------------------------------------------------- */

    public function ajax_attachment() {
        if (!is_user_logged_in()) {
            wp_die(esc_html__('Please sign in.', 'rt-event-manager'), '', array('response' => 403));
        }
        check_admin_referer('rt_help_attachment');
        if (!self::is_available()) {
            wp_die(esc_html__('The helpdesk is unavailable.', 'rt-event-manager'), '', array('response' => 503));
        }
        $conv_id = isset($_GET['id']) ? absint($_GET['id']) : 0;
        $att_id  = isset($_GET['att']) ? absint($_GET['att']) : 0;
        $email   = wp_get_current_user()->user_email;
        if (!$conv_id || !$att_id) {
            wp_die(esc_html__('Missing attachment.', 'rt-event-manager'), '', array('response' => 400));
        }

        $conv = $this->api('GET', '/api/conversations/' . $conv_id . '?embed=threads');
        if (is_wp_error($conv) || !$this->conversation_belongs_to($conv, $email)) {
            wp_die(esc_html__('You do not have access to this attachment.', 'rt-event-manager'), '', array('response' => 403));
        }

        // Find the attachment within this conversation's threads.
        $found = null;
        foreach ($this->extract($conv, 'threads') as $t) {
            foreach ($this->thread_attachments($t) as $a) {
                if (isset($a['id']) && absint($a['id']) === $att_id) {
                    $found = $a;
                    break 2;
                }
            }
        }
        if (!$found) {
            wp_die(esc_html__('Attachment not found.', 'rt-event-manager'), '', array('response' => 404));
        }

        $url = isset($found['fileUrl']) ? $found['fileUrl'] : (isset($found['url']) ? $found['url'] : '');
        if ('' === $url) {
            wp_die(esc_html__('Attachment unavailable.', 'rt-event-manager'), '', array('response' => 404));
        }
        // A relative fileUrl is resolved against the FreeScout base URL.
        if (0 !== strpos($url, 'http://') && 0 !== strpos($url, 'https://')) {
            $url = $this->base_url() . '/' . ltrim($url, '/');
        }

        $resp = wp_remote_get($url, array(
            'timeout' => 25,
            'headers' => array('X-FreeScout-API-Key' => $this->api_key()),
        ));
        if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) !== 200) {
            wp_die(esc_html__('Could not fetch the attachment.', 'rt-event-manager'), '', array('response' => 502));
        }
        $body = wp_remote_retrieve_body($resp);
        $mime = isset($found['mimeType']) ? $found['mimeType'] : 'application/octet-stream';
        $name = isset($found['fileName']) ? $found['fileName'] : ('attachment-' . $att_id);

        nocache_headers();
        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . rawurlencode($name) . '"');
        header('Content-Length: ' . strlen($body));
        echo $body; // phpcs:ignore WordPress.Security.EscapeOutput -- raw binary file
        exit;
    }

    /* ---------------------------------------------------------------------
     * Response shaping helpers
     * ------------------------------------------------------------------- */

    /** True when the conversation's customer is the given member email. */
    private function conversation_belongs_to($conv, $email) {
        $email = strtolower(trim((string) $email));
        if ('' === $email || !is_array($conv)) {
            return false;
        }
        // Primary customer.
        $candidates = array();
        if (isset($conv['customer']['email'])) {
            $candidates[] = $conv['customer']['email'];
        }
        if (isset($conv['createdByCustomer']['email'])) {
            $candidates[] = $conv['createdByCustomer']['email'];
        }
        if (isset($conv['_embedded']['customer']['email'])) {
            $candidates[] = $conv['_embedded']['customer']['email'];
        }
        // The customer thread author.
        foreach ($this->extract($conv, 'threads') as $t) {
            if (isset($t['createdBy']['email']) && (!isset($t['createdBy']['type']) || 'customer' === $t['createdBy']['type'])) {
                $candidates[] = $t['createdBy']['email'];
            }
        }
        foreach ($candidates as $c) {
            if (strtolower(trim((string) $c)) === $email) {
                return true;
            }
        }
        return false;
    }

    /**
     * Metadata about the most recent real message in a conversation.
     *
     * @return array{from:string,time:int,id:int} from is 'support'|'customer'|''
     */
    private function last_message_meta($conv) {
        $threads = array();
        foreach ($this->extract($conv, 'threads') as $t) {
            $type = isset($t['type']) ? $t['type'] : '';
            if (in_array($type, array('customer', 'message'), true)) {
                $threads[] = $t;
            }
        }
        if (empty($threads)) {
            return array('from' => '', 'time' => 0, 'id' => 0);
        }
        // Newest first (by createdAt, then id).
        usort($threads, function ($a, $b) {
            $ta = isset($a['createdAt']) ? strtotime($a['createdAt']) : 0;
            $tb = isset($b['createdAt']) ? strtotime($b['createdAt']) : 0;
            if ($ta === $tb) {
                $ia = isset($a['id']) ? (int) $a['id'] : 0;
                $ib = isset($b['id']) ? (int) $b['id'] : 0;
                return $ib <=> $ia;
            }
            return $tb <=> $ta;
        });
        $last = $threads[0];
        $author_type = isset($last['createdBy']['type']) ? $last['createdBy']['type'] : '';
        $from = ('customer' === ($last['type'] ?? '') || 'customer' === $author_type) ? 'customer' : 'support';
        return array(
            'from' => $from,
            'time' => isset($last['createdAt']) ? (int) strtotime($last['createdAt']) : 0,
            'id'   => isset($last['id']) ? (int) $last['id'] : 0,
        );
    }

    /** Who sent the most recent real message: 'support'|'customer'|''. */
    private function last_message_from($conv) {
        $meta = $this->last_message_meta($conv);
        return $meta['from'];
    }

    /* ---------------------------------------------------------------------
     * Per-member read state (FreeScout tracks agent-side read, not customer)
     * ------------------------------------------------------------------- */

    /** conversation id => unix time of the newest message the member has read. */
    private function get_read_map($user_id) {
        $map = get_user_meta($user_id, 'rt_help_read', true);
        return is_array($map) ? $map : array();
    }

    /** Record that the member has read a conversation up to $time. */
    private function mark_read($user_id, $conv_id, $time) {
        $map = $this->get_read_map($user_id);
        $map[(string) absint($conv_id)] = (int) $time;
        update_user_meta($user_id, 'rt_help_read', $map);
    }

    /** Has the member read the message at $time in $conv_id? */
    private function is_read($map, $conv_id, $time) {
        $time = (int) $time;
        if ($time <= 0) {
            return true; // nothing to read
        }
        $read = isset($map[(string) absint($conv_id)]) ? (int) $map[(string) absint($conv_id)] : 0;
        return $read >= $time;
    }

    /**
     * Conversation ids the member has removed from their own list. This is a
     * per-member view preference — the ticket itself stays in FreeScout for the
     * support team, and nothing is deleted from the helpdesk.
     */
    private function get_hidden($user_id) {
        $h = get_user_meta($user_id, 'rt_help_hidden', true);
        return is_array($h) ? array_map('absint', $h) : array();
    }

    private function hide_conversation($user_id, $conv_id) {
        $h = $this->get_hidden($user_id);
        $conv_id = absint($conv_id);
        if (!in_array($conv_id, $h, true)) {
            $h[] = $conv_id;
            update_user_meta($user_id, 'rt_help_hidden', $h);
        }
    }

    /** Normalise a thread's attachments regardless of envelope shape. */
    private function thread_attachments($thread) {
        if (isset($thread['_embedded']['attachments']) && is_array($thread['_embedded']['attachments'])) {
            return $thread['_embedded']['attachments'];
        }
        if (isset($thread['attachments']) && is_array($thread['attachments'])) {
            return $thread['attachments'];
        }
        return array();
    }

    /**
     * Turn API threads into chat messages for the client.
     * Only real messages (customer + staff message) are shown — notes, line
     * items and system entries are hidden from the member.
     */
    private function format_threads($conv, $conv_id) {
        $threads = $this->extract($conv, 'threads');
        // Show oldest-first for a chat. Sort by createdAt (then id) rather than
        // relying on the API's ordering.
        usort($threads, function ($a, $b) {
            $ta = isset($a['createdAt']) ? strtotime($a['createdAt']) : 0;
            $tb = isset($b['createdAt']) ? strtotime($b['createdAt']) : 0;
            if ($ta === $tb) {
                $ia = isset($a['id']) ? (int) $a['id'] : 0;
                $ib = isset($b['id']) ? (int) $b['id'] : 0;
                return $ia <=> $ib;
            }
            return $ta <=> $tb;
        });

        $messages = array();
        foreach ($threads as $t) {
            $type = isset($t['type']) ? $t['type'] : '';
            if (!in_array($type, array('customer', 'message'), true)) {
                continue; // hide notes/lineitem/phone system threads
            }
            $body = isset($t['body']) ? (string) $t['body'] : (isset($t['text']) ? (string) $t['text'] : '');
            $author_type = isset($t['createdBy']['type']) ? $t['createdBy']['type'] : ($type === 'customer' ? 'customer' : 'user');
            $mine = ('customer' === $author_type);

            $author = '';
            if (isset($t['createdBy']['firstName']) || isset($t['createdBy']['lastName'])) {
                $author = trim((isset($t['createdBy']['firstName']) ? $t['createdBy']['firstName'] : '') . ' ' . (isset($t['createdBy']['lastName']) ? $t['createdBy']['lastName'] : ''));
            }

            $atts = array();
            foreach ($this->thread_attachments($t) as $a) {
                $aid = isset($a['id']) ? absint($a['id']) : 0;
                if (!$aid) {
                    continue;
                }
                $atts[] = array(
                    'name' => isset($a['fileName']) ? (string) $a['fileName'] : ('file-' . $aid),
                    'mime' => isset($a['mimeType']) ? (string) $a['mimeType'] : '',
                    'url'  => $this->attachment_url($conv_id, $aid),
                );
            }

            $messages[] = array(
                'mine'        => $mine,
                'author'      => $mine ? __('You', 'rt-event-manager') : ($author !== '' ? $author : __('Support team', 'rt-event-manager')),
                'bodyHtml'    => wp_kses_post($body),
                'createdAt'   => isset($t['createdAt']) ? (string) $t['createdAt'] : '',
                'attachments' => $atts,
            );
        }
        return $messages;
    }

    private function attachment_url($conv_id, $att_id) {
        return wp_nonce_url(
            add_query_arg(array(
                'action' => 'rt_help_attachment',
                'id'     => $conv_id,
                'att'    => $att_id,
            ), admin_url('admin-ajax.php')),
            'rt_help_attachment'
        );
    }

    /** A member-safe message for an API error (logs the detail server-side). */
    private function friendly_error($wp_error) {
        if (is_wp_error($wp_error)) {
            error_log('[RT Helpdesk] ' . $wp_error->get_error_code() . ': ' . $wp_error->get_error_message());
        }
        return __('The helpdesk could not be reached right now. Please try again shortly.', 'rt-event-manager');
    }

    /* ---------------------------------------------------------------------
     * Account portal tab
     * ------------------------------------------------------------------- */

    /** Enqueue the helpdesk assets and render the "Get help" tab shell. */
    public function render_account_tab() {
        $this->enqueue_tab_assets();

        $topics = self::topics();
        echo '<div class="rthelp" id="rthelp">';
        echo '<h2 class="rtacc-title uk-heading-divider">' . esc_html__('Get help', 'rt-event-manager') . '</h2>';

        // ---- List view ----
        echo '<div class="rthelp-view rthelp-view--list" data-view="list">';

        echo '<div class="rthelp-intro">';
        echo '<p class="rtacc-hint">' . esc_html__('Ask our team a question. Your name, club, orders and tickets are shared with the helpdesk so we can help faster.', 'rt-event-manager') . '</p>';
        echo '<button type="button" class="rthelp-new-btn uk-button uk-button-primary" data-open-new>' . esc_html__('New help request', 'rt-event-manager') . '</button>';
        echo '</div>';

        // New request form (hidden until "New help request").
        echo '<form class="rthelp-new-form rtacc-form uk-form-stacked" hidden>';
        echo '<h3 class="rtacc-subtitle">' . esc_html__('New help request', 'rt-event-manager') . '</h3>';

        echo '<div class="rtacc-field">';
        echo '<label class="uk-form-label" for="rthelp-topic">' . esc_html__('Topic', 'rt-event-manager') . '</label>';
        echo '<select id="rthelp-topic" class="uk-select rthelp-topic" required>';
        echo '<option value="">' . esc_html__('— Please choose —', 'rt-event-manager') . '</option>';
        foreach ($topics as $slug => $label) {
            echo '<option value="' . esc_attr($slug) . '">' . esc_html($label) . '</option>';
        }
        echo '</select>';
        echo '</div>';

        // Which attendee the question is about (only shown when there is at least
        // one named attendee besides the "all" option).
        $attendees = $this->attendee_options(get_current_user_id());
        if (count($attendees) > 1) {
            echo '<div class="rtacc-field">';
            echo '<label class="uk-form-label" for="rthelp-attendee">' . esc_html__('Question relates to attendee:', 'rt-event-manager') . '</label>';
            echo '<select id="rthelp-attendee" class="uk-select rthelp-attendee">';
            foreach ($attendees as $value => $label) {
                echo '<option value="' . esc_attr($value) . '">' . esc_html($label) . '</option>';
            }
            echo '</select>';
            echo '</div>';
        }

        echo '<div class="rtacc-field">';
        echo '<label class="uk-form-label" for="rthelp-subject">' . esc_html__('Subject', 'rt-event-manager') . '</label>';
        echo '<input type="text" id="rthelp-subject" class="uk-input rthelp-subject" maxlength="150" required placeholder="' . esc_attr__('A short summary of your question', 'rt-event-manager') . '" />';
        echo '</div>';

        echo '<div class="rtacc-field">';
        echo '<label class="uk-form-label" for="rthelp-message">' . esc_html__('Your question', 'rt-event-manager') . '</label>';
        echo '<textarea id="rthelp-message" class="uk-textarea rthelp-message" rows="5" required placeholder="' . esc_attr__('Describe how we can help…', 'rt-event-manager') . '"></textarea>';
        echo '</div>';

        echo '<div class="rtacc-field">';
        echo $this->attach_control_html('rthelp-new-files');
        echo '</div>';

        echo '<div class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary rthelp-submit">' . esc_html__('Send request', 'rt-event-manager') . '</button> ';
        echo '<button type="button" class="uk-button uk-button-default" data-cancel-new>' . esc_html__('Cancel', 'rt-event-manager') . '</button>';
        echo '</div>';
        echo '<div class="rthelp-form-msg" role="alert" hidden></div>';
        echo '</form>';

        echo '<h3 class="rtacc-subtitle">' . esc_html__('Your requests', 'rt-event-manager') . '</h3>';
        echo '<div class="rthelp-list" aria-live="polite"><p class="rthelp-loading">' . esc_html__('Loading…', 'rt-event-manager') . '</p></div>';

        echo '</div>'; // list view

        // ---- Conversation (chat) view ----
        echo '<div class="rthelp-view rthelp-view--chat" data-view="chat" hidden>';
        echo '<div class="rthelp-chat-top">';
        echo '<button type="button" class="rthelp-back uk-button uk-button-text" data-back>&larr; ' . esc_html__('Back to your requests', 'rt-event-manager') . '</button>';
        echo '<button type="button" class="rthelp-delete uk-button uk-button-text" data-delete>' . esc_html__('Delete', 'rt-event-manager') . '</button>';
        echo '</div>';
        echo '<div class="rthelp-chat-head"><h3 class="rthelp-chat-subject"></h3><span class="rthelp-chat-status"></span></div>';
        echo '<div class="rthelp-chat" aria-live="polite"></div>';
        echo '<form class="rthelp-reply-form rtacc-form uk-form-stacked">';
        echo '<textarea class="uk-textarea rthelp-reply-text" rows="3" placeholder="' . esc_attr__('Write a reply…', 'rt-event-manager') . '"></textarea>';
        echo $this->attach_control_html('rthelp-reply-files');
        echo '<div class="rtacc-actions">';
        echo '<button type="submit" class="uk-button uk-button-primary rthelp-reply-btn">' . esc_html__('Send reply', 'rt-event-manager') . '</button>';
        echo '</div>';
        echo '<div class="rthelp-reply-msg" role="alert" hidden></div>';
        echo '</form>';
        echo '</div>'; // chat view

        echo '</div>'; // #rthelp
    }

    /** A styled file-input with the accepted types + limits hint. */
    private function attach_control_html($id) {
        $accept = '.jpg,.jpeg,.png,.gif,.webp,.heic,.pdf,.doc,.docx,.xls,.xlsx,'
            . 'image/*,application/pdf,application/msword,'
            . 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,'
            . 'application/vnd.ms-excel,'
            . 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        $html  = '<div class="rthelp-attach">';
        $html .= '<label class="rthelp-attach-label" for="' . esc_attr($id) . '"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' . esc_html__('Attach files', 'rt-event-manager') . '</label>';
        $html .= '<input type="file" id="' . esc_attr($id) . '" class="rthelp-files" multiple accept="' . esc_attr($accept) . '" />';
        $html .= '<span class="rthelp-attach-hint">' . esc_html(sprintf(__('Images, PDF, Word or Excel — up to %1$d files, %2$d MB each.', 'rt-event-manager'), self::MAX_FILES, self::MAX_FILE_MB)) . '</span>';
        $html .= '<ul class="rthelp-file-list"></ul>';
        $html .= '</div>';
        return $html;
    }

    private function enqueue_tab_assets() {
        $css_path = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/css/helpdesk.css';
        $js_path  = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/js/helpdesk.js';
        $css_ver  = file_exists($css_path) ? filemtime($css_path) : RT_EVENT_MANAGER_VERSION;
        $js_ver   = file_exists($js_path) ? filemtime($js_path) : RT_EVENT_MANAGER_VERSION;

        wp_enqueue_style('rt-event-manager-helpdesk', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/css/helpdesk.css', array(), $css_ver);
        wp_enqueue_script('rt-event-manager-helpdesk', RT_EVENT_MANAGER_PLUGIN_URL . 'assets/js/helpdesk.js', array('jquery'), $js_ver, true);
        wp_localize_script('rt-event-manager-helpdesk', 'rtHelp', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('rt_help'),
            'maxFiles' => self::MAX_FILES,
            'maxMb'    => self::MAX_FILE_MB,
            'i18n'    => array(
                'loading'    => __('Loading…', 'rt-event-manager'),
                'sending'    => __('Sending…', 'rt-event-manager'),
                'send'       => __('Send request', 'rt-event-manager'),
                'sendReply'  => __('Send reply', 'rt-event-manager'),
                'chooseTopic' => __('Please choose a topic.', 'rt-event-manager'),
                'enterSubject' => __('Please enter a subject.', 'rt-event-manager'),
                'writeQuestion' => __('Please describe your question.', 'rt-event-manager'),
                'loadFail'   => __('Could not load your requests. Please try again.', 'rt-event-manager'),
                'none'       => __('You have no help requests yet.', 'rt-event-manager'),
                'view'       => __('View conversation', 'rt-event-manager'),
                'tooMany'    => sprintf(__('Please attach at most %d files.', 'rt-event-manager'), self::MAX_FILES),
                'tooBig'     => sprintf(__('Each file must be %d MB or smaller.', 'rt-event-manager'), self::MAX_FILE_MB),
                'badType'    => __('Only images, PDF, Word and Excel files are allowed.', 'rt-event-manager'),
                'remove'     => __('Remove', 'rt-event-manager'),
                'you'        => __('You', 'rt-event-manager'),
                'noMessages' => __('No messages yet.', 'rt-event-manager'),
                'statusActive' => __('Open', 'rt-event-manager'),
                'statusPending' => __('Awaiting reply', 'rt-event-manager'),
                'statusClosed' => __('Resolved', 'rt-event-manager'),
                'statusReplied' => __('Support replied', 'rt-event-manager'),
                'statusRead' => __('Read', 'rt-event-manager'),
                'confirmDelete' => __('Remove this conversation from your list? The support team keeps a copy.', 'rt-event-manager'),
            ),
        ));
    }

    /* ---------------------------------------------------------------------
     * Admin: settings page
     * ------------------------------------------------------------------- */

    public function add_admin_menu() {
        add_submenu_page(
            'rt-event-manager',
            __('Helpdesk', 'rt-event-manager'),
            __('Helpdesk', 'rt-event-manager'),
            'manage_options',
            'rt-event-manager-helpdesk',
            array($this, 'render_settings_page')
        );
    }

    public function handle_settings_post() {
        if (!isset($_POST['rt_helpdesk_nonce'])) {
            return;
        }
        if (!current_user_can('manage_options')) {
            return;
        }
        if (!wp_verify_nonce(wp_unslash($_POST['rt_helpdesk_nonce']), 'rt_helpdesk_settings')) {
            return;
        }

        update_option(self::OPT_ENABLED, isset($_POST['helpdesk_enabled']) ? 'yes' : 'no');
        update_option(self::OPT_URL, esc_url_raw(trim(wp_unslash($_POST['helpdesk_url'] ?? ''))));
        update_option(self::OPT_MAILBOX, absint($_POST['helpdesk_mailbox'] ?? 0));
        update_option(self::OPT_NUM_PREFIX, sanitize_text_field(wp_unslash($_POST['helpdesk_num_prefix'] ?? '')));
        update_option(self::OPT_NUM_SUFFIX, sanitize_text_field(wp_unslash($_POST['helpdesk_num_suffix'] ?? '')));

        // Only overwrite the key when a new value is entered (blank keeps it).
        $posted_key = trim((string) wp_unslash($_POST['helpdesk_api_key'] ?? ''));
        if ('' !== $posted_key && false === strpos($posted_key, '•')) {
            update_option(self::OPT_KEY, self::encrypt($posted_key));
        }

        wp_safe_redirect(add_query_arg('page', 'rt-event-manager-helpdesk', admin_url('admin.php')));
        exit;
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to view this page.', 'rt-event-manager'));
        }
        $enabled = self::is_enabled();
        $url     = $this->base_url();
        $mailbox = $this->mailbox_id();
        $has_key = '' !== $this->api_key();

        // Try to load mailboxes for a friendly picker + connection status.
        $mailboxes = array();
        $conn_ok   = false;
        $conn_msg  = '';
        if ('' !== $url && $has_key) {
            $mb = $this->get_mailboxes();
            if (is_wp_error($mb)) {
                $conn_msg = $mb->get_error_message();
            } else {
                $conn_ok   = true;
                $mailboxes = $mb;
            }
        }

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Helpdesk (FreeScout)', 'rt-event-manager') . '</h1>';
        echo '<p class="description">' . esc_html__('Connect the member portal "Get help" tab to your FreeScout helpdesk. Requires the FreeScout API & Webhooks module.', 'rt-event-manager') . '</p>';

        if ('' !== $url && $has_key) {
            if ($conn_ok) {
                echo '<div class="notice notice-success inline"><p>' . esc_html__('Connected to FreeScout.', 'rt-event-manager') . '</p></div>';
            } else {
                echo '<div class="notice notice-error inline"><p>' . esc_html(sprintf(__('Could not connect: %s', 'rt-event-manager'), $conn_msg)) . '</p></div>';
            }
        }

        echo '<form method="post">';
        wp_nonce_field('rt_helpdesk_settings', 'rt_helpdesk_nonce');
        echo '<table class="form-table" role="presentation"><tbody>';

        // Enabled
        echo '<tr><th scope="row">' . esc_html__('Enable "Get help"', 'rt-event-manager') . '</th><td>';
        echo '<label><input type="checkbox" name="helpdesk_enabled" value="1" ' . checked($enabled, true, false) . '> ' . esc_html__('Show the Get help tab in the member portal', 'rt-event-manager') . '</label>';
        echo '</td></tr>';

        // URL
        echo '<tr><th scope="row"><label for="helpdesk_url">' . esc_html__('FreeScout URL', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="url" id="helpdesk_url" name="helpdesk_url" class="regular-text" value="' . esc_attr($url) . '" placeholder="https://help.rtihym2027.ch">';
        echo '</td></tr>';

        // API key
        echo '<tr><th scope="row"><label for="helpdesk_api_key">' . esc_html__('API key', 'rt-event-manager') . '</label></th><td>';
        $placeholder = $has_key ? '••••••••••••••••' : '';
        echo '<input type="password" id="helpdesk_api_key" name="helpdesk_api_key" class="regular-text" autocomplete="new-password" value="" placeholder="' . esc_attr($placeholder) . '">';
        echo '<p class="description">' . esc_html__('FreeScout → Manage → API. Stored encrypted. Leave blank to keep the current key.', 'rt-event-manager') . '</p>';
        echo '</td></tr>';

        // Mailbox
        echo '<tr><th scope="row"><label for="helpdesk_mailbox">' . esc_html__('Mailbox', 'rt-event-manager') . '</label></th><td>';
        if (!empty($mailboxes)) {
            echo '<select id="helpdesk_mailbox" name="helpdesk_mailbox">';
            echo '<option value="0">' . esc_html__('— Select a mailbox —', 'rt-event-manager') . '</option>';
            foreach ($mailboxes as $m) {
                $mid   = isset($m['id']) ? absint($m['id']) : 0;
                $mname = isset($m['name']) ? $m['name'] : ('#' . $mid);
                echo '<option value="' . esc_attr($mid) . '" ' . selected($mailbox, $mid, false) . '>' . esc_html($mname . ' (#' . $mid . ')') . '</option>';
            }
            echo '</select>';
        } else {
            echo '<input type="number" id="helpdesk_mailbox" name="helpdesk_mailbox" class="small-text" value="' . esc_attr($mailbox) . '" min="0" step="1">';
            echo '<p class="description">' . esc_html__('Enter the mailbox ID. Save a valid URL + API key to pick it from a list.', 'rt-event-manager') . '</p>';
        }
        echo '</td></tr>';

        // Ticket number prefix / suffix — mirror the FreeScout Ticket Number
        // module so members see the same reference (the API returns only the raw
        // number). Example: prefix "HYM-" suffix "" => "HYM-1042".
        $num_prefix = (string) get_option(self::OPT_NUM_PREFIX, self::DEFAULT_NUM_PREFIX);
        $num_suffix = (string) get_option(self::OPT_NUM_SUFFIX, self::DEFAULT_NUM_SUFFIX);
        echo '<tr><th scope="row"><label for="helpdesk_num_prefix">' . esc_html__('Ticket number prefix', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="text" id="helpdesk_num_prefix" name="helpdesk_num_prefix" class="regular-text" value="' . esc_attr($num_prefix) . '" placeholder="' . esc_attr__('e.g. HYM-', 'rt-event-manager') . '">';
        echo '<p class="description">' . esc_html__('Shown before the ticket number to match your FreeScout Ticket Number module.', 'rt-event-manager') . '</p>';
        echo '</td></tr>';
        echo '<tr><th scope="row"><label for="helpdesk_num_suffix">' . esc_html__('Ticket number suffix', 'rt-event-manager') . '</label></th><td>';
        echo '<input type="text" id="helpdesk_num_suffix" name="helpdesk_num_suffix" class="regular-text" value="' . esc_attr($num_suffix) . '" placeholder="' . esc_attr__('(optional)', 'rt-event-manager') . '">';
        if ('' !== $num_prefix || '' !== $num_suffix) {
            echo '<p class="description">' . esc_html(sprintf(__('Preview: %s', 'rt-event-manager'), $this->format_ticket_number(1042))) . '</p>';
        }
        echo '</td></tr>';

        echo '</tbody></table>';
        submit_button();
        echo '</form>';
        echo '</div>';
    }
}
