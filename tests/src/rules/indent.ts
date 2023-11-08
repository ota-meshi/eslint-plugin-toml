import { RuleTester } from "eslint";
import rule from "../../../src/rules/indent";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("indent", rule as any, loadTestCases("indent"));
