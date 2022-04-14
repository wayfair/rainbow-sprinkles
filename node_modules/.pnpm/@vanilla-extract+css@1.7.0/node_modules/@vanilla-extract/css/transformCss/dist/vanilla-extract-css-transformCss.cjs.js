'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-css-transformCss.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-css-transformCss.cjs.dev.js");
}
