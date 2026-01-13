import { RuleTester } from "eslint";
import rule from "../../../src/rules/padding-line-between-pairs.ts";
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
  "padding-line-between-pairs",
  rule as any,
  loadTestCases("padding-line-between-pairs"),
);
