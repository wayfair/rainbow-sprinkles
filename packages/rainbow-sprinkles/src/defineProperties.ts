import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { createStyles } from './createStyles';
import { createStaticStyles } from './createStaticStyles';
import type {
  BaseConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  BaseShorthand,
  RainbowSprinklesOptionsBoth,
  RainbowSprinklesOptionsStatic,
  RainbowSprinklesOptionsDynamic,
} from './types';
import { mapValues } from './utils';
import merge from 'lodash.merge';
import {
  BaseReturn,
  createRainbowSprinkles as internalCreateRainbowSprinkles,
  SprinklesFn,
} from './createRainbowSprinkles';

type ConditionalMap<Conditions> = {
  default: string;
  conditions: Record<keyof Conditions, string>;
};

type DefinePropertiesReturnDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends BaseConditions,
> = {
  conditions: {
    defaultCondition: keyof Conditions;
    conditionNames: Array<keyof Conditions>;
  };
  config: {
    [Property in keyof DynamicProperties]: {
      dynamic: ConditionalMap<Conditions>;
      dynamicScale: DynamicProperties[Property];
      name: Property;
      vars: ConditionalMap<Conditions>;
    };
  };
};

type Values<Property, Result> = {
  [Value in Property extends ReadonlyArray<any>
    ? Property[number]
    : Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result;
};

type DefinePropertiesReturnStatic<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
> = {
  conditions: {
    defaultCondition: keyof Conditions;
    conditionNames: Array<keyof Conditions>;
  };
  config: {
    [Property in keyof StaticProperties]: {
      values: Values<StaticProperties[Property], ConditionalMap<Conditions>>;
      staticScale: StaticProperties[Property];
      name: Property;
    };
  };
};

type DefinePropertiesShorthands<
  Shorthands extends { [k: string]: Array<string | number | symbol> },
> = {
  config: {
    [Shorthand in keyof Shorthands]: {
      mappings: Shorthands[Shorthand];
    };
  };
};

export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends BaseConditions,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
>(
  options: RainbowSprinklesOptionsDynamic<
    DynamicProperties,
    Conditions,
    Shorthands
  >,
): DefinePropertiesReturnDynamic<DynamicProperties, Conditions> &
  DefinePropertiesShorthands<Shorthands>;
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
>(
  options: RainbowSprinklesOptionsStatic<
    StaticProperties,
    Conditions,
    Shorthands
  >,
): DefinePropertiesReturnStatic<StaticProperties, Conditions> &
  DefinePropertiesShorthands<Shorthands>;
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
>(
  options: RainbowSprinklesOptionsBoth<
    DynamicProperties,
    StaticProperties,
    Conditions,
    Shorthands
  >,
): DefinePropertiesReturnStatic<StaticProperties, Conditions> &
  DefinePropertiesReturnDynamic<DynamicProperties, Conditions> &
  DefinePropertiesShorthands<Shorthands>;
export function defineProperties(options: any): any {
  const {
    conditions,
    dynamicProperties,
    staticProperties,
    shorthands,
    defaultCondition,
  } = options;

  let config: any = shorthands
    ? Object.fromEntries(
        Object.entries(options.shorthands).map(([prop, mappings]) => [
          prop,
          { mappings },
        ]),
      )
    : {};

  for (const dynamicProp in dynamicProperties) {
    // @ts-ignore
    config[dynamicProp] = createStyles<Conditions>(
      dynamicProp as keyof CSSProperties,
      dynamicProperties[dynamicProp],
      conditions,
      defaultCondition,
    );
  }

  for (const staticProp in staticProperties) {
    // @ts-ignore
    const style = createStaticStyles<Conditions>(
      staticProp as keyof CSSProperties,
      staticProperties[staticProp],
      conditions,
      defaultCondition,
    );
    config[staticProp] = Object.assign({}, config?.[staticProp], style);
  }

  return {
    config,
    conditions: {
      defaultCondition,
      conditionNames: Object.keys(conditions),
    },
  };
}

export function createRainbowSprinkles<Args extends ReadonlyArray<BaseReturn>>(
  ...config: Args
): SprinklesFn<Args> {
  const rainbowSprinkles = internalCreateRainbowSprinkles(...config);

  return addFunctionSerializer(rainbowSprinkles, {
    importPath: 'rainbow-sprinkles/createRuntimeFn',
    importName: 'createRuntimeFn',
    args: [config],
  });
}
