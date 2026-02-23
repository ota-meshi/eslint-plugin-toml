import { RuleTester } from "eslint";
import rule from "../../../src/rules/inline-table-curly-newline.ts";
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
  "inline-table-curly-newline",
  rule as any,
  loadTestCases("inline-table-curly-newline"),
);
