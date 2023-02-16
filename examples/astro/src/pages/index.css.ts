import { globalStyle, globalKeyframes } from '@vanilla-extract/css';

globalStyle('body, h1, h2, h3, h4, h5, h6, p, div', {
  all: 'unset',
  boxSizing: 'border-box',
});

globalKeyframes('pinwheelSpin', {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '20%': {
    transform: 'rotate(30deg) scale(1.2)',
  },
  '40%': {
    transform: 'rotate(-45deg) scale(1.2)',
  },
  '100%': {
    transform: 'rotate(720deg)',
  },
});
