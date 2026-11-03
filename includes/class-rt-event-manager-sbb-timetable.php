<?php
/**
 * SBB SMAPI timetable widget shortcode.
 *
 * Embeds the official SBB "SMAPI" timetable/connection search widget (a set of
 * web components shipped as an ES module + stylesheet, see assets/sbb/) via the
 * [rt_sbb_timetable] shortcode. The assets are enqueued only on pages that use
 * the shortcode, which keeps the widget's deliberately broad CSS reset — it
 * restyles html/body, every button and input, and loads the SBB webfont — off
 * the rest of the site. Keep it to a dedicated page for best results.
 *
 * Attributes:
 *   from       Prefill the "From" station (e.g. from="Zürich Flughafen").
 *   to         Prefill the "To" station.
 *   time       Prefill the time field (HH:MM, default 13:30).
 *   title      Optional heading shown above the widget.
 *   banner     Product banner below the form: none (default), swiss-travel-pass,
 *              saver-day-pass or railaway.
 *   affiliate  SBB affiliate tracking type code; replaces the
 *              "affiliate-tracking-type-placeholder" token in the banner links.
 *              Defaults to the rt_event_manager_sbb_affiliate_code filter value.
 *
 * @package RT_Event_Manager
 */

defined('ABSPATH') || exit;

class RT_Event_Manager_SBB_Timetable {

    /** @var RT_Event_Manager_SBB_Timetable|null */
    private static $instance = null;

