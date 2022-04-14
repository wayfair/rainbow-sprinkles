'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stylesheets = {};
var injectStyles = _ref => {
  var {
    fileScope,
    css
  } = _ref;
  var fileScopeId = fileScope.packageName ? [fileScope.packageName, fileScope.filePath].join('/') : fileScope.filePath;
  var stylesheet = stylesheets[fileScopeId];

  if (!stylesheet) {
    var styleEl = document.createElement('style');

    if (fileScope.packageName) {
      styleEl.setAttribute('data-package', fileScope.packageName);
    }

    styleEl.setAttribute('data-file', fileScope.filePath);
    styleEl.setAttribute('type', 'text/css');
    stylesheet = stylesheets[fileScopeId] = styleEl;
    document.head.appendChild(styleEl);
  }

  stylesheet.innerHTML = css;
};

exports.injectStyles = injectStyles;
