import { globalStyle, globalKeyframes } from '@vanilla-extract/css';

globalStyle('body, h1, h2, h3, h4, h5, h6, p, div', {
  all: 'unset',
  boxSizing: 'border-box',
});

globalKeyframes('pinwheelSpin', {
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});
