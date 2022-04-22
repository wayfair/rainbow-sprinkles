import { createGlobalTheme } from '@vanilla-extract/css';
import { modularScale } from 'polished';

const createScale = (ratio: number, base: number) => (steps: number) =>
  `${modularScale(steps, base, ratio)}px`;

const spaceScale = createScale(1.4, 4);
const fontSizeScale = createScale(1.3, 16);
const lineHeightScale = createScale(1.25, 24);
const borderRadiusScale = createScale(1.5, 4);

export const vars = createGlobalTheme(':root', {
  space: {
    '250': spaceScale(1),
    '500': spaceScale(2),
    '1000': spaceScale(3),
    '1500': spaceScale(4),
    '2000': spaceScale(5),
    '2500': spaceScale(6),
    '3000': spaceScale(7),
    '3500': spaceScale(8),
    '4000': spaceScale(9),
    '4500': spaceScale(10),
    '5000': spaceScale(11),
  },
  color: {
    core10: '#F7F3F6',
    core20: '#E6D3E4',
    core30: '#AF78B4',
    core40: '#A05EA6',
    core50: '#934398',
    core60: '#7F187F',
    core70: '#691568',
    core80: '#480D4A',
    black10: '#F5F5F5',
    black20: '#D1D1D6',
    black30: '#93939A',
    black40: '#777279',
    black50: '#646266',
    black60: '#4D4A4F',
    black70: '#363438',
    black80: '#211E22',
  },
  borderRadius: {
    '0x': borderRadiusScale(0),
    '1x': borderRadiusScale(1),
    '2x': borderRadiusScale(2),
    '3x': borderRadiusScale(3),
    '4x': borderRadiusScale(4),
    '5x': borderRadiusScale(5),
    full: '99999px',
  },
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  fontSize: {
    '0': fontSizeScale(0),
    '500': fontSizeScale(1),
    '1000': fontSizeScale(2),
    '1500': fontSizeScale(3),
    '2000': fontSizeScale(4),
    '2500': fontSizeScale(5),
    '3000': fontSizeScale(6),
    '3500': fontSizeScale(7),
    '4000': fontSizeScale(8),
  },
  lineHeight: {
    '0': lineHeightScale(0),
    '500': lineHeightScale(1),
    '1000': lineHeightScale(2),
    '1500': lineHeightScale(3),
    '2000': lineHeightScale(4),
    '2500': lineHeightScale(5),
    '3000': lineHeightScale(6),
    '3500': lineHeightScale(7),
    '4000': lineHeightScale(8),
  },
});
