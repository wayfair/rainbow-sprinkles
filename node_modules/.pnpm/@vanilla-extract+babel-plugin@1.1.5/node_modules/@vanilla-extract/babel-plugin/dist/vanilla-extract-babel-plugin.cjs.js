'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-babel-plugin.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-babel-plugin.cjs.dev.js");
}
