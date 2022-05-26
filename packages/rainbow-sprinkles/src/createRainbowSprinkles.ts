import type { RuntimeFnReturn } from './types';
import type { ChildSprinkles, SprinkleProperties } from './exp';
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { createRuntimeFn } from './createRuntimeFn';

export type SprinklesProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R,
]
  ? (L extends BaseReturn ? ChildSprinkles<L['config']> : never) &
      SprinklesProps<R>
  : {};

export type BaseReturn = {
  config: SprinkleProperties;
  conditions: {
    defaultCondition: string;
    conditionNames: string[];
  };
};

export type SprinklesFn<Args extends ReadonlyArray<BaseReturn>> = (
  props: SprinklesProps<Args>,
) => RuntimeFnReturn;

export function createRainbowSprinkles<Args extends ReadonlyArray<BaseReturn>>(
  ...args: Args
): SprinklesFn<Args> {
  const cssConfig = Object.assign({}, ...args.map((a) => a.config));
  const properties = Object.keys(cssConfig);

  const shorthandNames = properties.filter(
    (property) => 'mappings' in cssConfig[property],
  );

  const config = {
    cssConfig,
    shorthandNames,
    properties,
  };

  return addFunctionSerializer(createRuntimeFn(config), {
    importPath: 'rainbow-sprinkles/createRuntimeFn',
    importName: 'createRuntimeFn',
    args: [config],
  });
}
