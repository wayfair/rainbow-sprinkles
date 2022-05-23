import { assignInlineVars } from './assignInlineVars';
import { assignClasses } from './assignClasses';

import type {
  RuntimeFn,
  BaseConditions,
  ConfigDynamicProperties,
  ConfigStaticProperties,
  BaseShorthand,
  CssConfig,
} from './types';

export function createRuntimeFn<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends BaseConditions,
  Shorthands extends BaseShorthand<DynamicProperties, StaticProperties>,
>({
  config,
  properties,
  defaultCondition,
}: {
  config: CssConfig<Conditions>;
  properties: string[];
  defaultCondition: string;
}): RuntimeFn<DynamicProperties, StaticProperties, Conditions, Shorthands> {
  return (props: Record<string, unknown>) => {
    const style: Record<string, string> = {};
    const className: string[] = [];
    const otherProps: Record<string, any> = {};

    for (const property of Object.keys(props)) {
      if (!properties.includes(property)) {
        otherProps[property] = props[property];
        continue;
      }

      const propertyConfigs = config[property];
      const propValue = props[property];
      if (propertyConfigs) {
        propertyConfigs.forEach((propertyConfig) => {
          className.push(
            assignClasses(propertyConfig, defaultCondition, propValue),
          );
          Object.assign(
            style,
            assignInlineVars(propertyConfig, defaultCondition, propValue),
          );
        });
      }
    }

    return {
      className: className.join(' ').trim(),
      style,
      otherProps,
    };
  };
}
