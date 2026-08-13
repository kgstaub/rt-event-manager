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
    $(document).on('submit', '.rtacc-tickets-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $btn    = $form.find('button[type="submit"]');
        var $status = $form.find('.rtacc-status');

        var tickets = {};
        $form.find('tr[data-ticket-id]').each(function () {
            var ticketId = $(this).data('ticket-id');
            tickets[ticketId] = {};
            $(this).find('.rtacc-ticket-field').each(function () {
                var name  = $(this).attr('name');
                var match = name && name.match(/\[([^\]]+)\]$/);
                if (match) {
                    tickets[ticketId][match[1]] = $(this).val();
                }
            });
        });

        $btn.prop('disabled', true);
        setStatus($status, i18n.saving || 'Saving…', null);

        $.post(cfg.ajaxUrl, {
            action:  'rt_event_manager_account_save_tickets',
            nonce:   cfg.ticketsNonce,
            tickets: tickets
        }, function (response) {
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

    // ---- Ticket transfer: open modal, prefill target ----
    $(document).on('click', '.rtacc-transfer-btn', function () {
        var $modal = $('#rtacc-modal-transfer');
        $modal.find('input[name="ticket_id"]').val($(this).data('ticket'));
        $modal.find('input[name="email"]').val('');
        $modal.find('.rtacc-modal-target').text(
            (i18n.ticketFor || 'Ticket:') + ' ' + $(this).data('name')
        );
        $modal.find('.rtacc-modal-error').hide().text('');
        $modal.removeAttr('hidden');
    });

    $(document).on('submit', '.rtacc-transfer-form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $err  = $form.find('.rtacc-modal-error');
        var $btn  = $form.find('button[type="submit"]');
        var email = ($form.find('input[name="email"]').val() || '').trim();
        $err.hide();
        if (!email) {
            $err.text(i18n.needEmail || 'Please enter an email address.').show();
            return;
        }
        $btn.prop('disabled', true).text(i18n.sending || 'Sending…');
        $.post(cfg.ajaxUrl, {
            action:    'rt_event_manager_request_transfer',
            nonce:     cfg.transferNonce,
            ticket_id: $form.find('input[name="ticket_id"]').val(),
            email:     email
        }, function (response) {
            if (response && response.success) {
                $form.find('.rtacc-field, .rtacc-modal-target, p:not(.rtacc-actions)').hide();
                $err.removeClass().addClass('rtacc-modal-error uk-text-success')
                    .text((response.data && response.data.message) || (i18n.saved || 'Sent!')).show();
                $btn.hide();
            } else {
                $btn.prop('disabled', false).text(i18n.sendTransfer || 'Send transfer request');
                $err.removeClass().addClass('rtacc-modal-error uk-text-danger')
                    .text((response && response.data) || i18n.error || 'Error').show();
            }
        }).fail(function () {
            $btn.prop('disabled', false).text(i18n.sendTransfer || 'Send transfer request');
            $err.text(i18n.requestFail || 'Request failed.').show();
        });
    });

    // ---- Ticket cancellation: open modal, prefill target ----
    $(document).on('click', '.rtacc-cancel-btn', function () {
        var $modal = $('#rtacc-modal-cancel');
        var kind   = $(this).data('kind');
        $modal.find('input[name="ticket_id"]').val($(this).data('ticket'));
        $modal.find('.rtacc-modal-target').text(
            (i18n.ticketFor || 'Ticket:') + ' ' + $(this).data('name')
        );
        $modal.find('.rtacc-cancel-package').toggle(kind === 'event' || kind === 'minor');
        $modal.find('.rtacc-modal-error').hide().text('');
        $modal.removeAttr('hidden');
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
