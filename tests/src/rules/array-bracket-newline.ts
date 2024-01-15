import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/array-bracket-newline";
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
  "array-bracket-newline",
  rule as any,
  loadTestCases("array-bracket-newline"),
);
