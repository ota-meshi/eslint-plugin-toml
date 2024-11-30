import path from "path";
import assert from "assert";
import { getLegacyESLint, getESLint } from "eslint-compat-utils/eslint";
import plugin from "../../src/index";
import { setPlugin } from "../fixtures/integrations/eslint-plugin/plugin-store.cjs";
import semver from "semver";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

setPlugin(plugin);

describe("Integration with eslint-plugin-toml", () => {
  it("should lint without errors (legacy)", async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Class name
    const ESLint = getLegacyESLint();
    const engine = new ESLint({
      cwd: path.join(
        __dirname,
        "../fixtures/integrations/eslint-plugin/legacy-test01",
      ),
      // @ts-expect-error -- old
      extensions: [".js", ".toml"],
      plugins: { "eslint-plugin-toml": plugin as any },
    });
    const results = await engine.lintFiles(["src"]);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(
      results.reduce((s, a) => s + a.errorCount, 0),
      0,
    );
  });
  describe("should lint without errors", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Class name
    const ESLint = getESLint();
    if (!semver.satisfies(ESLint.version, ">=8")) return;
    for (const { dir, expects } of [
      {
        dir: "test01",
        expects: {
          files: 2,
          errors: 0,
        },
      },
      {
        dir: "with-json",
        expects: {
          files: 2,
          errors: 0,
        },
      },
    ]) {
      it(dir, async () => {
        const engine = new ESLint({
          cwd: path.join(
            __dirname,
            `../fixtures/integrations/eslint-plugin/${dir}`,
          ),
        });
        const results = await engine.lintFiles(["src"]);
        assert.strictEqual(results.length, expects.files);
        assert.strictEqual(
          results.reduce((s, a) => s + a.errorCount, 0),
          expects.errors,
        );
      });
    }
  });
});
