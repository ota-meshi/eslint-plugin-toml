import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/table-bracket-spacing";
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
  "table-bracket-spacing",
  rule as any,
  loadTestCases("table-bracket-spacing"),
);
