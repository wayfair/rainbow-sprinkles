import * as VE from '@vanilla-extract/css';
import { createStyles } from '../createStyles';
import { BaseConditions } from '../types';

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

  const calledArgs = style.mock.calls;

  expect(calledArgs[0][0]).toMatchInlineSnapshot(`
    Object {
      "backgroundColor": "--backgroundColor-mobile",
    }
  `);
  expect(calledArgs[1][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "backgroundColor": "--backgroundColor-tablet",
        },
      },
    }
  `);
  expect(calledArgs[2][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "backgroundColor": "--backgroundColor-desktop",
        },
      },
    }
  `);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "classes": Object {
        "dynamic": Object {
          "desktop": "backgroundColor-desktop",
          "mobile": "backgroundColor-mobile",
          "tablet": "backgroundColor-tablet",
        },
      },
      "name": "backgroundColor",
      "scale": Object {
        "primary": "primary-color",
        "secondary": "secondary-color",
      },
      "vars": Object {
        "desktop": "--backgroundColor-desktop",
        "mobile": "--backgroundColor-mobile",
        "tablet": "--backgroundColor-tablet",
      },
    }
  `);
});

it('returns expected configuration with scale: true', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStyles('backgroundColor', true, conditions);

  const calledArgs = style.mock.calls;

  expect(calledArgs[0][0]).toMatchInlineSnapshot(`
    Object {
      "backgroundColor": "--backgroundColor-mobile",
    }
  `);
  expect(calledArgs[1][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "backgroundColor": "--backgroundColor-tablet",
        },
      },
    }
  `);
  expect(calledArgs[2][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "backgroundColor": "--backgroundColor-desktop",
        },
      },
    }
  `);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "classes": Object {
        "dynamic": Object {
          "desktop": "backgroundColor-desktop",
          "mobile": "backgroundColor-mobile",
          "tablet": "backgroundColor-tablet",
        },
      },
      "name": "backgroundColor",
      "scale": true,
      "vars": Object {
        "desktop": "--backgroundColor-desktop",
        "mobile": "--backgroundColor-mobile",
        "tablet": "--backgroundColor-tablet",
      },
    }
  `);
});
