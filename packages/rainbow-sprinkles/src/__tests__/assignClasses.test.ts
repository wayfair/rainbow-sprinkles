import type { CreateStylesOutput } from '../types';
import { assignClasses } from '../assignClasses';

const fn = (
  ...args: [
    Parameters<typeof assignClasses>[0],
    Parameters<typeof assignClasses>[1],
  ]
) => assignClasses(...args, new Map());

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

  expect(
    fn(config, {
      mobile: 'foo',
      tablet: 'primary',
      desktop: 'secondary',
    }),
  ).toBe('1 b z');
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
