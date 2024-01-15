import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/no-mixed-type-in-array";
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
  "no-mixed-type-in-array",
  rule as any,
  loadTestCases("no-mixed-type-in-array"),
);
