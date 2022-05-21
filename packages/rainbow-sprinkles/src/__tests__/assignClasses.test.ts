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
  const config = makeConfig({
    dynamic: { mobile: 'a', tablet: 'b', desktop: 'c' },
  });

  expect(
    assignClasses<Conditions>(config, DEFAULT_CONDITION, {
      mobile: 'foo',
      tablet: 'bar',
    }),
  ).toBe('a b');

  expect(assignClasses<Conditions>(config, DEFAULT_CONDITION, 'foo')).toBe('a');
});

test('static', () => {
  const config = makeConfig({
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
  });

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
  const config = makeConfig({
    dynamic: {
      mobile: '1',
      tablet: '2',
      desktop: '3',
    },
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
  });
  expect(
    assignClasses<Conditions>(config, DEFAULT_CONDITION, {
      mobile: 'foo',
      tablet: 'flex',
    }),
  ).toBe('1 y');
});
