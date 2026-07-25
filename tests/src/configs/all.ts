import assert from "node:assert";
import plugin from "../../../src/index.ts";
import { ESLint } from "eslint";

const code = `foo = 0x10`;

describe("`all` config", () => {
  it("includes every non-deprecated rule", () => {
    const allRules =
      plugin.configs.all[plugin.configs.all.length - 1]?.rules ?? {};
    const expectedRules = Object.entries(plugin.rules)
      .filter(([, rule]) => !rule.meta?.deprecated)
      .map(([ruleName]) => `toml/${ruleName}`)
      .sort();
    const configuredRules = Object.keys(allRules).sort();

    assert.deepStrictEqual(configuredRules, expectedRules);
    assert.strictEqual(allRules["toml/space-eq-sign"], undefined);
  });

  for (const configName of ["all", "flat/all"] as const) {
    it(`\`${configName}\` config should enable all non-deprecated rules.`, async () => {
      const linter = new ESLint({
        overrideConfigFile: true,
        overrideConfig: plugin.configs[configName],
      });
      const result = await linter.lintText(code, { filePath: "test.toml" });

      assert.deepStrictEqual(
        result[0].messages.map((message) => message.ruleId),
        ["toml/no-non-decimal-integer"],
      );
    });
  }
});
