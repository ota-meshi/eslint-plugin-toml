import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/indent.ts";
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

tester.run("indent", rule as any, loadTestCases("indent"));
