import type { Properties } from './css';
import { createVar } from '@vanilla-extract/css';

export interface CSSProperties extends Properties {}

// Configuration

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

type CSSVarFunction = ReturnType<typeof createVar>;

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type BaseConditions = { [conditionName: string]: Condition };

export type PrefixValue<T> = `$${(string | number) & T}`;

export type BaseShorthand<DynamicProperties, StaticProperties> = {
  [shorthandName: string]: Array<
    keyof DynamicProperties | keyof StaticProperties
  >;
};

export type ShorthandOptions<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> = {
  shorthands?: Shorthands;
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

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [k in keyof Conditions | 'default']: string;
};

export type CreateStylesOutput<
  Conditions extends BaseConditions,
  Property extends keyof CSSProperties = keyof CSSProperties,
> = {
  dynamic?: BaseConditionMap<Conditions>;
  values?: { [k: string]: BaseConditionMap<Conditions> };
  name: Property;
  vars?: BaseConditionMap<Conditions>;
  scale: ConfigDynamicProperties[Property];
};

export type BaseCssConfig<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
> = {
  [K in
    | keyof DynamicProperties
    | keyof StaticProperties]: K extends keyof CSSProperties
    ? CreateStylesOutput<Conditions, K>
    : never;
};

export type CssConfig<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
  Config = BaseCssConfig<DynamicProperties, StaticProperties, Conditions>,
> = Config & {
  [K in keyof Shorthands]: Shorthands[K][0] extends keyof Config
    ? Config[Shorthands[K][0]]
    : never;
};

export type CreateReturn<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> = {
  config: CssConfig<
    DynamicProperties,
    StaticProperties,
    Conditions,
    Shorthands
  >;
  defaultCondition: keyof Conditions;
  properties:
    | keyof DynamicProperties
    | keyof StaticProperties
    | keyof Shorthands;
};

// Props

type ValueOrConditionObject<T, Conditions> =
  | T
  | Partial<Record<keyof Conditions, T>>;

/**
 * Properties that are `staticProperties` only, and not
 * also configured in `dynamicProperties`
 */
type ExclusivelyStaticProperties<DynamicProperties, StaticProperties> = Omit<
  StaticProperties,
  keyof DynamicProperties
>;

export type RainbowSprinklesProps<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
> = {
  [Property in keyof Pick<
    CSSProperties,
    keyof DynamicProperties extends keyof CSSProperties
      ? keyof DynamicProperties
      : never
  >]?: DynamicProperties[Property] extends boolean // Property set to `true` (no alias to values, just any accepted CSS value)
    ? // If the same property does have a scale set in static properties...
      Property extends keyof StaticProperties
      ? // ...and if the scale is an array (so not alias/theme values)
        StaticProperties[Property] extends string[]
        ? // ...just show the regular CSS Properties. We don't do anything special for the types here, since there's no unique values.
          ValueOrConditionObject<CSSProperties[Property], Conditions>
        : // Otherwise, we want to merge both the CSSProperties types and the theme/alias values provided in the config
          ValueOrConditionObject<
            | CSSProperties[Property]
            | PrefixValue<keyof StaticProperties[Property]>,
            Conditions
          >
      : ValueOrConditionObject<CSSProperties[Property], Conditions>
    : // Property has an object scale, therefore merge the alias/theme values with CSS property values
      ValueOrConditionObject<
        | CSSProperties[Property]
        | PrefixValue<keyof DynamicProperties[Property]>,
        Conditions
      >;
} & {
  // Static properties
  [Property in keyof Pick<
    CSSProperties,
    keyof ExclusivelyStaticProperties<
      DynamicProperties,
      StaticProperties
    > extends keyof CSSProperties
      ? keyof ExclusivelyStaticProperties<DynamicProperties, StaticProperties>
      : never
  >]?: StaticProperties[Property] extends string[]
    ? // Scale is an array of CSS values
      // e.g. {display: ['block', 'flex']}
      ValueOrConditionObject<StaticProperties[Property][number], Conditions>
    : // Scale is an object of alias to CSS values
      // usually means the use of CSS vars
      ValueOrConditionObject<
        PrefixValue<keyof StaticProperties[Property]>,
        Conditions
      >;
};

// Runtime Function

export type RuntimeFnReturn = {
  style: Record<string, string>;
  className: string;
  otherProps: Record<string, any>;
};

export type RuntimeFn<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
  Props = RainbowSprinklesProps<
    DynamicProperties,
    StaticProperties,
    Conditions
  >,
> = (
  props: Props & {
    [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof Props
      ? Props[Shorthands[Key][0]]
      : never;
  },
) => RuntimeFnReturn;
