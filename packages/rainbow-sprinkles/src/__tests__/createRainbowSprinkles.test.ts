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
    'gray-50': '#efefef',
    'gray-100': '#fefefe',
    'gray-200': '#333333',
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
  const { createRainbowSprinklesCss, getBoxProps, extractSprinklesFromProps } =
    createRainbowSprinkles({
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

  it('createRainbowSprinklesCss', () => {
    const result = createRainbowSprinklesCss();
    expect(result.color).toMatchObject([
      {
        classes: {
          dynamic: {
            mobile: 'color-mobile',
            desktop: 'color-desktop',
            tablet: 'color-tablet',
          },
        },
        name: 'color',
        scale: {
          'gray-100': '#fefefe',
          'gray-200': '#333333',
          'gray-50': '#efefef',
          white: '#fff',
        },
        vars: {
          desktop: '--color-desktop',
          mobile: '--color-mobile',
          tablet: '--color-tablet',
        },
      },
    ]);
    expect(result.paddingX).toMatchObject([
      {
        classes: {
          dynamic: {
            mobile: 'paddingLeft-mobile',
            tablet: 'paddingLeft-tablet',
            desktop: 'paddingLeft-desktop',
          },
        },
        name: 'paddingLeft',
        scale: {
          '1x': '5px',
          '2x': '10px',
          '3x': '15px',
          none: '0',
        },
        vars: {
          desktop: '--paddingLeft-desktop',
          mobile: '--paddingLeft-mobile',
          tablet: '--paddingLeft-tablet',
        },
      },
      {
        classes: {
          dynamic: {
            desktop: 'paddingRight-desktop',
            mobile: 'paddingRight-mobile',
            tablet: 'paddingRight-tablet',
          },
        },
        name: 'paddingRight',
        scale: {
          '1x': '5px',
          '2x': '10px',
          '3x': '15px',
          none: '0',
        },
        vars: {
          desktop: '--paddingRight-desktop',
          mobile: '--paddingRight-mobile',
          tablet: '--paddingRight-tablet',
        },
      },
    ]);
  });

  test('getBoxProps', () => {
    const classes = createRainbowSprinklesCss();

    expect(getBoxProps(classes, { color: 'gray-50', padding: '40' })).toEqual({
      className: 'color-mobile padding-mobile',
      style: {
        '--color-mobile': vars.color['gray-50'],
        '--padding-mobile': '40',
      },
    });

    expect(getBoxProps(classes, { px: '1x' })).toEqual({
      className: 'paddingLeft-mobile paddingRight-mobile',
      style: {
        '--paddingLeft-mobile': vars.space['1x'],
        '--paddingRight-mobile': vars.space['1x'],
      },
    });

    expect(
      getBoxProps(classes, {
        px: { mobile: '1x', tablet: '2x' },
        fontSize: { mobile: '1x', desktop: '2x' },
      }),
    ).toEqual({
      className:
        'paddingLeft-mobile paddingLeft-tablet paddingRight-mobile paddingRight-tablet fontSize-mobile fontSize-desktop',
      style: {
        '--paddingLeft-mobile': vars.space['1x'],
        '--paddingRight-mobile': vars.space['1x'],
        '--paddingLeft-tablet': vars.space['2x'],
        '--paddingRight-tablet': vars.space['2x'],
        '--fontSize-mobile': vars.fontSize['1x'],
        '--fontSize-desktop': vars.fontSize['2x'],
      },
    });
  });

  test('extractSprinklesFromProps', () => {
    expect(
      extractSprinklesFromProps({
        foo: 'bar',
        children: 'hey',
        display: 'block',
        height: 200,
      }),
    ).toEqual({
      systemProps: {
        display: 'block',
        height: 200,
      },
      otherProps: {
        foo: 'bar',
        children: 'hey',
      },
    });
  });
});

