import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-space-dots.ts";
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

tester.run("no-space-dots", rule as any, loadTestCases("no-space-dots"));
