import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/space-eq-sign";
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

tester.run("space-eq-sign", rule as any, loadTestCases("space-eq-sign"));
