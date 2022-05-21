const VE = require('@vanilla-extract/css');

function createVar(args) {
  return `--${args}`;
}

function style(styleObject, debugId) {
  // function find(obj) {
  //   for (const key in obj) {
  //     if (typeof obj[key] === 'string') {
  //       const value = obj[key];
  //       return value.startsWith('--') ? value : `static-${key}-${obj[key]}`;
  //     } else {
  //       return style(obj[key]);
  //     }
  //   }
  // }
  // const result = find(styleObject);
  // return result.startsWith('--') ? result.slice(2) : result;
  return debugId;
}

module.exports = {
  ...VE,
  style: jest.fn(style),
  createVar: jest.fn(createVar),
};
