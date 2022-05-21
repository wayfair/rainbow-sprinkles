export function extractSprinklesFromProps(
  props: Record<string, any>,
  configProperties: Set<string>,
) {
  const sprinkles: Record<string, unknown> = {};
  const otherProps: Record<string, unknown> = {};

  for (const key in props) {
    if (configProperties.has(key)) {
      sprinkles[key] = props[key];
    } else {
      otherProps[key] = props[key];
    }
  }

  return { sprinkles, otherProps };
}

export function createExtractSprinklesFromProps(configProperties: Set<string>) {
  return (props: Record<string, any>) =>
    extractSprinklesFromProps(props, configProperties);
}
