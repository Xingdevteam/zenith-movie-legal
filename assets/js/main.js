/* ==========================================================================
   Zenith Movie Legal Center — shared behaviour
   Vanilla JS, no dependencies. Every feature degrades gracefully without JS.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktopQuery = window.matchMedia('(min-width: 960px)');

  function headerOffset() {
    var header = $('.site-header');
    return (header ? header.offsetHeight : 64) + 24;
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Mobile navigation ---------- */
  var navToggle = $('.nav-toggle');
  var nav = $('#site-nav');

  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setNav(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ---------- Placeholder counter (draft banner) ---------- */
  var counters = $$('[data-ph-count]');
  if (counters.length) {
    var total = $$('.ph').length;
    counters.forEach(function (el) { el.textContent = String(total); });
  }

  /* ---------- Table of contents: collapsible on mobile, scrollspy everywhere ---------- */
  var toc = $('.toc');
  var sections = $$('.doc-section[id]');

  if (toc && sections.length) {
    var tocLinks = $$('a[href^="#"]', toc);
    var linkById = {};
    tocLinks.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });
    var currentLabel = $('[data-toc-current]', toc);
    var activeId = null;

    // Keep the list open on desktop, collapsed on mobile.
    var syncToc = function () {
      if (desktopQuery.matches) toc.setAttribute('open', '');
      else toc.removeAttribute('open');
    };
    syncToc();
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', syncToc);
    else if (desktopQuery.addListener) desktopQuery.addListener(syncToc);

    var setActive = function (id) {
      if (id === activeId) return;
      activeId = id;
      tocLinks.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      if (currentLabel && linkById[id]) {
        var text = linkById[id].querySelector('.toc-text');
        currentLabel.textContent = text ? text.textContent : '';
      }
      // Keep the active item visible inside the sticky sidebar.
      var active = linkById[id];
      var scroller = toc.parentNode;
      if (active && desktopQuery.matches && scroller.scrollHeight > scroller.clientHeight) {
        var tRect = scroller.getBoundingClientRect();
        var aRect = active.getBoundingClientRect();
        if (aRect.top < tRect.top || aRect.bottom > tRect.bottom) {
          scroller.scrollTop += aRect.top - tRect.top - tRect.height / 2;
        }
      }
    };

    var ticking = false;
    var update = function () {
      ticking = false;
      var line = headerOffset() + 8;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top - line <= 0) current = sections[i].id;
        else break;
      }
      // At the very bottom, always highlight the last section.
      if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    update();

    // TOC clicks: smooth scroll (CSS handles it), move focus to heading, close on mobile.
    toc.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      var heading = target.querySelector('h2');
      if (!desktopQuery.matches && toc.hasAttribute('open')) {
        // Collapse first so the layout is stable, then scroll to the section.
        e.preventDefault();
        toc.removeAttribute('open');
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (window.history && history.pushState) history.pushState(null, '', '#' + target.id);
      }
      if (heading) {
        window.setTimeout(function () { heading.focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
      }
    });
  }

  /* ---------- In-body "Section 0X" links: focus the target heading ---------- */
  $$('.doc-body a[href^="#s"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      var heading = target && target.querySelector('h2');
      if (heading) {
        window.setTimeout(function () { heading.focus({ preventScroll: true }); }, reduceMotion ? 0 : 400);
      }
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = $('.to-top');
  if (toTop) {
    var toggleTop = function () {
      toTop.classList.toggle('is-visible', window.pageYOffset > 700);
    };
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    });
  }
})();
