// eslint-disable-next-line import/no-extraneous-dependencies
import { style } from '@vanilla-extract/css';
import type {
  BaseConditions,
  CSSProperties,
  ConfigStaticProperties,
  CreateStylesOutput,
} from './types';
import merge from 'lodash.merge';

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [Prop: string]: {
    [k in keyof Conditions | 'default']: string;
  };
};

function generateRules(
  property: string,
  value: string,
  conditions?: [string, string],
) {
  const [conditionType, condition] = conditions || [];
  if (condition && conditionType) {
    return {
      [conditionType]: { [condition]: { [property]: value } },
    };
  } else {
    return { [property]: value };
  }
}

export function createStaticStyles<
  Conditions extends BaseConditions,
  CSSProperty extends keyof CSSProperties = keyof CSSProperties,
>(
  property: CSSProperty,
  scale: ConfigStaticProperties[CSSProperty],
  conditions: Conditions,
  defaultCondition: keyof Conditions,
): CreateStylesOutput<Conditions, CSSProperty> {
  const classes: any = {};

  let propertyOptions = scale;
  if (Array.isArray(scale)) {
    propertyOptions = scale.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr] = curr;
      return acc;
    }, {});
  }

  for (const propertyOption in propertyOptions) {
    const config = classes[propertyOption] || {};
    for (const conditionName in conditions) {
      if (Object.keys(conditions[conditionName]).length < 1) {
        merge(config, {
          [conditionName]: style(
            generateRules(
              property,
              propertyOptions[propertyOption] as unknown as string,
            ),
            process.env.NODE_ENV === 'test'
              ? `${property}-${propertyOption}-${conditionName}`
              : undefined,
          ),
        });
        continue;
      }
      for (const conditionType in conditions[conditionName]) {
        const condition = conditions[conditionName][conditionType];
        if (typeof condition === 'string') {
          merge(config, {
            [conditionName]: style(
              generateRules(
                property,
                propertyOptions[propertyOption] as unknown as string,
                [conditionType, condition],
              ),
              process.env.NODE_ENV === 'test'
                ? `${property}-${propertyOption}-${conditionName}`
                : undefined,
            ),
          });
        }
      }
    }
    Object.assign(classes, {
      [propertyOption]: { ...config, default: config[defaultCondition] },
    });
  }

  return { values: classes, name: property, scale };
}

export type CreateStaticStyles = typeof createStaticStyles;