    /** Handle used for both the registered script module and the stylesheet. */
    const HANDLE = 'rt-event-manager-sbb-widget';

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('rt_sbb_timetable', array($this, 'render_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'maybe_enqueue_assets'));
    }

    /**
     * Enqueue the widget assets up front on any singular page whose content
     * contains the shortcode, so the module is registered before the markup is
     * printed. render_shortcode() also enqueues as a fallback (e.g. when the
     * shortcode is rendered from a template or a page builder that bypasses
     * the_content).
     */
    public function maybe_enqueue_assets() {
        if (!is_singular()) {
            return;
        }
        $post = get_post();
        if ($post && has_shortcode($post->post_content, 'rt_sbb_timetable')) {
            $this->enqueue_assets();
        }
    }

    /**
     * Register and enqueue the SBB widget's stylesheet and ES module. The script
     * is a native module (the web components self-register on import), so it is
     * loaded via wp_enqueue_script_module() on WordPress 6.5+; on older versions
     * it falls back to a classic enqueue with type="module" added to the tag.
     */
    public function enqueue_assets() {
        $css_path = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/sbb/smapi-widget.css';
        $js_path  = RT_EVENT_MANAGER_PLUGIN_DIR . 'assets/sbb/smapi-widget.js';
        $css_url  = RT_EVENT_MANAGER_PLUGIN_URL . 'assets/sbb/smapi-widget.css';
        $js_url   = RT_EVENT_MANAGER_PLUGIN_URL . 'assets/sbb/smapi-widget.js';
        $css_ver  = file_exists($css_path) ? filemtime($css_path) : RT_EVENT_MANAGER_VERSION;
        $js_ver   = file_exists($js_path) ? filemtime($js_path) : RT_EVENT_MANAGER_VERSION;

        if (!wp_style_is(self::HANDLE, 'enqueued')) {
            wp_enqueue_style(self::HANDLE, $css_url, array(), $css_ver);
        }

        if (function_exists('wp_enqueue_script_module')) {
            // WP 6.5+ — registers a proper <script type="module">.
            wp_enqueue_script_module(self::HANDLE, $js_url, array(), $js_ver);
        } elseif (!wp_script_is(self::HANDLE, 'enqueued')) {
            // Older WP — enqueue classically and promote the tag to a module.
            wp_enqueue_script(self::HANDLE, $js_url, array(), $js_ver, true);
            add_filter('script_loader_tag', array($this, 'filter_module_tag'), 10, 3);
        }
    }

    /**
     * Add type="module" to the widget's classic script tag (WP < 6.5 fallback).
     *
     * @param string $tag    The full <script> tag.
     * @param string $handle The script handle.
     * @param string $src    The script source URL.
     * @return string
     */
    public function filter_module_tag($tag, $handle, $src) {
        if (self::HANDLE !== $handle) {
            return $tag;
        }
        return '<script type="module" src="' . esc_url($src) . '"></script>' . "\n";
    }

    /**
     * [rt_sbb_timetable] — render the timetable search form.
     *
     * @param array $atts
     * @return string
     */
    public function render_shortcode($atts) {
        $atts = shortcode_atts(
            array(
                'from'      => '',
                'to'        => '',
                'date'      => '',
                'time'      => '13:30',
                'lang'      => '',
                'title'     => '',
                'banner'    => 'none',
                'affiliate' => '',
            ),
            $atts,
            'rt_sbb_timetable'
        );

        $this->enqueue_assets();

        $from = esc_attr($atts['from']);
        $to   = esc_attr($atts['to']);
        $time = esc_attr($atts['time']);
        // The SBB date input expects Swiss format DD.MM.YYYY. Accept D.M.YYYY too
        // and pad it; ignore anything else so an invalid value is not emitted.
        $date = '';
        if (preg_match('/^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/', (string) $atts['date'], $m)) {
            $date = sprintf('%02d.%02d.%04d', (int) $m[1], (int) $m[2], (int) $m[3]);
        }
        $date = esc_attr($date);
        // SBB's timetable only exists under /de, /fr, /it, /en. The widget builds
        // its Search URL from <html lang>, which on WordPress is a full locale
        // like "en-US" → sbb.ch/en-US → 404. Resolve a supported 2-letter code
        // (optional `lang` override) and normalise <html lang> to it below.
        $lang = strtolower(substr((string) $atts['lang'], 0, 2));
        if (!in_array($lang, array('de', 'fr', 'it', 'en'), true)) {
            $lang = '';
        }

        // Effective affiliate tracking code (attribute wins, else the filter).
        // The widget bundles the Search URL with at_type=<placeholder>, so we
        // rewrite that param as the widget opens the results tab.
        $affiliate_code = trim((string) $atts['affiliate']);
        if ('' === $affiliate_code) {
            $affiliate_code = trim((string) apply_filters('rt_event_manager_sbb_affiliate_code', ''));
        }

        ob_start();
        ?>
        <div class="rt-sbb-timetable sbb-light">
            <?php if ('' !== trim((string) $atts['title'])) : ?>
                <h2 class="rt-sbb-timetable-title"><?php echo esc_html($atts['title']); ?></h2>
            <?php endif; ?>
            <form id="sbb-timetable-form-wrapper" class="sbb-timetable-form">
                <sbb-signet></sbb-signet>
                <sbb-timetable-form id="sbb-timetable-form">
                    <sbb-timetable-form-field id="sbb-timetable-form-field-from">
                        <label><?php esc_html_e('From', 'rt-event-manager'); ?></label>
                        <input id="sbb-timetable-form-field-input-from" type="text" name="from"<?php echo '' !== $from ? ' value="' . $from . '"' : ''; ?>/>
                        <sbb-autocomplete id="sbb-timetable-form-field-autocomplete-from"
                                          origin="sbb-timetable-form-field-to"
                                          trigger="sbb-timetable-form-field-input-from">
                        </sbb-autocomplete>
                    </sbb-timetable-form-field>
                    <sbb-timetable-form-swap-button></sbb-timetable-form-swap-button>
                    <sbb-timetable-form-field id="sbb-timetable-form-field-to">
                        <label><?php esc_html_e('To', 'rt-event-manager'); ?></label>
                        <input id="sbb-timetable-form-field-input-to" type="text" name="to"<?php echo '' !== $to ? ' value="' . $to . '"' : ''; ?>/>
                        <sbb-autocomplete id="sbb-timetable-form-field-autocomplete-to"
                                          origin="sbb-timetable-form-field-to"
                                          trigger="sbb-timetable-form-field-input-to">
                        </sbb-autocomplete>
                    </sbb-timetable-form-field>
                    <sbb-timetable-form-details>
                        <sbb-form-field width="collapse" size="l" borderless
                                        class="sbb-timetable-form-mobile-block">
                            <sbb-date-input id="sbb-timetable-form-details-date-input"<?php echo '' !== $date ? ' value="' . $date . '"' : ''; ?>></sbb-date-input>
                            <sbb-datepicker-previous-day
                                    class="sbb-timetable-form-mobile-hidden"></sbb-datepicker-previous-day>
                            <sbb-datepicker-toggle></sbb-datepicker-toggle>
                            <sbb-datepicker-next-day
                                    class="sbb-timetable-form-mobile-hidden"></sbb-datepicker-next-day>
                            <sbb-datepicker></sbb-datepicker>
                        </sbb-form-field>
                        <sbb-divider orientation="vertical" class="sbb-timetable-form-mobile-hidden">
                        </sbb-divider>
                        <sbb-form-field width="collapse" size="l" borderless>
                            <sbb-time-input id="sbb-timetable-form-details-time-input"
                                            value="<?php echo $time; ?>"></sbb-time-input>
                        </sbb-form-field>
                        <sbb-toggle size="s" name="departure-arrival">
                            <sbb-toggle-option id="sbb-timetable-form-details-toggle-option-departure"
                                               value="departure"><?php esc_html_e('Dep', 'rt-event-manager'); ?></sbb-toggle-option>
                            <sbb-toggle-option id="sbb-timetable-form-details-toggle-option-arrival"
                                               value="arrival"><?php esc_html_e('Arr', 'rt-event-manager'); ?></sbb-toggle-option>
                        </sbb-toggle>
                        <div style="flex-grow: 1;"></div>
                        <sbb-button id="sbb-timetable-form-button-submit" type="submit" size="m"><?php esc_html_e('Search', 'rt-event-manager'); ?></sbb-button>
                    </sbb-timetable-form-details>
                </sbb-timetable-form>
                <?php echo $this->render_banner($atts['banner'], $atts['affiliate']); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from a fixed allow-list with escaped values ?>
            </form>
            <script>
            (function () {
                // Normalise the page language to an SBB-supported code so the
                // widget's Search URL (sbb.ch/<lang>) resolves instead of 404ing.
                var supported = ['de', 'fr', 'it', 'en'];
                var forced = <?php echo '' !== $lang ? "'" . esc_js($lang) . "'" : 'null'; ?>;
                var cur = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
                document.documentElement.lang = forced || (supported.indexOf(cur) > -1 ? cur : 'en');

                // Activate the SBB design-system colour tokens. Without a
                // .sbb-light / .sbb-dark ancestor, the tokens resolve to invalid
                // values and overlays (e.g. the station autocomplete and the
                // datepicker) render with no background. Set it on the document so
                // overlays portalled to <body> are covered too.
                document.documentElement.classList.add('sbb-light');

                // The widget opens its Search URL via window.open. Adjust that URL
                // as the results tab opens, without editing the vendored bundle:
                //  - substitute the real affiliate code for the bundled
                //    at_type=affiliate-tracking-type-placeholder, and
                //  - append reduction=none.
                if (!window.__rtSbbOpenPatched) {
                    window.__rtSbbOpenPatched = true;
                    var rtAff = '<?php echo esc_js($affiliate_code); ?>';
                    var origOpen = window.open;
                    window.open = function (url) {
                        try {
                            if (typeof url === 'string' && url.indexOf('sbb.ch') !== -1) {
                                if (rtAff && url.indexOf('affiliate-tracking-type-placeholder') !== -1) {
                                    url = url.replace('affiliate-tracking-type-placeholder', encodeURIComponent(rtAff));
                                }
                                if (url.indexOf('reduction=') === -1) {
                                    url += (url.indexOf('?') === -1 ? '?' : '&') + 'reduction=none';
                                }
                                arguments[0] = url;
                            }
                        } catch (e) {}
                        return origOpen.apply(window, arguments);
                    };
                }
                <?php if ('' !== $date) : ?>
                var apply = function () {
                    var el = document.getElementById('sbb-timetable-form-details-date-input');
                    if (el) { try { el.value = '<?php echo esc_js($date); ?>'; } catch (e) {} }
                };
                if (window.customElements && customElements.whenDefined) {
                    Promise.all([
                        customElements.whenDefined('sbb-date-input'),
                        customElements.whenDefined('sbb-datepicker')
                    ]).then(function () {
                        (window.requestAnimationFrame || window.setTimeout)(apply);
                    });
                } else {
                    document.addEventListener('DOMContentLoaded', apply);
                }
                <?php endif; ?>
            })();
            </script>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Optional SBB product banner below the form. Returns the markup for one of
     * the templates SBB provides, or an empty string for "none"/unknown values.
     *
     * @param string $banner    Banner key.
     * @param string $affiliate Affiliate tracking type code (may be empty).
     * @return string
     */
    private function render_banner($banner, $affiliate) {
        $banner = sanitize_key($banner);
        if ('' === $banner || 'none' === $banner) {
            return '';
        }

        // Resolve the affiliate tracking code (attribute wins, else a filter).
        $affiliate = trim((string) $affiliate);
        if ('' === $affiliate) {
            $affiliate = (string) apply_filters('rt_event_manager_sbb_affiliate_code', '');
        }

        $banners = array(
            'swiss-travel-pass' => array(
                'href'  => 'https://www.sbb.ch/en/offers/swiss-travel-pass?at_medium=affiliate&at_campaign=b2p&at_type=' . rawurlencode($affiliate),
                'img'   => 'https://www.sbb.ch/content/dam/internet/sbb/images/kampagnen/swiss-travel-pass-1st-class-promo.jpg',
                'alt'   => __('Swiss Travel Pass', 'rt-event-manager'),
                'title' => __('Swiss Travel Pass', 'rt-event-manager'),
                'text'  => __('Discover Switzerland with just a single ticket.', 'rt-event-manager'),
            ),
            'saver-day-pass' => array(
                'href'  => 'https://www.sbb.ch/en/offers/saver-day-pass?at_medium=affiliate&at_campaign=b2p&at_type=' . rawurlencode($affiliate),
                'img'   => 'https://www.datocms-assets.com/160391/1763476595-bahnhof_91739.jpg',
                'alt'   => __('Saver Day Pass', 'rt-event-manager'),
                'title' => __('Saver Day Pass', 'rt-event-manager'),
                'text'  => __('From CHF 29.-, while stocks last.', 'rt-event-manager'),
            ),
            // RailAway uses a fixed deeplink; no per-partner tracking token.
            'railaway' => array(
                'href'  => 'https://freizeit.sbb.ch/en/?at_medium=affiliate&at_campaign=RAW29&at_creation=EN&at_type=Pull_allgemein&at_channel=SBBFahrplan_Widget',
                'img'   => 'https://images.contenthub.dev/g8e1xze8wimq/9eeab46ab3526db77712da1c59e0cca9/260216_RAW_Content_Adults_D3_25.jpg?fm=jpg&fl=progressive&f=center&fit=fill&q=80&h=900&w=960',
                'alt'   => __('Discover the RailAway leisure offer.', 'rt-event-manager'),
                'title' => __('Discover the RailAway leisure offer.', 'rt-event-manager'),
                'text'  => __('Travel by public transport and enjoy attractive discounts.', 'rt-event-manager'),
            ),
        );

        if (!isset($banners[$banner])) {
            return '';
        }
        $b = $banners[$banner];

        ob_start();
        ?>
        <div class="div-smapi-product-banner">
            <sbb-teaser class="block teaser-product-banner"
                        href="<?php echo esc_url($b['href']); ?>"
                        alignment="after-centered">
                <img src="<?php echo esc_url($b['img']); ?>"
                     slot="image"
                     alt="<?php echo esc_attr($b['alt']); ?>"
                     class="img-product-banner"/>
                <sbb-title level="2" slot="title" visual-level="5">
                    <?php echo esc_html($b['title']); ?>
                </sbb-title>
                <?php echo esc_html($b['text']); ?>
            </sbb-teaser>
        </div>
        <?php
        return ob_get_clean();
    }
}
