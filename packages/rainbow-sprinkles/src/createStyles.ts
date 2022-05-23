import { createVar, style } from '@vanilla-extract/css';
import type {
  BaseConditions,
  CSSProperties,
  ConfigDynamicProperties,
  CreateStylesOutput,
} from './types';

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [k in keyof Conditions]: string;
};

function generateRules(
  property: string,
  cssVariable: string,
  conditions?: [string, string],
) {
  const [conditionType, condition] = conditions || [];
  if (condition && conditionType) {
    return {
      [conditionType]: { [condition]: { [property]: cssVariable } },
    };
  } else {
    return { [property]: cssVariable };
  }
}

export function createStyles<
  Conditions extends BaseConditions,
  Property extends keyof CSSProperties = keyof CSSProperties,
>(
  property: Property,
  scale: ConfigDynamicProperties[Property],
  conditions: Conditions,
): CreateStylesOutput<Conditions, Property> {
  type ConditionMap = Partial<BaseConditionMap<Conditions>>;

  const partialVars: ConditionMap = {};
  for (const conditionName in conditions) {
    Object.assign(partialVars, {
      [conditionName]: createVar(`${property}-${conditionName}`),
    });
  }

  const vars = partialVars as BaseConditionMap<Conditions>;

  const partialClasses: ConditionMap = {};

  for (const conditionName in conditions) {
    if (Object.keys(conditions[conditionName]).length < 1) {
      Object.assign(partialClasses, {
        [conditionName]: style(
          generateRules(property, vars[conditionName] as string),
          process.env.NODE_ENV === 'test'
            ? `${property}-${conditionName}`
            : undefined,
        ),
      });
      continue;
    }
    for (const conditionType in conditions[conditionName]) {
      const condition = conditions[conditionName][conditionType];
      if (typeof condition === 'string') {
        Object.assign(partialClasses, {
          [conditionName]: style(
            generateRules(property, vars[conditionName] as string, [
              conditionType,
              condition,
            ]),
            process.env.NODE_ENV === 'test'
              ? `${property}-${conditionName}`
              : undefined,
          ),
        });
      }
    }
  }

  const result: CreateStylesOutput<Conditions, Property> = {
    classes: { dynamic: partialClasses as BaseConditionMap<Conditions> },
    name: property,
    vars,
  };

  if (typeof scale === 'object') {
    result.scale = scale;
  }

  return result;
}

export type CreateStyles = typeof createStyles;
