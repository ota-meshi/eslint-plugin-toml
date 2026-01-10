import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/precision-of-fractional-seconds.ts";
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
  "precision-of-fractional-seconds",
  rule as any,
  loadTestCases("precision-of-fractional-seconds"),
);
