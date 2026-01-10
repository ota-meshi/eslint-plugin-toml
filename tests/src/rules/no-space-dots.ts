import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/no-space-dots.ts";
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

tester.run("no-space-dots", rule as any, loadTestCases("no-space-dots"));
