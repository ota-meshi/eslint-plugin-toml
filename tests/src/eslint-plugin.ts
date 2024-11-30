import path from "path";
import assert from "assert";
import { getLegacyESLint, getESLint } from "eslint-compat-utils/eslint";
import plugin from "../../src/index";
import { setPlugin } from "../fixtures/integrations/eslint-plugin/plugin-store.cjs";

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
  it("should lint without errors", async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Class name
    const ESLint = getESLint();
    const engine = new ESLint({
      cwd: path.join(
        __dirname,
        "../fixtures/integrations/eslint-plugin/test01",
      ),
    });
    const results = await engine.lintFiles(["src"]);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(
      results.reduce((s, a) => s + a.errorCount, 0),
      0,
    );
  });
});
