import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/padding-line-between-pairs";
import { loadTestCases } from "../../utils/utils";
import * as tomlParser from "toml-eslint-parser";

const tester = new RuleTester({
  languageOptions: {
    parser: tomlParser,
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
