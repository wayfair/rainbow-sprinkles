import { createStyles } from './createStyles';
import { createStaticStyles } from './createStaticStyles';
import type {
  ConfigConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  ConfigShorthands,
  CommonOptions,
} from './types';

type ConditionalMap<Conditions> = {
  default: string;
  conditions: Record<keyof Conditions, string>;
};

type ReturnConditionalDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
> = {
  config: {
    [Property in keyof DynamicProperties]: {
      dynamic: ConditionalMap<Conditions>;
      dynamicScale: DynamicProperties[Property];
      name: Property;
      vars: ConditionalMap<Conditions>;
    };
  };
};
type ReturnDynamic<DynamicProperties extends ConfigDynamicProperties> = {
  config: {
    [Property in keyof DynamicProperties]: {
      dynamic: { default: string };
      dynamicScale: DynamicProperties[Property];
      name: Property;
      vars: { default: string };
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

type ReturnConditionalStatic<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
> = {
  config: {
    [Property in keyof StaticProperties]: {
      values: Values<StaticProperties[Property], ConditionalMap<Conditions>>;
      staticScale: StaticProperties[Property];
      name: Property;
    };
  };
};
type ReturnStatic<StaticProperties extends ConfigStaticProperties> = {
  config: {
    [Property in keyof StaticProperties]: {
      values: Values<StaticProperties[Property], { default: string }>;
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

type ShorthandOptions<
  Properties extends object,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> },
> = {
  shorthands?: Shorthands;
};

export type OptionsConditionalDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
> = {
  dynamicProperties: DynamicProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
};
export type OptionsConditionalStatic<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
> = {
  staticProperties: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
};
export type OptionsConditionalBoth<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
};
export type OptionsDynamic<DynamicProperties extends ConfigDynamicProperties> =
  {
    dynamicProperties: DynamicProperties;
  };
export type OptionsStatic<StaticProperties extends ConfigStaticProperties> = {
  staticProperties: StaticProperties;
};
export type OptionsBoth<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties: StaticProperties;
};

/**
 * NO SHORTHANDS + NO CONDITIONS
 */

// Dynamic Properties
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
>(
  options: CommonOptions & OptionsDynamic<DynamicProperties>,
): ReturnDynamic<DynamicProperties>;
// Static Properties
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
>(
  options: CommonOptions & OptionsStatic<StaticProperties>,
): ReturnStatic<StaticProperties>;
// Dynamic Properties + Static Properties
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
>(
  options: CommonOptions & OptionsBoth<DynamicProperties, StaticProperties>,
): ReturnStatic<StaticProperties> & ReturnDynamic<DynamicProperties>;

/**
 * SHORTHANDS + NO CONDITIONS
 */

// Dynamic Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
>(
  options: CommonOptions &
    OptionsDynamic<DynamicProperties> &
    ShorthandOptions<DynamicProperties, Shorthands>,
): ReturnDynamic<DynamicProperties> & ReturnShorthands<Shorthands>;
// Static Properties + Shorthands
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
>(
  options: CommonOptions &
    OptionsStatic<StaticProperties> &
    ShorthandOptions<StaticProperties, Shorthands>,
): ReturnStatic<StaticProperties> & ReturnShorthands<Shorthands>;
// Dynamic Properties + Static Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
>(
  options: CommonOptions &
    OptionsBoth<DynamicProperties, StaticProperties> &
    ShorthandOptions<DynamicProperties & StaticProperties, Shorthands>,
): ReturnStatic<StaticProperties> &
  ReturnDynamic<DynamicProperties> &
  ReturnShorthands<Shorthands>;

/**
 * NO SHORTHANDS + CONDITIONS
 */

// Conditional Dynamic Properties
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
>(
  options: CommonOptions &
    OptionsConditionalDynamic<DynamicProperties, Conditions>,
): ReturnConditionalDynamic<DynamicProperties, Conditions>;
// Conditional Static Properties
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
>(
  options: CommonOptions &
    OptionsConditionalStatic<StaticProperties, Conditions>,
): ReturnConditionalStatic<StaticProperties, Conditions>;
// Conditional Dynamic Properties + Conditional Static Properties
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
>(
  options: CommonOptions &
    OptionsConditionalBoth<DynamicProperties, StaticProperties, Conditions>,
): ReturnConditionalStatic<StaticProperties, Conditions> &
  ReturnConditionalDynamic<DynamicProperties, Conditions>;

/**
 * SHORTHANDS + CONDITIONS
 */

// Conditional Dynamic Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
>(
  options: CommonOptions &
    OptionsConditionalDynamic<DynamicProperties, Conditions> &
    ShorthandOptions<DynamicProperties, Shorthands>,
): ReturnConditionalDynamic<DynamicProperties, Conditions> &
  ReturnShorthands<Shorthands>;
// Conditional Static Properties + Shorthands
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
>(
  options: CommonOptions &
    OptionsConditionalStatic<StaticProperties, Conditions> &
    ShorthandOptions<StaticProperties, Shorthands>,
): ReturnConditionalStatic<StaticProperties, Conditions> &
  ReturnShorthands<Shorthands>;
// Conditional Dynamic Properties + Conditional Static Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
>(
  options: CommonOptions &
    OptionsConditionalBoth<DynamicProperties, StaticProperties, Conditions> &
    ShorthandOptions<DynamicProperties & StaticProperties, Shorthands>,
): ReturnConditionalStatic<StaticProperties, Conditions> &
  ReturnConditionalDynamic<DynamicProperties, Conditions> &
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
      { '@layer': options['@layer'] },
    );
  }

  for (const staticProp in staticProperties) {
    const style = createStaticStyles(
      staticProp as keyof CSSProperties,
      staticProperties[staticProp],
      conditions,
      defaultCondition,
      { '@layer': options['@layer'] },
    );
    config[staticProp] = Object.assign({}, config?.[staticProp], style);
  }

  return { config };
}
