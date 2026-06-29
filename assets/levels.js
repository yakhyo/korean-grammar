/* Reader-mode enhancements for KIIP level pages.
   Progressive enhancement: reads the existing DOM and adds
   collapsible units, a sticky jump-nav, live vocab search and back-to-top.
   No build step; works the same across every level/language file. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var CHEV = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  ready(function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll('section.lesson'));
    if (!sections.length) return;

    /* ---- 1. Collapsible units (collapsed by default) ---- */
    sections.forEach(function (sec) {
      var head = sec.querySelector('.lesson-head');
      if (!head) return;

      // move everything after the head into a collapsible body
      var body = document.createElement('div');
      body.className = 'lesson-body';
      var node = head.nextSibling;
      while (node) {
        var next = node.nextSibling;
        body.appendChild(node);
        node = next;
      }
      sec.appendChild(body);

      // word-count badge + chevron, and make the head a toggle
      var nWords = sec.querySelectorAll('table.voc td.w').length;
      if (nWords) {
        var badge = document.createElement('span');
        badge.className = 'lesson-count';
        badge.textContent = nWords + (nWords === 1 ? ' word' : ' words');
        head.appendChild(badge);
      }
      var chev = document.createElement('span');
      chev.className = 'lesson-chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.innerHTML = CHEV;
      head.appendChild(chev);

      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', 'false');
      head.addEventListener('click', function () { toggle(sec); });
      head.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(sec); }
      });
    });

    function setOpen(sec, open) {
      sec.classList.toggle('is-open', open);
      var head = sec.querySelector('.lesson-head');
      if (head) head.setAttribute('aria-expanded', String(open));
    }
    function toggle(sec) { setOpen(sec, !sec.classList.contains('is-open')); }

    function expandTarget(id) {
      if (!id) return;
      var sec = document.getElementById(id);
      if (!sec || !sec.classList.contains('lesson')) return;
      setOpen(sec, true);
      requestAnimationFrame(function () {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* clicking a Table-of-Contents link expands + scrolls to that unit */
    Array.prototype.forEach.call(document.querySelectorAll('nav.toc a[href^="#"]'), function (a) {
      a.addEventListener('click', function () { expandTarget(a.getAttribute('href').slice(1)); });
    });
    window.addEventListener('hashchange', function () { expandTarget(location.hash.slice(1)); });
    if (location.hash) expandTarget(location.hash.slice(1));

    /* ---- 2. Floating reader bar: search · units · top ---- */
    var bar = document.createElement('div');
    bar.className = 'reader-bar';
    bar.innerHTML =
      '<span class="reader-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span>' +
      '<input class="reader-search" type="search" placeholder="Search vocabulary…" aria-label="Search vocabulary" autocomplete="off" spellcheck="false">' +
      '<span class="reader-count" aria-live="polite"></span>' +
      '<button class="reader-units" type="button" aria-haspopup="true" aria-expanded="false">Units' +
      '<span class="reader-units-chev" aria-hidden="true">' + CHEV + '</span></button>' +
      '<button class="reader-top" type="button" aria-label="Back to top" title="Back to top"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>';
    document.body.appendChild(bar);

    /* units popover, built from the Table of Contents */
    var pop = document.createElement('div');
    pop.className = 'reader-pop';
    pop.hidden = true;
    var toc = document.querySelector('nav.toc');
    if (toc) {
      Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) {
        var link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.innerHTML = a.innerHTML;
        pop.appendChild(link);
      });
    }
    document.body.appendChild(pop);

    var unitsBtn = bar.querySelector('.reader-units');
    function closePop() { pop.hidden = true; unitsBtn.setAttribute('aria-expanded', 'false'); }
    unitsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = pop.hidden;
      pop.hidden = !willOpen;
      unitsBtn.setAttribute('aria-expanded', String(willOpen));
    });
    pop.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      closePop();
      expandTarget(a.getAttribute('href').slice(1));
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.reader-pop') && !e.target.closest('.reader-units')) closePop();
    });
    bar.querySelector('.reader-top').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---- 3. Live vocabulary search ---- */
    var input = bar.querySelector('.reader-search');
    var countEl = bar.querySelector('.reader-count');
    var rows = [];
    sections.forEach(function (sec) {
      Array.prototype.forEach.call(sec.querySelectorAll('table.voc tr'), function (tr) {
        var w = tr.querySelector('td.w');
        if (!w) return; // skip header + group rows
        var tds = tr.querySelectorAll('td');
        rows.push({
          tr: tr, sec: sec,
          text: (w.textContent + ' ' + (tds[1] ? tds[1].textContent : '')).toLowerCase()
        });
      });
    });

    function clearSearch() {
      document.body.classList.remove('is-searching');
      rows.forEach(function (r) { r.tr.style.display = ''; });
      sections.forEach(function (sec) { sec.style.display = ''; setOpen(sec, false); });
      countEl.textContent = '';
    }
    function runSearch(q) {
      q = q.trim().toLowerCase();
      if (!q) { clearSearch(); return; }
      document.body.classList.add('is-searching');
      var hitSec = [];
      var n = 0;
      rows.forEach(function (r) {
        var hit = r.text.indexOf(q) >= 0;
        r.tr.style.display = hit ? '' : 'none';
        if (hit) { hitSec.push(r.sec); n++; }
      });
      sections.forEach(function (sec) {
        var has = hitSec.indexOf(sec) >= 0;
        sec.style.display = has ? '' : 'none';
        setOpen(sec, has);
      });
      countEl.textContent = n ? (n + (n === 1 ? ' result' : ' results')) : 'No matches';
    }

    var t;
    input.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () { runSearch(input.value); }, 110);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; clearSearch(); input.blur(); }
    });

    /* ---- 4. Scroll state: reveal the bar past the intro, and flag the
       header currently pinned to the top so its outline aids (word count +
       chevron) hide while it sits under the top-right controls ---- */
    var ticking = false;
    var lastY = window.scrollY;
    function updateUI() {
      ticking = false;
      var y = window.scrollY;
      document.body.classList.toggle('reader-ready', y > 300);
      /* Hide the top-right controls while reading downward so the pinned unit
         title gets the top to itself; reveal them on scroll up or near the top.
         The small deadzone (4px) keeps them from flickering on tiny scrolls. */
      if (y < 90) document.body.classList.remove('controls-hidden');
      else if (y > lastY + 4) document.body.classList.add('controls-hidden');
      else if (y < lastY - 4) document.body.classList.remove('controls-hidden');
      lastY = y;
      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i], head = sec.querySelector('.lesson-head');
        if (!head) continue;
        var r = sec.getBoundingClientRect();
        // pinned while the section straddles the top edge of the viewport
        head.classList.toggle('is-stuck', r.top < 0 && r.bottom > 0);
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateUI); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateUI();
  });
})();
