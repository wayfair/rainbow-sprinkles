import { assignClasses } from './assignClasses';
import { assignInlineVars } from './assignInlineVars';
import {
  DefinePropertiesReturn,
  RuntimeFnReturn,
  ShorthandProperty,
  SprinklesProps,
} from './types';

export type SprinklesFn<Args extends ReadonlyArray<DefinePropertiesReturn>> = ((
  props: SprinklesProps<Args>,
) => RuntimeFnReturn) & { properties: Set<keyof SprinklesProps<Args>> };

export const createRuntimeFn = <
  Configs extends ReadonlyArray<DefinePropertiesReturn>,
>(
  ...configs: Configs
): SprinklesFn<Configs> => {
  const cssConfig = Object.assign({}, ...configs.map((c) => c.config));
  const properties = Object.keys(cssConfig) as Array<
    keyof SprinklesProps<Configs>
  >;
  const propertiesSet = new Set(properties);

  const shorthandNames = properties.filter(
    (property) => 'mappings' in cssConfig[property],
  );

  /**
   * Cache the inline styles and classes for properties and their values
   *
   * Structure in object notation would look like:
   * cache: {
   *   propName: {
   *      class: {
   *        propValue: 'className'
   *      },
   *      style: {
   *        propValue: 'inline style value'
   *      }
   *   }
   * }
   */
  const cache: Map<
    string,
    Map<'class' | 'style', Map<string | number, string>>
  > = new Map();

  const fn = (props: any) => {
    const style: Record<string, string> = {};
    const className: string[] = [];
    const otherProps: Record<string, any> = {};

    const shorthands: any = {};
    const nonShorthands: any = { ...props };
    let hasShorthands = false;

    for (const shorthand of shorthandNames) {
      const value = props[shorthand];
      if (value != null) {
        const sprinkle = cssConfig[shorthand] as ShorthandProperty;
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
      if (!propertiesSet.has(property as any)) {
        otherProps[property] = props[property];
        continue;
      }

      const propertyConfig = cssConfig[property];
      const propValue = finalProps[property];

      if ('mappings' in propertyConfig) {
        continue;
      }

      let classCache: Map<string | number, string>;
      let styleCache: Map<string | number, string>;

      if (propertyConfig) {
        if (cache.has(property)) {
          const c = cache.get(property);
          classCache = c.get('class');
          styleCache = c.get('style');
        } else {
          const propCache = new Map();
          classCache = new Map();
          styleCache = new Map();
          propCache.set('class', classCache);
          propCache.set('style', styleCache);
          cache.set(property, propCache);
        }

        className.push(assignClasses(propertyConfig, propValue, classCache));
        Object.assign(
          style,
          assignInlineVars(propertyConfig, propValue, styleCache),
        );
      }
    }

    return {
      className: className.join(' ').trim(),
      style,
      otherProps,
    };
  };

  return Object.assign(fn, { properties: propertiesSet });
};
