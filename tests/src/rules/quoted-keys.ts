import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/quoted-keys";
import { loadTestCases } from "../../utils/utils";
import * as tomlParser from "toml-eslint-parser";

const tester = new RuleTester({
  languageOptions: {
    parser: tomlParser,
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run("quoted-keys", rule as any, loadTestCases("quoted-keys"));
