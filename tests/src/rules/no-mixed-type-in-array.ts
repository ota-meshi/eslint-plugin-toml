import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-mixed-type-in-array";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    ecmaVersion: 2020,
  },
});

tester.run(
  "no-mixed-type-in-array",
  rule as any,
  loadTestCases("no-mixed-type-in-array"),
);
