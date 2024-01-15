import { RuleTester } from "../../test-lib/eslint-compat";
import rule from "../../../../src/rules/vue-custom-block/no-parsing-error";
import { loadTestCases } from "../../../utils/utils";
import * as vueParser from "vue-eslint-parser";

const tester = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run(
  "vue-custom-block/no-parsing-error",
  rule as any,
  loadTestCases("vue-custom-block/no-parsing-error"),
);
