import { createRainbowSprinkles, defineProperties } from 'rainbow-sprinkles';
import { vars } from '../vars.css';
import { interactiveLayer, responsiveLayer } from '../layers.css';

const positiveSpace = {
  '250': vars.space['250'],
  '500': vars.space['500'],
  '1000': vars.space['1000'],
  '1500': vars.space['1500'],
  '2000': vars.space['2000'],
  '2500': vars.space['2500'],
  '3000': vars.space['3000'],
  '3500': vars.space['3500'],
  '4000': vars.space['4000'],
  '4500': vars.space['4500'],
  '5000': vars.space['5000'],
} as const;

const responsiveProperties = defineProperties({
  '@layer': responsiveLayer,
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
    gap: positiveSpace,
    padding: positiveSpace,
    paddingLeft: positiveSpace,
    paddingRight: positiveSpace,
    paddingTop: positiveSpace,
    paddingBottom: positiveSpace,
    width: true,
    height: true,
    borderRadius: vars.borderRadius,
    fontFamily: vars.fontFamily,
    fontSize: vars.fontSize,
    lineHeight: vars.lineHeight,
    textAlign: true,
    zIndex: true,
    position: true,
    top: vars.space,
    left: vars.space,
    right: vars.space,
    bottom: vars.space,
    verticalAlign: true,
    margin: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    marginTop: vars.space,
  },
  staticProperties: {
    display: ['block', 'flex', 'inline-block', 'inline-flex'],
    border: {
      '1x': '1px',
      '2x': '2px',
      '3x': '3px',
    },
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
    placeItems: ['alignItems', 'justifyContent'],
    typeSize: ['fontSize', 'lineHeight'],
    m: ['margin'],
    mr: ['marginRight'],
    ml: ['marginLeft'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    size: ['height', 'width'],
  },
});

const interactiveProperties = defineProperties({
  '@layer': interactiveLayer,
  conditions: {
    base: {},
    hover: { selector: '&:hover' },
    active: { selector: '&:active' },
  },
  defaultCondition: 'base',
  dynamicProperties: {
    color: vars.color,
    backgroundColor: vars.color,
    transform: true,
    transition: true,
    animation: true,
  },
  shorthands: {
    bg: ['backgroundColor'],
  },
});

export const rainbowSprinkles = createRainbowSprinkles(
  responsiveProperties,
  interactiveProperties,
);

export type Sprinkles = Parameters<typeof rainbowSprinkles>[0];
