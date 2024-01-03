import { defineProperties, createRainbowSprinkles } from '../';

const vars = {
  space: {
    '-1x': '-5px',
    '-2x': '-10px',
    '-3x': '-15px',
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
    'gray-500': '#6b7280',
    'gray.500': '#6b7280',
    gray_500: '#6b7280',
    'gray--500': '#6b7280',
    'colors.gray-500': '#6b7280',
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
  const responsiveProps = defineProperties({
    conditions: {
      mobile: {},
      tablet: { '@media': 'screen and (min-width: 768px)' },
      desktop: { '@media': 'screen and (min-width: 1024px)' },
    },
    defaultCondition: 'mobile',
    responsiveArray: ['mobile', 'tablet', 'desktop'],
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

  const rainbowSprinkles = createRainbowSprinkles(responsiveProps);

  describe('rainbowSprinkles', () => {
    it('handles scale values and non-scale values', () => {
      expect(
        rainbowSprinkles({ color: '$gray50', padding: '40px' }),
      ).toMatchObject({
        className: 'color-mobile padding-mobile',
        style: {
          '--color-mobile': vars.color['gray50'],
          '--padding-mobile': '40px',
        },
      });
    });

    it('handles negated values', () => {
      expect(
        rainbowSprinkles({
          color: '-$gray50',
          paddingTop: '-$2x',
          padding: '-$1x -$3x',
        }),
      ).toMatchObject({
        className: 'color-mobile paddingTop-mobile padding-mobile',
        style: {
          '--color-mobile': '-$gray50',
          '--paddingTop-mobile': vars.space['-2x'],
          '--padding-mobile': `${vars.space['-1x']} ${vars.space['-3x']}`,
        },
      });
    });

    it('handles shorthands', () => {
      expect(rainbowSprinkles({ px: '$1x' })).toMatchObject({
        className: 'paddingLeft-mobile paddingRight-mobile',
        style: {
          '--paddingLeft-mobile': vars.space['1x'],
          '--paddingRight-mobile': vars.space['1x'],
        },
      });
    });

    it('handles conditionals', () => {
      expect(
        rainbowSprinkles({
          p: ['$1x', '$2x', '$3x'],
          px: { mobile: '$1x', tablet: '$2x', desktop: '-$3x' },
          fontSize: { mobile: '$1x', desktop: '$2x' },
        }),
      ).toMatchObject({
        className:
          'padding-mobile padding-tablet padding-desktop paddingLeft-mobile paddingLeft-tablet paddingLeft-desktop paddingRight-mobile paddingRight-tablet paddingRight-desktop fontSize-mobile fontSize-desktop',
        style: {
          '--padding-mobile': vars.space['1x'],
          '--padding-tablet': vars.space['2x'],
          '--padding-desktop': vars.space['3x'],
          '--paddingLeft-mobile': vars.space['1x'],
          '--paddingRight-mobile': vars.space['1x'],
          '--paddingLeft-tablet': vars.space['2x'],
          '--paddingRight-tablet': vars.space['2x'],
          '--paddingLeft-desktop': vars.space['-3x'],
          '--paddingRight-desktop': vars.space['-3x'],
          '--fontSize-mobile': vars.fontSize['1x'],
          '--fontSize-desktop': vars.fontSize['2x'],
        },
      });
    });
    it('has properties', () => {
      expect(rainbowSprinkles.properties).toMatchInlineSnapshot(`
        Set {
          "p",
          "pl",
          "pr",
          "pt",
          "pb",
          "paddingX",
          "paddingY",
          "px",
          "py",
          "bg",
          "placeItems",
          "display",
          "flexDirection",
          "alignItems",
          "justifyContent",
          "gap",
          "padding",
          "paddingLeft",
          "paddingRight",
          "paddingTop",
          "paddingBottom",
          "width",
          "height",
          "borderRadius",
          "fontFamily",
          "fontSize",
          "textAlign",
          "color",
          "background",
        }
      `);
    });

    describe('parses scale values with hyphens, underscores, and periods', () => {
      test.each([
        ['$gray200', vars.color['gray200']],
        ['$gray-500', vars.color['gray-500']],
        ['$gray.500', vars.color['gray.500']],
        ['$gray_500', vars.color['gray_500']],
        ['$gray--500', vars.color['gray--500']],
        ['$colors.gray-500', vars.color['colors.gray-500']],
      ])(`%s`, (key, value) => {
        expect(
          rainbowSprinkles({
            color: key,
          }),
        ).toMatchObject({
          className: 'color-mobile',
          style: {
            '--color-mobile': value,
          },
        });
      });
    });
  });
});

describe('static properties only', () => {
  const responsiveProps = defineProperties({
    conditions: {
      mobile: {},
      tablet: { '@media': 'screen and (min-width: 768px)' },
      desktop: { '@media': 'screen and (min-width: 1024px)' },
    },
    responsiveArray: ['mobile', 'tablet', 'desktop'],
    defaultCondition: 'mobile',
    staticProperties: {
      padding: vars.space,
      paddingLeft: vars.space,
      paddingRight: vars.space,
      fontSize: vars.fontSize,
      color: vars.color,
      background: vars.color,
    },
    shorthands: {
      p: ['padding'],
      px: ['paddingLeft', 'paddingRight'],
      bg: ['background'],
    },
  });

  const rainbowSprinkles = createRainbowSprinkles(responsiveProps);

  describe('rainbowSprinkles', () => {
    it('handles scale values', () => {
      expect(
        rainbowSprinkles({
          color: '$gray50',
          padding: '$2x',
          paddingRight: '-$3x',
        }),
      ).toMatchObject({
        className:
          'color-gray50-mobile padding-2x-mobile paddingRight--3x-mobile',
      });
    });

    it('handles shorthands', () => {
      expect(rainbowSprinkles({ px: '$1x' })).toMatchObject({
        className: 'paddingLeft-1x-mobile paddingRight-1x-mobile',
      });
    });

    it('handles conditionals', () => {
      expect(
        rainbowSprinkles({
          p: ['$1x', '$2x', '$3x'],
          px: { mobile: '$1x', tablet: '$2x' },
          fontSize: { mobile: '$1x', desktop: '$2x' },
        }),
      ).toMatchObject({
        className:
          'padding-1x-mobile padding-2x-tablet padding-3x-desktop paddingLeft-1x-mobile paddingLeft-2x-tablet paddingRight-1x-mobile paddingRight-2x-tablet fontSize-1x-mobile fontSize-2x-desktop',
      });
    });

    test('errors when expected', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // @ts-expect-error
      rainbowSprinkles({ fontSize: '23px' });
      // @ts-expect-error
      rainbowSprinkles({ px: '23px' });
      // @ts-expect-error
      rainbowSprinkles({ px: { mobile: 'foo' } });
      // @ts-expect-error
      rainbowSprinkles({ fontSize: { mobile: 'foo' } });

      // Called twice for px shorthand
      expect(consoleError).toHaveBeenCalledTimes(6);

      consoleError.mockRestore();
    });

    it('has properties', () => {
      expect(rainbowSprinkles.properties).toMatchInlineSnapshot(`
        Set {
          "p",
          "px",
          "bg",
          "padding",
          "paddingLeft",
          "paddingRight",
          "fontSize",
          "color",
          "background",
        }
      `);
    });

    describe('parses scale values with hyphens, underscores, and periods', () => {
      test.each([
        ['$gray200', 'gray200'],
        ['$gray-500', 'gray-500'],
        ['$gray.500', 'gray.500'],
        ['$gray_500', 'gray_500'],
        ['$gray--500', 'gray--500'],
        ['$colors.gray-500', 'colors.gray-500'],
      ])(`%s`, (key, value) => {
        expect(
          rainbowSprinkles({
            color: '$gray50',
            padding: '$2x',
            paddingRight: '-$3x',
          }),
        ).toMatchObject({
          className:
            'color-gray50-mobile padding-2x-mobile paddingRight--3x-mobile',
        });
        expect(
          rainbowSprinkles({
            color: key as `$${keyof (typeof vars)['color']}`,
          }),
        ).toMatchObject({
          className: `color-${value}-mobile`,
        });
      });
    });
  });
});

describe('static and dynamic properties', () => {
  const responsiveProps = defineProperties({
    dynamicProperties: {
      display: true,
      padding: vars.space,
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
    responsiveArray: ['mobile', 'tablet', 'desktop'],
  });

  const rainbowSprinkles = createRainbowSprinkles(responsiveProps);

  describe('rainbowSprinkles', () => {
    describe('props with static and dynamic values', () => {
      it('creates just static classes', () => {
        expect(rainbowSprinkles({ display: 'block' })).toMatchObject({
          className: 'display-block-mobile',
        });
      });

      it('creates class and var for dynamic value', () => {
        expect(rainbowSprinkles({ display: 'flex' })).toMatchObject({
          className: 'display-mobile',
          style: {
            '--display-mobile': 'flex',
          },
        });
      });

      it('handles static and dynamic values within conditional object', () => {
        expect(
          rainbowSprinkles({
            display: {
              mobile: 'block',
              tablet: 'flex',
              desktop: 'inline-block',
            },
          }),
        ).toMatchObject({
          className:
            'display-block-mobile display-tablet display-inline-block-desktop',
          style: {
            '--display-tablet': 'flex',
          },
        });
      });

      it('handles just static values in a conditional object', () => {
        expect(
          rainbowSprinkles({
            display: { mobile: 'block', tablet: 'inline-block' },
          }),
        ).toMatchObject({
          className: 'display-block-mobile display-inline-block-tablet',
        });
      });
    });

    describe('props with just static values', () => {
      let consoleError;

      beforeAll(() => {
        consoleError = jest
          .spyOn(console, 'error')
          .mockImplementation(() => {});
      });

      afterAll(() => {
        consoleError.mockRestore();
      });

      it('handles non-conditional static value', () => {
        expect(rainbowSprinkles({ textAlign: 'left' })).toMatchObject({
          className: 'textAlign-left-mobile',
          otherProps: {},
          style: {},
        });
      });
      it('returns nothing for non-configured value', () => {
        // @ts-expect-error
        expect(rainbowSprinkles({ textAlign: 'center' })).toMatchObject({
          className: '',
          otherProps: {},
          style: {},
        });
        expect(
          rainbowSprinkles({
            // @ts-expect-error
            textAlign: { mobile: 'left', tablet: 'center' },
          }),
        ).toMatchObject({
          className: 'textAlign-left-mobile',
        });
        expect(console.error).toHaveBeenCalledTimes(2);
      });
    });

    it('has properties', () => {
      expect(rainbowSprinkles.properties).toMatchInlineSnapshot(`
        Set {
          "display",
          "padding",
          "textAlign",
        }
      `);
    });
  });
});

describe('static and dynamic properties and shorthands', () => {
  const responsiveProps = defineProperties({
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

  const rainbowSprinkles = createRainbowSprinkles(responsiveProps);

  describe('rainbowSprinkles', () => {
    it('handles shorthands', () => {
      expect(
        rainbowSprinkles({
          bg: '$gray50',
          mx: '24px',
        }),
      ).toMatchObject({
        className:
          'marginLeft-mobile marginRight-mobile backgroundColor-gray50-mobile',
        style: {
          '--marginLeft-mobile': '24px',
          '--marginRight-mobile': '24px',
        },
      });
    });

    it('handles responsive shorthands', () => {
      expect(
        rainbowSprinkles({
          bg: { mobile: '$gray50', tablet: 'seagreen' },
          mx: { mobile: '$2x', desktop: '50px' },
        }),
      ).toMatchObject({
        className:
          'marginLeft-2x-mobile marginLeft-desktop marginRight-2x-mobile marginRight-desktop backgroundColor-gray50-mobile backgroundColor-tablet',
        style: {
          '--backgroundColor-tablet': 'seagreen',
          '--marginLeft-desktop': '50px',
          '--marginRight-desktop': '50px',
        },
      });
    });

    it('has properties', () => {
      expect(rainbowSprinkles.properties).toMatchInlineSnapshot(`
        Set {
          "mx",
          "bg",
          "backgroundColor",
          "marginLeft",
          "marginRight",
        }
      `);
    });
  });
});

describe('dynamic (no conditions)', () => {
  const properties = defineProperties({
    dynamicProperties: {
      padding: vars.space,
      color: vars.color,
      background: vars.color,
    },
    shorthands: {
      bg: ['background'],
    },
  });

  const rainbowSprinkles = createRainbowSprinkles(properties);

  it('handles scale values and non-scale values', () => {
    expect(
      rainbowSprinkles({ color: '$gray50', padding: '40px', bg: '$gray50' }),
    ).toMatchObject({
      className: 'background color padding',
      style: {
        '--color': vars.color.gray50,
        '--background': vars.color.gray50,
        '--padding': '40px',
      },
    });
  });
});

describe('static (no conditions)', () => {
  const properties = defineProperties({
    staticProperties: {
      padding: vars.space,
      color: vars.color,
      background: vars.color,
    },
    shorthands: {
      bg: ['background'],
    },
  });

  const rainbowSprinkles = createRainbowSprinkles(properties);

  it('handles scale values', () => {
    expect(rainbowSprinkles({ color: '$gray50', bg: '$gray50' })).toMatchObject(
      {
        className: 'background-gray50 color-gray50',
        style: {},
      },
    );
  });

  it('errors when expected', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // @ts-expect-error
    rainbowSprinkles({ padding: '22px' });
    // @ts-expect-error
    rainbowSprinkles({ bg: 'foo' });

    expect(consoleError).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
  });

  it('has properties', () => {
    expect(rainbowSprinkles.properties).toMatchInlineSnapshot(`
      Set {
        "bg",
        "padding",
        "color",
        "background",
      }
    `);
  });
});
