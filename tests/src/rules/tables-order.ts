import { RuleTester } from "eslint";
import rule from "../../../src/rules/tables-order";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run("tables-order", rule as any, loadTestCases("tables-order"));
