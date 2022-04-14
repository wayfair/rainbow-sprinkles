import { createVar, style } from '@vanilla-extract/css';
import type {
  BaseConditions,
  CSSProperties,
  ConfigDynamicProperties,
} from './types';

export type BaseConditionMap<Conditions extends BaseConditions> = {
  [k in keyof Conditions]: string;
};

export type CreateStylesOutput<
  Conditions extends BaseConditions,
  Property extends keyof CSSProperties = keyof CSSProperties,
> = {
  classes: { dynamic: BaseConditionMap<Conditions> };
  vars: BaseConditionMap<Conditions>;
  name: Property;
  scale: ConfigDynamicProperties[Property];
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
          ),
        });
      }
    }
  }

  const classes = partialClasses as BaseConditionMap<Conditions>;

  return { classes: { dynamic: classes }, name: property, vars, scale };
}

export type CreateStyles = typeof createStyles;
