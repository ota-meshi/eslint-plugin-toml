import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/no-non-decimal-integer";
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
  "no-non-decimal-integer",
  rule as any,
  loadTestCases("no-non-decimal-integer"),
);
