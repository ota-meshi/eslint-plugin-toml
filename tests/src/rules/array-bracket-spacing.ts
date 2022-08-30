import { RuleTester } from "eslint";
import rule from "../../../src/rules/array-bracket-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run(
  "array-bracket-spacing",
  rule as any,
  loadTestCases("array-bracket-spacing")
);
