import type { CreateStylesOutput } from '../types';
import { assignClasses } from '../assignClasses';
import * as utils from '../utils';

let fn = assignClasses as (
  ...args: [
    Parameters<typeof assignClasses>[0],
    Parameters<typeof assignClasses>[1],
  ]
) => ReturnType<typeof assignClasses>;

beforeEach(() => {
  // Create a new cache for each test
  fn = (...args) => assignClasses(...args, new Map());
});

test('dynamic', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    name: 'display',
    vars: {
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
      default: 'a',
    },
  };

  expect(
    fn(config, {
      mobile: 'foo',
      tablet: 'bar',
    }),
  ).toBe('a b');

  expect(fn(config, 'foo')).toBe('a');
});

test('static', () => {
  const config: CreateStylesOutput = {
    values: {
      block: {
        default: 'a',
        conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
      },
      flex: {
        default: 'x',
        conditions: { mobile: 'x', tablet: 'y', desktop: 'z' },
      },
    },
    name: 'display',
    staticScale: ['block', 'flex'],
  };

  expect(
    fn(config, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toBe('a y');

  expect(fn(config, 'block')).toBe('a');
});

test('static and dynamic', () => {
  const config: CreateStylesOutput = {
    vars: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    dynamic: {
      default: '1',
      conditions: { mobile: '1', tablet: '2', desktop: '3' },
    },
    values: {
      primary: {
        default: 'a',
        conditions: {
          mobile: 'a',
          tablet: 'b',
          desktop: 'c',
        },
      },
      secondary: {
        default: 'x',
        conditions: {
          mobile: 'x',
          tablet: 'y',
          desktop: 'z',
        },
      },
    },
    name: 'color',
    staticScale: {
      primary: 'color1',
      secondary: 'color2',
    },
  };

  // Apply dynamic class and static classes correctly
  expect(
    fn(config, {
      mobile: 'foo',
      tablet: '$primary',
      desktop: '$secondary',
    }),
  ).toBe('1 b z');

  // All non-configured values apply dynamic classes
  expect(
    fn(config, {
      mobile: 'foo',
      tablet: 'primary',
      desktop: 'secondary',
    }),
  ).toBe('1 2 3');
});

test('supports number values', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    name: 'lineHeight',
    vars: {
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
      default: 'a',
    },
  };

  expect(
    fn(config, {
      mobile: 1,
      tablet: 3,
    }),
  ).toBe('a b');

  expect(fn(config, 'foo')).toBe('a');
});

test('supports 0 values', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    name: 'flexShrink',
    vars: {
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
      default: 'a',
    },
  };

  expect(
    fn(config, {
      mobile: 0,
      tablet: 1,
    }),
  ).toBe('a b');

  expect(fn(config, 0)).toBe('a');
});

test('caching', () => {
  const spy = jest.spyOn(utils, 'getValueConfig');
  const config: CreateStylesOutput = {
    vars: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    dynamic: {
      default: '1',
      conditions: { mobile: '1', tablet: '2', desktop: '3' },
    },
    values: {
      primary: {
        default: 'a',
        conditions: {
          mobile: 'a',
          tablet: 'b',
          desktop: 'c',
        },
      },
      secondary: {
        default: 'x',
        conditions: {
          mobile: 'x',
          tablet: 'y',
          desktop: 'z',
        },
      },
    },
    name: 'color',
    staticScale: {
      primary: 'color1',
      secondary: 'color2',
    },
  };

  const cache = new Map();

  assignClasses(config, '$primary', cache);
  assignClasses(config, '$primary', cache);
  assignClasses(config, '$secondary', cache);
  assignClasses(config, '$secondary', cache);

  expect(spy).toHaveBeenCalledTimes(2);

  assignClasses(config, { mobile: '$primary', desktop: '$secondary' }, cache);
  expect(spy).toHaveBeenCalledTimes(4);
  assignClasses(config, { mobile: '$primary', desktop: '$secondary' }, cache);
  expect(spy).toHaveBeenCalledTimes(4);

  assignClasses(config, { mobile: '$secondary', desktop: '$primary' }, cache);
  expect(spy).toHaveBeenCalledTimes(6);

  spy.mockRestore();
});
