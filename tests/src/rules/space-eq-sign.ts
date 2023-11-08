import { RuleTester } from "eslint";
import rule from "../../../src/rules/space-eq-sign";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("space-eq-sign", rule as any, loadTestCases("space-eq-sign"));
