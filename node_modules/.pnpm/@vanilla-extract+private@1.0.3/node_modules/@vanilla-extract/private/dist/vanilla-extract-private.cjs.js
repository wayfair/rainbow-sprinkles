'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./vanilla-extract-private.cjs.prod.js");
} else {
  module.exports = require("./vanilla-extract-private.cjs.dev.js");
}
