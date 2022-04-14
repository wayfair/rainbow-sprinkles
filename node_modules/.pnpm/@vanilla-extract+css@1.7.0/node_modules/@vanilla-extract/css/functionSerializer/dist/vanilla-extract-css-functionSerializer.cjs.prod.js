'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function addFunctionSerializer(target, recipe) {
  // TODO: Update to "__function_serializer__" in future.
  // __recipe__ is the backwards compatible name
  Object.defineProperty(target, '__recipe__', {
    value: recipe,
    writable: false
  });
  return target;
}

exports.addFunctionSerializer = addFunctionSerializer;
