(function () {
  'use strict';

  var script = document.currentScript;
  var siteMaxLines = Math.max(1, parseInt(script && script.dataset.maxLines, 10) || 24);

  function languageOf(code, shell) {
    var classes = (code.className + ' ' + shell.className).split(/\s+/);
    var language = classes.find(function (name) { return name.indexOf('language-') === 0; });
    if (!language) return 'TEXT';
    language = language.slice(9).replace(/\+/g, '+');
    var aliases = { js: 'JavaScript', ts: 'TypeScript', py: 'Python', rb: 'Ruby', sh: 'Shell', bash: 'Bash', html: 'HTML', css: 'CSS', cpp: 'C++', 'c++': 'C++' };
    return aliases[language.toLowerCase()] || language.toUpperCase();
  }

  function copyText(text, button) {
    function done() {
      button.classList.add('is-copied');
      button.setAttribute('aria-label', '已复制');
      window.setTimeout(function () {
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', '复制代码');
      }, 1300);
    }

    function fallback() {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      done();
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
      return;
    }

    fallback();
  }

  function enhance(code) {
    var pre = code.parentElement;
    if (!pre || pre.tagName !== 'PRE' || pre.dataset.enhanced === 'true') return;

    var shell = pre.closest('.highlighter-rouge');
    if (!shell) {
      shell = document.createElement('div');
      pre.parentNode.insertBefore(shell, pre);
      shell.appendChild(pre);
    }
    shell.classList.add('code-shell');
    pre.dataset.enhanced = 'true';

    var header = document.createElement('div');
    header.className = 'code-header';

    var language = document.createElement('span');
    language.className = 'code-language';
    language.textContent = languageOf(code, shell);

    var copy = document.createElement('button');
    copy.className = 'code-copy';
    copy.type = 'button';
    copy.setAttribute('aria-label', '复制代码');
    copy.setAttribute('title', '复制代码');
    copy.innerHTML = '<svg class="copy-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="1.5"></rect><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"></path></svg><svg class="copy-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';
    copy.addEventListener('click', function () { copyText(code.textContent, copy); });

    header.appendChild(language);
    header.appendChild(copy);
    shell.insertBefore(header, shell.firstChild);

    var source = code.textContent.replace(/\n$/, '');
    var lineCount = Math.max(1, source.split('\n').length);
    var maxLines = Math.max(1, parseInt(pre.dataset.maxLines || shell.dataset.maxLines, 10) || siteMaxLines);
    var gutter = document.createElement('span');
    gutter.className = 'code-gutter';
    gutter.setAttribute('aria-hidden', 'true');
    gutter.textContent = Array.from({ length: lineCount }, function (_, index) { return index + 1; }).join('\n');

    var highlight = document.createElement('span');
    highlight.className = 'code-current-line';
    highlight.setAttribute('aria-hidden', 'true');
    pre.insertBefore(highlight, code);
    pre.insertBefore(gutter, highlight);

    var lockedLine = 0;

    function lineFromEvent(event) {
      var style = window.getComputedStyle(code);
      var lineHeight = parseFloat(style.lineHeight);
      var rect = code.getBoundingClientRect();
      // The code rectangle already moves with the pre element's scroll offset.
      // Adding scrollTop again would count the scroll twice and shift the active line.
      var offset = event.clientY - rect.top;
      return Math.max(1, Math.min(lineCount, Math.floor(offset / lineHeight) + 1));
    }

    function showLine(line) {
      var style = window.getComputedStyle(code);
      var lineHeight = parseFloat(style.lineHeight);
      gutter.style.lineHeight = lineHeight + 'px';
      highlight.style.height = lineHeight + 'px';
      highlight.style.top = (code.offsetTop + (line - 1) * lineHeight) + 'px';
      highlight.classList.add('is-visible');
    }

    var codeStyle = window.getComputedStyle(code);
    var lineHeight = parseFloat(codeStyle.lineHeight);
    gutter.style.lineHeight = lineHeight + 'px';

    if (lineCount > maxLines) {
      var preStyle = window.getComputedStyle(pre);
      var verticalPadding = parseFloat(preStyle.paddingTop) + parseFloat(preStyle.paddingBottom);
      pre.style.maxHeight = (lineHeight * maxLines + verticalPadding) + 'px';
      pre.classList.add('is-scrollable');
      shell.dataset.visibleLines = maxLines;
    }

    pre.addEventListener('mousemove', function (event) {
      if (!lockedLine) showLine(lineFromEvent(event));
    });
    pre.addEventListener('mouseleave', function () {
      if (!lockedLine) highlight.classList.remove('is-visible');
    });
    pre.addEventListener('click', function (event) {
      var line = lineFromEvent(event);
      lockedLine = lockedLine === line ? 0 : line;
      if (lockedLine) showLine(lockedLine);
      else highlight.classList.remove('is-visible');
    });
  }

  document.querySelectorAll('pre > code').forEach(enhance);
}());
