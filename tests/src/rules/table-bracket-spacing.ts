import { RuleTester } from "eslint";
import rule from "../../../src/rules/table-bracket-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run(
  "table-bracket-spacing",
  rule as any,
  loadTestCases("table-bracket-spacing"),
);
