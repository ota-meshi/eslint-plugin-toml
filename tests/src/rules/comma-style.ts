import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/comma-style.ts";
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

tester.run("comma-style", rule as any, loadTestCases("comma-style"));
