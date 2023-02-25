import { CreateStylesOutput } from './types';

/**
 * Parses a string for things with '$'
 *
 * (-)? -> optionally captures '-', names it "negated"
 * \B\$           -> capture '$' when preceded by a "non-word" (whitespace, punctuation)
 * ([\w\-.]+)  -> capture the "word" following the '$', including hyphen and period characters
 * /g             -> capture all instances
 */
export const VALUE_REGEX = /(-)?\B\$([\w\-.]+)/g;

export function mapValues<
  Value,
  Obj extends Record<string, Value>,
  Result = Value,
>(
  obj: Obj & Record<string, Value>,
  callback: (value: Value, key: string, object: typeof obj) => Result,
): Record<keyof Obj, Result> {
  const result = {};

  for (const key in obj) {
    Object.assign(result, { [key]: callback(obj[key], key, obj) });
  }

  return result as any;
}

/**
 * Takes a value and replaces all '$' values with the
 * values in the scale, if available
 *
 * Returns false if parsed value is in staticScale
 */
export function replaceVarsInValue(
  propValue: string,
  dynamicScale: CreateStylesOutput['dynamicScale'],
  staticScale?: CreateStylesOutput['staticScale'],
) {
  if (Array.isArray(staticScale) && staticScale.indexOf(propValue) > -1) {
    return false;
  }

  let foundStatic = false;
  const parsed = propValue.replace(VALUE_REGEX, (match, ...args) => {
    const [negated, token] = args;
    const v = `${negated ? '-' : ''}${token}`;
    if (staticScale?.[v]) {
      foundStatic = true;
      return match;
    }
    if (dynamicScale?.[v]) {
      return dynamicScale[v];
    }
    return match;
  });
  return foundStatic ? false : parsed;
}

/**
 * Takes a value and replaces all '$' values with the
 * values in the scale, if available
 */
export function getValueConfig(
  propValue: string,
  scale: CreateStylesOutput['values'],
): CreateStylesOutput['values'][keyof CreateStylesOutput['values']] | null {
  let match: RegExpExecArray | null;
  const parsed: string[] = [];
  while ((match = VALUE_REGEX.exec(propValue))) {
    parsed.push(...match.slice(1));
  }
  if (parsed.length === 2) {
    const [negated, token] = parsed;
    const v = `${negated ? '-' : ''}${token}`;
    if (v in scale) {
      return scale[v];
    }
  }
  return null;
}
