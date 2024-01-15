import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/tables-order";
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

tester.run("tables-order", rule as any, loadTestCases("tables-order"));
