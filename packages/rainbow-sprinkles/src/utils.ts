export function mapValues<
  Value,
  Obj extends Record<string, Value>,
  Result = Value,
>(
  obj: Obj & Record<string, Value>,
  callback: (value: Value, key: string) => Result,
): Record<keyof Obj, Result> {
  const result = {};

  for (const key in obj) {
    Object.assign(result, { [key]: callback(obj[key], key) });
  }

  return result as any;
}
