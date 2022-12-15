import type { CreateStylesOutput } from './types';
import { getValueConfig } from './utils';

export function assignClasses(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
  cache: Map<string | number, string>,
): string {
  if (!propValue && propValue !== 0) {
    return '';
  }

  const { dynamic, values, name: propName, staticScale } = propertyConfig;

  // Value is a string or number, ie not responsive
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    const cacheKey = propValue;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // Check for static value first
    if (values) {
      if (Array.isArray(staticScale) && staticScale.includes(propValue)) {
        const result = values[propValue].default;
        cache.set(cacheKey, result);
        return result;
      }

      const parsedValue = getValueConfig(`${propValue}`, values);
      if (parsedValue) {
        const result = parsedValue.default;
        cache.set(cacheKey, result);
        return result;
      }
    }

    if (dynamic) {
      const result = '';
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
      const rawValueAtCondition = `${propValue[condition]}`;

      const cacheKey = `${condition}${rawValueAtCondition}`;

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      // Check for static value first
      if (values) {
        if (Array.isArray(staticScale) && staticScale.includes(propValue)) {
          const result = values[rawValueAtCondition].conditions[condition];
          cache.set(cacheKey, result);
          return result;
        }

        const parsedValue = getValueConfig(rawValueAtCondition, values);
        if (parsedValue) {
          const result = parsedValue.conditions[condition];
          cache.set(cacheKey, result);
          return result;
        }
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
          .join(', ')}. Received: ${JSON.stringify(propValue)}.`,
      );
      return '';
    })
    .filter(Boolean);

  return className.join(' ').trim();
}

function handleEntry(
  propertyConfig: CreateStylesOutput,
  propValue: string,
  cache: Map<string | number, string>,
  condition?: string,
) {
  const { dynamic, values, name: propName, staticScale } = propertyConfig;

  const cacheKey = condition ? `${condition}${propValue}` : propValue;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Check for static value first
  if (values) {
    if (Array.isArray(staticScale) && staticScale.includes(propValue)) {
      const result = condition
        ? values[propValue].conditions[condition]
        : values[propValue].default;
      cache.set(cacheKey, result);
      return result;
    }

    const parsedValue = getValueConfig(propValue, values);
    if (parsedValue) {
      const result = condition
        ? parsedValue.conditions[condition]
        : parsedValue.default;
      cache.set(cacheKey, result);
      return result;
    }
  }

  if (dynamic) {
    const result = condition ? dynamic.conditions[condition] : dynamic.default;
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
      .join(', ')}. Received: ${JSON.stringify(propValue)}.`,
  );
  return '';
}
