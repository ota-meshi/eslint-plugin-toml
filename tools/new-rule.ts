import path from "path";
import fs from "fs";
import cp from "child_process";
const logger = console;

// main
((ruleId) => {
  if (ruleId == null) {
    logger.error("Usage: npm run new <RuleID>");
    process.exitCode = 1;
    return;
  }
  if (!/^[\w-]+$/u.test(ruleId)) {
    logger.error("Invalid RuleID '%s'.", ruleId);
    process.exitCode = 1;
    return;
  }

  const ruleFile = path.resolve(__dirname, `../src/rules/${ruleId}.ts`);
  const testFile = path.resolve(__dirname, `../tests/src/rules/${ruleId}.ts`);
  const fixturesRoot = path.resolve(
    __dirname,
    `../tests/fixtures/rules/${ruleId}/`,
  );
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`);
  try {
    fs.mkdirSync(fixturesRoot);
    fs.mkdirSync(path.resolve(fixturesRoot, "valid"));
    fs.mkdirSync(path.resolve(fixturesRoot, "invalid"));
  } catch {
    // ignore
  }

  fs.writeFileSync(
    ruleFile,
    `
import type { AST } from "toml-eslint-parser"
import { createRule } from "../utils/index.ts"

export default createRule("${ruleId}", {
    meta: {
        docs: {
            description: "...",
            categories: ["..."],
        },
        fixable: null,
        hasSuggestions: null,
        schema: [],
        messages: {},
        type: "",
    },
    create(context) {
      const sourceCode = context.sourceCode
        if (!sourceCode.parserServices?.isTOML) {
            return {}
        }

        return {
          // ...
        }
    },
})
`,
  );
  fs.writeFileSync(
    testFile,
    `import { RuleTester } from "../test-lib/eslint-compat.ts"
import rule from "../../../src/rules/${ruleId}.ts"
import { loadTestCases } from "../../utils/utils.ts"
import plugin from "../../../src/index.ts";

const tester = new RuleTester({
  plugins: { toml: plugin },
  language: "toml/toml",
  languageOptions: {
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run("${ruleId}", rule as any, loadTestCases("${ruleId}"))
`,
  );
  fs.writeFileSync(
    docFile,
    `#  (toml/${ruleId})

> description

## :book: Rule Details

This rule reports ???.


<eslint-code-block fix>

<!-- eslint-skip -->

\`\`\`toml
# eslint toml/${ruleId}: 'error'

# ✓ GOOD
"good" = "foo"

# ✗ BAD
"bad" = "bar"
\`\`\`

</eslint-code-block>

## :wrench: Options

Nothing.

\`\`\`yaml
"toml/${ruleId}":
  - "error"
  - "opt"
\`\`\`

Same as [${ruleId}] rule option. See [here](https://eslint.org/docs/rules/${ruleId}#options) for details.

- 

## :books: Further reading

- 

## :couple: Related rules

- [${ruleId}]

[${ruleId}]: https://eslint.org/docs/rules/${ruleId}

`,
  );

  cp.execSync(`code "${ruleFile}"`);
  cp.execSync(`code "${testFile}"`);
  cp.execSync(`code "${docFile}"`);
})(process.argv[2]);
