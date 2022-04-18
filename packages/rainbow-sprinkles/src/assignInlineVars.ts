import { BaseConditions, CSSProperties } from './types';
import { CreateStylesOutput } from './createStyles';
import { assignInlineVars } from '@vanilla-extract/dynamic';

const VALUE_REGEX = /^\$(\w*)/;

function parseValue(scale: CreateStylesOutput<any>['scale'], rawValue: string) {
  const match = rawValue.match(VALUE_REGEX);
  const value = match?.[1] || rawValue;
  return scale?.[value] || value;
}

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
      [vars[defaultCondition]]: parseValue(scale, propValue),
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
        acc[vars[bp]] = parseValue(scale, value);
      }
      return acc;
    },
    {},
  );

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

export { _assignInlineVars as assignInlineVars };
