const VALUE_REGEX = /^\$(\w*)/;

export function parseValue(rawValue: string, scale?: {} | boolean) {
  if (typeof scale === 'boolean' || !scale) {
    return rawValue;
  }

  const matches = rawValue.match(VALUE_REGEX);
  const foundValue = matches?.[1];
  console.log({ rawValue, foundValue, scale, finalValue: scale?.[foundValue] });
  return scale?.[foundValue] ?? rawValue;
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
