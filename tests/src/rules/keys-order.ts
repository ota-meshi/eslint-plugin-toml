import { RuleTester } from "eslint";
import rule from "../../../src/rules/keys-order.ts";
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

tester.run("keys-order", rule as any, loadTestCases("keys-order"));