describe('static and dynamic properties', () => {
  const { createRainbowSprinklesCss, getBoxProps } = createRainbowSprinkles({
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

  it('createRainbowSprinklesCss', () => {
    const result = createRainbowSprinklesCss();
    const someClass = expect.stringContaining('');
    expect(result.display).toMatchObject([
      {
        classes: {
          dynamic: {
            mobile: someClass,
            tablet: someClass,
            desktop: someClass,
          },
          block: {
            mobile: someClass,
            tablet: someClass,
            desktop: someClass,
          },
          'inline-block': {
            mobile: someClass,
            tablet: someClass,
            desktop: someClass,
          },
        },
        name: 'display',
      },
    ]);
    expect(result.textAlign).toMatchObject([
      {
        classes: {
          left: {
            mobile: someClass,
            tablet: someClass,
            desktop: someClass,
          },
          right: {
            mobile: someClass,
            tablet: someClass,
            desktop: someClass,
          },
        },
        name: 'textAlign',
      },
    ]);
  });

  describe('getBoxProps', () => {
    const classes = createRainbowSprinklesCss();

    test('props with static and dynamic values', () => {
      expect(getBoxProps(classes, { display: 'block' })).toEqual({
        className: 'static-display-block',
      });

      expect(getBoxProps(classes, { display: 'flex' })).toEqual({
        className: 'display-mobile',
        style: {
          '--display-mobile': 'flex',
        },
      });

      expect(
        getBoxProps(classes, {
          display: { mobile: 'block', tablet: 'flex', desktop: 'inline-block' },
        }),
      ).toEqual({
        className:
          'static-display-block display-tablet static-display-inline-block',
        style: {
          '--display-tablet': 'flex',
        },
      });

      expect(
        getBoxProps(classes, {
          display: { mobile: 'block', tablet: 'inline-block' },
        }),
      ).toEqual({
        className: 'static-display-block static-display-inline-block',
      });

      expect(
        getBoxProps(classes, {
          display: { mobile: 'block', tablet: 'inline-block' },
        }),
      ).toEqual({
        className: 'static-display-block static-display-inline-block',
      });
    });

    test('props with just static values', () => {
      /* eslint-disable no-console */
      // @ts-ignore
      console.error = jest.fn();
      expect(getBoxProps(classes, { textAlign: 'left' })).toEqual({
        className: 'static-textAlign-left',
      });
      // @ts-expect-error
      expect(getBoxProps(classes, { textAlign: 'center' })).toEqual({
        className: '',
      });
      expect(
        getBoxProps(classes, {
          // @ts-expect-error
          textAlign: { mobile: 'left', tablet: 'center' },
        }),
      ).toEqual({
        className: 'static-textAlign-left',
      });
      expect(console.error).toHaveBeenCalledTimes(2);
      // @ts-ignore
      console.error.mockRestore();
      /* eslint-enable no-console */
    });
  });
});

describe('static and dynamic properties and shorthands', () => {
  const { createRainbowSprinklesCss, getBoxProps } = createRainbowSprinkles({
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

  it('createRainbowSprinklesCss', () => {
    const result = createRainbowSprinklesCss();
    expect(result.mx).toMatchObject([
      ...result.marginLeft,
      ...result.marginRight,
    ]);
  });

  test('getBoxProps', () => {
    const classes = createRainbowSprinklesCss();

    expect(
      getBoxProps(classes, {
        bg: 'seagreen',
        mx: '24px',
      }),
    ).toEqual({
      className: 'backgroundColor-mobile marginLeft-mobile marginRight-mobile',
      style: {
        '--backgroundColor-mobile': 'seagreen',
        '--marginLeft-mobile': '24px',
        '--marginRight-mobile': '24px',
      },
    });

    expect(
      getBoxProps(classes, {
        bg: { mobile: 'gray-50', tablet: 'seagreen' },
        mx: { mobile: '2x', desktop: '50px' },
      }),
    ).toEqual({
      className:
        'static-backgroundColor-#efefef backgroundColor-tablet static-marginLeft-10px marginLeft-desktop static-marginRight-10px marginRight-desktop',
      style: {
        '--backgroundColor-tablet': 'seagreen',
        '--marginLeft-desktop': '50px',
        '--marginRight-desktop': '50px',
      },
    });
  });
});
