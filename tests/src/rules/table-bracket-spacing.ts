import { RuleTester } from "eslint";
import rule from "../../../src/rules/table-bracket-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "1.1",
  },
});

tester.run(
  "table-bracket-spacing",
  rule as any,
  loadTestCases("table-bracket-spacing"),
);
