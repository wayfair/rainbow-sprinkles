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

  const calledArgs = style.mock.calls;

  expect(calledArgs.length).toBe(6);
  expect(calledArgs[0][0]).toMatchInlineSnapshot(`
    Object {
      "display": "block",
    }
  `);
  expect(calledArgs[1][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "display": "block",
        },
      },
    }
  `);
  expect(calledArgs[2][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "display": "block",
        },
      },
    }
  `);
  expect(calledArgs[3][0]).toMatchInlineSnapshot(`
    Object {
      "display": "inline-block",
    }
  `);
  expect(calledArgs[4][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "display": "inline-block",
        },
      },
    }
  `);
  expect(calledArgs[5][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "display": "inline-block",
        },
      },
    }
  `);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "classes": Object {
        "block": Object {
          "desktop": "display-block-desktop",
          "mobile": "display-block-mobile",
          "tablet": "display-block-tablet",
        },
        "inline-block": Object {
          "desktop": "display-inline-block-desktop",
          "mobile": "display-inline-block-mobile",
          "tablet": "display-inline-block-tablet",
        },
      },
      "name": "display",
    }
  `);

  style.mockRestore();
});

it('returns expected config given object scale', () => {
  const style = jest.spyOn(VE, 'style');
  const result = createStaticStyles(
    'color',
    { primary: '#aaa', secondary: '#bbb' },
    conditions,
  );

  const calledArgs = style.mock.calls;

  expect(calledArgs.length).toBe(6);
  expect(calledArgs[0][0]).toMatchInlineSnapshot(`
    Object {
      "color": "#aaa",
    }
  `);
  expect(calledArgs[1][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "color": "#aaa",
        },
      },
    }
  `);
  expect(calledArgs[2][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "color": "#aaa",
        },
      },
    }
  `);
  expect(calledArgs[3][0]).toMatchInlineSnapshot(`
    Object {
      "color": "#bbb",
    }
  `);
  expect(calledArgs[4][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 768px)": Object {
          "color": "#bbb",
        },
      },
    }
  `);
  expect(calledArgs[5][0]).toMatchInlineSnapshot(`
    Object {
      "@media": Object {
        "screen and (min-width: 1024px)": Object {
          "color": "#bbb",
        },
      },
    }
  `);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "classes": Object {
        "primary": Object {
          "desktop": undefined,
          "mobile": undefined,
          "tablet": undefined,
        },
        "secondary": Object {
          "desktop": undefined,
          "mobile": undefined,
          "tablet": undefined,
        },
      },
      "name": "color",
    }
  `);

  style.mockRestore();
});
