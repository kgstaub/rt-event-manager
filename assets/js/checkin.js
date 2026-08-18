/**
 * RT Event Manager — staff check-in PWA.
 *
 * Scans a ticket QR (native BarcodeDetector when available, jsQR fallback),
 * looks the ticket up, shows its details, and marks it checked in.
 */
(function () {
    'use strict';

    if (typeof rtEventManagerCheckin === 'undefined') {
        return;
    }
    var CFG  = rtEventManagerCheckin;
    var I18N = CFG.i18n || {};

    // Register the service worker (installable / offline shell).
    if ('serviceWorker' in navigator && CFG.swUrl) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register(CFG.swUrl, { scope: '/' }).catch(function () {});
        });
    }

    var video   = document.getElementById('rtem-video');
    var startBtn = document.getElementById('rtem-start');
    var hint    = document.getElementById('rtem-hint');
    var result  = document.getElementById('rtem-result');
    var manual  = document.getElementById('rtem-manual');
    var manualToggle = document.getElementById('rtem-manual-toggle');
    if (!video) { return; }

    var stream = null;
    var scanning = false;
    var rafId = null;
    var detector = null;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var busy = false;

    function setHint(msg) { if (hint) { hint.textContent = msg; } }

    function stopScan() {
        scanning = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
        video.classList.remove('is-live');
    }

    function startScan() {
        result.hidden = true;
        result.innerHTML = '';
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHint(I18N.cameraError || 'Camera unavailable.');
            return;
        }
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
            .then(function (s) {
                stream = s;
                video.srcObject = s;
                video.setAttribute('playsinline', 'true');
                return video.play();
            })
            .then(function () {
                video.classList.add('is-live');
                setHint(I18N.scanning || 'Point the camera at the QR code.');
                scanning = true;
                if ('BarcodeDetector' in window) {
                    try { detector = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { detector = null; }
                }
                tick();
            })
            .catch(function () {
                setHint(I18N.cameraError || 'Could not access the camera.');
            });
    }

    function tick() {
        if (!scanning) { return; }
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            if (detector) {
                detector.detect(video).then(function (codes) {
                    if (codes && codes.length) { onDecode(codes[0].rawValue); }
                }).catch(function () {});
            } else {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                if (canvas.width && canvas.height) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var code = window.jsQR ? window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' }) : null;
                    if (code && code.data) { onDecode(code.data); }
                }
            }
        }
        rafId = requestAnimationFrame(tick);
    }

    function onDecode(text) {
        if (busy) { return; }
        busy = true;
        stopScan();
        lookup({ token: text });
    }

    function post(action, data) {
        var body = new URLSearchParams();
        body.set('action', action);
        body.set('nonce', CFG.lookupNonce);
        Object.keys(data).forEach(function (k) { body.set(k, data[k]); });
        return fetch(CFG.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: body })
            .then(function (r) { return r.json(); });
    }

    function lookup(params) {
        setHint('…');
        post('rt_event_manager_checkin_lookup', params).then(function (res) {
            busy = false;
            if (res && res.success) {
                renderTicket(res.data);
            } else {
                showError((res && res.data && res.data.message) || I18N.notFound);
            }
        }).catch(function () { busy = false; showError(I18N.networkError); });
    }

    function statusLabel(s) {
        var map = {
            valid: 'Confirmed', draft: 'Pending', invalid: 'Invalid',
            checked_in: 'Checked in', cancelled: 'Cancelled', refunded: 'Refunded'
        };
        return map[s] || s;
    }

    function renderTicket(t) {
        result.hidden = false;
        var terminal = (t.status === 'cancelled' || t.status === 'refunded');
        var checkedIn = (t.status === 'checked_in');
        var extra = '';
        if (t.guardian) { extra += row('Guardian', t.guardian); }
        if (t.pretours && t.pretours.length) { extra += row('Pretours', t.pretours.join(', ')); }
        if (t.daytours && t.daytours.length) { extra += row('Day tours', t.daytours.join(', ')); }
        if (t.dietary && t.dietary !== 'none') { extra += row('Dietary', t.dietary); }

        var banner = '';
        if (checkedIn) {
            var msg = t.checked_by
                ? (I18N.checkedInBy || 'Checked in by') + ' ' + t.checked_by
                : (I18N.checkedIn || 'Checked in');
            if (t.checked_at) { msg += ' ' + (I18N.at || 'at') + ' ' + t.checked_at; }
            banner = '<div class="rtem-banner rtem-banner-secondary">' + esc(msg) + '</div>';
        } else if (terminal) {
            banner = '<div class="rtem-banner rtem-banner-danger">' + esc(statusLabel(t.status)) + '</div>';
        }

        // Companions (guardian ⇄ minors) offered for a combined check-in.
        var companionsHtml = '';
        var pendingCompanions = (t.companions || []).filter(function (c) { return c.status !== 'checked_in'; });
        if (!terminal && !checkedIn && pendingCompanions.length) {
            companionsHtml = '<div class="rtem-companions"><p class="rtem-companions-title">' +
                esc('Check in together') + '</p>';
            pendingCompanions.forEach(function (c) {
                companionsHtml += '<label class="rtem-companion"><input type="checkbox" class="rtem-companion-cb" value="' +
                    esc(c.id) + '" checked> <span>' + esc(c.holder) + '</span> <span class="rtem-companion-rel">' +
                    esc(c.relation) + '</span></label>';
            });
            companionsHtml += '</div>';
        }

        var action = (terminal || checkedIn) ? '' :
            '<button type="button" class="rtem-btn rtem-btn-checkin" id="rtem-do">' +
            esc((I18N.checkIn || 'Check in')) + ' →</button>';

        result.innerHTML =
            '<div class="rtem-card rtem-card-' + esc(t.status) + '">' +
            banner +
            '<h2 class="rtem-name">' + esc(t.holder) + '</h2>' +
            '<div class="rtem-badges"><span class="rtem-badge">' + esc(t.type) + '</span>' +
            '<span class="rtem-badge rtem-badge-status rtem-status-' + esc(t.status) + '">' + esc(statusLabel(t.status)) + '</span></div>' +
            '<table class="rtem-details">' +
            row('Ticket', esc(t.product)) +
            row('Order / no.', '#' + esc(t.order_id) + ' · ' + esc(t.number)) +
            extra +
            '</table>' +
            companionsHtml +
            action +
            '<button type="button" class="rtem-btn rtem-btn-next" id="rtem-next">' + esc('Scan next') + '</button>' +
            '</div>';

        var doBtn = document.getElementById('rtem-do');
        if (doBtn) {
            doBtn.addEventListener('click', function () {
                doBtn.disabled = true;
                doBtn.textContent = '…';
                var payload = { ticket_id: t.id };
                var also = Array.prototype.slice.call(result.querySelectorAll('.rtem-companion-cb:checked')).map(function (cb) { return cb.value; });
                also.forEach(function (id, i) { payload['also[' + i + ']'] = id; });
                post('rt_event_manager_checkin_do', payload).then(function (res) {
                    if (res && res.success) {
                        renderTicket(res.data.ticket);
                        var did = (res.data.results || []).filter(function (r) { return r.outcome === 'checked_in'; }).length;
                        flash(did > 1 ? (did + ' ' + esc('checked in')) : (I18N.checkedIn || 'Checked in'), 'ok');
                    } else {
                        doBtn.disabled = false;
                        doBtn.textContent = (I18N.checkIn || 'Check in') + ' →';
                        showError((res && res.data && res.data.message) || I18N.networkError);
                    }
                }).catch(function () {
                    doBtn.disabled = false;
                    showError(I18N.networkError);
                });
            });
        }
        document.getElementById('rtem-next').addEventListener('click', function () {
            result.hidden = true; result.innerHTML = '';
            startScan();
        });
    }

    function row(label, value) {
        return '<tr><td class="lbl">' + esc(label) + '</td><td>' + value + '</td></tr>';
    }

    function flash(msg, kind) {
        var el = document.createElement('div');
        el.className = 'rtem-flash rtem-flash-' + (kind || 'ok');
        el.textContent = msg;
        document.getElementById('rtem-checkin').appendChild(el);
        setTimeout(function () { el.classList.add('is-out'); }, 1600);
        setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 2100);
    }

    function showError(msg) {
        result.hidden = false;
        result.innerHTML = '<div class="rtem-card"><div class="rtem-banner rtem-banner-danger">' + esc(msg || 'Error') + '</div>' +
            '<button type="button" class="rtem-btn rtem-btn-next" id="rtem-next">' + esc('Try again') + '</button></div>';
        document.getElementById('rtem-next').addEventListener('click', function () {
            result.hidden = true; result.innerHTML = ''; startScan();
        });
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    if (startBtn) { startBtn.addEventListener('click', startScan); }
    if (manualToggle && manual) {
        manualToggle.addEventListener('click', function () { manual.hidden = !manual.hidden; });
        manual.addEventListener('submit', function (e) {
            e.preventDefault();
            var order = document.getElementById('rtem-order').value;
            var number = document.getElementById('rtem-number').value || '1';
            if (!order) { return; }
            stopScan();
            lookup({ order_id: order, number: number });
        });
    }
})();
