import { createStyles, CreateStylesOutput } from './createStyles';
import {
  createStaticStyles,
  CreateStaticStylesOutput,
} from './createStaticStyles';
import type {
  BaseConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  PrefixValue,
} from './types';
import { assignClasses } from './assignClasses';
import { assignInlineVars } from './assignInlineVars';
import { factoryExtractSprinklesFromProps } from './extractSprinklesFromProps';
import merge from 'lodash.merge';

type BaseShorthand<DynamicProperties, StaticProperties> = {
  [shorthandName: string]: Array<
    keyof DynamicProperties | keyof StaticProperties
  >;
};

type ShorthandOptions<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
> = {
  shorthands?: Shorthands;
};

type UnconditionalProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
> = {
  dynamicProperties: DynamicProperties;
  staticProperties?: StaticProperties;
  conditions: Conditions;
  defaultCondition: keyof Conditions;
};

export function createRainbowSprinkles<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
>(
  options: UnconditionalProperties<
    DynamicProperties,
    StaticProperties,
    Conditions
  > &
    ShorthandOptions<DynamicProperties, StaticProperties, Shorthands>,
) {
  const {
    conditions,
    dynamicProperties,
    shorthands,
    defaultCondition,
    staticProperties,
  } = options;

  type ValueOrConditionObject<T> = T | Partial<Record<keyof Conditions, T>>;

  /**
   * Properties that are `staticProperties` only, and not
   * also configured in `dynamicProperties`
   */
  type ExclusivelyStaticProperties = Omit<
    StaticProperties,
    keyof DynamicProperties
  >;

  type BaseSprinklesProps =
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
              ValueOrConditionObject<CSSProperties[Property]>
            : // Otherwise, we want to merge both the CSSProperties types and the theme/alias values provided in the config
              ValueOrConditionObject<
                | CSSProperties[Property]
                | PrefixValue<keyof StaticProperties[Property]>
              >
          : ValueOrConditionObject<CSSProperties[Property]>
        : // Property has an object scale, therefore merge the alias/theme values with CSS property values
          ValueOrConditionObject<
            | CSSProperties[Property]
            | PrefixValue<keyof DynamicProperties[Property]>
          >;
    } & {
      // Static properties
      [Property in keyof Pick<
        CSSProperties,
        keyof ExclusivelyStaticProperties extends keyof CSSProperties
          ? keyof ExclusivelyStaticProperties
          : never
      >]?: StaticProperties[Property] extends string[]
        ? // Scale is an array of CSS values
          // e.g. {display: ['block', 'flex']}
          ValueOrConditionObject<StaticProperties[Property][number]>
        : // Scale is an object of alias to CSS values
          // usually means the use of CSS vars
          ValueOrConditionObject<PrefixValue<keyof StaticProperties[Property]>>;
    };

  type SprinklesProps = BaseSprinklesProps & {
    [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof BaseSprinklesProps
      ? BaseSprinklesProps[Shorthands[Key][0]]
      : never;
  };

  function createRainbowSprinklesCss(): Record<
    string,
    CreateStylesOutput<Conditions, keyof CSSProperties>[]
  > {
    type NormalProps = Record<
      keyof DynamicProperties,
      Array<CreateStylesOutput<Conditions, keyof CSSProperties>>
    >;
    const _normalProps: Partial<NormalProps> = {};
    for (const property in dynamicProperties) {
      const cssProperty = property as keyof CSSProperties;
      _normalProps[property] = [
        createStyles<Conditions>(
          cssProperty,
          dynamicProperties[cssProperty],
          conditions,
        ),
      ];
    }
    const normalProps = _normalProps as NormalProps;

    type StaticProps = Record<
      keyof StaticProperties,
      Array<CreateStaticStylesOutput<Conditions>>
    >;
    const _staticProps: Partial<StaticProps> = {};
    if (staticProperties) {
      for (const staticProperty in staticProperties) {
        const staticCSSProperty = staticProperty as keyof CSSProperties;
        _staticProps[staticCSSProperty] = [
          createStaticStyles<Conditions>(
            staticCSSProperty,
            // For some reason, TypeScript does not recognize that
            // these types line up, but it can't be otherwise
            // @ts-ignore
            staticProperties[staticCSSProperty],
            conditions,
          ),
        ];
      }
    }

    const staticProps = _staticProps as StaticProps;

    const allConfiguredProps: NormalProps & StaticProps = merge(
      normalProps,
      staticProps,
    );

    type ShorthandProps = Record<
      keyof Shorthands,
      CreateStylesOutput<Conditions>[]
    >;
    const _shorthandProps: Partial<
      Record<keyof Shorthands, CreateStylesOutput<Conditions>[]>
    > = {};
    if (shorthands) {
      for (const [shorthandName, shorthandProperties] of Object.entries(
        shorthands,
      )) {
        const name = shorthandName as keyof Shorthands;
        shorthandProperties.forEach((shorthandProperty) => {
          const arr = _shorthandProps[name] || [];
          arr!.push(allConfiguredProps[shorthandProperty][0]);
          _shorthandProps[name] = arr;
        });
      }
    }
    const shorthandProps = _shorthandProps as ShorthandProps;

    return {
      ...allConfiguredProps,
      ...shorthandProps,
    };
  }

  function getBoxProps(
    /** styles returned by createRainbowSprinklesCss */
    sprinklesCssConfig: ReturnType<typeof createRainbowSprinklesCss>,
    /** Sprinkles props and their values as configured */
    props: SprinklesProps,
  ) {
    const style: Record<string, string> = {};
    const className: string[] = [];

    Object.keys(props).forEach((property) => {
      const propertyConfigs = sprinklesCssConfig[property];
      const propValue = props[property];
      if (propertyConfigs) {
        propertyConfigs.forEach((propertyConfig) => {
          className.push(
            assignClasses<Conditions>(
              propertyConfig,
              defaultCondition,
              propValue,
            ),
          );
          Object.assign(
            style,
            assignInlineVars<Conditions>(
              propertyConfig,
              defaultCondition,
              propValue,
            ),
          );
        });
      }
    });

    return {
      className: className.join(' ').trim(),
      ...(Object.keys(style).length > 0 ? { style } : {}),
    };
  }

  const propertySet = new Set([
    ...Object.keys(dynamicProperties),
    ...(staticProperties ? Object.keys(staticProperties) : []),
    ...(shorthands ? Object.keys(shorthands) : []),
  ]);

  return {
    getBoxProps,
    createRainbowSprinklesCss,
    extractSprinklesFromProps: factoryExtractSprinklesFromProps(propertySet),
  };
}
