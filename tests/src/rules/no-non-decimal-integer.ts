import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-non-decimal-integer";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run(
  "no-non-decimal-integer",
  rule as any,
  loadTestCases("no-non-decimal-integer"),
);
