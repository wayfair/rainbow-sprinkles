import { BaseConditions, CSSProperties, CreateStylesOutput } from './types';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { trim$ } from './utils';

function _assignInlineVars<Conditions extends BaseConditions>(
  propertyConfig: CreateStylesOutput<Conditions>,
  propValue: unknown,
): CSSProperties | null {
  const { vars, scale, values, dynamic } = propertyConfig;

  // Value is a string, ie not responsive
  if (typeof propValue === 'string') {
    const parsedValue = trim$(propValue) ?? propValue;
    // If the propValue matches a static value,
    // don't assign any variables
    if (values?.[parsedValue] || !dynamic) {
      return {};
    }
    return assignInlineVars({
      [vars.default]: scale?.[parsedValue] ?? propValue,
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
        if (values?.[parsedValue] || !dynamic) {
          // If value has a static class, don't assign any variables
          return acc;
        }
        hasProperty = true;
        acc[vars.conditions[bp]] = scale?.[parsedValue] ?? value;
      }
      return acc;
    },
    {},
  );

  // console.log(variableAssignments);

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

export { _assignInlineVars as assignInlineVars };
