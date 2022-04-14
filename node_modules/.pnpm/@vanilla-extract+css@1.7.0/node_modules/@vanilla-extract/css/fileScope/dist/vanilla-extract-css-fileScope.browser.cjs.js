'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var taggedTemplateLiteral = require('../../dist/taggedTemplateLiteral-c635af00.browser.cjs.js');
var outdent = require('outdent');
var adapter_dist_vanillaExtractCssAdapter = require('../../adapter/dist/vanilla-extract-css-adapter.browser.cjs.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var outdent__default = /*#__PURE__*/_interopDefault(outdent);

var _templateObject;
var refCounter = 0;
var fileScopes = [];
function setFileScope(filePath, packageName) {
  refCounter = 0;
  fileScopes.unshift({
    filePath,
    packageName
  });
}
function endFileScope() {
  adapter_dist_vanillaExtractCssAdapter.onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}
function hasFileScope() {
  return fileScopes.length > 0;
}
function getFileScope() {
  if (fileScopes.length === 0) {
    throw new Error(outdent__default["default"](_templateObject || (_templateObject = taggedTemplateLiteral._taggedTemplateLiteral(["\n        Styles were unable to be assigned to a file. This is generally caused by one of the following:\n\n        - You may have created styles outside of a '.css.ts' context\n        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/setup\n      "]))));
  }

  return fileScopes[0];
}
function getAndIncrementRefCounter() {
  return refCounter++;
}

exports.endFileScope = endFileScope;
exports.getAndIncrementRefCounter = getAndIncrementRefCounter;
exports.getFileScope = getFileScope;
exports.hasFileScope = hasFileScope;
exports.setFileScope = setFileScope;
