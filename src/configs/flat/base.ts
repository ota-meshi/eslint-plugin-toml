import type { ESLint } from "eslint";
import * as parser from "toml-eslint-parser";
export default [
  {
    plugins: {
      get toml(): ESLint.Plugin {
        // eslint-disable-next-line @typescript-eslint/no-require-imports -- ignore
        return require("../../index");
      },
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
];
