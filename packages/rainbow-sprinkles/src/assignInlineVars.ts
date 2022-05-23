import { BaseConditions, CSSProperties, CreateStylesOutput } from './types';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { trim$ } from './utils';

function _assignInlineVars<Conditions extends BaseConditions>(
  propertyConfig: CreateStylesOutput<Conditions>,
  defaultCondition: keyof Conditions,
  propValue: unknown,
): CSSProperties | null {
  const { vars, scale } = propertyConfig;

  // Value is a string, ie not responsive
  if (typeof propValue === 'string') {
    const parsedValue = trim$(propValue) ?? propValue;
    // If the propValue matches a static value,
    // don't assign any variables
    if (
      propertyConfig.classes[parsedValue] ||
      !propertyConfig.classes.dynamic
    ) {
      return {};
    }
    return assignInlineVars({
      [vars[defaultCondition]]: scale?.[parsedValue] ?? propValue,
    });
  }

  const bps = propValue as { [k in keyof Conditions]?: string };

  // If no entries, exit gracefully
  if ((bps && Object.keys(bps).length < 1) || bps == null) {
    return {};
  }

  let hasProperty = false;

  const variableAssignments = Object.entries(bps).reduce(
    (acc: Record<string, string>, [bp, value]) => {
      if (value) {
        const parsedValue = trim$(value) ?? value;
        if (
          propertyConfig.classes[parsedValue] ||
          !propertyConfig.classes.dynamic
        ) {
          // If value has a static class, don't assign any variables
          return acc;
        }
        hasProperty = true;
        acc[vars[bp]] = scale?.[parsedValue] ?? value;
      }
      return acc;
    },
    {},
  );

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

export { _assignInlineVars as assignInlineVars };
