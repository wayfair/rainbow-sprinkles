import { walkObject, get, getVarName } from '@vanilla-extract/private';

function assignInlineVars(varsOrContract, tokens) {
  var styles = {};

  if (typeof tokens === 'object') {
    var _contract = varsOrContract;
    walkObject(tokens, (value, path) => {
      var varName = get(_contract, path);
      styles[getVarName(varName)] = String(value);
    });
  } else {
    var _vars = varsOrContract;

    for (var varName in _vars) {
      styles[getVarName(varName)] = _vars[varName];
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
  element.style.setProperty(getVarName(variable), value);
}

function setElementVars(element, varsOrContract, tokens) {
  if (typeof tokens === 'object') {
    var _contract = varsOrContract;
    walkObject(tokens, (value, path) => {
      setVar(element, get(_contract, path), String(value));
    });
  } else {
    var _vars = varsOrContract;

    for (var varName in _vars) {
      setVar(element, varName, _vars[varName]);
    }
  }
}

export { assignInlineVars, setElementVars };
