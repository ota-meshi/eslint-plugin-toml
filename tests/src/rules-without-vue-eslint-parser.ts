import { Linter } from "eslint";
import plugin from "../../src/index";
import assert from "assert";
const rules = plugin.rules;

describe("Don't crash even if without toml-eslint-parser.", () => {
  const code = "{a:[1,2,3,4]}";

  for (const key of Object.keys(rules)) {
    const ruleId = `toml/${key}`;

    it(ruleId, () => {
      const linter = new Linter();
      const config: Linter.Config = {
        parserOptions: { ecmaVersion: 2015 },
        rules: {
          [ruleId]: "error",
        },
      };
      linter.defineRule(ruleId, rules[key] as any);
      const resultJs = linter.verifyAndFix(code, config, "test.js");
      assert.strictEqual(resultJs.messages.length, 0);
    });
  }
});
