import * as VE from '@vanilla-extract/css';
import { createStyles } from '../createStyles';
import { BaseConditions } from '../types';
import '@vanilla-extract/css/disableRuntimeStyles';

const TABLET = 'screen and (min-width: 768px)';
const DESKTOP = 'screen and (min-width: 1024px)';

const conditions: BaseConditions = {
  mobile: {},
  tablet: { '@media': TABLET },
  desktop: { '@media': DESKTOP },
};

const scale = {
  primary: 'primary-color',
  secondary: 'secondary-color',
};

it('returns expected configuration with vars scale', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStyles('backgroundColor', scale, conditions);

  expect(style).toHaveBeenCalledWith({
    backgroundColor: '--backgroundColor-mobile',
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { backgroundColor: '--backgroundColor-tablet' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { backgroundColor: '--backgroundColor-desktop' } },
  });

  expect(result).toMatchObject({
    classes: {
      dynamic: {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
    },
    name: 'backgroundColor',
    vars: {
      mobile: expect.stringContaining(''),
      tablet: expect.stringContaining(''),
      desktop: expect.stringContaining(''),
    },
    scale,
  });
});

it('returns expected configuration with scale: true', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStyles('backgroundColor', true, conditions);

  expect(style).toHaveBeenCalledWith({
    backgroundColor: '--backgroundColor-mobile',
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [TABLET]: { backgroundColor: '--backgroundColor-tablet' } },
  });
  expect(style).toHaveBeenCalledWith({
    '@media': { [DESKTOP]: { backgroundColor: '--backgroundColor-desktop' } },
  });

  expect(result).toMatchObject({
    classes: {
      dynamic: {
        mobile: expect.stringContaining(''),
        tablet: expect.stringContaining(''),
        desktop: expect.stringContaining(''),
      },
    },
    name: 'backgroundColor',
    vars: {
      mobile: expect.stringContaining(''),
      tablet: expect.stringContaining(''),
      desktop: expect.stringContaining(''),
    },
    scale: true,
  });
});
