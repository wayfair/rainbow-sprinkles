import { CSSProperties, CreateStylesOutput } from './types';
import { replaceVarsInValue } from './utils';

export function assignVars(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
  cache: Map<number | string, string>,
): CSSProperties {
  const { vars, dynamicScale, values, dynamic } = propertyConfig;

  if (!dynamic) {
    return {};
  }

  // Value is a string, ie not responsive
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    let parsedValue: string;
    if (cache.has(propValue)) {
      parsedValue = cache.get(propValue);
    } else {
      parsedValue = replaceVarsInValue(`${propValue}`, dynamicScale);
      cache.set(propValue, parsedValue);
    }

    // If the propValue matches a static value,
    // don't assign any variables
    if (values?.[parsedValue] || values?.conditions?.[parsedValue]) {
      return {};
    }

    const result = {
      [vars.default]: parsedValue,
    };
    return result;
  }

  // If no entries, exit gracefully
  if ((propValue && Object.keys(propValue).length < 1) || propValue == null) {
    return {};
  }

  const variableAssignments = Object.entries(
    propValue as Record<string | number, string>,
  ).reduce((acc: Record<string, string>, [bp, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      let parsedValue: string;
      if (cache.has(value)) {
        parsedValue = cache.get(value);
      } else {
        parsedValue = replaceVarsInValue(`${value}`, dynamicScale);
        cache.set(value, parsedValue);
      }

      if (values && parsedValue in values) {
        // If value has a static class, don't assign any variables
        return acc;
      }

      acc[vars.conditions[bp]] = parsedValue;
    }

    return acc;
  }, {});

  return variableAssignments;
}
