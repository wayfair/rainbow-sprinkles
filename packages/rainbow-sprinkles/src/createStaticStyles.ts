import { style } from '@vanilla-extract/css';
import type {
  BaseConditions,
  ConfigStaticProperties,
  CSSProperties,
} from './types';
import merge from 'lodash.merge';

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [Prop: string]: {
    [k in keyof Conditions]: string;
  };
};

export type CreateStaticStylesOutput<Conditions extends BaseConditions> = {
  classes: BaseConditionMap<Conditions>;
  name: string;
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
): CreateStaticStylesOutput<Conditions> {
  type ConditionMap = Partial<BaseConditionMap<Conditions>>;

  const partialClasses: ConditionMap = {};

  let propertyOptions = scale;
  if (Array.isArray(scale)) {
    propertyOptions = scale.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr] = curr;
      return acc;
    }, {});
  }

  for (const propertyOption in propertyOptions) {
    const config = partialClasses[propertyOption] || {};
    for (const conditionName in conditions) {
      if (Object.keys(conditions[conditionName]).length < 1) {
        merge(config, {
          [conditionName]: style(
            generateRules(
              property,
              propertyOptions[propertyOption] as unknown as string,
            ),
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
            ),
          });
        }
      }
    }
    Object.assign(partialClasses, { [propertyOption]: config });
  }

  const classes = partialClasses as BaseConditionMap<Conditions>;

  return { classes, name: property };
}

export type CreateStaticStyles = typeof createStaticStyles;
