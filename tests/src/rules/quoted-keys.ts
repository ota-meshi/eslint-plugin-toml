import { RuleTester } from "../test-lib/eslint-compat.ts";
import rule from "../../../src/rules/quoted-keys.ts";
import { loadTestCases } from "../../utils/utils.ts";
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
