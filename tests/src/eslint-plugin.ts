import path from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import { getESLint } from "eslint-compat-utils/eslint";
import plugin from "../../src/index.ts";
import { setPlugin } from "../fixtures/integrations/eslint-plugin/plugin-store.cjs";
import semver from "semver";

// ESM compatibility
// eslint-disable-next-line @typescript-eslint/naming-convention -- ESM compat
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention -- ESM compat
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

setPlugin(plugin);

describe("Integration with eslint-plugin-toml", () => {
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
      ...(semver.satisfies(process.version, ">=18")
        ? [
            {
              dir: "with-json",
              expects: {
                files: 2,
                errors: 0,
              },
            },
          ]
        : []),
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
