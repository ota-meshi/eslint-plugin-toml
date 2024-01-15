import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/keys-order";
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

tester.run("keys-order", rule as any, loadTestCases("keys-order"));
