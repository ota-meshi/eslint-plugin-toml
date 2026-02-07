import assert from "node:assert";
import plugin from "../../../src/index.ts";
import { ESLint } from "eslint";
import stylistic from "@stylistic/eslint-plugin";

describe("Test to make sure that ESLint Stylistic rules don't crash with language: 'toml/toml'", () => {
  const code = `# Test TOML file
title = "TOML Example"
number = 42
float = 3.14
bool = true
date = 1979-05-27T07:32:00-08:00

[owner]
name = "Tom Preston-Werner"

[database]
enabled = true
ports = [8001, 8002, 8003]

[[products]]
name = "Hammer"
sku = 738594937

[[products]]
name = "Nail"
sku = 284758393
`;

  for (const [ruleId, rule] of Object.entries(stylistic.rules)) {
    if (rule.meta?.deprecated) continue;
    it(`ESLint Stylistic rule '${ruleId}' should not crash`, async () => {
      const eslint = new ESLint({
        overrideConfigFile: true,
        overrideConfig: [
          {
            plugins: {
              toml: plugin,
              "@stylistic": stylistic,
            },
            files: ["**/*.toml"],
            language: "toml/toml",
            rules: {
              [`@stylistic/${ruleId}`]: "error",
            },
          },
        ],
      });

      // Make sure linting can be performed without crashing
      const results = await eslint.lintText(code, { filePath: "test.toml" });

      assert.ok(Array.isArray(results));
      assert.strictEqual(results.length, 1);
      assert.deepStrictEqual(results[0].messages, []);
    });
  }
});
