import type { CreateStaticStylesOutput } from './createStaticStyles';
import type { CreateStylesOutput } from './createStyles';
import type { BaseConditions } from './types';

export function assignClasses<Conditions extends BaseConditions>(
  propertyConfig: CreateStylesOutput<Conditions> &
    CreateStaticStylesOutput<Conditions>,
  defaultCondition: keyof Conditions,
  prop: unknown,
): string {
  if (!prop) {
    return '';
  }

  const { classes, name: propName } = propertyConfig;

  // Value is a string or number, ie not responsive
  if (typeof prop === 'string') {
    // Check for static value first
    if (classes[prop]) {
      return classes[prop][defaultCondition];
    }
    if (classes.dynamic) {
      return classes.dynamic[defaultCondition];
    }
    // If the property is not dynamic, and unrecognized value is provided
    // Quietly warn
    // eslint-disable-next-line no-console
    console.error(
      `Homebase: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
        classes,
      )
        .map((className) => `"${className}"`)
        .join(', ')}. Received: ${JSON.stringify(prop)}.`,
    );
    return '';
  }

  const propObj = prop as { [k in keyof Conditions]: string };
  const keys = Object.keys(propObj);

  // If no entries, exit gracefully
  if (keys.length < 1) {
    return '';
  }

  const className = keys
    .map((bp) => {
      const valueAtBp = propObj[bp];
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
        `Homebase: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
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
