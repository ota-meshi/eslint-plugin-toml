import { RuleTester } from "eslint";
import rule from "../../../src/rules/space-eq-sign.ts";
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

tester.run("space-eq-sign", rule as any, loadTestCases("space-eq-sign"));
