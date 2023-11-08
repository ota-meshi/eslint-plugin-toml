import { RuleTester } from "eslint";
import rule from "../../../src/rules/comma-style";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("comma-style", rule as any, loadTestCases("comma-style"));
