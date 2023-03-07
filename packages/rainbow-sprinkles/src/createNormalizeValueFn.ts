import { DefinePropertiesReturn } from './types';

export function createNormalizeValueFn<
  Configs extends ReadonlyArray<DefinePropertiesReturn>,
>(...configs: Configs) {
  const normalizeValueFn = (property: string, value: any) => {
    if (Array.isArray(value)) {
      const config = configs.find((c) => property in c.config);
      if (!config || !config.responsiveArray) {
        return value;
      }

      let lastValue: typeof value;
      return config.responsiveArray.reduce(
        (acc, key, index) => {
          const currentValue = value[index];

          if (currentValue !== undefined && currentValue !== null) {
            lastValue = currentValue;
          }

          acc[key] = lastValue;

          return acc;
        },
        {} as {
          [key in typeof config.responsiveArray[number]]: typeof value[number];
        },
      );
    }

    return value;
  };

  return normalizeValueFn;
}
