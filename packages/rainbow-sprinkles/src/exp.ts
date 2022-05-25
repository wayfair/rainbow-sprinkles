import type { Properties } from './css';
import { createVar } from '@vanilla-extract/css';

export interface CSSProperties extends Properties {}

// Configuration

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

// type ValueOrConditionObject<T, Conditions> =
//   | T
//   | Partial<Record<keyof Conditions, T>>;

type ValueOrConditionObject<T, Conditions extends ConditionalMap> =
  | T
  | Partial<Record<keyof Conditions['conditions'], T>>;

type ValueOrConditionObjectStatic<
  T,
  Values extends { [k: string]: ConditionalMap },
> =
  | T
  | {
      [Condition in keyof Values[keyof Values]['conditions']]?: keyof Values;
    };

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

type ConditionalMap = {
  default: string;
  conditions: { [condition: string]: string };
};

export type DynamicConditionalProperty = {
  dynamic: ConditionalMap;
  vars: ConditionalMap;
  dynamicScale:
    | {
        [token: string]: string;
      }
    | true;
  name: string;
};

export type StaticConditionalPropertyArray = {
  values: {
    [value: string]: ConditionalMap;
  };
  staticScale: string[];
  name: string;
};

export type StaticConditionalProperty = {
  values: {
    [value: string]: ConditionalMap;
  };
  staticScale: {
    [token: string]: string;
  };
  name: string;
};

export type StaticDynamicConditionalPropertyArray = {
  dynamic: ConditionalMap;
  values: {
    [value: string]: ConditionalMap;
  };
  name: string;
  staticScale: string[];
  dynamicScale: true;
  vars: ConditionalMap;
};

export type StaticDynamicConditionalProperty = {
  dynamic: ConditionalMap;
  values: {
    [value: string]: ConditionalMap;
  };
  name: string;
  vars: ConditionalMap;
  staticScale: {
    [token: string]: string;
  };
  dynamicScale: true;
};

export type ShorthandProperty = {
  mappings: string[];
};

export type SprinkleProperties = {
  [k: string]:
    | DynamicConditionalProperty
    | StaticConditionalProperty
    | StaticConditionalPropertyArray
    | StaticDynamicConditionalPropertyArray
    | StaticDynamicConditionalProperty
    | ShorthandProperty;
};

export type DefinePropertiesReturn = {
  config: SprinkleProperties[];
};

type PropertyCssValue<T> = T extends keyof CSSProperties
  ? CSSProperties[T]
  : never;

export type ChildSprinkles<Sprinkles extends SprinkleProperties> = {
  [Prop in keyof Sprinkles]?: Sprinkles[Prop] extends StaticDynamicConditionalProperty
    ? ValueOrConditionObject<
        | PropertyCssValue<Prop>
        | PrefixValue<keyof Sprinkles[Prop]['dynamicScale']>,
        Sprinkles[Prop]['vars']
      >
    : Sprinkles[Prop] extends StaticDynamicConditionalPropertyArray
    ? ValueOrConditionObject<PropertyCssValue<Prop>, Sprinkles[Prop]['vars']>
    : Sprinkles[Prop] extends DynamicConditionalProperty
    ? Sprinkles[Prop]['dynamicScale'] extends boolean
      ? ValueOrConditionObject<PropertyCssValue<Prop>, Sprinkles[Prop]['vars']>
      : ValueOrConditionObject<
          | PropertyCssValue<Prop>
          | PrefixValue<keyof Sprinkles[Prop]['dynamicScale']>,
          Sprinkles[Prop]['vars']
        >
    : Sprinkles[Prop] extends StaticDynamicConditionalPropertyArray
    ? ValueOrConditionObject<
        Sprinkles[Prop]['staticScale'][number],
        Sprinkles[Prop]['dynamic']
      >
    : Sprinkles[Prop] extends StaticDynamicConditionalProperty
    ? ValueOrConditionObjectStatic<
        PrefixValue<keyof Sprinkles[Prop]['staticScale']>,
        Sprinkles[Prop]['values']
      >
    : Sprinkles[Prop] extends StaticConditionalProperty
    ? ValueOrConditionObjectStatic<
        PrefixValue<keyof Sprinkles[Prop]['staticScale']>,
        Sprinkles[Prop]['values']
      >
    : Sprinkles[Prop] extends StaticConditionalPropertyArray
    ? ValueOrConditionObjectStatic<
        Sprinkles[Prop]['staticScale'][number],
        Sprinkles[Prop]['values']
      >
    : /**
     *
     * SHORTHANDS
     * Repeats everything above, just nested with
     * Sprinkles[Sprinkles[Prop]['mappings'][number]]
     *
     */
    Sprinkles[Prop] extends ShorthandProperty
    ? Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticDynamicConditionalProperty
      ? ValueOrConditionObject<
          | PropertyCssValue<Sprinkles[Prop]['mappings'][number]>
          | PrefixValue<
              keyof Sprinkles[Sprinkles[Prop]['mappings'][number]]['staticScale']
            >,
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['vars']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticDynamicConditionalPropertyArray
      ? ValueOrConditionObject<
          PropertyCssValue<Prop>,
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['vars']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends DynamicConditionalProperty
      ? Sprinkles[Sprinkles[Prop]['mappings'][number]]['dynamicScale'] extends boolean
        ? ValueOrConditionObject<
            PropertyCssValue<Sprinkles[Prop]['mappings'][number]>,
            Sprinkles[Sprinkles[Prop]['mappings'][number]]['vars']
          >
        : ValueOrConditionObject<
            | PropertyCssValue<Sprinkles[Prop]['mappings'][number]>
            | PrefixValue<
                keyof Sprinkles[Sprinkles[Prop]['mappings'][number]]['dynamicScale']
              >,
            Sprinkles[Sprinkles[Prop]['mappings'][number]]['vars']
          >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticDynamicConditionalPropertyArray
      ? ValueOrConditionObject<
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['staticScale'][number],
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['dynamic']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticDynamicConditionalProperty
      ? ValueOrConditionObjectStatic<
          PrefixValue<
            keyof Sprinkles[Sprinkles[Prop]['mappings'][number]]['staticScale']
          >,
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['values']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticConditionalProperty
      ? ValueOrConditionObjectStatic<
          PrefixValue<
            keyof Sprinkles[Sprinkles[Prop]['mappings'][number]]['staticScale']
          >,
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['values']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends StaticConditionalPropertyArray
      ? ValueOrConditionObjectStatic<
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['staticScale'][number],
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['values']
        >
      : never
    : never;
};
