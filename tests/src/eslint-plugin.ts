import path from "path"
import assert from "assert"
import { ESLint } from "./eslint-compat"
import plugin from "../../src/index"

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const TEST_CWD = path.join(__dirname, "../fixtures/integrations/eslint-plugin")

describe("Integration with eslint-plugin-toml", () => {
    it("should lint without errors", async () => {
        const engine = new ESLint({
            cwd: TEST_CWD,
            extensions: [".js", ".toml"],
            plugins: { "eslint-plugin-toml": plugin },
        })
        const results = await engine.lintFiles(["test01/src"])
        assert.strictEqual(results.length, 2)
        assert.strictEqual(
            results.reduce((s, a) => s + a.errorCount, 0),
            0,
        )
    })
})
