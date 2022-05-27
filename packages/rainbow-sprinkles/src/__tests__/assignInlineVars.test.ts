import { CreateStylesOutput } from '../types';
import { assignInlineVars } from '../assignInlineVars';

test('dynamic', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    vars: {
      default: '--mobile',
      conditions: {
        mobile: '--mobile',
        tablet: '--tablet',
        desktop: '--desktop',
      },
    },
    dynamicScale: true,
    name: 'display',
  };

  expect(assignInlineVars(config, 'foo')).toMatchObject({
    '--mobile': 'foo',
  });
  expect(
    assignInlineVars(config, { mobile: 'foo', tablet: 'bar' }),
  ).toMatchObject({
    '--mobile': 'foo',
    '--tablet': 'bar',
  });
});

test('ignores null and undefined prop values', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: 'a',
      conditions: { mobile: 'a', tablet: 'b', desktop: 'c' },
    },
    vars: {
      default: '--mobile',
      conditions: {
        mobile: '--mobile',
        tablet: '--tablet',
        desktop: '--desktop',
      },
    },
    dynamicScale: true,
    name: 'display',
  };

  expect(assignInlineVars(config, null)).toMatchObject({});
  expect(assignInlineVars(config, undefined)).toMatchObject({});
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
    staticScale: {
      block: 'block',
      flex: 'flex',
    },
    name: 'display',
  };

  expect(
    assignInlineVars(config, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toMatchObject({});

  expect(assignInlineVars(config, 'block')).toMatchObject({});
});

test('static and dynamic', () => {
  const config: CreateStylesOutput = {
    dynamic: {
      default: '1',
      conditions: { mobile: '1', tablet: '2', desktop: '3' },
    },
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
    vars: {
      default: '--mobile',
      conditions: {
        mobile: '--mobile',
        tablet: '--tablet',
        desktop: '--desktop',
      },
    },
    staticScale: {
      block: 'block',
      flex: 'flex',
    },
    name: 'display',
  };

  expect(
    assignInlineVars(config, {
      mobile: 'foo',
      tablet: 'flex',
    }),
  ).toMatchObject({ '--mobile': 'foo' });
});
