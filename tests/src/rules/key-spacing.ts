import { RuleTester } from "eslint";
import rule from "../../../src/rules/key-spacing";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester({
  parser: require.resolve("toml-eslint-parser"),
  parserOptions: {
    tomlVersion: "next",
  },
});

tester.run("key-spacing", rule as any, loadTestCases("key-spacing"));
