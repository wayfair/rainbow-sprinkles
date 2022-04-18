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
  SprinklesFn,
} from './types';
import { assignClasses } from './assignClasses';
import { assignInlineVars } from './assignInlineVars';
import { factoryExtractSprinklesFromProps } from './extractSprinklesFromProps';
import { mapValues } from './utils';
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

  function createRainbowSprinklesCss(): Record<
    string,
    CreateStylesOutput<Conditions, keyof CSSProperties>[]
  > {
    const normalProps = mapValues(dynamicProperties, (scale, property) =>
      createStyles<Conditions>(
        property as keyof CSSProperties,
        scale,
        conditions,
      ),
    );

    const staticProps = mapValues(staticProperties, (scale, property) =>
      createStaticStyles<Conditions>(
        property as keyof CSSProperties,
        scale,
        conditions,
      ),
    );

    const allConfiguredProps = merge(normalProps, staticProps);

    const shorthandProps = mapValues(shorthands, (properties) => {
      // @ts-ignore
      return properties.map((property) => allConfiguredProps[property]);
    });

    return {
      ...mapValues(allConfiguredProps, (config) => [config]),
      ...shorthandProps,
    };
  }

  function getBoxProps(
    /** styles returned by createRainbowSprinklesCss */
    sprinklesCssConfig: ReturnType<typeof createRainbowSprinklesCss>,
    /** Sprinkles props and their values as configured */
    props: SprinklesFn<
      DynamicProperties,
      StaticProperties,
      Shorthands,
      Conditions
    >,
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
