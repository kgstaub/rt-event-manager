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
                $res.removeClass('uk-alert-danger uk-alert-warning uk-alert-success')
                    .addClass(response.data.eu_efta ? 'uk-alert-warning' : 'uk-alert-success')
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

    // ---- Calendar: show/hide a category ----
    $(document).on('change', '.rtacc-cal-toggle', function () {
        $(this).closest('.rtacc-cal').toggleClass('rtacc-cal-hide-' + $(this).data('cat'), !this.checked);
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

    // ---- Toggle allergy details when dietary = Allergies ----
    $(document).on('change', '.rtacc-dietary-select', function () {
        $(this).closest('tr').find('.rtacc-allergy-input').toggle($(this).val() === 'allergies');
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

    // ---- Bulk pretour add (select group members, then checkout) ----
    $(document).on('submit', '.rtacc-pretour-form', function (e) {
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
            action:     'rt_event_manager_add_pretours_to_cart',
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

    function saveTickets($form, tickets, $status) {
        setStatus($status, i18n.saving || 'Saving…', null);
        return $.post(cfg.ajaxUrl, {
            action:  'rt_event_manager_account_save_tickets',
            nonce:   cfg.ticketsNonce,
            tickets: tickets
        }, function (response) {
            if (response && response.success) {
                setStatus($status, i18n.saved || 'Saved!', 'success');
            } else {
                setStatus($status, (response && response.data) || i18n.error || 'Error', 'error');
            }
        }).fail(function () {
            setStatus($status, i18n.requestFail || 'Request failed.', 'error');
        });
    }

    // Auto-save the edited ticket row when the field is left / changed.
    $(document).on('change', '.rtacc-tickets-form .rtacc-ticket-field', function () {
        var $row  = $(this).closest('tr[data-ticket-id]');
        var $form = $(this).closest('.rtacc-tickets-form');
        if (!$row.length) {
            return;
        }
        var tickets = {};
        tickets[$row.data('ticket-id')] = collectTicketRow($row);
        saveTickets($form, tickets, $form.find('.rtacc-status'));
    });

    // Manual "Save" button still saves every row at once.
    $(document).on('submit', '.rtacc-tickets-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $btn    = $form.find('button[type="submit"]');
        var $status = $form.find('.rtacc-status');

        var tickets = {};
        $form.find('tr[data-ticket-id]').each(function () {
            tickets[$(this).data('ticket-id')] = collectTicketRow($(this));
        });

        $btn.prop('disabled', true);
        saveTickets($form, tickets, $status).always(function () {
            $btn.prop('disabled', false);
        });
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

})(jQuery);
