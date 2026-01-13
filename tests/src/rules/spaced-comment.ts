import { RuleTester } from "eslint";
import rule from "../../../src/rules/spaced-comment.ts";
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

tester.run("spaced-comment", rule as any, loadTestCases("spaced-comment"));
