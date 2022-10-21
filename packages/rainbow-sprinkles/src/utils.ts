const VALUE_REGEX = /(-)?\$(\w*)/;

export function trim$(rawValue: string | number): string {
  if (typeof rawValue === 'number') {
    return `${rawValue}`;
  }
  const matches = rawValue.match(VALUE_REGEX);
  if (matches) {
    return (matches[1] ?? '').concat(matches[2]);
  }
  return rawValue;
}

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
