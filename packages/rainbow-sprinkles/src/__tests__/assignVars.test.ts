import { CreateStylesOutput } from '../types';
import { createAssignVars } from '../assignVars';
import * as utils from '../utils';

const fn: ReturnType<typeof createAssignVars> = (propertyConfig, propValue) => {
  const result = {};
  const fn = createAssignVars(result, new Map());
  fn(propertyConfig, propValue);
  return result;
};

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
    '--mobile': 'foo',
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
      desktop: '$block',
    }),
  ).toEqual({ '--mobile': 'foo', '--tablet': 'flex' });

  expect(fn(config, 'block')).toEqual({ '--mobile': 'block' });
  expect(fn(config, '$block')).toEqual({});
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
    '--mobile': '2',
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

  const fn = createAssignVars({}, new Map());

  fn(config, 'block');
  fn(config, 'block');
  fn(config, 'inline-block');
  fn(config, 'inline-block');

  expect(spy).toHaveBeenCalledTimes(2);

  fn(config, { mobile: 'block', desktop: 'flex' });
  // An additional for 'flex'
  expect(spy).toHaveBeenCalledTimes(3);

  fn(config, { mobile: 'block', desktop: 'flex' });
  expect(spy).toHaveBeenCalledTimes(3);

  fn(config, {
    mobile: 'block',
    tablet: 'block',
    desktop: 'flex',
  });
  expect(spy).toHaveBeenCalledTimes(3);
  spy.mockRestore();
});
