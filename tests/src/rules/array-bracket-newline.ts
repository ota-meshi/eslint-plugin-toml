import { RuleTester } from "eslint";
import rule from "../../../src/rules/array-bracket-newline";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run(
  "array-bracket-newline",
  rule as any,
  loadTestCases("array-bracket-newline"),
);
