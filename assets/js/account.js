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
