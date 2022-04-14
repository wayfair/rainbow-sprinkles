import * as VE from '@vanilla-extract/css';
import { createStaticStyles } from '../createStaticStyles';
import { BaseConditions } from '../types';

const TABLET = 'screen and (min-width: 768px)';
const DESKTOP = 'screen and (min-width: 1024px)';

const conditions: BaseConditions = {
  mobile: {},
  tablet: { '@media': TABLET },
  desktop: { '@media': DESKTOP },
};

it('returns expected configuration given array scale', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStaticStyles(
    'display',
    ['block', 'inline-block'],
    conditions,
  );

  expect(style).toHaveBeenCalledWith({ display: 'block' });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { display: 'block' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { display: 'block' } },
  });
  expect(style).toHaveBeenCalledWith({ display: 'inline-block' });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { display: 'inline-block' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { display: 'inline-block' } },
  });

  expect(result).toMatchObject({
    classes: {
      'inline-block': {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
      block: {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
    },
    name: 'display',
  });
});

it('returns expected config given object scale', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStaticStyles(
    'color',
    { primary: '#aaa', secondary: '#bbb' },
    conditions,
  );

  expect(style).toHaveBeenCalledWith({ color: '#aaa' });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { color: '#aaa' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { color: '#aaa' } },
  });
  expect(style).toHaveBeenCalledWith({ color: '#bbb' });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { color: '#bbb' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { color: '#bbb' } },
  });

  expect(result).toMatchObject({
    classes: {
      primary: {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
      secondary: {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
    },
    name: 'color',
  });
});
