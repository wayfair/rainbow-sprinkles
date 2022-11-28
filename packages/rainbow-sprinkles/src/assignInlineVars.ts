import { CSSProperties, CreateStylesOutput } from './types';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { trim$ } from './utils';

function _assignInlineVars(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
): CSSProperties | null {
  const { vars, dynamicScale, values, dynamic } = propertyConfig;

  // Value is a string, ie not responsive
  if (typeof propValue === 'string' || typeof propValue === 'number') {
    const parsedValue = trim$(propValue);
    // If the propValue matches a static value,
    // don't assign any variables
    if (
      values?.[parsedValue] ||
      values?.conditions?.[parsedValue] ||
      !dynamic
    ) {
      return {};
    }
    
    let valueToAssign = dynamicScale?.[parsedValue] ?? `${propValue}`;

    // Account for cases where there may be multiple values (e.g. padding = "$500 $1000")
    if (typeof propValue === 'string' && propValue.split(' ').length > 1) {
      const splitValue = propValue.split(' ');
      valueToAssign = splitValue.reduce((acc, curr) => {
        return `${acc} ${dynamicScale?.[trim$(curr)] ?? `${curr}`}`;
      }, '');
    }
    
    return assignInlineVars({
      [vars.default]: valueToAssign,
    });
  }

  // If no entries, exit gracefully
  if ((propValue && Object.keys(propValue).length < 1) || propValue == null) {
    return {};
  }

  let hasProperty = false;

  const variableAssignments = Object.entries(propValue).reduce(
    (acc: Record<string, string>, [bp, value]) => {
      if (value) {
        const parsedValue = trim$(value);
        if (values?.[parsedValue] || !dynamic) {
          // If value has a static class, don't assign any variables
          return acc;
        }

        let valueToAssign = dynamicScale?.[parsedValue] ?? `${value}`;

        if (typeof value === 'string' && value.split(' ').length > 1) {
          const splitValue = value.split(' ');
          valueToAssign = splitValue.reduce((acc, curr) => {
            return `${acc} ${dynamicScale?.[trim$(curr)] ?? `${curr}`}`;
          }, '');
        }
        hasProperty = true;
        acc[vars.conditions[bp]] = valueToAssign;
      }
      return acc;
    },
    {},
  );

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

export { _assignInlineVars as assignInlineVars };
