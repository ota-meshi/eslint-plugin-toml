import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/inline-table-curly-spacing";
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
  "inline-table-curly-spacing",
  rule as any,
  loadTestCases("inline-table-curly-spacing"),
);
