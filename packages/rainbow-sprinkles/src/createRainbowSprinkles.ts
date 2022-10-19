import type { DefinePropertiesReturn } from './types';
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { createRuntimeFn, SprinklesFn } from './createRuntimeFn';

export function createRainbowSprinkles<
  Configs extends ReadonlyArray<DefinePropertiesReturn>,
>(...configs: Configs): SprinklesFn<Configs> {
  const sprinkles = createRuntimeFn(...configs);

  return addFunctionSerializer(sprinkles, {
    importPath: 'rainbow-sprinkles/createRuntimeFn',
    importName: 'createRuntimeFn',
    args: configs,
  });
}
