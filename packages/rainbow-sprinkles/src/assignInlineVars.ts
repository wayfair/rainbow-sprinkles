import { BaseConditions, CSSProperties, CreateStylesOutput } from './types';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { parseValue } from './utils';

function _assignInlineVars<Conditions extends BaseConditions>(
  propertyConfig: CreateStylesOutput<Conditions>,
  defaultCondition: keyof Conditions,
  propValue: unknown,
): CSSProperties | null {
  const { vars, scale } = propertyConfig;

  // Value is a string, ie not responsive
  if (typeof propValue === 'string') {
    // If the propValue matches a static value,
    // don't assign any variables
    if (propertyConfig.classes[propValue] || !propertyConfig.classes.dynamic) {
      return {};
    }
    return assignInlineVars({
      [vars[defaultCondition]]: parseValue(propValue, scale),
    });
  }

  const bps = propValue as { [k in keyof Conditions]?: string };

  // If no entries, exit gracefully
  if (bps && Object.keys(bps).length < 1) {
    return {};
  }

  let hasProperty = false;

  const variableAssignments = Object.entries(bps).reduce(
    (acc: Record<string, string>, [bp, value]) => {
      if (value) {
        if (propertyConfig.classes[value] || !propertyConfig.classes.dynamic) {
          // If value has a static class, don't assign any variables
          return acc;
        }
        hasProperty = true;
        acc[vars[bp]] = parseValue(value, scale);
      }
      return acc;
    },
    {},
  );

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

export { _assignInlineVars as assignInlineVars };
