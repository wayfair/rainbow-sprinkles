import type { CreateStylesOutput } from '../types';
import { assignClasses } from '../assignClasses';

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
    assignClasses(config, {
      mobile: 'foo',
      tablet: 'bar',
    }),
  ).toBe('a b');

  expect(assignClasses(config, 'foo')).toBe('a');
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
    assignClasses(config, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toBe('a y');

  expect(assignClasses(config, 'block')).toBe('a');
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
    assignClasses(config, {
      mobile: 'foo',
      tablet: 'primary',
      desktop: 'secondary',
    }),
  ).toBe('1 b z');
});
