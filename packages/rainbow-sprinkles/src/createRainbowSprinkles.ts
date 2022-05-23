import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { createStyles } from './createStyles';
import { createStaticStyles } from './createStaticStyles';
import type {
  BaseConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  RainbowSprinklesOptions,
  RuntimeFn,
  BaseShorthand,
} from './types';
import { mapValues } from './utils';
import { createRuntimeRainbowSprinkles } from './createRuntimeRainbowSprinkles';
import merge from 'lodash.merge';

export function createRainbowSprinkles<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
>(
  options: RainbowSprinklesOptions<
    DynamicProperties,
    StaticProperties,
    Conditions,
    Shorthands
  >,
): RuntimeFn<DynamicProperties, StaticProperties, Conditions, Shorthands> {
  const {
    conditions,
    dynamicProperties,
    shorthands,
    defaultCondition,
    staticProperties,
  } = options;

  const normalProps = mapValues(dynamicProperties, (scale, property) =>
    createStyles<Conditions>(
      property as keyof CSSProperties,
      scale,
      conditions,
    ),
  );

  const staticProps = mapValues(staticProperties, (scale, property) =>
    createStaticStyles<Conditions>(
      property as keyof CSSProperties,
      scale,
      conditions,
    ),
  );

  const allConfiguredProps = merge(staticProps, normalProps);

  const shorthandProps = mapValues(shorthands, (properties) =>
    // @ts-expect-error
    properties.map((property) => allConfiguredProps[property]),
  );

  const cssConfig = {
    ...mapValues(allConfiguredProps, (config) => [config]),
    ...shorthandProps,
  };

  const properties = [
    ...Object.keys(dynamicProperties),
    ...(staticProperties ? Object.keys(staticProperties) : []),
    ...(shorthands ? Object.keys(shorthands) : []),
  ];

  const config = {
    config: cssConfig,
    defaultCondition: defaultCondition as string,
    properties,
  };

  return addFunctionSerializer(createRuntimeRainbowSprinkles(config), {
    importPath: 'rainbow-sprinkles/createRuntimeRainbowSprinkles',
    importName: 'createRuntimeRainbowSprinkles',
    args: [config],
  });
}
