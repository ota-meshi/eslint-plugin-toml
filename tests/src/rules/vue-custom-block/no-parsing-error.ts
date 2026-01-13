import rule from "../../../../src/rules/vue-custom-block/no-parsing-error.ts";
import { loadTestCases } from "../../../utils/utils.ts";
import * as vueParser from "vue-eslint-parser";
import semver from "semver";
import { RuleTester } from "eslint";

if (semver.satisfies(process.version, ">=18")) {
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
}
