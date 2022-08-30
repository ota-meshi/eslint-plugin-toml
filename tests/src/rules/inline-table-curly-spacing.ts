import { RuleTester } from "eslint";
import rule from "../../../src/rules/inline-table-curly-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run(
  "inline-table-curly-spacing",
  rule as any,
  loadTestCases("inline-table-curly-spacing")
);
