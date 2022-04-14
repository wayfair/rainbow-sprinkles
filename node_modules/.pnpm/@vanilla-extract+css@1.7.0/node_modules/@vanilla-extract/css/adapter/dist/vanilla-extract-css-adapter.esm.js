var mockAdapter = {
  appendCss: () => {},
  registerClassName: () => {},
  onEndFileScope: () => {},
  registerComposition: () => {},
  markCompositionUsed: () => {},
  getIdentOption: () => process.env.NODE_ENV === 'production' ? 'short' : 'debug'
};
var adapterStack = [mockAdapter];

var currentAdapter = () => {
  if (adapterStack.length < 1) {
    throw new Error('No adapter configured');
  }

  return adapterStack[adapterStack.length - 1];
};

var hasConfiguredAdapter = false;
var setAdapterIfNotSet = newAdapter => {
  if (!hasConfiguredAdapter) {
    setAdapter(newAdapter);
  }
};
var setAdapter = newAdapter => {
  hasConfiguredAdapter = true;
  adapterStack.push(newAdapter);
};
var removeAdapter = () => {
  adapterStack.pop();
};
var appendCss = function appendCss() {
  return currentAdapter().appendCss(...arguments);
};
var registerClassName = function registerClassName() {
  return currentAdapter().registerClassName(...arguments);
};
var registerComposition = function registerComposition() {
  return currentAdapter().registerComposition(...arguments);
};
var markCompositionUsed = function markCompositionUsed() {
  return currentAdapter().markCompositionUsed(...arguments);
};
var onEndFileScope = function onEndFileScope() {
  return currentAdapter().onEndFileScope(...arguments);
};
var getIdentOption = function getIdentOption() {
  var adapter = currentAdapter(); // Backwards compatibility with old versions of the integration package

  if (!('getIdentOption' in adapter)) {
    return process.env.NODE_ENV === 'production' ? 'short' : 'debug';
  }

  return adapter.getIdentOption(...arguments);
};

export { appendCss, getIdentOption, markCompositionUsed, mockAdapter, onEndFileScope, registerClassName, registerComposition, removeAdapter, setAdapter, setAdapterIfNotSet };
