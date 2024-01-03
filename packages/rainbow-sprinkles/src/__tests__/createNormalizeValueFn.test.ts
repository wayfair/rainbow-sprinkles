import { createNormalizeValueFn } from '../createNormalizeValueFn';

const responsiveArray = ['mobile', 'tablet', 'desktop'];

describe('with responsive array', () => {
  const config = {
    config: {
      display: {},
    },
    responsiveArray,
  };

  const fn = createNormalizeValueFn(config as any);

  it('returns conditional object given responsive array', () => {
    expect(fn('display', ['block', 'flex', 'grid'])).toMatchObject({
      mobile: 'block',
      tablet: 'flex',
      desktop: 'grid',
    });
  });

  it('fills in missing values with last value', () => {
    expect(fn('display', ['block', 'flex'])).toMatchObject({
      mobile: 'block',
      tablet: 'flex',
      desktop: 'flex',
    });

    expect(fn('display', ['block', null, 'flex'])).toMatchObject({
      mobile: 'block',
      tablet: 'block',
      desktop: 'flex',
    });
  });
});

describe('without responsive array', () => {
  const config = {
    config: {
      display: {},
    },
  };

  const fn = createNormalizeValueFn(config as any);

  it('returns original value given no responsive array', () => {
    expect(fn('display', ['block', 'flex', 'grid'])).toMatchObject([
      'block',
      'flex',
      'grid',
    ]);
  });
});
