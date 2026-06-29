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

  /* ---- Masthead level nav -----------------------------------------------
     Turns the old floating "Level N ▾" pill into a header navigation menu above
     the page title: Home on the left, then Level 1–5 (the current one
     highlighted in the level's accent). Built from the existing level menu so
     there's no per-file HTML to edit, and run in its own ready() (not the
     reader-mode one, which bails out on the lesson-less level-5). It scrolls away
     with the masthead. */
  function buildLevelRail() {
    var levelSwitch = document.querySelector('.page-controls .level-switch:not(.lang-switch)');
    var group = levelSwitch && levelSwitch.closest('.ctrl-group');
    var menu = group && group.querySelector('.level-menu');
    var h1 = document.querySelector('.doc h1');
    if (!menu || !h1) return;

    // localized word for "level" — used to name the nav landmark
    var word = (levelSwitch.textContent || '').replace(/[0-9.·–—-]/g, '').trim() || 'Level';

    var nav = document.createElement('nav');
    nav.className = 'level-nav';
    nav.setAttribute('aria-label', word);

    var levels = document.createElement('ol');
    levels.className = 'ln-levels';

    Array.prototype.forEach.call(menu.querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href') || '';
      var label = a.textContent.trim();
      if (/index[^/]*\.html$/.test(href)) {       // Home — left side (index / index-ru / index-uz)
        var home = document.createElement('a');
        home.className = 'ln-home';
        home.href = href;
        home.textContent = label || 'Home';
        nav.appendChild(home);
        return;
      }
      if (!/level-\d/.test(href)) return;
      var li = document.createElement('li');
      var lv = document.createElement('a');
      lv.className = 'ln-lvl';
      lv.href = href;
      if (a.getAttribute('aria-current')) lv.setAttribute('aria-current', 'page');
      // "Level 1 · 초급 1" -> "Level 1" (the Korean tier stays in the h1)
      lv.textContent = (label.split('·')[0] || label).trim();
      li.appendChild(lv);
      levels.appendChild(li);
    });
    nav.appendChild(levels);

    h1.parentNode.insertBefore(nav, h1);

    // the nav now carries the level identity, so drop the redundant
    // "Level N · " prefix from the title — keep just the Korean tier
    var m = h1.textContent.match(/·\s*(.+)$/);
    if (m) h1.textContent = m[1].trim();

    // retire the old level pill; hide the top control cluster only if nothing
    // else is left in it (on level-5 the theme/language pills still live there)
    group.parentNode.removeChild(group);
    var pc = document.querySelector('.page-controls');
    if (pc && !pc.querySelector('.ctrl-group, .ctrl')) pc.classList.add('is-empty');
  }

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

      // count badge + chevron, and make the head a toggle. Levels 1-4 count
      // vocab words; level 5 (society themes) counts its terms instead.
      var nWords = sec.querySelectorAll('table.voc td.w').length;
      var nTerms = sec.querySelectorAll('table.terms td.term-k').length;
      var count = nWords
        ? nWords + (nWords === 1 ? ' word' : ' words')
        : (nTerms ? nTerms + (nTerms === 1 ? ' term' : ' terms') : '');
      if (count) {
        var badge = document.createElement('span');
        badge.className = 'lesson-count';
        badge.textContent = count;
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

    function expandTarget(id, smooth) {
      if (!id) return;
      var sec = document.getElementById(id);
      if (!sec || !sec.classList.contains('lesson')) return;
      setOpen(sec, true);
      requestAnimationFrame(function () {
        sec.scrollIntoView({ behavior: smooth === false ? 'auto' : 'smooth', block: 'start' });
      });
    }

    /* The unit the reader is currently on — the last one whose top has reached the
       top of the reading area. Used to carry the reading position across a
       language switch. Empty when still up in the intro (so it opens at the top). */
    function currentUnitId() {
      var id = '';
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= 90) id = sections[i].id;
        else break; // sections are in document order
      }
      return id;
    }

    /* clicking a Table-of-Contents link expands + scrolls to that unit */
    Array.prototype.forEach.call(document.querySelectorAll('nav.toc a[href^="#"]'), function (a) {
      a.addEventListener('click', function () { expandTarget(a.getAttribute('href').slice(1)); });
    });
    window.addEventListener('hashchange', function () { expandTarget(location.hash.slice(1)); });
    // On load, jump straight to the hashed unit (no smooth scroll) — e.g. when a
    // language switch lands here, open that unit immediately instead of the top.
    if (location.hash) expandTarget(location.hash.slice(1), false);

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

    /* Dock the bar together with the light/dark toggle and the language switcher,
       so the reading-time controls sit side by side ([ search · units · top ]
       [theme] [language]) and slide in and out together. The level switcher stays
       at the top of the page (it navigates to other levels — orientation, not a
       reading-time tool). */
    var dock = document.createElement('div');
    dock.className = 'reader-dock';
    dock.appendChild(bar);

    /* A second pill beside the search bar holds the light/dark toggle and the
       language switcher (the two "reading-time" settings). Both are moved out of
       the top controls; their click handlers in nav.js are delegated off the
       .theme-toggle / .level-switch classes, so they keep working after the move. */
    var tools = document.createElement('div');
    tools.className = 'reader-tools';
    var themeBtn = document.querySelector('.page-controls .theme-toggle');
    if (themeBtn) {
      themeBtn.classList.remove('ctrl');
      themeBtn.classList.add('reader-theme');
      tools.appendChild(themeBtn);
    }
    /* the language menu is restyled to open upward (see .reader-lang in
       levels.css) since the dock sits at the bottom of the screen */
    var langBtn = document.querySelector('.page-controls .lang-switch');
    var langGroup = langBtn && langBtn.closest('.ctrl-group');
    if (langGroup) {
      langBtn.classList.remove('ctrl');
      langGroup.classList.add('reader-lang');
      tools.appendChild(langGroup);
      /* Carry the unit being read across the language switch: rewrite the picked
         language link to <other-language-page>#<currentUnit> just before it
         navigates, so the new language opens at the same place rather than the top.
         Unit ids (#u1, #u2 …) are identical across languages. */
      langGroup.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var id = currentUnitId();
        var base = a.getAttribute('href').split('#')[0];
        a.setAttribute('href', id ? base + '#' + id : base);
      });
    }
    if (tools.children.length) dock.appendChild(tools);
    document.body.appendChild(dock);

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
      // vocab rows (levels 1-4)
      Array.prototype.forEach.call(sec.querySelectorAll('table.voc tr'), function (tr) {
        var w = tr.querySelector('td.w');
        if (!w) return; // skip header + group rows
        var tds = tr.querySelectorAll('td');
        rows.push({
          tr: tr, sec: sec,
          text: (w.textContent + ' ' + (tds[1] ? tds[1].textContent : '')).toLowerCase()
        });
      });
      // term rows (level 5 — society themes): index the whole row
      Array.prototype.forEach.call(sec.querySelectorAll('table.terms tr'), function (tr) {
        if (!tr.querySelector('td.term-k')) return; // skip the header row
        rows.push({ tr: tr, sec: sec, text: tr.textContent.toLowerCase() });
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

    /* ---- 4. Scroll state: reveal the floating reader dock past the intro.
       The selectors scroll away with the page and unit headers just pin at the
       top, so there's nothing here that needs per-frame work or can flicker. ---- */
    var ticking = false;
    function updateUI() {
      ticking = false;
      document.body.classList.toggle('reader-ready', window.scrollY > 300);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateUI); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateUI();
  });

  /* Build the masthead level rail after the reader-mode pass above (which, on
     lesson pages, has already moved the theme + language pills into the dock —
     so the empty-check below correctly hides the now-bare top control cluster). */
  ready(buildLevelRail);
})();
