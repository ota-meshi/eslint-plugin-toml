import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/array-element-newline.ts";
import { loadTestCases } from "../../utils/utils.ts";
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
  "array-element-newline",
  rule as any,
  loadTestCases("array-element-newline"),
);
