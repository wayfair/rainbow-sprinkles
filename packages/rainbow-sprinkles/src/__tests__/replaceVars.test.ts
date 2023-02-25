import { CreateStylesOutput } from '../types';
import { replaceVarsInValue, getValueConfig } from '../utils';

describe('replaceVarsInValue', () => {
  test('dynamic scale only', () => {
    const scale = {
      '-1x': '-5px',
      '-2x': '-10px',
      '-3x': '-15px',
      none: '0',
      '1x': '5px',
      '2x': '10px',
      '3x': '15px',
      'gray-500': '#6b7280',
      'gray.500': '#6b7280',
    };

    const run = (v: string) => replaceVarsInValue(v, scale);

    expect(run('1x')).toBe('1x');
    expect(run('$1x')).toBe(scale['1x']);
    expect(run('-$2x')).toBe(scale['-2x']);
    expect(run('$1x -$2x')).toBe(`${scale['1x']} ${scale['-2x']}`);
    expect(run('-$1x $2x')).toBe(`${scale['-1x']} ${scale['2x']}`);
    expect(run('-1x 2x')).toBe('-1x 2x');
    expect(run('calc(100% - $2x)')).toBe(`calc(100% - ${scale['2x']})`);
    expect(run('calc($3x - $2x)')).toBe(
      `calc(${scale['3x']} - ${scale['2x']})`,
    );
    expect(run('$gray-500')).toBe(scale['gray-500']);
    expect(run('$gray.500')).toBe(scale['gray.500']);
  });

  test('dynamic scale and static scale as object', () => {
    const dynamicScale = {
      '-1x': '-5px',
      '1x': '5px',
      'gray-500': '#6b7280',
      'gray.500': '#6b7280',
    };
    const staticScale = {
      '-2x': '-10px',
      '-3x': '-15px',
      '2x': '10px',
      '3x': '15px',
      none: '0',
    };

    const run = (v: string) => replaceVarsInValue(v, dynamicScale, staticScale);

    expect(run('1x')).toBe('1x');
    expect(run('$1x')).toBe(dynamicScale['1x']);
    expect(run('-$1x')).toBe(dynamicScale['-1x']);
    expect(run('$2x')).toBe(false);
    expect(run('-$2x')).toBe(false);
    expect(run('$1x -$2x')).toBe(false);
    expect(run('-$1x $2x')).toBe(false);
    expect(run('-1x 2x')).toBe('-1x 2x');
    expect(run('calc(100% - $2x)')).toBe(false);
    expect(run('calc($3x - $2x)')).toBe(false);
    expect(run('$gray-500')).toBe(dynamicScale['gray-500']);
    expect(run('$gray.500')).toBe(dynamicScale['gray.500']);
  });

  test('dynamic scale and static scale as array', () => {
    const dynamicScale = {
      small: '2px',
      medium: '6px',
      large: '10px',
    };
    const staticScale = ['4px', '8px', '12px'];

    const run = (v: string) => replaceVarsInValue(v, dynamicScale, staticScale);

    expect(run('small')).toBe('small');
    expect(run('$small')).toBe(dynamicScale.small);

    expect(run('4px')).toBe(false);
    expect(run('$4px')).toBe('$4px');

    expect(run('-$small')).toBe('-$small');
    expect(run('-4px')).toBe('-4px');

    expect(run('$small 4px')).toBe(`${dynamicScale.small} 4px`);
  });
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
    'gray-500': {
      default: 'light',
      conditions: {
        light: 'light',
        dark: 'dark',
      },
    },
    'gray.500': {
      default: 'light',
      conditions: {
        light: 'light',
        dark: 'dark',
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
  expect(run('$gray-500')).toBe(scale['gray-500']);
  expect(run('$gray.500')).toBe(scale['gray.500']);
});
