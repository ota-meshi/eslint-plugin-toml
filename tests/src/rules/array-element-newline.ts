import { RuleTester } from "eslint";
import rule from "../../../src/rules/array-element-newline";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run(
  "array-element-newline",
  rule as any,
  loadTestCases("array-element-newline"),
);
