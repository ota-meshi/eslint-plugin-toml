import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/spaced-comment";
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

tester.run("spaced-comment", rule as any, loadTestCases("spaced-comment"));
