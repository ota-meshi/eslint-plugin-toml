import path from "path";
import assert from "assert";
import { getESLint } from "eslint-compat-utils";
import plugin from "../../src/index";

// eslint-disable-next-line @typescript-eslint/naming-convention -- Class name
const ESLint = getESLint();

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const TEST_CWD = path.join(__dirname, "../fixtures/integrations/eslint-plugin");

describe("Integration with eslint-plugin-toml", () => {
  it("should lint without errors", async () => {
    const engine = new ESLint({
      cwd: TEST_CWD,
      extensions: [".js", ".toml"],
      plugins: { "eslint-plugin-toml": plugin as any },
    });
    const results = await engine.lintFiles(["test01/src"]);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(
      results.reduce((s, a) => s + a.errorCount, 0),
      0,
    );
  });
});
