/* Shared top-bar behaviour for every KIIP page (landing + level pages).
   The initial theme is set by a tiny inline script in each page's <head> so it
   applies before first paint (no flash); this file only wires up the
   interactions — theme toggle, the level menu, and the language menu — so that
   logic lives in one place instead of being copied into every HTML file.
   Loaded with `defer`, so the DOM is ready when it runs. */
(function () {
  'use strict';
  var root = document.documentElement, KEY = 'kiip-theme';

  function closeMenu() {
    var menus = document.querySelectorAll('.level-menu');
    for (var i = 0; i < menus.length; i++) menus[i].hidden = true;
    var btns = document.querySelectorAll('.level-switch');
    for (var j = 0; j < btns.length; j++) btns[j].setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', t);
      try { localStorage.setItem(KEY, t); } catch (e) { }
      return;
    }
    var sw = e.target.closest('.level-switch');
    if (sw) {
      var open = sw.getAttribute('aria-expanded') === 'true';
      var m = sw.parentNode.querySelector('.level-menu');
      closeMenu();
      sw.setAttribute('aria-expanded', String(!open));
      if (m) m.hidden = open;
      return;
    }
    if (!e.target.closest('.level-menu')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
