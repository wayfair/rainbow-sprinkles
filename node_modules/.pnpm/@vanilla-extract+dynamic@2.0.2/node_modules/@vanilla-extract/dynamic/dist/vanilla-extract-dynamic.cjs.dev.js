'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _private = require('@vanilla-extract/private');

function assignInlineVars(varsOrContract, tokens) {
  var styles = {};

  if (typeof tokens === 'object') {
    var _contract = varsOrContract;
    _private.walkObject(tokens, (value, path) => {
      var varName = _private.get(_contract, path);
      styles[_private.getVarName(varName)] = String(value);
    });
  } else {
    var _vars = varsOrContract;

    for (var varName in _vars) {
      styles[_private.getVarName(varName)] = _vars[varName];
    }
  }

  Object.defineProperty(styles, 'toString', {
    value: function value() {
      return Object.keys(this).map(key => "".concat(key, ":").concat(this[key])).join(';');
    },
    writable: false
  });
  return styles;
}

function setVar(element, variable, value) {
  element.style.setProperty(_private.getVarName(variable), value);
}

function setElementVars(element, varsOrContract, tokens) {
  if (typeof tokens === 'object') {
    var _contract = varsOrContract;
    _private.walkObject(tokens, (value, path) => {
      setVar(element, _private.get(_contract, path), String(value));
    });
  } else {
    var _vars = varsOrContract;

    for (var varName in _vars) {
      setVar(element, varName, _vars[varName]);
    }
  }
}

exports.assignInlineVars = assignInlineVars;
exports.setElementVars = setElementVars;
