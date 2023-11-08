import { RuleTester } from "eslint";
import rule from "../../../src/rules/padding-line-between-pairs";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run(
  "padding-line-between-pairs",
  rule as any,
  loadTestCases("padding-line-between-pairs"),
);
