import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/no-space-dots";
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

tester.run("no-space-dots", rule as any, loadTestCases("no-space-dots"));
