import { RuleTester } from "eslint";
import rule from "../../../src/rules/array-bracket-spacing.ts";
import { loadTestCases } from "../../utils/utils.ts";
import plugin from "../../../src/index.ts";

const tester = new RuleTester({
  plugins: { toml: plugin },
  language: "toml/toml",
  languageOptions: {
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run(
  "array-bracket-spacing",
  rule as any,
  loadTestCases("array-bracket-spacing"),
);
