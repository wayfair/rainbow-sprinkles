export function extractSprinklesFromProps(
  props: Record<string, any>,
  systemProperties: Set<string>,
) {
  const systemProps: Record<string, unknown> = {};
  const otherProps: Record<string, unknown> = {};

  for (const key in props) {
    if (systemProperties.has(key)) {
      systemProps[key] = props[key];
    } else {
      otherProps[key] = props[key];
    }
  }

  return { systemProps, otherProps };
}

export function factoryExtractSprinklesFromProps(
  systemProperties: Set<string>,
) {
  return (props: Record<string, any>) =>
    extractSprinklesFromProps(props, systemProperties);
}
