'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-integration.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-integration.cjs.dev.js");
}
