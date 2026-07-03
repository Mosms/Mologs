(function () {
  'use strict';

  var CJK = '\\u2e80-\\u2eff\\u3000-\\u303f\\u3040-\\u30ff\\u3100-\\u312f\\u31a0-\\u31bf\\u31c0-\\u31ef\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff';
  var LATIN = 'A-Za-z0-9';
  var cjkThenLatin = new RegExp('([' + CJK + '])\\s*([' + LATIN + '])', 'g');
  var latinThenCjk = new RegExp('([' + LATIN + '])\\s*([' + CJK + '])', 'g');
  var endsCjk = new RegExp('[' + CJK + ']$');
  var startsCjk = new RegExp('^[' + CJK + ']');
  var endsLatin = new RegExp('[' + LATIN + ']$');
  var startsLatin = new RegExp('^[' + LATIN + ']');
  var skipSelector = 'code, pre, kbd, samp, script, style, textarea, math, mjx-container, svg, [data-no-cjk-spacing]';
  var blockSelector = 'p, li, blockquote, figcaption, td, th, h1, h2, h3, h4, h5, h6, div, section, article, aside, nav, header, footer';

  function isSkipped(node) {
    var parent = node.parentElement;
    return !parent || parent.closest(skipSelector);
  }

  function blockOf(node) {
    return node.parentElement && node.parentElement.closest(blockSelector);
  }

  function normalizeNode(node) {
    node.nodeValue = node.nodeValue
      .replace(cjkThenLatin, '$1 $2')
      .replace(latinThenCjk, '$1 $2');
  }

  function normalizeBoundary(previous, current) {
    if (!previous || blockOf(previous) !== blockOf(current)) return;

    var left = previous.nodeValue.replace(/\\s+$/, '');
    var right = current.nodeValue.replace(/^\\s+/, '');
    if (!left || !right) return;

    var needsSpace =
      (endsCjk.test(left) && startsLatin.test(right)) ||
      (endsLatin.test(left) && startsCjk.test(right));

    if (needsSpace) {
      previous.nodeValue = left + ' ';
      current.nodeValue = right;
    }
  }

  function normalizeCjkSpacing() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var previous = null;
    var node;

    while ((node = walker.nextNode())) {
      if (isSkipped(node)) {
        previous = null;
        continue;
      }
      normalizeNode(node);
      normalizeBoundary(previous, node);
      previous = node;
    }
    document.documentElement.setAttribute('data-cjk-spacing', 'ready');
  }

  function start() {
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(function () {
        window.requestAnimationFrame(normalizeCjkSpacing);
      });
    } else {
      normalizeCjkSpacing();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', function () {
    window.setTimeout(normalizeCjkSpacing, 150);
  }, { once: true });
}());
