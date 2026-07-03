(function () {
  'use strict';

  var storageKey = 'mologs-theme';
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  if (!toggle) return;

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemTheme.matches ? 'dark' : 'light');
  }

  function updateButton() {
    var dark = currentTheme() === 'dark';
    var label = dark ? '切换至亮色主题' : '切换至暗色主题';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.setAttribute('aria-pressed', String(dark));
  }

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(storageKey, next);
    } catch (error) {}
    updateButton();
  });

  systemTheme.addEventListener('change', function (event) {
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch (error) {}
    root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    updateButton();
  });

  updateButton();
}());
