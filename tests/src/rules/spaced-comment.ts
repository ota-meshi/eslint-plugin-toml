import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/spaced-comment.ts";
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

tester.run("spaced-comment", rule as any, loadTestCases("spaced-comment"));
