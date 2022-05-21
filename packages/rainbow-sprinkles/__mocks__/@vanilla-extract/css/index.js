const VE = require('@vanilla-extract/css');

function createVar(args) {
  return `--${args}`;
}

function style(styleObject, debugId) {
  return debugId;
}

module.exports = {
  ...VE,
  style: jest.fn(style),
  createVar: jest.fn(createVar),
};
