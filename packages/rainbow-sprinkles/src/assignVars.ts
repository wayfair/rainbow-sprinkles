import { CreateStylesOutput } from './types';
import { replaceVarsInValue } from './utils';

export function createAssignVars(
  varsToAssign: Record<string, string>,
  cache: Map<number | string, string | false>,
) {
  return function assignVars(
    propertyConfig: CreateStylesOutput,
    propValue: unknown,
  ) {
    const { vars, dynamicScale, staticScale, values, dynamic } = propertyConfig;

    if (!dynamic) {
      return varsToAssign;
    }

    // Value is a string, ie not responsive
    if (typeof propValue === 'string' || typeof propValue === 'number') {
      let parsedValue: string | false;
      if (cache.has(propValue)) {
        parsedValue = cache.get(propValue);
      } else {
        parsedValue = replaceVarsInValue(
          `${propValue}`,
          dynamicScale,
          staticScale,
        );
        cache.set(propValue, parsedValue);
      }

      // If the propValue matches a static value,
      // don't assign any variables
      if (!parsedValue) {
        return varsToAssign;
      }

      varsToAssign[vars.default] = parsedValue;
      return varsToAssign;
    }

    // If no entries, exit gracefully
    if ((propValue && Object.keys(propValue).length < 1) || propValue == null) {
      return varsToAssign;
    }

    for (const condition in propValue as Record<string, string>) {
      const value = propValue[condition];
      if (typeof value === 'string' || typeof value === 'number') {
        let parsedValue: string | false;
        if (cache.has(value)) {
          parsedValue = cache.get(value);
        } else {
          parsedValue = replaceVarsInValue(
            `${value}`,
            dynamicScale,
            staticScale,
          );
          cache.set(value, parsedValue);
        }

        if (!parsedValue) {
          continue;
        }

        varsToAssign[vars.conditions[condition]] = parsedValue;
      }
    }

    return varsToAssign;
  };
}
