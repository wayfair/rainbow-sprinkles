import type { BaseConditions, CreateStylesOutput } from '../types';
import { assignClasses } from '../assignClasses';

interface Conditions extends BaseConditions {
  mobile: { '@media': 'foo' };
  tablet: { '@media': 'foo' };
  desktop: { '@media': 'foo' };
}
const DEFAULT_CONDITION: keyof Conditions = 'mobile';

const makeConfig = (classes): CreateStylesOutput<Conditions> => ({
  classes,
  name: 'display',
  vars: { mobile: 'a', tablet: 'b', desktop: 'c' },
  scale: true,
});

test('dynamic', () => {
  const config: CreateStylesOutput<Conditions> = {
    classes: {
      dynamic: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    name: 'display',
    vars: { mobile: 'a', tablet: 'b', desktop: 'c' },
  };

  expect(
    assignClasses<Conditions>(config, DEFAULT_CONDITION, {
      mobile: 'foo',
      tablet: 'bar',
    }),
  ).toBe('a b');

  expect(assignClasses<Conditions>(config, DEFAULT_CONDITION, 'foo')).toBe('a');
});

test('static', () => {
  const config: CreateStylesOutput<Conditions> = {
    classes: {
      block: {
        mobile: 'a',
        tablet: 'b',
        desktop: 'c',
      },
      flex: {
        mobile: 'x',
        tablet: 'y',
        desktop: 'z',
      },
    },
    name: 'display',
  };

  expect(
    assignClasses<Conditions>(config, DEFAULT_CONDITION, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toBe('a y');

  expect(assignClasses<Conditions>(config, DEFAULT_CONDITION, 'block')).toBe(
    'a',
  );
});

test('static and dynamic', () => {
  const config: CreateStylesOutput<Conditions> = {
    vars: { mobile: 'a', tablet: 'b', desktop: 'c' },
    classes: {
      dynamic: {
        mobile: '1',
        tablet: '2',
        desktop: '3',
      },
      primary: {
        mobile: 'a',
        tablet: 'b',
        desktop: 'c',
      },
      secondary: {
        mobile: 'x',
        tablet: 'y',
        desktop: 'z',
      },
    },
    name: 'color',
    scale: {
      primary: 'color1',
      secondary: 'color2',
    },
  };

  expect(
    assignClasses<Conditions>(config, DEFAULT_CONDITION, {
      mobile: 'foo',
      tablet: 'primary',
      desktop: 'secondary',
    }),
  ).toBe('1 b z');
});
