import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/indent";
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

tester.run("indent", rule as any, loadTestCases("indent"));
