import type { Properties } from './css';

export interface CSSProperties extends Properties {}

type PropertyCssValue<T> = T extends keyof CSSProperties
  ? CSSProperties[T]
  : never;

// Configuration

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type ConfigConditions = {
  [conditionName: string]: {
    '@media'?: string;
    '@supports'?: string;
    selector?: string;
  };
};

export type ConfigShorthands<DynamicProperties, StaticProperties> = {
  [shorthandName: string]: Array<
    keyof DynamicProperties | keyof StaticProperties
  >;
};

export type ConditionalMap = {
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

/**
 * All of the possible permutations of a Sprinkle Property, combined
 * together and made conditional
 */
export type CreateStylesOutput = {
  dynamic?: {
    default: string;
    conditions: { [condition: string]: string };
  };
  values?: {
    [value: string]: {
      default: string;
      conditions: { [condition: string]: string };
    };
  };
  name: string;
  vars?: {
    default: string;
    conditions: { [condition: string]: string };
  };
  staticScale?: string[] | Record<string, string>;
  dynamicScale?: true | Record<string, string>;
};

export type DefinePropertiesReturn = {
  config: SprinkleProperties;
};

// Props

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

export type PrefixValue<T> = `$${(string | number) & T}`;

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

export type SprinklesProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R,
]
  ? (L extends DefinePropertiesReturn ? ChildSprinkles<L['config']> : never) &
      SprinklesProps<R>
  : {};

// Runtime Function

export type RuntimeFnReturn = {
  style: Record<string, string>;
  className: string;
  otherProps: Record<string, any>;
};
