import path from "path";
import fs from "fs";
import type { RuleModule } from "../../src/types.ts";

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- It's only used in script
const dirname = import.meta.dirname;

/**
 * Get the all rules
 * @returns {Array} The all rules
 */
async function readRules() {
  const rules: RuleModule[] = [];
  const rulesLibRoot = path.resolve(dirname, "../../src/rules");
  for (const name of fs
    .readdirSync(rulesLibRoot)
    .filter((n) => n.endsWith(".ts"))) {
    const ruleName = name.replace(/\.ts$/u, "");
    const ruleId = `toml/${ruleName}`;
    const rule = (await import(path.join(rulesLibRoot, name))).default;

    rule.meta.docs.ruleName = ruleName;
    rule.meta.docs.ruleId = ruleId;

    rules.push(rule);
  }
  const vueCustomBlockRulesLibRoot = path.resolve(
    dirname,
    "../../src/rules/vue-custom-block",
  );
  for (const name of fs.readdirSync(vueCustomBlockRulesLibRoot)) {
    const ruleName = `vue-custom-block/${name.replace(/\.ts$/u, "")}`;
    const ruleId = `toml/${ruleName}`;

    const rule = (await import(path.join(vueCustomBlockRulesLibRoot, name)))
      .default;

    rule.meta.docs.ruleName = ruleName;
    rule.meta.docs.ruleId = ruleId;

    rules.push(rule);
  }
  return rules;
}

export const rules = await readRules();
