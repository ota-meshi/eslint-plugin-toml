import assert from "assert";
import plugin from "../../../src/index.ts";
import { ESLint } from "../test-lib/eslint-compat.ts";

const code = `foo =   42`;
describe("`standard` config", () => {
  it("`standard` config should work. ", async () => {
    const linter = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs.recommended,
        ...plugin.configs.standard,
      ],
    });
    const result = await linter.lintText(code, { filePath: "test.toml" });
    const messages = result[0].messages;

    assert.deepStrictEqual(
      messages.map((m) => ({
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      })),
      [
        {
          message: "Extra space before value for key 'foo'.",
          ruleId: "toml/key-spacing",
          line: 1,
        },
      ],
    );
  });
  it("`flat/standard` config should work (backward compatibility). ", async () => {
    const linter = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs["flat/recommended"],
        ...plugin.configs["flat/standard"],
      ],
    });
    const result = await linter.lintText(code, { filePath: "test.toml" });
    const messages = result[0].messages;

    assert.deepStrictEqual(
      messages.map((m) => ({
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      })),
      [
        {
          message: "Extra space before value for key 'foo'.",
          ruleId: "toml/key-spacing",
          line: 1,
        },
      ],
    );
  });
  it("`standard` config with *.js should work. ", async () => {
    const linter = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...plugin.configs.recommended,
        ...plugin.configs.standard,
      ],
    });

    const result = await linter.lintText(";", { filePath: "test.js" });
    const messages = result[0].messages;

    assert.deepStrictEqual(
      messages.map((m) => ({
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      })),
      [],
    );
  });
});
