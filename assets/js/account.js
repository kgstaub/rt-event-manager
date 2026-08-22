/**
 * RT Event Manager — customer account portal.
 *
 * Handles the two AJAX forms (profile save, ticket save). Add-to-cart and
 * receipt downloads are plain links and need no JS. Config is injected via
 * wp_localize_script as `rtEventManagerAccount`.
 */
(function ($) {
    'use strict';

    if (typeof rtEventManagerAccount === 'undefined') {
        return;
    }

    var cfg  = rtEventManagerAccount;
    var i18n = cfg.i18n || {};

    function setStatus($el, message, type) {
        if (!$el.length) {
            return;
        }
        $el.text(message).removeClass('is-error is-success');
        if (type) {
            $el.addClass(type === 'error' ? 'is-error' : 'is-success');
        }
        $el.show();
    }

    // Confirm a saved field inline: green (theme uk-form-success) border plus a
    // checkmark at the right edge. Fades back after a few seconds.
    function markFieldSaved($field) {
        if (!$field || !$field.length) {
            return;
        }
        $field.each(function () {
            var $f = $(this);
            // Enhanced selects are hidden; flag their visible toggle instead.
            var $target = $f;
            if ($f.is('select') && $f.closest('.rtacc-select').length) {
                $target = $f.closest('.rtacc-select').find('.rtacc-select-toggle');
            }
            if (!$target.length) { return; }
            if ($target.data('rtaccSavedTimer')) {
                clearTimeout($target.data('rtaccSavedTimer'));
            }
            $target.removeClass('uk-form-danger').addClass('uk-form-success rtacc-field-saved');
            var t = setTimeout(function () {
                $target.removeClass('uk-form-success rtacc-field-saved');
            }, 3000);
            $target.data('rtaccSavedTimer', t);
        });
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            try {
                var el = document.createElement('textarea');
                el.value = text;
                el.style.position = 'fixed';
                el.style.opacity = '0';
                document.body.appendChild(el);
                el.focus();
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    // Age in whole years at the event date (or today if unset).
    function ageAtEvent(dobStr) {
        if (!dobStr) { return null; }
        var dob = new Date(dobStr);
        var ref = cfg.visaEventDate ? new Date(cfg.visaEventDate) : new Date();
        if (isNaN(dob.getTime()) || isNaN(ref.getTime())) { return null; }
        var age = ref.getFullYear() - dob.getFullYear();
        var m = ref.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) { age--; }
        return age;
    }

    // ---- Visa letter: toggle the request form (each button targets its form by id) ----
    $(document).on('click', '.rtacc-visa-toggle', function () {
        var id = $(this).data('visa-form');
        if (id) { $('#' + id).toggle(); }
    });
    // Cancel closes (hides) the visa form.
    $(document).on('click', '.rtacc-visa-cancel', function () {
        $(this).closest('.rtacc-visa-form').hide();
    });

    // Message for a too-old child — personalised with their name when entered.
    function childTooOldMsg($form) {
        var name = ($form.find('input[name="child_name"]').val() || '').trim();
        if (name && i18n.childTooOldNamed) {
            return i18n.childTooOldNamed.replace('%s', name);
        }
        return i18n.childTooOld || 'This child needs their own Future member ticket.';
    }

    function childTooOld($form) {
        var age = ageAtEvent($form.find('input[name="dob"]').val());
        return age !== null && cfg.visaChildMax && age >= cfg.visaChildMax;
    }

    // Re-evaluate the child age warning on date-of-birth or name changes.
    $(document).on('input change', '.rtacc-visa-form input[name="dob"], .rtacc-visa-form input[name="child_name"]', function () {
        var $form = $(this).closest('.rtacc-visa-form');
        if (!$form.find('input[name="for_child"]').length) { return; }
        var $warn = $form.find('.rtacc-visa-child-warn');
        if (childTooOld($form)) {
            $warn.find('p').text(childTooOldMsg($form));
            $warn.show();
        } else {
            $warn.hide();
        }
    });

    // Flag empty required fields in the visa form in red (danger). Enhanced
    // selects are hidden, so their wrapper carries the danger state.
    function validateVisaForm($form) {
        var ok = true;
        $form.find('[required]').each(function () {
            var $f      = $(this);
            var invalid = $.trim($f.val() || '') === '';
            var $wrap   = $f.closest('.rtacc-select');
            if ($wrap.length) {
                $wrap.toggleClass('rtacc-select-danger', invalid);
            } else {
                $f.toggleClass('uk-form-danger', invalid);
            }
            if (invalid) { ok = false; }
        });
        return ok;
    }
    // Clear a field's danger state as soon as it's filled.
    $(document).on('input change', '.rtacc-visa-form [required]', function () {
        var $f = $(this);
        if ($.trim($f.val() || '') !== '') {
            $f.removeClass('uk-form-danger');
            $f.closest('.rtacc-select').removeClass('rtacc-select-danger');
        }
    });

    // ---- Visa letter: generate (spinner in-place, then inline download) ----
    $(document).on('submit', '.rtacc-visa-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $err    = $form.find('.rtacc-modal-error');
        var $status = $form.find('.rtacc-status');
        var $btn    = $form.find('button[type="submit"]');
        $err.hide();

        // Accompanying child must be younger than the cutoff at the event.
        if ($form.find('input[name="for_child"]').length && childTooOld($form)) {
            $form.find('.rtacc-visa-child-warn p').text(childTooOldMsg($form));
            $form.find('.rtacc-visa-child-warn').show();
            return;
        }

        // Highlight any empty required field in red before submitting.
        if (!validateVisaForm($form)) {
            $err.text(i18n.fillRequired || 'Please fill in all the required fields.').show();
            return;
        }

        var data = $form.serializeArray();
        data.push({ name: 'action', value: 'rt_event_manager_generate_visa' });
        data.push({ name: 'nonce', value: cfg.visaNonce });
        data.push({ name: 'ticket_id', value: $form.data('ticket') });

        $btn.prop('disabled', true);
        $status.html('<span uk-spinner="ratio: 0.6"></span> ' + (i18n.generating || 'Generating…')).show();

        $.post(cfg.ajaxUrl, $.param(data), function (response) {
            if (response && response.success && response.data) {
                // Replace the form body with a result + download button. No reload.
                $form.children().hide();
                var $res = $form.find('.rtacc-visa-result');
                $res.removeClass('uk-alert-danger uk-alert-warning uk-alert-success rtacc-alert-secondary')
                    .addClass(response.data.eu_efta ? 'rtacc-alert-secondary' : 'uk-alert-success')
                    .empty()
                    .append($('<p></p>').text(response.data.message));
                if (response.data.download_url) {
                    $res.append($('<a class="uk-button uk-button-primary uk-button-small" target="_blank" rel="noopener"></a>')
                        .attr('href', response.data.download_url).text(i18n.downloadPdf || 'Download PDF'));
                }
                $res.show();
            } else {
                $btn.prop('disabled', false);
                $status.hide().text('');
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $status.hide().text('');
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // Re-pack the visible blocks in every day column so they fill the full width
    // (recomputing overlap lanes from the blocks' pixel top/height positions).
    function relayoutCalendar($cal) {
        $cal.find('.rtacc-cal-daybody').each(function () {
            var segs = [];
            $(this).children('.rtacc-cal-block').each(function () {
                if ($(this).is(':hidden')) {
                    return; // category- or attendee-filtered out
                }
                var top = parseFloat(this.style.top) || 0;
                var h   = parseFloat(this.style.height) || 0;
                segs.push({ el: this, s: top, e: top + h });
            });
            segs.sort(function (a, b) { return a.s - b.s; });

            var i = 0;
            while (i < segs.length) {
                var cluster = [segs[i]];
                var maxE = segs[i].e;
                var j = i + 1;
                while (j < segs.length && segs[j].s < maxE) {
                    cluster.push(segs[j]);
                    maxE = Math.max(maxE, segs[j].e);
                    j++;
                }
                var laneEnds = [];
                cluster.forEach(function (seg) {
                    var lane = -1;
                    for (var l = 0; l < laneEnds.length; l++) {
                        if (laneEnds[l] <= seg.s) { lane = l; break; }
                    }
                    if (lane < 0) { lane = laneEnds.length; }
                    laneEnds[lane] = seg.e;
                    seg.lane = lane;
                });
                var width = 100 / laneEnds.length;
                cluster.forEach(function (seg) {
                    seg.el.style.width = width + '%';
                    seg.el.style.left  = (seg.lane * width) + '%';
                });
                i = j;
            }
        });
    }

    // ---- Calendar: show/hide a category ----
    $(document).on('change', '.rtacc-cal-toggle', function () {
        var $cal = $(this).closest('.rtacc-cal');
        $cal.toggleClass('rtacc-cal-hide-' + $(this).data('cat'), !this.checked);
        relayoutCalendar($cal);
    });

    // ---- Calendar: filter by attendee (agenda blocks always show) ----
    $(document).on('change', '.rtacc-cal-holder', function () {
        var holder = String(this.value || '');
        var $cal = $(this).closest('.rtacc-cal');
        $cal.find('.rtacc-cal-block, .rtacc-cal-listitem').each(function () {
            var $b = $(this);
            if (holder === '' || $b.data('cat') === 'agenda') {
                $b.removeClass('rtacc-cal-hidden-holder');
                return;
            }
            var holders = String($b.attr('data-holders') || '').split('|');
            $b.toggleClass('rtacc-cal-hidden-holder', holders.indexOf(holder) === -1);
        });
        relayoutCalendar($cal);
    });

    // ---- Calendar: focus the day viewport on 08:00 (scroll to reveal the rest) ----
    $(function () {
        $('.rtacc-cal-week-body').each(function () {
            var top = parseInt($(this).attr('data-focus-top'), 10);
            if (!isNaN(top)) {
                this.scrollTop = top;
            }
        });
    });

    // ---- Copy a share link to the clipboard ----
    $(document).on('click', '.rtacc-copy-link', function () {
        var $btn = $(this);
        copyText($btn.data('url')).then(function () {
            var original = i18n.copyLink || 'Copy link';
            $btn.text(i18n.copied || 'Copied!');
            setTimeout(function () { $btn.text(original); }, 2000);
        });
    });

    // ---- Privacy policy re-consent ----
    $(document).on('click', '.rtacc-pp-accept', function () {
        var $btn = $(this);
        var $err = $btn.closest('.rtacc-modal-dialog').find('.rtacc-modal-error');
        $btn.prop('disabled', true);
        $.post(cfg.ajaxUrl, {
            action: 'rt_event_manager_pp_accept',
            nonce:  cfg.ppAcceptNonce
        }, function (response) {
            if (response && response.success) {
                $('.rtacc-pp-modal').attr('hidden', 'hidden').remove();
            } else {
                $btn.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Profile save ----
    $(document).on('submit', '#rtacc-profile-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $btn    = $form.find('button[type="submit"]');
        var $status = $('#rtacc-profile-status');

        $btn.prop('disabled', true);
        setStatus($status, i18n.saving || 'Saving…', null);

        // Serialize the whole form so membership fields (shown for non-SSO
        // accounts) are included alongside emergency contact / function.
        var data = $form.serializeArray();
        data.push({ name: 'action', value: 'rt_event_manager_save_profile' });
        data.push({ name: 'nonce', value: cfg.profileNonce });

        $.post(cfg.ajaxUrl, $.param(data), function (response) {
            $btn.prop('disabled', false);
            if (response && response.success) {
                setStatus($status, i18n.saved || 'Saved!', 'success');
            } else {
                setStatus($status, (response && response.data) || i18n.error || 'Error', 'error');
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            setStatus($status, i18n.requestFail || 'Request failed.', 'error');
        });
    });

    // ---- My Profile: auto-save on field exit + live nav badge ----
    // Profile is incomplete (badge shown) while Function / Role is empty.
    function refreshProfileBadge($form) {
        var $fn = ($form && $form.length) ? $form.find('[name="function"]') : $('[name="function"]');
        var missing = $.trim($fn.val() || '') === '';
        toggleNavAttention('.rtacc-nav-item-profile', missing);
        markRequiredMissing($fn, missing);
    }
    // Set the initial required-field highlights for whichever section is shown.
    $(function () {
        refreshTicketsBadge();
        var $pf = $('.rtacc-profile-autosave');
        if ($pf.length) { refreshProfileBadge($pf); }
        var $ef = $('.rtacc-emergency-form');
        if ($ef.length) { refreshEmergencyDot($ef); }
    });
    function saveProfile($form, $field) {
        var $status = $('#rtacc-profile-status');
        // Validate any email field before saving.
        var $invalid = null;
        $form.find('input[type="email"]').each(function () {
            var $f = $(this);
            var v  = $.trim($f.val() || '');
            if (v !== '' && !isValidEmail(v)) {
                $f.removeClass('uk-form-success rtacc-field-saved').addClass('uk-form-danger');
                if (!$invalid) { $invalid = $f; }
            } else {
                $f.removeClass('uk-form-danger');
            }
        });
        if ($invalid) {
            setStatus($status, i18n.invalidEmail || 'Please enter a valid email address.', 'error');
            $invalid.trigger('focus');
            return;
        }
        var data = $form.serializeArray();
        data.push({ name: 'action', value: 'rt_event_manager_save_profile' });
        data.push({ name: 'nonce', value: cfg.profileNonce });
        $.post(cfg.ajaxUrl, $.param(data), function (response) {
            if (response && response.success) {
                if ($status.length) { $status.hide().text(''); }
                markFieldSaved($field);
                refreshProfileBadge($form);
            } else {
                if ($field) { $field.addClass('uk-form-danger'); }
                setStatus($status, (response && response.data) || i18n.error || 'Error', 'error');
            }
        }).fail(function () {
            setStatus($status, i18n.requestFail || 'Request failed.', 'error');
        });
    }
    $(document).on('change', '.rtacc-profile-autosave input, .rtacc-profile-autosave select', function () {
        saveProfile($(this).closest('form'), $(this));
    });
    // Live badge update as Function / Role is typed or cleared.
    $(document).on('input change', '.rtacc-profile-autosave [name="function"]', function () {
        refreshProfileBadge($(this).closest('form'));
    });

    // ---- Emergency contact ----
    var emergencyNote = null; // active UIkit notification instance, if any.

    // Bottom-centre prompt shown when the tab loads with an incomplete contact.
    (function showEmergencyPrompt() {
        var $prompt = $('.rtacc-emergency-prompt');
        if (!$prompt.length || !window.UIkit || !UIkit.notification) {
            return;
        }
        emergencyNote = UIkit.notification({
            message: $prompt.data('message'),
            pos:     'bottom-right',
            timeout: 0 // stays until dismissed or the contact is completed
        });
    })();

    // Auto-save when a field is left / changed. Toggle the nav notification dot
    // live: the primary contact (block 1) needs name, relationship, email and
    // phone before it counts as complete.
    function primaryEmergencyComplete($form) {
        return ['emergency1_name', 'emergency1_relationship', 'emergency1_email', 'emergency1_phone'].every(function (n) {
            var v = $form.find('[name="' + n + '"]').val();
            return v != null && $.trim(v) !== '';
        });
    }
    // Lock/unlock the second contact block based on the primary contact.
    function toggleSecondaryEmergency(complete) {
        var $sec = $('.rtacc-emergency-secondary');
        if (!$sec.length) {
            return;
        }
        $sec.toggleClass('rtacc-locked', !complete);
        $sec.find('input, select').prop('disabled', !complete);
        $sec.find('.rtacc-emergency-secondary-hint').prop('hidden', complete);
    }
    // Toggle a nav item's attention state (light-blue bg + swap to the alert icon)
    // live, using the data-icon-normal / data-icon-alert attributes on its icon.
    function toggleNavAttention(selector, incomplete) {
        $(selector).each(function () {
            var $li = $(this);
            var $i  = $li.find('.rtacc-nav-icon');
            if (incomplete) {
                $li.addClass('rtacc-nav-attention');
                var a = $i.attr('data-icon-alert');
                if (a) { $i.attr('class', a + ' rtacc-nav-icon'); }
            } else {
                $li.removeClass('rtacc-nav-attention');
                var n = $i.attr('data-icon-normal');
                if (n) { $i.attr('class', n + ' rtacc-nav-icon'); }
            }
        });
    }
    // Outline a required-but-empty field (or its themed-select toggle) in red,
    // so members can see exactly what the nav notification refers to.
    function markRequiredMissing($field, missing) {
        $field.each(function () {
            var $f = $(this);
            var $target = ($f.is('select') && $f.closest('.rtacc-select').length)
                ? $f.closest('.rtacc-select').find('.rtacc-select-toggle')
                : $f;
            $target.toggleClass('rtacc-required-missing', !!missing);
        });
    }
    function refreshEmergencyDot($form) {
        var complete = primaryEmergencyComplete($form);
        toggleSecondaryEmergency(complete);
        toggleNavAttention('.rtacc-nav-item-emergency', !complete);
        ['emergency1_name', 'emergency1_relationship', 'emergency1_email', 'emergency1_phone'].forEach(function (n) {
            var $f = $form.find('[name="' + n + '"]');
            markRequiredMissing($f, $.trim($f.val() || '') === '');
        });
        if (complete && emergencyNote) {
            emergencyNote.close();
            emergencyNote = null;
        }
    }
    // Event Tickets badge: flagged while any editable holder-name field is empty.
    function refreshTicketsBadge() {
        var $names = $('.rtacc-tickets-form .rtacc-ticket-field[name$="[holder_name]"]');
        if (!$names.length) {
            return;
        }
        var incomplete = false;
        $names.each(function () {
            var empty = $.trim($(this).val() || '') === '';
            if (empty) { incomplete = true; }
            markRequiredMissing($(this), empty);
        });
        toggleNavAttention('.rtacc-nav-item-tickets', incomplete);
    }
    $(document).on('input change', '.rtacc-tickets-form .rtacc-ticket-field[name$="[holder_name]"]', function () {
        refreshTicketsBadge();
    });
    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function saveEmergency($form, $field) {
        var $intro = $('.rtacc-emergency-intro').first();

        // Validate email fields before saving: any filled email must be a valid
        // address (the primary contact's email is required to complete it).
        var $invalid = null;
        $form.find('input[type="email"]').each(function () {
            var $f = $(this);
            var v  = $.trim($f.val());
            if (v !== '' && !isValidEmail(v)) {
                $f.removeClass('uk-form-success rtacc-field-saved').addClass('uk-form-danger');
                if (!$invalid) { $invalid = $f; }
            } else {
                $f.removeClass('uk-form-danger');
            }
        });
        if ($invalid) {
            showRowAlert($intro, i18n.invalidEmail || 'Please enter a valid email address.', true);
            $invalid.trigger('focus');
            return $.Deferred().reject().promise();
        }

        var data = $form.serializeArray();
        data.push({ name: 'action', value: 'rt_event_manager_save_profile' });
        data.push({ name: 'nonce', value: cfg.profileNonce });
        return $.post(cfg.ajaxUrl, $.param(data), function (response) {
            if (response && response.success) {
                markFieldSaved($field);
                refreshEmergencyDot($form);
            } else {
                if ($field) { $field.addClass('uk-form-danger'); }
                showRowAlert($intro, (response && response.data) || i18n.error || 'Error', true);
            }
        }).fail(function () {
            showRowAlert($intro, i18n.requestFail || 'Request failed.', true);
        });
    }
    $(document).on('change', '.rtacc-emergency-form input, .rtacc-emergency-form select', function () {
        saveEmergency($(this).closest('form'), $(this));
    });

    // ---- Toggle allergy details when dietary = Allergies ----
    $(document).on('change', '.rtacc-dietary-select', function () {
        var show = $(this).val() === 'allergies';
        var $row = $(this).closest('tr');
        // Toggle the themed combo wrapper (falls back to the bare input).
        var $combo = $row.find('.rtacc-combo');
        if ($combo.length) { $combo.toggle(show); } else { $row.find('.rtacc-allergy-input').toggle(show); }
        if (show) { $row.find('.rtacc-allergy-input').trigger('focus'); }
    });

    // ---- Themed autocomplete for the allergy details field ----
    function comboSuggestions($input) {
        var s = $input.data('suggestions');
        if (typeof s === 'string') { try { s = JSON.parse(s); } catch (e) { s = []; } }
        return $.isArray(s) ? s : [];
    }
    function renderCombo($input) {
        var $combo = $input.closest('.rtacc-combo');
        var q = $.trim($input.val()).toLowerCase();
        var matches = comboSuggestions($input).filter(function (s) {
            return String(s).toLowerCase().indexOf(q) !== -1;
        });
        var $list = $combo.find('.rtacc-combo-list');
        if (!matches.length) { $list.remove(); return; }
        if (!$list.length) { $list = $('<ul class="rtacc-combo-list"></ul>'); $combo.append($list); }
        $list.empty();
        matches.forEach(function (s) { $('<li></li>').text(s).appendTo($list); });
    }
    $(document).on('focus input', '.rtacc-combo-input', function () { renderCombo($(this)); });
    $(document).on('mousedown', '.rtacc-combo-list li', function (e) {
        e.preventDefault(); // keep focus so blur cleanup doesn't fire first
        var $li    = $(this);
        var $combo = $li.closest('.rtacc-combo');
        var $input = $combo.find('.rtacc-combo-input');
        $input.val($li.text());
        $combo.find('.rtacc-combo-list').remove();
        $input.trigger('change'); // details now filled → row can save
    });
    $(document).on('blur', '.rtacc-combo-input', function () {
        var $combo = $(this).closest('.rtacc-combo');
        setTimeout(function () { $combo.find('.rtacc-combo-list').remove(); }, 150);
    });

    // ---- Themed select: enhance native <select>s into themed dropdowns ----
    // Keeps the native <select> in the DOM as the value source, so existing
    // change handlers / form serialization / value reads keep working.
    function enhanceSelect(sel) {
        var $sel = $(sel);
        if ($sel.data('rtaccEnhanced')) { return; }
        if ($sel.closest('.rtacc-select').length) { $sel.data('rtaccEnhanced', true); return; }
        if ($sel.find('option').length > 500) { return; } // safety cap only
        $sel.data('rtaccEnhanced', true);
        var $wrap = $('<div class="rtacc-select"></div>');
        $sel.after($wrap);
        $wrap.append($sel); // move the native select inside the wrapper
        var $toggle = $('<button type="button" class="uk-input rtacc-select-toggle" aria-haspopup="listbox"></button>');
        var $list   = $('<ul class="rtacc-select-list" role="listbox" hidden></ul>');
        // Long lists (e.g. countries) get a type-to-filter search box.
        if ($sel.find('option').length > 12) {
            $('<li class="rtacc-select-search"></li>')
                .append('<input type="text" class="uk-input rtacc-select-filter" placeholder="' + (i18n.searchPlaceholder || 'Search…') + '" autocomplete="off" />')
                .appendTo($list);
        }
        $sel.find('option').each(function () {
            var $o  = $(this);
            var $li = $('<li></li>').attr('data-value', $o.attr('value') || '').text($o.text());
            if ($o.is(':selected')) { $li.addClass('rtacc-combo-active'); }
            $list.append($li);
        });
        $toggle.text($sel.find('option:selected').text() || '');
        $wrap.append($toggle).append($list);
    }
    function enhanceSelects(root) {
        $(root || document).find('.rtacc select.uk-select, .rtacc-modal select.uk-select').each(function () {
            enhanceSelect(this);
        });
    }
    enhanceSelects(document);

    $(document).on('click', '.rtacc-select-toggle', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // A disabled underlying <select> (e.g. a ticket row not in edit mode)
        // must not open.
        if ($(this).closest('.rtacc-select').children('select').prop('disabled')) {
            return;
        }
        var $list = $(this).closest('.rtacc-select').find('.rtacc-select-list');
        var willOpen = $list.prop('hidden');
        $('.rtacc-select-list').prop('hidden', true); // close any others
        $list.prop('hidden', !willOpen);
        if (willOpen) {
            var $filter = $list.find('.rtacc-select-filter');
            if ($filter.length) {
                $filter.val('');
                $list.find('li[data-value]').show();
                setTimeout(function () { $filter.trigger('focus'); }, 0);
            }
        }
    });
    // Filter long lists as the user types.
    $(document).on('input', '.rtacc-select-filter', function (e) {
        e.stopPropagation();
        var q = $.trim($(this).val()).toLowerCase();
        $(this).closest('.rtacc-select-list').find('li[data-value]').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(q) !== -1);
        });
    });
    $(document).on('click', '.rtacc-select-search', function (e) { e.stopPropagation(); });
    // Only actual option rows (with data-value) are selectable.
    $(document).on('click', '.rtacc-select-list li[data-value]', function (e) {
        e.stopPropagation();
        var $li   = $(this);
        var $wrap = $li.closest('.rtacc-select');
        var val   = $li.attr('data-value') || '';
        var $sel  = $wrap.children('select');
        if ($sel.length) {
            $sel.val(val).trigger('change');
        } else {
            $wrap.find('.rtacc-select-value').val(val).trigger('change');
        }
        $wrap.find('.rtacc-select-toggle').text($li.text());
        $wrap.find('.rtacc-select-list li').removeClass('rtacc-combo-active');
        $li.addClass('rtacc-combo-active');
        $wrap.find('.rtacc-select-list').prop('hidden', true);
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.rtacc-select').length) {
            $('.rtacc-select-list').prop('hidden', true);
        }
    });

    // ---- Add-ticket modal (customize the ticket before checkout) ----
    $(document).on('click', '[data-rtacc-modal]', function (e) {
        e.preventDefault();
        $('#rtacc-modal-' + $(this).data('rtacc-modal')).removeAttr('hidden');
    });
    $(document).on('click', '[data-rtacc-close]', function () {
        $(this).closest('.rtacc-modal').attr('hidden', 'hidden');
    });
    $(document).on('change', '.rtacc-modal-dietary', function () {
        $(this).closest('.rtacc-modal-form').find('.rtacc-modal-allergy-field')
            .toggle($(this).val() === 'allergies');
    });
    $(document).on('submit', '.rtacc-modal-form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $err  = $form.find('.rtacc-modal-error');
        var $btn  = $form.find('button[type="submit"]');
        $err.hide();

        var data = $form.serializeArray();
        data.push({ name: 'action', value: 'rt_event_manager_add_ticket_to_cart' });
        data.push({ name: 'nonce', value: cfg.addTicketNonce });
        data.push({ name: 'product_id', value: $form.data('product') });

        $btn.prop('disabled', true);
        $.post(cfg.ajaxUrl, $.param(data), function (response) {
            if (response && response.success && response.data && response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            } else {
                $btn.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Bulk tour add (pretour / day tour): select group members, then checkout ----
    $(document).on('submit', '.rtacc-tour-form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $err  = $form.find('.rtacc-modal-error');
        var $btn  = $form.find('button[type="submit"]');
        $err.hide();

        var members = $form.find('input[name="members[]"]:checked').map(function () {
            return this.value;
        }).get();
        if (!members.length) {
            $err.text(i18n.selectMember || 'Please select at least one member.').show();
            return;
        }

        $btn.prop('disabled', true);
        $.post(cfg.ajaxUrl, {
            action:     $form.data('action') || 'rt_event_manager_add_pretours_to_cart',
            nonce:      cfg.addTicketNonce,
            product_id: $form.find('[name="product_id"]').val(),
            members:    members
        }, function (response) {
            if (response && response.success && response.data && response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            } else {
                $btn.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Ticket save (Event Tickets + Pretour tabs) ----
    function collectTicketRow($row) {
        var data = {};
        $row.find('.rtacc-ticket-field').each(function () {
            var name  = $(this).attr('name');
            var match = name && name.match(/\[([^\]]+)\]$/);
            if (match) {
                data[match[1]] = $(this).val();
            }
        });
        return data;
    }

    // Show a dismissable green alert directly under the edited ticket row and
    // auto-close it after 3s. Falls back gracefully when UIkit JS is absent.
    function showRowAlert($row, message, isError) {
        if (!$row || !$row.length) {
            return;
        }
        // Remove any lingering alert floating over this row first.
        $row.children('.rtacc-row-alert').remove();
        var cls   = isError ? 'uk-alert-danger' : 'uk-alert-success';
        var lead  = isError ? (i18n.errorLead || 'Error') : (i18n.successLead || 'Success!');
        // Floating overlay anchored to the (position:relative) ticket box.
        var $float = $('<div class="rtacc-row-alert" aria-hidden="false"></div>');
        // Match the theme's UIkit alert markup exactly (including the close
        // icon SVG) so it renders correctly with or without UIkit JS decoration.
        var $alert = $(
            '<div class="' + cls + ' uk-alert" uk-alert="">' +
                '<a href="#" class="uk-alert-close uk-icon uk-close" uk-close="" role="button" aria-label="Close">' +
                    '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">' +
                        '<line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line>' +
                        '<line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line>' +
                    '</svg>' +
                '</a>' +
                '<p><strong></strong> <span></span></p>' +
            '</div>'
        );
        $alert.find('strong').text(lead);
        $alert.find('span').text(message);
        $float.append($alert);
        $row.addClass('rtacc-row-has-alert').append($float);

        if (window.UIkit && UIkit.alert) {
            UIkit.alert($alert.get(0));
        }
        var cleanup = function () {
            $float.remove();
            if (!$row.children('.rtacc-row-alert').length) {
                $row.removeClass('rtacc-row-has-alert');
            }
        };
        // Manual close removes the floating wrapper too.
        $alert.on('hide beforehide', cleanup);
        // Auto-close after 3s.
        setTimeout(function () {
            if (!$float.parent().length) {
                return;
            }
            if (window.UIkit && UIkit.alert) {
                UIkit.alert($alert.get(0)).close();
            } else {
                $alert.fadeOut(200, cleanup);
            }
        }, 3000);
    }

    function saveTickets($form, tickets, $status, $row, $field) {
        if (!$field) { setStatus($status, i18n.saving || 'Saving…', null); }
        return $.post(cfg.ajaxUrl, {
            action:  'rt_event_manager_account_save_tickets',
            nonce:   cfg.ticketsNonce,
            tickets: tickets
        }, function (response) {
            if (response && response.success) {
                if ($field && $field.length) {
                    if ($status && $status.length) { $status.hide().text(''); }
                    markFieldSaved($field);
                } else if ($row && $row.length) {
                    if ($status && $status.length) { $status.hide().text(''); }
                    showRowAlert($row, i18n.savedMsg || 'Your changes have been saved.', false);
                } else {
                    setStatus($status, i18n.saved || 'Saved!', 'success');
                }
            } else {
                var msg = (response && response.data) || i18n.error || 'Error';
                if ($field && $field.length) { $field.addClass('uk-form-danger'); }
                if ($row && $row.length) {
                    if ($status && $status.length) { $status.hide().text(''); }
                    showRowAlert($row, msg, true);
                } else {
                    setStatus($status, msg, 'error');
                }
            }
        }).fail(function () {
            if ($row && $row.length) {
                showRowAlert($row, i18n.requestFail || 'Request failed.', true);
            } else {
                setStatus($status, i18n.requestFail || 'Request failed.', 'error');
            }
        });
    }

    // Ticket rows are read-only until the pencil is clicked. Fields start
    // disabled; entering edit mode enables them (locked fields render as plain
    // text and are never inputs, so they stay uneditable).
    function initTicketRows() {
        $('.rtacc-tickets-form tr[data-editable] .rtacc-ticket-field').each(function () {
            if (!$(this).closest('tr').hasClass('rtacc-row-editing')) {
                $(this).prop('disabled', true);
            }
        });
    }
    initTicketRows();

    function enterTicketEdit($row) {
        $row.addClass('rtacc-row-editing');
        $row.find('.rtacc-ticket-field').prop('disabled', false);
        $row.find('.rtacc-edit-toggle').attr('hidden', 'hidden');
        $row.find('.rtacc-edit-save').removeAttr('hidden');
        $row.find('.rtacc-ticket-field').first().trigger('focus');
    }
    function exitTicketEdit($row) {
        $row.removeClass('rtacc-row-editing');
        $row.find('.rtacc-ticket-field').prop('disabled', true);
        $row.find('.rtacc-edit-save').attr('hidden', 'hidden');
        $row.find('.rtacc-edit-toggle').removeAttr('hidden');
    }
    // Validate a row before saving. Blocks only when Dietary = Allergies but the
    // details are empty; family is flagged (non-blocking) if left unselected.
    function validateTicketRow($row) {
        var $diet    = $row.find('.rtacc-dietary-select');
        var $details = $row.find('.rtacc-allergy-input');
        if ($diet.length && $diet.val() === 'allergies' && $details.length && $.trim($details.val()) === '') {
            $details.addClass('uk-form-danger').trigger('focus');
            return false;
        }
        if ($details.length) { $details.removeClass('uk-form-danger'); }
        var $fam     = $row.find('.rtacc-ticket-field[name$="[rti_family]"]');
        var $famWrap = $fam.closest('.rtacc-select');
        if ($fam.length && $.trim($fam.val() || '') === '') {
            $famWrap.addClass('rtacc-select-danger');
        } else {
            $famWrap.removeClass('rtacc-select-danger');
        }
        return true;
    }

    // Never submit the tickets form directly (e.g. Enter key) — saving is per row.
    $(document).on('submit', '.rtacc-tickets-form', function (e) { e.preventDefault(); });

    // Pencil → edit mode.
    $(document).on('click', '.rtacc-edit-toggle', function () {
        enterTicketEdit($(this).closest('tr[data-ticket-id]'));
    });
    // Save icon → validate, save, exit edit mode.
    $(document).on('click', '.rtacc-edit-save', function () {
        var $row  = $(this).closest('tr[data-ticket-id]');
        var $form = $row.closest('.rtacc-tickets-form');
        if (!validateTicketRow($row)) {
            return;
        }
        var $save = $row.find('.rtacc-edit-save').prop('disabled', true);
        var tickets = {};
        tickets[$row.data('ticket-id')] = collectTicketRow($row);
        saveTickets($form, tickets, $form.find('.rtacc-status'), null, null)
            .done(function (response) {
                if (response && response.success) {
                    var $fields = $row.find('.rtacc-ticket-field');
                    exitTicketEdit($row);
                    markFieldSaved($fields);
                    refreshTicketsBadge();
                }
            })
            .always(function () { $save.prop('disabled', false); });
    });

    // ---- Add a linked co-traveller / pretour (parent chosen at add-to-cart) ----
    $(document).on('click', '.rtacc-add-linked-btn', function (e) {
        e.preventDefault();
        var $btn   = $(this);
        var $wrap  = $btn.closest('.rtacc-linked-add');
        var pid    = $btn.data('product');
        var parent = $wrap.find('.rtacc-add-parent').val();

        if (!parent) {
            window.alert(i18n.needParent || 'Please choose a ticket to attach this to.');
            return;
        }

        var sep = cfg.cartUrl.indexOf('?') > -1 ? '&' : '?';
        var url = cfg.cartUrl + sep + 'add-to-cart=' + encodeURIComponent(pid) +
                  '&rti_parent_ticket_id=' + encodeURIComponent(parent);

        if ($btn.data('needs-gender')) {
            var gender = $wrap.find('.rtacc-add-gender').val();
            if (gender) {
                url += '&rti_minor_gender=' + encodeURIComponent(gender);
            }
        }

        window.location.href = url;
    });

    // ---- Ticket transfer: open modal, reset to step 1 ----
    $(document).on('click', '.rtacc-transfer-btn', function () {
        var $modal = $('#rtacc-modal-transfer');
        var $form  = $modal.find('.rtacc-transfer-form');
        $form.find('input[name="ticket_id"]').val($(this).data('ticket'));
        $form.find('.rtacc-modal-target').text((i18n.ticketFor || 'Ticket:') + ' ' + $(this).data('name')).show();
        $form.find('.rtacc-transfer-intro, .rtacc-transfer-final, .rtacc-transfer-step1').show();
        $form.find('.rtacc-transfer-step2').hide();
        $form.find('.rtacc-sharelink-wrap, .rtacc-share-row').remove();
        $form.find('.rtacc-modal-error').removeClass('uk-text-success').addClass('uk-text-danger').hide().text('');
        $form.find('button[type="submit"]').prop('disabled', false);
        $modal.removeAttr('hidden');
    });

    // Two-step confirm: reveal / hide the "Are you sure?" step.
    $(document).on('click', '.rtacc-transfer-next', function () {
        var $form = $(this).closest('.rtacc-transfer-form');
        $form.find('.rtacc-transfer-step1').hide();
        $form.find('.rtacc-transfer-step2').show();
    });
    $(document).on('click', '.rtacc-transfer-back', function () {
        var $form = $(this).closest('.rtacc-transfer-form');
        $form.find('.rtacc-transfer-step2').hide();
        $form.find('.rtacc-transfer-step1').show();
    });

    $(document).on('submit', '.rtacc-transfer-form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $err  = $form.find('.rtacc-modal-error');
        var $btn  = $form.find('button[type="submit"]');
        $err.hide();
        $btn.prop('disabled', true).text(i18n.sending || 'Sending…');
        $.post(cfg.ajaxUrl, {
            action:    'rt_event_manager_request_transfer',
            nonce:     cfg.transferNonce,
            ticket_id: $form.find('input[name="ticket_id"]').val()
        }, function (response) {
            if (response && response.success) {
                $form.find('.rtacc-transfer-intro, .rtacc-transfer-final, .rtacc-transfer-step1, .rtacc-transfer-step2, .rtacc-modal-target').hide();
                $err.removeClass().addClass('rtacc-modal-error')
                    .text(i18n.linkReady || 'Transfer link ready — share it with the new holder.').show();
                // Surface the accept link and ways to share it with the new holder.
                if (response.data && response.data.accept_url) {
                    $form.find('.rtacc-sharelink-wrap').remove();
                    var url = response.data.accept_url;

                    // Message body with the link embedded.
                    var tpl = i18n.shareMessage || 'Hey,\n\nhere is a link so you can accept the transfer of my RTI HYM 2027 Ticket: %s\n\nYours in Tabling';
                    var msg = tpl.replace('%s', url);
                    var mailto = 'mailto:?subject=' + encodeURIComponent(i18n.shareSubject || 'Event ticket transfer') +
                                 '&body=' + encodeURIComponent(msg);
                    var wa = 'https://wa.me/?text=' + encodeURIComponent(msg);

                    // Shareable link inside a non-closable secondary alert.
                    var $wrap = $('<div class="rtacc-sharelink-wrap rtacc-alert-secondary"></div>');
                    $wrap.append($('<p class="rtacc-sharelink-warn"></p>').text(
                        i18n.shareWarn || 'You can also share this link directly, however anyone with this link can accept the transfer!'
                    ));

                    // The alert holds only the warning + link; buttons go below it.
                    $wrap.append($('<a target="_blank" rel="noopener" class="rtacc-sharelink"></a>').attr('href', url).text(url));
                    $form.append($wrap);

                    var $share = $('<p class="rtacc-share-row"></p>');
                    $share.append(
                        $('<button type="button" class="uk-button uk-button-secondary rtacc-copy-link"></button>')
                            .text(i18n.copyLink || 'Copy link').attr('data-url', url)
                    );
                    $share.append($('<a class="uk-button uk-button-primary" target="_blank" rel="noopener"></a>')
                        .attr('href', mailto).text(i18n.sendEmail || 'Send email'));
                    $share.append($('<a class="uk-button uk-button-primary" target="_blank" rel="noopener"></a>')
                        .attr('href', wa).text(i18n.sendWhatsApp || 'Send WhatsApp'));
                    $form.append($share);
                }
            } else {
                $btn.prop('disabled', false).text(i18n.sendTransfer || 'Yes, create the link');
                $form.find('.rtacc-transfer-step2').show();
                $form.find('.rtacc-transfer-step1').hide();
                $err.removeClass().addClass('rtacc-modal-error uk-text-danger')
                    .text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false).text(i18n.sendTransfer || 'Yes, create the link');
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Withdraw a pending transfer (by the current holder) ----
    $(document).on('click', '.rtacc-withdraw-transfer-btn', function () {
        if (!window.confirm(i18n.confirmWithdraw || 'Withdraw the pending transfer for this ticket?')) {
            return;
        }
        var $btn = $(this);
        $btn.prop('disabled', true);
        $.post(cfg.ajaxUrl, {
            action:    'rt_event_manager_withdraw_transfer',
            nonce:     cfg.withdrawNonce,
            ticket_id: $btn.data('ticket')
        }, function (response) {
            if (response && response.success) {
                window.location.reload();
            } else {
                $btn.prop('disabled', false);
                window.alert((response && response.data) || i18n.error || 'Error');
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            window.alert(i18n.requestFail || 'Request failed.');
        });
    });

    // ---- Ticket cancellation: open modal, reset to step 1 ----
    $(document).on('click', '.rtacc-cancel-btn', function () {
        var $modal = $('#rtacc-modal-cancel');
        var $form  = $modal.find('.rtacc-cancel-form');
        var kind   = $(this).data('kind');
        $form.find('input[name="ticket_id"]').val($(this).data('ticket'));
        $form.find('.rtacc-modal-target').text((i18n.ticketFor || 'Ticket:') + ' ' + $(this).data('name'));
        $form.find('.rtacc-cancel-package').toggle(kind === 'event' || kind === 'minor');
        $form.find('.rtacc-cancel-step1').show();
        $form.find('.rtacc-cancel-step2').hide();
        $form.find('.rtacc-modal-error').hide().text('');
        $form.find('button[type="submit"]').prop('disabled', false);
        $modal.removeAttr('hidden');
    });

    // Two-step confirm for cancellation.
    $(document).on('click', '.rtacc-cancel-next', function () {
        var $form = $(this).closest('.rtacc-cancel-form');
        $form.find('.rtacc-cancel-step1').hide();
        $form.find('.rtacc-cancel-step2').show();
    });
    $(document).on('click', '.rtacc-cancel-back', function () {
        var $form = $(this).closest('.rtacc-cancel-form');
        $form.find('.rtacc-cancel-step2').hide();
        $form.find('.rtacc-cancel-step1').show();
    });

    $(document).on('submit', '.rtacc-cancel-form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $err  = $form.find('.rtacc-modal-error');
        var $btn  = $form.find('button[type="submit"]');
        $err.hide();
        $btn.prop('disabled', true).text(i18n.cancelling || 'Cancelling…');
        $.post(cfg.ajaxUrl, {
            action:    'rt_event_manager_cancel_ticket',
            nonce:     cfg.cancelNonce,
            ticket_id: $form.find('input[name="ticket_id"]').val()
        }, function (response) {
            if (response && response.success) {
                window.location.reload();
            } else {
                $btn.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Accept a ticket transfer ----
    $(document).on('submit', '.rtacc-accept-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $err    = $form.find('.rtacc-modal-error');
        var $btn    = $form.find('button[type="submit"]');
        var $status = $form.find('.rtacc-status');
        $err.hide();
        $btn.prop('disabled', true);
        setStatus($status, i18n.accepting || 'Accepting…', null);
        $.post(cfg.ajaxUrl, {
            action: 'rt_event_manager_accept_transfer',
            nonce:  cfg.acceptNonce,
            token:  $form.find('input[name="token"]').val()
        }, function (response) {
            if (response && response.success && response.data && response.data.redirect) {
                window.location.href = response.data.redirect;
            } else {
                $btn.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Decline a ticket transfer ----
    $(document).on('click', '.rtacc-decline-btn', function () {
        var $form   = $(this).closest('.rtacc-accept-form');
        var $err    = $form.find('.rtacc-modal-error');
        var $status = $form.find('.rtacc-status');
        var $btns   = $form.find('button');
        $err.hide();
        $btns.prop('disabled', true);
        setStatus($status, i18n.declining || 'Declining…', null);
        $.post(cfg.ajaxUrl, {
            action: 'rt_event_manager_decline_transfer',
            nonce:  cfg.declineNonce,
            token:  $form.find('input[name="token"]').val()
        }, function (response) {
            if (response && response.success && response.data && response.data.redirect) {
                window.location.href = response.data.redirect;
            } else {
                $btns.prop('disabled', false);
                $err.text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btns.prop('disabled', false);
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Choose options for a product that needs a variation/MTO selection,
    //      carrying the chosen parent ticket to the product page. ----
    $(document).on('click', '.rtacc-choose-options-btn', function (e) {
        e.preventDefault();
        var $btn   = $(this);
        var $wrap  = $btn.closest('.rtacc-linked-add');
        var url    = $btn.data('url');
        var parent = $wrap.find('.rtacc-add-parent').val();

        if (parent) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + 'rti_parent_ticket_id=' + encodeURIComponent(parent);
        }
        window.location.href = url;
    });

    // ---- Dropdown menus (Ticket, Options): toggle, close on outside click / Esc. ----
    $(document).on('click', '.rtacc-menu-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $menu = $(this).closest('.rtacc-menu');
        var open  = $menu.hasClass('is-open');
        $('.rtacc-menu.is-open').removeClass('is-open')
            .find('.rtacc-menu-btn').attr('aria-expanded', 'false');
        if (!open) {
            $menu.addClass('is-open').find('.rtacc-menu-btn').attr('aria-expanded', 'true');
        }
    });

    // Choosing an item closes the menu (before its own action handler runs).
    $(document).on('click', '.rtacc-menu-item', function () {
        $(this).closest('.rtacc-menu').removeClass('is-open')
            .find('.rtacc-menu-btn').attr('aria-expanded', 'false');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.rtacc-menu').length) {
            $('.rtacc-menu.is-open').removeClass('is-open')
                .find('.rtacc-menu-btn').attr('aria-expanded', 'false');
        }
    });

    $(document).on('keyup', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            $('.rtacc-menu.is-open').removeClass('is-open')
                .find('.rtacc-menu-btn').attr('aria-expanded', 'false');
        }
    });

})(jQuery);
