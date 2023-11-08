import { RuleTester } from "eslint";
import rule from "../../../src/rules/spaced-comment";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "1.1",
  },
});

tester.run("spaced-comment", rule as any, loadTestCases("spaced-comment"));
