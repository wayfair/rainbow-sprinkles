import { CreateStylesOutput } from '../types';
import { assignVars } from '../assignVars';
import * as utils from '../utils';

let fn = assignVars as (
  ...args: [Parameters<typeof assignVars>[0], Parameters<typeof assignVars>[1]]
) => ReturnType<typeof assignVars>;

beforeEach(() => {
  // Create a new cache for each test
  fn = (...args) => assignVars(...args, new Map());
});

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

  expect(fn(config, 'foo')).toEqual({
    display: 'foo',
  });
  expect(fn(config, { mobile: 'foo', tablet: 'bar' })).toEqual({
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

  expect(fn(config, null)).toEqual({});
  expect(fn(config, undefined)).toEqual({});
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
    fn(config, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toEqual({});

  expect(fn(config, 'block')).toEqual({});
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
    fn(config, {
      mobile: 'foo',
      tablet: 'flex',
    }),
  ).toEqual({ '--mobile': 'foo' });

  expect(fn(config, 'block')).toEqual({});
});

test('supports number values', () => {
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
    name: 'lineHeight',
  };

  expect(fn(config, 2)).toEqual({
    lineHeight: '2',
  });
  expect(fn(config, { mobile: 1, tablet: 3 })).toEqual({
    '--mobile': '1',
    '--tablet': '3',
  });
});

test('caching', () => {
  const spy = jest.spyOn(utils, 'replaceVarsInValue');
  const config: CreateStylesOutput = {
    dynamic: {
      default: '1',
      conditions: { mobile: '1', tablet: '2', desktop: '3' },
    },
    vars: {
      default: '--mobile',
      conditions: {
        mobile: '--mobile',
        tablet: '--tablet',
        desktop: '--desktop',
      },
    },
    name: 'display',
  };

  const cache = new Map();

  assignVars(config, 'block', cache);
  assignVars(config, 'block', cache);
  assignVars(config, 'inline-block', cache);
  assignVars(config, 'inline-block', cache);

  expect(spy).toHaveBeenCalledTimes(2);

  assignVars(config, { mobile: 'block', desktop: 'flex' }, cache);
  // An additional for 'flex'
  expect(spy).toHaveBeenCalledTimes(3);

  assignVars(config, { mobile: 'block', desktop: 'flex' }, cache);
  expect(spy).toHaveBeenCalledTimes(3);

  assignVars(
    config,
    { mobile: 'block', tablet: 'block', desktop: 'flex' },
    cache,
  );
  expect(spy).toHaveBeenCalledTimes(3);
  spy.mockRestore();
});
