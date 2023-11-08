import { RuleTester } from "eslint";
import rule from "../../../src/rules/inline-table-curly-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "1.1",
  },
});

tester.run(
  "inline-table-curly-spacing",
  rule as any,
  loadTestCases("inline-table-curly-spacing"),
);
