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

  type PrefixValue<T> = T/* `$${(string | number) & T}`; */

  /**
   * properties with provided scale (e.g., not `true`)
   */
  type DynamicPropertiesWithScale = {
    [k in keyof DynamicProperties]: DynamicProperties[k] extends boolean
      ? never
      : DynamicProperties[k];
  };

  /**
   * The possible values for any configured dynamic property, if it has a scale or not
   */
  type DynamicSprinklesValue<Property extends keyof DynamicProperties> =
    Property extends keyof CSSProperties
      ? // Property set to an obj
        Property extends keyof DynamicPropertiesWithScale
        ? ValueOrConditionObject<
            | CSSProperties[Property]
            | PrefixValue<keyof DynamicProperties[Property]>
          >
        : // Property set to `true` (no alias to values, just any accepted CSS value)
          ValueOrConditionObject<CSSProperties[Property]>
      : never;

  /**
   * Properties that are `staticProperties` only, and not
   * also configured in `dynamicProperties`
   */
  type ExclusivelyStaticProperties = Omit<
    StaticProperties,
    keyof DynamicProperties
  >;

  type SprinklesProps =
    // Dynamic properties
    {
      [Key in keyof Pick<
        CSSProperties,
        keyof DynamicProperties extends keyof CSSProperties
          ? keyof DynamicProperties
          : never
      >]?: DynamicSprinklesValue<Key>;
    };
  // & {
  //     // Static properties
  //     [Key in keyof Pick<
  //       CSSProperties,
  //       keyof ExclusivelyStaticProperties extends keyof CSSProperties
  //         ? keyof ExclusivelyStaticProperties
  //         : never
  //     >]?: StaticProperties[Key] extends string[]
  //       ? ValueOrConditionObject<StaticProperties[Key][number]>
  //       : ValueOrConditionObject<PrefixValue<keyof StaticProperties[Key]>>;
  //   } & {
  //     // Shorthands
  //     [Key in keyof Shorthands]?: Shorthands[Key][0] extends keyof CSSProperties
  //       ? DynamicSprinklesValue<Shorthands[Key][0]>
  //       : never;
  //   };

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
