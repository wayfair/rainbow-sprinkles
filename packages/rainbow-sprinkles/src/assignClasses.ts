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

  // Value is a string or number, ie not responsive
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    return handleEntry(propertyConfig, `${propValue}`, cache);
  }

  const keys = Object.keys(propValue);

  // If no entries, exit gracefully
  if (keys.length < 1) {
    return '';
  }

  const className = keys
    .map((condition) => {
      const rawValueAtCondition = `${propValue[condition]}`;
      return handleEntry(propertyConfig, rawValueAtCondition, cache, condition);
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
