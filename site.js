// teammateapp.au — shared page behaviour (every page loads this, deferred).
// The header menus are plain <details>, so they already open and close
// without JS; this only adds the polish: one menu open at a time, close on
// a click outside, on Escape or on following a link, and no page scroll
// behind the full-screen phone menu.
(function () {
  var menus = Array.prototype.slice.call(document.querySelectorAll(".nav details"));
  if (!menus.length) return;

  function sync() {
    var phoneMenu = document.querySelector(".nav-menu");
    document.documentElement.classList.toggle("menu-open", !!(phoneMenu && phoneMenu.open));
  }

  menus.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) menus.forEach(function (o) { if (o !== d) o.open = false; });
      sync();
    });
    d.addEventListener("click", function (e) {
      if (e.target.closest("a")) d.open = false;
    });
  });

  document.addEventListener("click", function (e) {
    menus.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    menus.forEach(function (d) {
      if (d.open) { d.open = false; d.querySelector("summary").focus(); }
    });
  });

  // Phone menu is display:none above 720px; if the window grows while it's
  // open, close it so the scroll lock can't stick.
  window.addEventListener("resize", function () {
    var m = document.querySelector(".nav-menu");
    if (m && m.open && window.innerWidth > 720) m.open = false;
  });
})();

// Homepage industry switcher (scripts/marketing-pages.mjs renders it).
// Without this script every panel shows stacked and the tab row stays
// hidden; with it, one industry at a time. Arrow keys, Home and End move
// between tabs (WAI-ARIA tabs pattern). No auto-rotate: the desktop page
// stays still unless the visitor acts (owner direction 2026-09-11). All
// six tabs are always in view (two rows on phones), so the row never
// scrolls sideways (owner 2026-10-06).
(function () {
  var root = document.querySelector("[data-showcase]");
  if (!root) return;
  var list = root.querySelector(".sc-tabs");
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".sc-tab"));
  if (!list || !tabs.length) return;

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t, false); });
    t.addEventListener("keydown", function (e) {
      var n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      select(tabs[(n + tabs.length) % tabs.length], true);
    });
  });

  list.hidden = false;
  root.classList.add("is-tabs");
  select(tabs[0], false);
})();
