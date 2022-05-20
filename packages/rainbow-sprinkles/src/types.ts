import type { Properties } from './css';
import { createVar } from '@vanilla-extract/css';

export interface CSSProperties extends Properties {}

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

type CSSVarFunction = ReturnType<typeof createVar>;

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | Array<CSSProperties[k] | CSSVarFunction>
    | Record<string, CSSProperties[k] | CSSVarFunction>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?:
    | Record<string, CSSProperties[k] | CSSVarFunction>
    | true;
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

export type RainbowSprinklesOptions<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties?: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
  shorthands?: Shorthands;
};

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [k in keyof Conditions]: string;
};

export type CreateStylesOutput<
  Conditions extends BaseConditions,
  Property extends keyof CSSProperties = keyof CSSProperties,
> = {
  classes: { [k: string | 'dynamic']: BaseConditionMap<Conditions> };
  name: Property;
  vars?: BaseConditionMap<Conditions>;
  scale?: ConfigDynamicProperties[Property];
};

export type CreateCssReturn<Conditions extends BaseConditions> = Record<
  string,
  CreateStylesOutput<Conditions, keyof CSSProperties>[]
>;

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
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> =
  // Config extends RainbowSprinklesOptions<
  //   infer DynamicProperties,
  //   infer StaticProperties,
  //   infer Conditions,
  //   infer Shorthands
  // >
  //   ?
  // Dynamic properties
  {
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
  }; /* & {
    [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof DynamicProperties
      ? DynamicProperties[Shorthands[Key][0]]
      : Shorthands[Key][0] extends keyof StaticProperties
      ? StaticProperties[Shorthands[Key][0]]
      : never;
  }; */
// : never;

// export type RainbowSprinklesProps<Config> =
//   Config extends RainbowSprinklesConfig<
//     infer DynamicProperties,
//     infer StaticProperties,
//     infer Conditions,
//     infer Shorthands
//   >
//     ? BaseSprinklesProps<Config> & {

//     [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof BaseSprinklesProps<Config>
//       ? BaseSprinklesProps<Config>[Shorthands[Key][0]]
//       : never;

//     : never;

// Runtime Function

type RuntimeFnReturn = {
  style?: Record<string, string>;
  className: string;
};
export type RuntimeFn<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
  Props = RainbowSprinklesProps<
    DynamicProperties,
    StaticProperties,
    Conditions,
    Shorthands
  >,
> = (
  props: Props & {
    [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof Props
      ? Props[Shorthands[Key][0]]
      : never;
  },
) => RuntimeFnReturn;
