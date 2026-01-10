import type { ESLint, Linter } from "eslint";
import * as parser from "toml-eslint-parser";
import { plugin } from "../../plugin-proxy";

export default [
  {
    plugins: {
      toml: plugin as ESLint.Plugin,
    },
  },
  {
    files: ["*.toml", "**/*.toml"],
    languageOptions: {
      parser,
    },
    rules: {
      // ESLint core rules known to cause problems with TOML.
      "no-irregular-whitespace": "off",
      "spaced-comment": "off",
    },
  },
] satisfies Linter.FlatConfig[];
