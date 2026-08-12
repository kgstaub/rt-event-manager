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

        $.post(cfg.ajaxUrl, {
            action:            'rt_event_manager_save_profile',
            nonce:             cfg.profileNonce,
            emergency_contact: $form.find('[name="emergency_contact"]').val(),
            'function':        $form.find('[name="function"]').val()
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

    // ---- Ticket save ----
    $(document).on('submit', '#rtacc-tickets-form', function (e) {
        e.preventDefault();
        var $form   = $(this);
        var $btn    = $form.find('button[type="submit"]');
        var $status = $('#rtacc-tickets-status');

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

})(jQuery);
