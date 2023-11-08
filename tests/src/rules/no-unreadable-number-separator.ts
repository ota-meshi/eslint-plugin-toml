import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-unreadable-number-separator";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run(
  "no-unreadable-number-separator",
  rule as any,
  loadTestCases("no-unreadable-number-separator"),
);
