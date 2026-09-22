/* global jQuery, rtHelp */
(function ($) {
    'use strict';

    if (typeof rtHelp === 'undefined') {
        return;
    }

    var $root = $('#rthelp');
    if (!$root.length) {
        return;
    }

    var i18n = rtHelp.i18n || {};

    var $listView = $root.find('.rthelp-view--list');
    var $chatView = $root.find('.rthelp-view--chat');
    var $list = $root.find('.rthelp-list');
    var $newForm = $root.find('.rthelp-new-form');

    /* ---------------------------------------------------------------- utils */

    function esc(s) {
        return $('<div/>').text(s == null ? '' : String(s)).html();
    }

    // Member-facing status: a closed ticket is Resolved; a support reply is
    // "Support replied" until the member reads it, then "Read"; else Open /
    // Awaiting reply.
    function displayStatus(status, lastFrom, read) {
        var s = (status || '').toLowerCase();
        if (s === 'closed') {
            return { label: i18n.statusClosed || 'Resolved', cls: 'rthelp-status--closed' };
        }
        if (lastFrom === 'support') {
            if (read) {
                return { label: i18n.statusRead || 'Read', cls: 'rthelp-status--read' };
            }
            return { label: i18n.statusReplied || 'Support replied', cls: 'rthelp-status--replied' };
        }
        if (s === 'pending') {
            return { label: i18n.statusPending || 'Awaiting reply', cls: 'rthelp-status--pending' };
        }
        return { label: i18n.statusActive || 'Open', cls: 'rthelp-status--active' };
    }

    // Decrease the "Get help" nav badge by one (removing it at zero). There may be
    // two nav copies (desktop + off-canvas).
    function decrementNavBadge() {
        jQuery('.rtacc-nav-badge').each(function () {
            var n = parseInt(jQuery(this).text(), 10) || 0;
            n = Math.max(0, n - 1);
            if (n <= 0) {
                jQuery(this).remove();
            } else {
                jQuery(this).text(n);
            }
        });
    }

    function fmtDate(iso) {
        if (!iso) { return ''; }
        var d = new Date(iso);
        if (isNaN(d.getTime())) { return esc(iso); }
        try {
            return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
        } catch (e) {
            return d.toLocaleString();
        }
    }

    function isImage(mime) {
        return /^image\//.test(mime || '');
    }

    // Client-side file validation mirroring the server rules.
    var ALLOWED = /\.(jpe?g|png|gif|webp|heic|pdf|docx?|xlsx?)$/i;

    function validateFiles(input) {
        var files = input.files || [];
        if (files.length > rtHelp.maxFiles) {
            return i18n.tooMany;
        }
        for (var i = 0; i < files.length; i++) {
            if (files[i].size > rtHelp.maxMb * 1024 * 1024) {
                return (i18n.tooBig || '') + ' (' + esc(files[i].name) + ')';
            }
            if (!ALLOWED.test(files[i].name)) {
                return (i18n.badType || '') + ' (' + esc(files[i].name) + ')';
            }
        }
        return '';
    }

    // Show the chosen filenames under a file input.
    function bindFileList($scope) {
        $scope.find('.rthelp-files').on('change', function () {
            var $ul = $(this).closest('.rthelp-attach').find('.rthelp-file-list');
            $ul.empty();
            var files = this.files || [];
            for (var i = 0; i < files.length; i++) {
                $ul.append('<li>' + esc(files[i].name) + '</li>');
            }
        });
    }

    function showView(which) {
        if (which === 'chat') {
            $listView.attr('hidden', true);
            $chatView.removeAttr('hidden');
        } else {
            $chatView.attr('hidden', true);
            $listView.removeAttr('hidden');
        }
    }

    /* ------------------------------------------------------------- list view */

    function loadList() {
        $list.html('<p class="rthelp-loading">' + esc(i18n.loading || '…') + '</p>');
        $.post(rtHelp.ajaxUrl, { action: 'rt_help_list', nonce: rtHelp.nonce })
            .done(function (res) {
                if (!res || !res.success) {
                    $list.html('<p class="rthelp-error">' + esc(i18n.loadFail) + '</p>');
                    return;
                }
                renderList(res.data.conversations || []);
            })
            .fail(function () {
                $list.html('<p class="rthelp-error">' + esc(i18n.loadFail) + '</p>');
            });
    }

    // Unread support replies (not closed) need the member's attention — float
    // them to the top, newest-first within each group.
    function needsAttention(c) {
        return c.lastFrom === 'support' && !c.read && (c.status || '').toLowerCase() !== 'closed';
    }

    function renderList(items) {
        if (!items.length) {
            $list.html('<p class="rthelp-empty">' + esc(i18n.none) + '</p>');
            return;
        }
        // Stable sort: the API already returns newest-first, so only lift the
        // support-replied tickets above the rest without reshuffling within.
        items = items.slice().sort(function (a, b) {
            return (needsAttention(b) ? 1 : 0) - (needsAttention(a) ? 1 : 0);
        });
        var html = '<ul class="rthelp-tickets">';
        items.forEach(function (c) {
            var ds = displayStatus(c.status, c.lastFrom, c.read);
            html += '<li class="rthelp-ticket" data-id="' + esc(c.id) + '" tabindex="0" role="button">'
                + '<div class="rthelp-ticket-main">'
                + '<span class="rthelp-ticket-subject">' + esc(c.subject) + '</span>'
                + '<span class="rthelp-ticket-meta">' + esc(c.ref) + ' · ' + fmtDate(c.updatedAt) + '</span>'
                + '</div>'
                + '<span class="rthelp-status ' + ds.cls + '">' + esc(ds.label) + '</span>'
                + '</li>';
        });
        html += '</ul>';
        $list.html(html);
    }

    /* ------------------------------------------------------------- chat view */

    var currentId = 0;

    function openConversation(id) {
        currentId = id;
        showView('chat');
        var $chat = $chatView.find('.rthelp-chat');
        $chatView.find('.rthelp-chat-subject').text('');
        $chatView.find('.rthelp-chat-status').text('').attr('class', 'rthelp-chat-status');
        $chat.html('<p class="rthelp-loading">' + esc(i18n.loading || '…') + '</p>');
        resetReplyForm();

        $.post(rtHelp.ajaxUrl, { action: 'rt_help_thread', nonce: rtHelp.nonce, id: id })
            .done(function (res) {
                if (!res || !res.success) {
                    // Agent deleted it (or it's otherwise gone) — return to the list.
                    if (res && res.data && res.data.gone) {
                        showView('list');
                        loadList();
                        return;
                    }
                    $chat.html('<p class="rthelp-error">' + esc((res && res.data && res.data.message) || i18n.loadFail) + '</p>');
                    return;
                }
                var subj = res.data.subject || '';
                $chatView.find('.rthelp-chat-subject').text(res.data.ref ? (res.data.ref + ' · ' + subj) : subj);
                var ds = displayStatus(res.data.status || '', res.data.lastFrom, res.data.read);
                $chatView.find('.rthelp-chat-status')
                    .text(ds.label)
                    .addClass('rthelp-status ' + ds.cls);
                // Reading an unread support reply reduces the nav badge live.
                if (res.data.wasUnread) {
                    decrementNavBadge();
                }
                renderMessages(res.data.messages || []);
            })
            .fail(function () {
                $chat.html('<p class="rthelp-error">' + esc(i18n.loadFail) + '</p>');
            });
    }

    function renderMessages(messages) {
        var $chat = $chatView.find('.rthelp-chat');
        if (!messages.length) {
            $chat.html('<p class="rthelp-empty">' + esc(i18n.noMessages) + '</p>');
            return;
        }
        var html = '';
        messages.forEach(function (m) {
            var side = m.mine ? 'rthelp-msg--mine' : 'rthelp-msg--them';
            html += '<div class="rthelp-msg ' + side + '">';
            html += '<div class="rthelp-msg-head"><span class="rthelp-msg-author">' + esc(m.author) + '</span>';
            if (m.createdAt) {
                html += '<span class="rthelp-msg-date">' + fmtDate(m.createdAt) + '</span>';
            }
            html += '</div>';
            html += '<div class="rthelp-msg-body">' + (m.bodyHtml || '') + '</div>';
            if (m.attachments && m.attachments.length) {
                html += '<div class="rthelp-msg-atts">';
                m.attachments.forEach(function (a) {
                    // No inline preview — always a download link showing the file name.
                    html += '<a class="rthelp-att rthelp-att--file" href="' + esc(a.url) + '" target="_blank" rel="noopener" download>'
                        + '<i class="fa-regular fa-file" aria-hidden="true"></i> ' + esc(a.name) + '</a>';
                });
                html += '</div>';
            }
            html += '</div>';
        });
        $chat.html(html);
        $chat.scrollTop($chat[0].scrollHeight);
    }

    function resetReplyForm() {
        var $f = $chatView.find('.rthelp-reply-form');
        $f[0].reset();
        $f.find('.rthelp-file-list').empty();
        $f.find('.rthelp-reply-msg').attr('hidden', true).text('');
    }

    /* -------------------------------------------------------------- actions */

    // Open the new-request form.
    $root.on('click', '[data-open-new]', function () {
        $newForm.removeAttr('hidden');
        $newForm.find('.rthelp-topic').focus();
    });
    $root.on('click', '[data-cancel-new]', function () {
        $newForm.attr('hidden', true)[0].reset();
        $newForm.find('.rthelp-file-list').empty();
        $newForm.find('.rthelp-form-msg').attr('hidden', true);
    });

    // Open a conversation.
    $root.on('click keydown', '.rthelp-ticket', function (e) {
        if (e.type === 'keydown' && e.which !== 13 && e.which !== 32) { return; }
        e.preventDefault();
        openConversation($(this).data('id'));
    });

    // Back to list.
    $root.on('click', '[data-back]', function () {
        showView('list');
        loadList();
    });

    // Delete (remove from the member's list).
    $root.on('click', '[data-delete]', function () {
        if (currentId <= 0) { return; }
        if (!window.confirm(i18n.confirmDelete || 'Remove this conversation from your list?')) { return; }
        var $btn = $(this);
        $btn.prop('disabled', true);
        $.post(rtHelp.ajaxUrl, { action: 'rt_help_delete', nonce: rtHelp.nonce, id: currentId })
            .always(function () {
                $btn.prop('disabled', false);
                showView('list');
                loadList();
            });
    });

    // Submit a new request.
    $newForm.on('submit', function (e) {
        e.preventDefault();
        var $msg = $newForm.find('.rthelp-form-msg');
        var topic = $newForm.find('.rthelp-topic').val();
        var subject = $.trim($newForm.find('.rthelp-subject').val());
        var message = $.trim($newForm.find('.rthelp-message').val());
        var $attendee = $newForm.find('.rthelp-attendee');
        var attendee = $attendee.length ? $attendee.val() : 'all';
        var fileInput = $newForm.find('.rthelp-files')[0];

        if (!topic) { return showFormMsg($msg, i18n.chooseTopic || 'Please choose a topic.', true); }
        if (!subject) { return showFormMsg($msg, i18n.enterSubject || 'Please enter a subject.', true); }
        if (!message) { return showFormMsg($msg, i18n.writeQuestion || 'Please describe your question.', true); }

        var fileErr = validateFiles(fileInput);
        if (fileErr) { return showFormMsg($msg, fileErr, true); }

        var fd = new FormData();
        fd.append('action', 'rt_help_create');
        fd.append('nonce', rtHelp.nonce);
        fd.append('topic', topic);
        fd.append('subject', subject);
        fd.append('attendee', attendee);
        fd.append('message', message);
        appendFiles(fd, fileInput);

        var $btn = $newForm.find('.rthelp-submit');
        $btn.prop('disabled', true).text(i18n.sending);
        showFormMsg($msg, '', false);

        postForm(fd)
            .done(function (res) {
                if (res && res.success) {
                    $newForm.attr('hidden', true)[0].reset();
                    $newForm.find('.rthelp-file-list').empty();
                    loadList();
                } else {
                    showFormMsg($msg, (res && res.data && res.data.message) || i18n.loadFail, true);
                }
            })
            .fail(function () { showFormMsg($msg, i18n.loadFail, true); })
            .always(function () { $btn.prop('disabled', false).text(i18n.send); });
    });

    // Submit a reply.
    $chatView.on('submit', '.rthelp-reply-form', function (e) {
        e.preventDefault();
        var $f = $(this);
        var $msg = $f.find('.rthelp-reply-msg');
        var text = $.trim($f.find('.rthelp-reply-text').val());
        var fileInput = $f.find('.rthelp-files')[0];

        var fileErr = validateFiles(fileInput);
        if (fileErr) { return showFormMsg($msg, fileErr, true); }
        if (!text && (!fileInput.files || !fileInput.files.length)) { return; }

        var fd = new FormData();
        fd.append('action', 'rt_help_reply');
        fd.append('nonce', rtHelp.nonce);
        fd.append('id', currentId);
        fd.append('message', text);
        appendFiles(fd, fileInput);

        var $btn = $f.find('.rthelp-reply-btn');
        $btn.prop('disabled', true).text(i18n.sending);
        showFormMsg($msg, '', false);

        postForm(fd)
            .done(function (res) {
                if (res && res.success) {
                    resetReplyForm();
                    renderMessages(res.data.messages || []);
                } else {
                    showFormMsg($msg, (res && res.data && res.data.message) || i18n.loadFail, true);
                }
            })
            .fail(function () { showFormMsg($msg, i18n.loadFail, true); })
            .always(function () { $btn.prop('disabled', false).text(i18n.sendReply); });
    });

    function appendFiles(fd, input) {
        var files = (input && input.files) || [];
        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files[i]);
        }
    }

    function postForm(fd) {
        return $.ajax({
            url: rtHelp.ajaxUrl,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false
        });
    }

    function showFormMsg($el, text, isError) {
        if (!text) { $el.attr('hidden', true).text(''); return; }
        $el.text(text).removeAttr('hidden')
            .toggleClass('rthelp-msg-error', !!isError)
            .toggleClass('rthelp-msg-ok', !isError);
    }

    /* ----------------------------------------------------------------- init */

    bindFileList($newForm);
    bindFileList($chatView);
    loadList();

})(jQuery);
