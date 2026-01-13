import { RuleTester } from "eslint";
import rule from "../../../src/rules/array-element-newline.ts";
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
  "array-element-newline",
  rule as any,
  loadTestCases("array-element-newline"),
);
