import { getLinter } from "eslint-compat-utils/linter";
import plugin from "../../src/index";
import assert from "assert";
const rules = plugin.rules;
// eslint-disable-next-line @typescript-eslint/naming-convention -- class name
const Linter = getLinter();

describe("Don't crash even if without toml-eslint-parser.", () => {
  const code = "{a:[1,2,3,4]}";

  for (const key of Object.keys(rules)) {
    const ruleId = `toml/${key}`;

    it(ruleId, () => {
      const linter = new Linter();
      const config = {
        languageOptions: { ecmaVersion: 2015 },
        plugins: {
          toml: plugin,
        },
        rules: {
          [ruleId]: "error",
        },
      } as any;
      const resultJs = linter.verifyAndFix(code, config, "test.js");
      assert.strictEqual(resultJs.messages.length, 0);
    });
  }
});
