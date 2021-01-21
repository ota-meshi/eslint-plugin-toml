"use strict";
module.exports = {
  root: true,
  extends: ["plugin:toml/standard", "plugin:jsonc/recommended-with-jsonc"],
  rules: {
    "toml/indent": ["error", 2, { subTables: 1, keyValuePairs: 1 }],
  },
};
