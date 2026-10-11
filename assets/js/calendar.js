/**
 * RT Event Manager — public event calendar ([rt_event_manager_calendar]).
 *
 * Standalone behaviour for the calendar grid: re-pack visible blocks into full
 * width, toggle categories from the legend, (optional) attendee filter, and
 * focus the day viewport on 08:00. Mirrors the calendar handlers in account.js
 * but without the logged-in portal config dependency, so it runs on a public
 * page. Guarded so it is harmless if account.js is also present.
 */
(function ($) {
    'use strict';

    if (window.rtEventManagerCalendarInit) {
        return;
    }
    window.rtEventManagerCalendarInit = true;

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

    // ---- Show/hide a category ----
    $(document).on('change', '.rtacc-cal-toggle', function () {
        var $cal = $(this).closest('.rtacc-cal');
        $cal.toggleClass('rtacc-cal-hide-' + $(this).data('cat'), !this.checked);
        relayoutCalendar($cal);
    });

    // ---- Filter by attendee (agenda blocks always show) ----
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

    // ---- Focus the day viewport on 08:00 (scroll to reveal the rest) ----
    $(function () {
        $('.rtacc-cal-week-body').each(function () {
            var top = parseInt($(this).attr('data-focus-top'), 10);
            if (!isNaN(top)) {
                this.scrollTop = top;
            }
        });
    });
})(jQuery);
