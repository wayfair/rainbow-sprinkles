const VALUE_REGEX = /^\$(\w*)/;

export function parseValue(rawValue: string, scale?: Record<string, string>) {
  const matches = rawValue.match(VALUE_REGEX);
  const value = matches?.[1] || rawValue;
  return scale?.[value] || value;
}
