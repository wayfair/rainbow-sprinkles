import { CreateStylesOutput } from '../types';
import { replaceVarsInValue, getValueConfig } from '../utils';

test('replaceVarsInValue', () => {
  const scale = {
    '-1x': '-5px',
    '-2x': '-10px',
    '-3x': '-15px',
    none: '0',
    '1x': '5px',
    '2x': '10px',
    '3x': '15px',
  };

  const run = (v: string) => replaceVarsInValue(v, scale);

  expect(run('1x')).toBe('1x');
  expect(run('$1x')).toBe(scale['1x']);
  expect(run('-$2x')).toBe(scale['-2x']);
  expect(run('$1x -$2x')).toBe(`${scale['1x']} ${scale['-2x']}`);
  expect(run('-$1x $2x')).toBe(`${scale['-1x']} ${scale['2x']}`);
  expect(run('-1x 2x')).toBe('-1x 2x');
  expect(run('calc(100% - $2x)')).toBe(`calc(100% - ${scale['2x']})`);
  expect(run('calc($3x - $2x)')).toBe(`calc(${scale['3x']} - ${scale['2x']})`);
});

test('getValueConfig', () => {
  const scale: CreateStylesOutput['values'] = {
    '1x': {
      default: 'a',
      conditions: {
        mobile: 'a',
        tablet: 'b',
        desktop: 'c',
      },
    },
    '2x': {
      default: 'x',
      conditions: {
        mobile: 'x',
        tablet: 'y',
        desktop: 'z',
      },
    },
    '-1x': {
      default: 'd',
      conditions: {
        mobile: 'd',
        tablet: 'e',
        desktop: 'f',
      },
    },
  };

  const run = (v: string) => getValueConfig(v, scale);

  expect(run('$1x')).toBe(scale['1x']);
  expect(run('$2x')).toBe(scale['2x']);
  expect(run('-$1x')).toBe(scale['-1x']);
  expect(run('1x')).toBe(null);
  expect(run('-1x')).toBe(null);
  expect(run('')).toBe(null);
  expect(run('$1x -$2x')).toBe(null);
});
