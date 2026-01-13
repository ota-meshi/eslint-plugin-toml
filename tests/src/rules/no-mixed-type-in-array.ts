import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-mixed-type-in-array.ts";
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
  "no-mixed-type-in-array",
  rule as any,
  loadTestCases("no-mixed-type-in-array"),
);
