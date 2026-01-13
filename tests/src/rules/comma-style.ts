import { RuleTester } from "eslint";
import rule from "../../../src/rules/comma-style.ts";
import { loadTestCases } from "../../utils/utils.ts";
import plugin from "../../../src/index.ts";

const tester = new RuleTester({
  plugins: { toml: plugin },
  language: "toml/toml",
  languageOptions: {
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run("comma-style", rule as any, loadTestCases("comma-style"));
