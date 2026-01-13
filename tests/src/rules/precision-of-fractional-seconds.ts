import { RuleTester } from "eslint";
import rule from "../../../src/rules/precision-of-fractional-seconds.ts";
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

tester.run(
  "precision-of-fractional-seconds",
  rule as any,
  loadTestCases("precision-of-fractional-seconds"),
);
