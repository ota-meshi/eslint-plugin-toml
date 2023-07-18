import { RuleTester } from "eslint";
import rule from "../../../src/rules/padding-line-between-tables";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run(
  "padding-line-between-tables",
  rule as any,
  loadTestCases("padding-line-between-tables"),
);
