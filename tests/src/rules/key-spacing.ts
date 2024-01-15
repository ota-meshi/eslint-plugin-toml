import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/key-spacing";
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

tester.run("key-spacing", rule as any, loadTestCases("key-spacing"));
