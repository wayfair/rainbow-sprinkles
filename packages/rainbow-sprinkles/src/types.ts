import type { PropertiesFallback, Properties } from 'csstype';

export type CSSProperties = Properties<number | (string & {})>;

export type CSSPropertyNames = keyof Properties<number | string & {});

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type BaseConditions = { [conditionName: string]: Condition };

type BaseShorthand<DynamicProperties, StaticProperties> = {
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

export type UnconditionalProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties?: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
};

type ValueOrConditionObject<T, Conditions extends BaseConditions> =
  | T
  | Partial<Record<keyof Conditions, T>>;

/**
 * properties with provided scale (e.g., not `true`)
 */
type GetDynamicPropertiesWithScale<
  DynamicProperties extends ConfigDynamicProperties,
> = {
  [k in keyof DynamicProperties]: DynamicProperties[k] extends boolean
    ? never
    : DynamicProperties[k];
}[keyof DynamicProperties];

// /**
//  * The possible values for any configured dynamic property, if it has a scale or not
//  */
// type DynamicSprinklesValue<
//   Property extends keyof ConfigDynamicProperties,
//   Conditions extends BaseConditions,
//   DynamicPropertiesWithScale,
// > = Property extends keyof CSSProperties
//   ? // Property set to an obj
//     Property extends keyof DynamicPropertiesWithScale
//     ? ValueOrConditionObject<
//         CSSProperties[Property] | keyof DynamicProperties[Property],
//         Conditions
//       >
//     : // Property set to `true` (no alias to values, just any accepted CSS value)
//       ValueOrConditionObject<CSSProperties[Property], Conditions>
//   : never;

// /**
//  * Properties that are `staticProperties` only, and not
//  * also configured in `dynamicProperties`
//  */
// type ExclusivelyStaticProperties<
//   StaticProperties extends ConfigStaticProperties,
//   DynamicProperties extends ConfigDynamicProperties,
// > = Omit<StaticProperties, keyof DynamicProperties>;

export type SprinklesFn<
  DynamicProperties extends Readonly<ConfigDynamicProperties>,
  StaticProperties extends Readonly<StaticProperties>,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
  Conditions extends BaseConditions,
  DynamicPropertiesWithScale = GetDynamicPropertiesWithScale<DynamicProperties>,
  ExclusivelyStaticProperties = keyof Omit<
    StaticProperties,
    keyof DynamicProperties
  >,
> =
  // Dynamic properties
  {
    [Key in keyof Pick<
      CSSProperties,
      keyof DynamicProperties extends keyof CSSProperties
        ? keyof DynamicProperties
        : never
    >]?: Key extends keyof DynamicPropertiesWithScale
      ? ValueOrConditionObject<
          CSSProperties[Key] | keyof DynamicProperties[Key],
          Conditions
        >
      : // Property set to `true` (no alias to values, just any accepted CSS value)
        ValueOrConditionObject<CSSProperties[Key], Conditions>;
  } & {
    // Static properties
    [Key in keyof Pick<
      CSSProperties,
      keyof ExclusivelyStaticProperties extends keyof CSSProperties
        ? keyof ExclusivelyStaticProperties
        : never
    >]?: StaticProperties[Key] extends string[]
      ? ValueOrConditionObject<StaticProperties[Key][number], Conditions>
      : ValueOrConditionObject<keyof StaticProperties[Key], Conditions>;
  } & {
    // Shorthands
    [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof CSSProperties
      ? Shorthands[Key][0] extends DynamicPropertiesWithScale
        ?
            | ValueOrConditionObject<
                CSSProperties[Shorthands[Key][0]],
                Conditions
              >
            | Shorthands[Key][0]
        : ValueOrConditionObject<Shorthands[Key][0], Conditions>
      : never;
  };
