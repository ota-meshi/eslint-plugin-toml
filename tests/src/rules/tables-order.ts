import { RuleTester } from "eslint";
import rule from "../../../src/rules/tables-order";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("tables-order", rule as any, loadTestCases("tables-order"));
