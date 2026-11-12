/**
 * RT Event Manager — member Parking tab: change a permit's licence plate inline.
 */
(function () {
    'use strict';

    if (typeof rtEventManagerParking === 'undefined') {
        return;
    }
    var CFG  = rtEventManagerParking;
    var I18N = CFG.i18n || {};

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function post(data) {
        var body = new URLSearchParams();
        body.set('action', 'rt_event_manager_parking_plate');
        body.set('nonce', CFG.nonce);
        Object.keys(data).forEach(function (k) { body.set(k, data[k]); });
        return fetch(CFG.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: body })
            .then(function (r) { return r.json(); });
    }

    function openEditor(cell) {
        var row     = cell.closest('[data-permit]');
        var plateEl = cell.querySelector('.rtacc-parking-plate');
        var current = plateEl ? plateEl.textContent : '';
        var original = cell.innerHTML;

        cell.innerHTML =
            '<form class="rtacc-parking-form">' +
            '<input class="uk-input uk-form-small" type="text" maxlength="20" autocomplete="off" style="text-transform:uppercase;max-width:160px" value="' + esc(current) + '" required /> ' +
            '<button type="submit" class="uk-button uk-button-primary uk-button-small">' + esc(I18N.save || 'Save') + '</button> ' +
            '<button type="button" class="uk-button uk-button-default uk-button-small rtacc-parking-cancel">' + esc(I18N.cancel || 'Cancel') + '</button>' +
            '<div class="rtacc-parking-msg uk-text-small"></div>' +
            '</form>';

        var form  = cell.querySelector('form');
        var input = form.querySelector('input');
        var msg   = form.querySelector('.rtacc-parking-msg');
        input.focus();
        input.select();

        form.querySelector('.rtacc-parking-cancel').addEventListener('click', function () {
            cell.innerHTML = original;
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type=submit]');
            btn.disabled = true;
            msg.textContent = I18N.saving || 'Saving…';
            post({ permit_id: row.getAttribute('data-permit'), plate: input.value }).then(function (res) {
                if (res && res.success) {
                    cell.innerHTML = original;
                    var p = cell.querySelector('.rtacc-parking-plate');
                    if (p) { p.textContent = res.data.plate; }
                    var note = document.createElement('div');
                    note.className = 'uk-text-small uk-text-success';
                    note.textContent = I18N.reprint || 'Plate updated — print the permit again.';
                    cell.appendChild(note);
                } else {
                    btn.disabled = false;
                    msg.textContent = (res && res.data && res.data.message) || I18N.error;
                }
            }).catch(function () {
                btn.disabled = false;
                msg.textContent = I18N.error || 'Error';
            });
        });
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.rtacc-parking-edit') : null;
        if (!btn) { return; }
        e.preventDefault();
        openEditor(btn.closest('.rtacc-parking-plate-cell'));
    });
})();
