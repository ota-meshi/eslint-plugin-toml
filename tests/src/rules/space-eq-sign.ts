import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/space-eq-sign.ts";
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

tester.run("space-eq-sign", rule as any, loadTestCases("space-eq-sign"));
