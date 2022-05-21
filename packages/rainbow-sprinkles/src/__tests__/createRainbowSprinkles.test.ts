import { createRainbowSprinkles } from '../createRainbowSprinkles';

const vars = {
  space: {
    none: '0',
    '1x': '5px',
    '2x': '10px',
    '3x': '15px',
  },
  color: {
    white: '#fff',
    gray50: '#efefef',
    gray100: '#fefefe',
    gray200: '#333333',
  },
  borderRadius: {
    '0x': '0px',
    '1x': '3px',
    '2x': '8px',
    full: '99999px',
  },
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  fontSize: {
    '0x': '10px',
    '1x': '15px',
    '2x': '20px',
  },
};

describe('dynamic properties only', () => {
  const rainbowSprinkles = createRainbowSprinkles({
    conditions: {
      mobile: {},
      tablet: { '@media': 'screen and (min-width: 768px)' },
      desktop: { '@media': 'screen and (min-width: 1024px)' },
    },
    defaultCondition: 'mobile',
    dynamicProperties: {
      display: true,
      flexDirection: true,
      alignItems: true,
      justifyContent: true,
      gap: vars.space,
      padding: vars.space,
      paddingLeft: vars.space,
      paddingRight: vars.space,
      paddingTop: vars.space,
      paddingBottom: vars.space,
      width: true,
      height: true,
      borderRadius: vars.borderRadius,
      fontFamily: vars.fontFamily,
      fontSize: vars.fontSize,
      textAlign: true,
      color: vars.color,
      background: vars.color,
    },
    shorthands: {
      p: ['padding'],
      pl: ['paddingLeft'],
      pr: ['paddingRight'],
      pt: ['paddingTop'],
      pb: ['paddingBottom'],
      paddingX: ['paddingLeft', 'paddingRight'],
      paddingY: ['paddingTop', 'paddingBottom'],
      px: ['paddingLeft', 'paddingRight'],
      py: ['paddingTop', 'paddingBottom'],
      bg: ['background'],
      placeItems: ['alignItems', 'justifyContent'],
    },
  });

  test('rainbowSprinkles', () => {
    expect(rainbowSprinkles({ color: '$gray50', padding: '40px' }))
      .toMatchInlineSnapshot(`
      Object {
        "className": "color-mobile padding-mobile",
        "otherProps": Object {},
        "style": Object {
          "--color-mobile": "#efefef",
          "--padding-mobile": "40px",
        },
      }
    `);

    expect(rainbowSprinkles({ px: '$1x' })).toMatchInlineSnapshot(`
      Object {
        "className": "paddingLeft-mobile paddingRight-mobile",
        "otherProps": Object {},
        "style": Object {
          "--paddingLeft-mobile": "5px",
          "--paddingRight-mobile": "5px",
        },
      }
    `);

    expect(
      rainbowSprinkles({
        px: { mobile: '$1x', tablet: '$2x' },
        fontSize: { mobile: '$1x', desktop: '$2x' },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "className": "paddingLeft-mobile paddingLeft-tablet paddingRight-mobile paddingRight-tablet fontSize-mobile fontSize-desktop",
        "otherProps": Object {},
        "style": Object {
          "--fontSize-desktop": "20px",
          "--fontSize-mobile": "15px",
          "--paddingLeft-mobile": "5px",
          "--paddingLeft-tablet": "10px",
          "--paddingRight-mobile": "5px",
          "--paddingRight-tablet": "10px",
        },
      }
    `);
  });

  describe('static and dynamic properties', () => {
    const rainbowSprinkles = createRainbowSprinkles({
      dynamicProperties: {
        display: true,
      },
      staticProperties: {
        display: ['block', 'inline-block'],
        textAlign: ['left', 'right'],
      },
      conditions: {
        mobile: {},
        tablet: { '@media': 'screen and (min-width: 768px)' },
        desktop: { '@media': 'screen and (min-width: 1024px)' },
      },
      defaultCondition: 'mobile',
    });

    describe('rainbowSprinkles', () => {
      test('props with static and dynamic values', () => {
        expect(rainbowSprinkles({ display: 'block' })).toMatchInlineSnapshot(`
          Object {
            "className": "display-block-mobile",
            "otherProps": Object {},
            "style": Object {},
          }
        `);

        expect(rainbowSprinkles({ display: 'flex' })).toMatchInlineSnapshot(`
          Object {
            "className": "display-mobile",
            "otherProps": Object {},
            "style": Object {
              "--display-mobile": "flex",
            },
          }
        `);

        expect(
          rainbowSprinkles({
            display: {
              mobile: 'block',
              tablet: 'flex',
              desktop: 'inline-block',
            },
          }),
        ).toMatchInlineSnapshot(`
          Object {
            "className": "display-block-mobile display-tablet display-inline-block-desktop",
            "otherProps": Object {},
            "style": Object {
              "--display-tablet": "flex",
            },
          }
        `);

        expect(
          rainbowSprinkles({
            display: { mobile: 'block', tablet: 'inline-block' },
          }),
        ).toMatchInlineSnapshot(`
          Object {
            "className": "display-block-mobile display-inline-block-tablet",
            "otherProps": Object {},
            "style": Object {},
          }
        `);

        expect(
          rainbowSprinkles({
            display: { mobile: 'block', tablet: 'inline-block' },
          }),
        ).toMatchInlineSnapshot(`
          Object {
            "className": "display-block-mobile display-inline-block-tablet",
            "otherProps": Object {},
            "style": Object {},
          }
        `);
      });

      test('props with just static values', () => {
        const consoleError = jest
          .spyOn(console, 'error')
          .mockImplementation(() => {});

        expect(rainbowSprinkles({ textAlign: 'left' })).toMatchInlineSnapshot(`
          Object {
            "className": "textAlign-left-mobile",
            "otherProps": Object {},
            "style": Object {},
          }
        `);
        expect(rainbowSprinkles({ textAlign: 'center' }))
          .toMatchInlineSnapshot(`
          Object {
            "className": "",
            "otherProps": Object {},
            "style": Object {},
          }
        `);
        expect(
          rainbowSprinkles({
            textAlign: { mobile: 'left', tablet: 'center' },
          }),
        ).toMatchInlineSnapshot(`
          Object {
            "className": "textAlign-left-mobile",
            "otherProps": Object {},
            "style": Object {},
          }
        `);

        expect(consoleError).toHaveBeenCalledTimes(2);

        consoleError.mockRestore();
      });
    });
  });

  describe('static and dynamic properties and shorthands', () => {
    const rainbowSprinkles = createRainbowSprinkles({
      dynamicProperties: {
        backgroundColor: true,
        marginLeft: true,
        marginRight: true,
      },
      staticProperties: {
        backgroundColor: vars.color,
        marginLeft: vars.space,
        marginRight: vars.space,
      },
      shorthands: {
        mx: ['marginLeft', 'marginRight'],
        bg: ['backgroundColor'],
      },
      conditions: {
        mobile: {},
        tablet: { '@media': 'screen and (min-width: 768px)' },
        desktop: { '@media': 'screen and (min-width: 1024px)' },
      },
      defaultCondition: 'mobile',
    });

    test('rainbowSprinkles', () => {
      expect(
        rainbowSprinkles({
          bg: 'seagreen',
          mx: '24px',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "className": "backgroundColor-mobile marginLeft-mobile marginRight-mobile",
          "otherProps": Object {},
          "style": Object {
            "--backgroundColor-mobile": "seagreen",
            "--marginLeft-mobile": "24px",
            "--marginRight-mobile": "24px",
          },
        }
      `);

      expect(
        rainbowSprinkles({
          bg: { mobile: '$gray50', tablet: 'seagreen' },
          mx: { mobile: '$2x', desktop: '50px' },
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "className": "backgroundColor-gray50-mobile backgroundColor-tablet marginLeft-2x-mobile marginLeft-desktop marginRight-2x-mobile marginRight-desktop",
          "otherProps": Object {},
          "style": Object {
            "--backgroundColor-mobile": "gray50",
            "--backgroundColor-tablet": "seagreen",
            "--marginLeft-desktop": "50px",
            "--marginLeft-mobile": "2x",
            "--marginRight-desktop": "50px",
            "--marginRight-mobile": "2x",
          },
        }
      `);
    });
  });
});
