import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-non-decimal-integer.ts";
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
  "no-non-decimal-integer",
  rule as any,
  loadTestCases("no-non-decimal-integer"),
);
