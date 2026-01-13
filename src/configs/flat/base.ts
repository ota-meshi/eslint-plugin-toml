import type { ESLint, Linter } from "eslint";
import plugin from "../../index.ts";

export default [
  {
    plugins: {
      get toml(): ESLint.Plugin {
        return plugin;
      },
    },
  },
  {
    files: ["*.toml", "**/*.toml"],
    language: "toml/toml",
    rules: {
      // ESLint core rules known to cause problems with TOML.
      "no-irregular-whitespace": "off",
      "spaced-comment": "off",
    },
  },
] satisfies Linter.Config[];
