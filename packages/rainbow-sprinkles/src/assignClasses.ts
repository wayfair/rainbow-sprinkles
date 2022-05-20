import type { CreateStaticStylesOutput } from './createStaticStyles';
import type { CreateStylesOutput } from './createStyles';
import type { BaseConditions } from './types';
import { parseValue } from './utils';

export function assignClasses<Conditions extends BaseConditions>(
  propertyConfig: CreateStylesOutput<Conditions> &
    CreateStaticStylesOutput<Conditions>,
  defaultCondition: keyof Conditions,
  propValue: unknown,
): string {
  if (!propValue) {
    return '';
  }

  const { classes, name: propName } = propertyConfig;

  // Value is a string or number, ie not responsive
  if (typeof propValue === 'string') {
    const value = parseValue(propValue);
    // Check for static value first
    if (classes[value]) {
      return classes[propValue][defaultCondition];
    }
    if (classes.dynamic) {
      return classes.dynamic[defaultCondition];
    }
    // If the property is not dynamic, and unrecognized value is provided
    // Quietly warn
    // eslint-disable-next-line no-console
    console.error(
      `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
        classes,
      )
        .map((className) => `"${className}"`)
        .join(', ')}. Received: ${JSON.stringify(propValue)}.`,
    );
    return '';
  }

  const propObj = propValue as { [k in keyof Conditions]: string };
  const keys = Object.keys(propObj);

  // If no entries, exit gracefully
  if (keys.length < 1) {
    return '';
  }

  const className = keys
    .map((bp) => {
      const rawValueAtBp = propObj[bp];
      const valueAtBp = parseValue(rawValueAtBp);
      // Check for static value first
      if (classes[valueAtBp]) {
        return classes[valueAtBp][bp];
      }
      if (classes.dynamic) {
        return classes.dynamic[bp];
      }
      // If the property is not dynamic, and unrecognized value is provided
      // Quietly warn
      // eslint-disable-next-line no-console
      console.error(
        `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
          classes,
        )
          .map((className) => `"${className}"`)
          .join(', ')}. Received: ${JSON.stringify(valueAtBp)}.`,
      );
      return null;
    })
    .filter(Boolean);

  return className.join(' ').trim();
}
