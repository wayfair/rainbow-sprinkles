import type { RuntimeFnReturn } from './types';
import type { ChildSprinkles, SprinkleProperties } from './exp';
import { assignClasses } from './assignClasses';
import { assignInlineVars } from './assignInlineVars';

export type SprinklesProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R,
]
  ? (L extends BaseReturn ? ChildSprinkles<L['config']> : never) &
      SprinklesProps<R>
  : {};

export type BaseCssConfig = {
  values?: {
    [k: string]: {
      [condition: string | 'default']: string;
    };
  };
  name: string;
  dynamic?: {
    [condition: string | 'default']: string;
  };
  vars?: {
    [condition: string | 'default']: string;
  };
  scale: string[] | Record<string, string> | true;
};

export type BaseReturn = {
  config: SprinkleProperties;
  conditions: {
    defaultCondition: string;
    conditionNames: string[];
  };
};

export type SprinklesFn<Args extends ReadonlyArray<BaseReturn>> = ((
  props: SprinklesProps<Args>,
) => RuntimeFnReturn) & { properties: Set<keyof SprinklesProps<Args>> };

export function createRainbowSprinkles<Args extends ReadonlyArray<BaseReturn>>(
  ...args: Args
): SprinklesFn<Args> {
  const cssConfig = Object.assign({}, ...args.map((a) => a.config));
  const properties = Object.keys(cssConfig) as Array<
    keyof SprinklesProps<Args>
  >;
  const propertiesSet = new Set(properties);

  // const config = { config: cssConfig, properties };
  const shorthandNames = properties.filter(
    (property) => 'mappings' in cssConfig[property],
  );

  const runtimeFn = (props: any) => {
    const style: Record<string, string> = {};
    const className: string[] = [];
    const otherProps: Record<string, any> = {};

    const shorthands: any = {};
    const nonShorthands: any = { ...props };
    let hasShorthands = false;

    for (const shorthand of shorthandNames) {
      const value = props[shorthand];
      if (value != null) {
        const sprinkle = cssConfig[shorthand];
        hasShorthands = true;
        for (const propMapping of sprinkle.mappings) {
          shorthands[propMapping] = value;
          if (nonShorthands[propMapping] == null) {
            delete nonShorthands[propMapping];
          }
        }
      }
    }

    const finalProps = hasShorthands
      ? { ...shorthands, ...nonShorthands }
      : props;

    for (const property in finalProps) {
      // @ts-ignore
      if (!propertiesSet.has(property)) {
        otherProps[property] = props[property];
        continue;
      }

      const propertyConfig = cssConfig[property];
      const propValue = finalProps[property];

      if (propertyConfig.mappings) {
        continue;
      }

      if (propertyConfig) {
        className.push(assignClasses(propertyConfig, propValue));
        Object.assign(style, assignInlineVars(propertyConfig, propValue));
      }
    }

    return {
      className: className.join(' ').trim(),
      style,
      otherProps,
    };
  };

  return Object.assign(runtimeFn, { properties: new Set(properties) });
}
