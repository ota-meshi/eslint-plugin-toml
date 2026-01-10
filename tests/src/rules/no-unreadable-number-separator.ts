import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/no-unreadable-number-separator.ts";
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
  "no-unreadable-number-separator",
  rule as any,
  loadTestCases("no-unreadable-number-separator"),
);
