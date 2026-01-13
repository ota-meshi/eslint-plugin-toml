/* eslint @typescript-eslint/no-explicit-any: off -- util */
import type { RuleModule, PartialRuleModule, RuleContext } from "../types.ts";
import type { Rule } from "eslint";
import * as tomlESLintParser from "toml-eslint-parser";
import path from "path";

/**
 * Define the rule.
 * @param ruleName ruleName
 * @param rule rule module
 */
export function createRule(
  ruleName: string,
  rule: PartialRuleModule,
): RuleModule {
  return {
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url: `https://ota-meshi.github.io/eslint-plugin-toml/rules/${ruleName}.html`,
        ruleId: `toml/${ruleName}`,
        ruleName,
      },
    },
    create(context: RuleContext): any {
      const sourceCode = context.sourceCode;
      const parserServices: Record<string, unknown> =
        sourceCode.parserServices || {};
      if (
        typeof parserServices.defineCustomBlocksVisitor === "function" &&
        path.extname(context.filename) === ".vue"
      ) {
        return parserServices.defineCustomBlocksVisitor(
          context,
          tomlESLintParser,
          {
            target: ["toml", "toml"],
            create(blockContext: Rule.RuleContext) {
              return rule.create(blockContext as any, {
                customBlock: true,
              });
            },
          },
        );
      }
      return rule.create(context as any, {
        customBlock: false,
      });
    },
  };
}
