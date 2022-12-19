import { CreateStylesOutput } from './types';

/**
 * Parses a string for things with '$'
 *
 * (?<negated>-)? -> optionally captures '-', names it "negated"
 * \B\$           -> capture '$' when preceded by a "non-word" (whitespace, punctuation)
 * (?<token>\w+)  -> capture the "word" following the '$'
 * /g             -> capture all instances
 */
export const VALUE_REGEX = /(?<negated>-)?\B\$(?<token>\w+)/g;

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
 */
export function replaceVarsInValue(
  propValue: string,
  scale: CreateStylesOutput['dynamicScale'],
) {
  const parsed = propValue.replace(VALUE_REGEX, (match, ...args) => {
    const { negated, token }: { negated?: '-'; token?: string } =
      args[args.length - 1];
    const v = `${negated ? '-' : ''}${token}`;
    if (scale?.[v]) {
      return scale[v];
    }
    return match;
  });
  return parsed;
}

/**
 * Takes a value and replaces all '$' values with the
 * values in the scale, if available
 */
export function getValueConfig(
  propValue: string,
  scale: CreateStylesOutput['values'],
): CreateStylesOutput['values'][keyof CreateStylesOutput['values']] | null {
  const parsed = [...propValue.matchAll(VALUE_REGEX)];
  if (parsed.length === 1) {
    const { negated, token }: { negated?: '-'; token?: string } =
      parsed[0].groups;
    const v = `${negated ? '-' : ''}${token}`;
    if (v in scale) {
      return scale[v];
    }
  }
  return null;
}
