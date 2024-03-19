import assert from "assert";
import plugin from "../../../src/index";
import { LegacyESLint, ESLint } from "../test-lib/eslint-compat";

const code = `foo =   42`;
describe("`standard` config", () => {
  it("legacy `standard` config should work. ", async () => {
    const linter = new LegacyESLint({
      plugins: {
        toml: plugin as never,
      },
      baseConfig: {
        parserOptions: {
          ecmaVersion: 2020,
        },
        extends: ["plugin:toml/recommended", "plugin:toml/standard"],
      },
      useEslintrc: false,
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
  it("`flat/standard` config should work. ", async () => {
    const linter = new ESLint({
      // @ts-expect-error -- typing bug
      overrideConfigFile: true,
      // @ts-expect-error -- typing bug
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
  it("`flat/standard` config with *.js should work. ", async () => {
    const linter = new ESLint({
      // @ts-expect-error -- typing bug
      overrideConfigFile: true,
      // @ts-expect-error -- typing bug
      overrideConfig: [
        ...plugin.configs["flat/recommended"],
        ...plugin.configs["flat/standard"],
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
