import { createStyles } from './createStyles';
import { createStaticStyles } from './createStaticStyles';
import type {
  BaseConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  BaseShorthand,
} from './types';

type ConditionalMap<Conditions> = {
  default: string;
  conditions: Record<keyof Conditions, string>;
};

type ReturnDynamic<
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

type ReturnStatic<
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

type ReturnShorthands<
  Shorthands extends { [k: string]: Array<string | number | symbol> },
> = {
  config: {
    [Shorthand in keyof Shorthands]: {
      mappings: Shorthands[Shorthand];
    };
  };
};

export type RainbowSprinklesOptionsDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends BaseConditions,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
> = {
  dynamicProperties: DynamicProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
  shorthands?: Shorthands;
};
export type RainbowSprinklesOptionsStatic<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
> = {
  staticProperties: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
  shorthands?: Shorthands;
};
export type RainbowSprinklesOptionsBoth<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
  shorthands?: Shorthands;
};

// Dynamic Properties + Shorthands
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
): ReturnDynamic<DynamicProperties, Conditions> & ReturnShorthands<Shorthands>;
// Static Properties + Shorthands
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
): ReturnStatic<StaticProperties, Conditions> & ReturnShorthands<Shorthands>;
// Dynamic Properties + Static Properties + Shorthands
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
): ReturnStatic<StaticProperties, Conditions> &
  ReturnDynamic<DynamicProperties, Conditions> &
  ReturnShorthands<Shorthands>;
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
    config[dynamicProp] = createStyles(
      dynamicProp as keyof CSSProperties,
      dynamicProperties[dynamicProp],
      conditions,
      defaultCondition,
    );
  }

  for (const staticProp in staticProperties) {
    const style = createStaticStyles(
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
