import { CreateStylesOutput } from '../types';
import { assignInlineVars, replaceVars } from '../assignInlineVars';

const fn = (
  ...args: [
    Parameters<typeof assignInlineVars>[0],
    Parameters<typeof assignInlineVars>[1],
  ]
) => assignInlineVars(...args, new Map());

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
    '--mobile': '2',
  });
  expect(fn(config, { mobile: 1, tablet: 3 })).toEqual({
    '--mobile': '1',
    '--tablet': '3',
  });
});

test('replaceVars', () => {
  const scale = {
    '-1x': '-5px',
    '-2x': '-10px',
    '-3x': '-15px',
    none: '0',
    '1x': '5px',
    '2x': '10px',
    '3x': '15px',
  };

  const run = (v: string) => replaceVars(v, scale);

  expect(run('1x')).toBe('1x');
  expect(run('$1x')).toBe(scale['1x']);
  expect(run('-$2x')).toBe(scale['-2x']);
  expect(run('$1x -$2x')).toBe(`${scale['1x']} ${scale['-2x']}`);
  expect(run('-$1x $2x')).toBe(`${scale['-1x']} ${scale['2x']}`);
  expect(run('-1x 2x')).toBe('-1x 2x');
  expect(run('calc(100% - $2x)')).toBe(`calc(100% - ${scale['2x']})`);
  expect(run('calc($3x - $2x)')).toBe(`calc(${scale['3x']} - ${scale['2x']})`);
});
