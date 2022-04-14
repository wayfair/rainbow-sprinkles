'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-css-injectStyles.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-css-injectStyles.cjs.dev.js");
}
