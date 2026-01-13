import { RuleTester } from "eslint";
import rule from "../../../src/rules/tables-order.ts";
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

tester.run("tables-order", rule as any, loadTestCases("tables-order"));
