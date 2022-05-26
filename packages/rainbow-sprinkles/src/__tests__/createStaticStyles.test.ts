import * as VE from '@vanilla-extract/css';
import { createStaticStyles } from '../createStaticStyles';

const TABLET = 'screen and (min-width: 768px)';
const DESKTOP = 'screen and (min-width: 1024px)';

const conditions = {
  mobile: {},
  tablet: { '@media': TABLET },
  desktop: { '@media': DESKTOP },
};

it('returns expected config given object scale', () => {
  const style = jest.spyOn(VE, 'style');

  const result = createStaticStyles(
    'color',
    { primary: '#aaa', secondary: '#bbb' },
    conditions,
    'mobile',
  );

  const calledArgs = style.mock.calls;

  expect(calledArgs.length).toBe(6);

  expect(calledArgs[0][0]).toMatchObject({ color: '#aaa' });
  expect(calledArgs[1][0]).toMatchObject({
    '@media': { [TABLET]: { color: '#aaa' } },
  });
  expect(calledArgs[2][0]).toMatchObject({
    '@media': { [DESKTOP]: { color: '#aaa' } },
  });
  expect(calledArgs[3][0]).toMatchObject({ color: '#bbb' });
  expect(calledArgs[4][0]).toMatchObject({
    '@media': { [TABLET]: { color: '#bbb' } },
  });
  expect(calledArgs[5][0]).toMatchObject({
    '@media': { [DESKTOP]: { color: '#bbb' } },
  });

  expect(result).toMatchObject({
    values: {
      primary: {
        default: 'color-primary-mobile',
        conditions: {
          mobile: 'color-primary-mobile',
          tablet: 'color-primary-tablet',
          desktop: 'color-primary-desktop',
        },
      },
      secondary: {
        default: 'color-secondary-mobile',
        conditions: {
          mobile: 'color-secondary-mobile',
          tablet: 'color-secondary-tablet',
          desktop: 'color-secondary-desktop',
        },
      },
    },
    name: 'color',
  });

  style.mockClear();
});

it('returns expected configuration given array scale', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStaticStyles(
    'display',
    ['block', 'inline-block'],
    conditions,
    'mobile',
  );

  const calledArgs = style.mock.calls;

  expect(calledArgs.length).toBe(6);

  expect(calledArgs[0][0]).toMatchObject({ display: 'block' });
  expect(calledArgs[1][0]).toMatchObject({
    '@media': { [TABLET]: { display: 'block' } },
  });
  expect(calledArgs[2][0]).toMatchObject({
    '@media': { [DESKTOP]: { display: 'block' } },
  });
  expect(calledArgs[3][0]).toMatchObject({ display: 'inline-block' });
  expect(calledArgs[4][0]).toMatchObject({
    '@media': { [TABLET]: { display: 'inline-block' } },
  });
  expect(calledArgs[5][0]).toMatchObject({
    '@media': { [DESKTOP]: { display: 'inline-block' } },
  });

  expect(result).toMatchObject({
    values: {
      block: {
        default: 'display-block-mobile',
        conditions: {
          desktop: 'display-block-desktop',
          mobile: 'display-block-mobile',
          tablet: 'display-block-tablet',
        },
      },
      'inline-block': {
        default: 'display-inline-block-mobile',
        conditions: {
          desktop: 'display-inline-block-desktop',
          mobile: 'display-inline-block-mobile',
          tablet: 'display-inline-block-tablet',
        },
      },
    },
    name: 'display',
  });

  style.mockClear();
});
