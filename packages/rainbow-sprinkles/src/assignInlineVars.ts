import { CSSProperties, CreateStylesOutput } from './types';
import { assignInlineVars } from '@vanilla-extract/dynamic';

function _assignInlineVars(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
  cache: Map<number | string, string>,
): CSSProperties | null {
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
      parsedValue = replaceVars(`${propValue}`, dynamicScale);
      cache.set(propValue, parsedValue);
    }

    // If the propValue matches a static value,
    // don't assign any variables
    if (values?.[parsedValue] || values?.conditions?.[parsedValue]) {
      return {};
    }

    const result = assignInlineVars({
      [vars.default]: parsedValue,
    });
    return result;
  }

  // If no entries, exit gracefully
  if ((propValue && Object.keys(propValue).length < 1) || propValue == null) {
    return {};
  }

  let hasProperty = false;

  const variableAssignments = Object.entries(
    propValue as Record<string | number, string>,
  ).reduce((acc: Record<string, string>, [bp, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      let parsedValue: string;
      if (cache.has(value)) {
        parsedValue = cache.get(value);
      } else {
        parsedValue = replaceVars(`${value}`, dynamicScale);
        cache.set(value, parsedValue);
      }

      if (values && parsedValue in values) {
        // If value has a static class, don't assign any variables
        return acc;
      }

      hasProperty = true;
      acc[vars.conditions[bp]] = parsedValue;
    }

    return acc;
  }, {});

  return hasProperty ? assignInlineVars(variableAssignments) : {};
}

/**
 * Parses a string for things with '$'
 *
 * (?<negated>-)? -> optionally captures '-', names it "negated"
 * \B\$           -> capture '$' when preceded by a "non-word" (whitespace, punctuation)
 * (?<token>\w+)  -> capture the "word" following the '$'
 * /g             -> capture all instances
 */
const REG = /(?<negated>-)?\B\$(?<token>\w+)/g;

/**
 * Takes a value and replaces all '$' values with the
 * values in the scale, if available
 */
export function replaceVars(
  propValue: string,
  scale: CreateStylesOutput['dynamicScale'],
) {
  if (process.env.NODE_ENV === 'test') {
    globalThis.replaceVarsCallback?.();
  }
  const parsed = propValue.replace(REG, (match, ...args) => {
    const { negated, token }: { negated?: '-'; token?: string } = args.at(-1);
    const v = `${negated ? '-' : ''}${token}`;
    if (scale?.[v]) {
      return scale[v];
    }
    return match;
  });
  return parsed;
}

export { _assignInlineVars as assignInlineVars };
