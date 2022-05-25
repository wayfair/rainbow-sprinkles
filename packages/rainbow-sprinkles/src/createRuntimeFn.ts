import {
  BaseReturn,
  createRainbowSprinkles as internalCreateRainbowSprinkles,
  SprinklesFn,
} from './createRainbowSprinkles';

export const createRainbowSprinkles = <Args extends ReadonlyArray<BaseReturn>>(
  ...config: Args
): SprinklesFn<Args> => internalCreateRainbowSprinkles(...config);
