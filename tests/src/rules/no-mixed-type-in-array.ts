import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-mixed-type-in-array";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "1.1",
  },
});

tester.run(
  "no-mixed-type-in-array",
  rule as any,
  loadTestCases("no-mixed-type-in-array"),
);
