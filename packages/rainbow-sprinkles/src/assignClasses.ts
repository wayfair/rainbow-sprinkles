import type { CreateStylesOutput } from './types';
import { trim$ } from './utils';

export function assignClasses(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
  cache: Map<string | number, string>,
): string {
  if (!propValue && propValue !== 0) {
    return '';
  }

  const { dynamic, values, name: propName } = propertyConfig;

  // Value is a string or number, ie not responsive
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    if (cache.has(propValue)) {
      return cache.get(propValue);
    }

    const value = trim$(propValue);
    // Check for static value first
    if (values?.[value]) {
      const result = values[value].default;
      cache.set(propValue, result);
      return result;
    }

    if (dynamic) {
      const result = dynamic.default;
      cache.set(propValue, result);
      return result;
    }
    // If the property is not dynamic, and unrecognized value is provided
    // Quietly warn
    // eslint-disable-next-line no-console
    console.error(
      `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
        values,
      )
        .map((className) => `"${className}"`)
        .join(', ')}. Received: ${JSON.stringify(propValue)}.`,
    );
    return '';
  }

  const keys = Object.keys(propValue);

  // If no entries, exit gracefully
  if (keys.length < 1) {
    return '';
  }

  const className = keys
    .map((condition) => {
      const rawValueAtCondition: string | number = propValue[condition];

      // Make sure we're caching the value for that condition,
      // so it doesn't clash with no-condition values
      const cacheKey = `${condition}${rawValueAtCondition}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      const valueAtCondition = trim$(rawValueAtCondition);

      // Check for static value first
      if (values?.[valueAtCondition]) {
        const result = values[valueAtCondition].conditions[condition];
        cache.set(cacheKey, result);
        return result;
      }
      if (dynamic) {
        const result = dynamic.conditions[condition];
        cache.set(cacheKey, result);
        return result;
      }
      // If the property is not dynamic, and unrecognized value is provided
      // Quietly warn
      // eslint-disable-next-line no-console
      console.error(
        `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
          values,
        )
          .map((className) => `"${className}"`)
          .join(', ')}. Received: ${JSON.stringify(valueAtCondition)}.`,
      );
      return null;
    })
    .filter(Boolean);

  return className.join(' ').trim();
}
