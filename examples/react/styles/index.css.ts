import { globalStyle, globalKeyframes, layer } from '@vanilla-extract/css';
import { resetLayer } from '../layers.css';

globalStyle('body, h1, h2, h3, h4, h5, h6, p, div', {
  '@layer': {
    [resetLayer]: {
      all: 'unset',
      boxSizing: 'border-box',
    },
  },
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
