import { RuleTester } from "eslint";
import rule from "../../../src/rules/no-space-dots";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("no-space-dots", rule as any, loadTestCases("no-space-dots"));
