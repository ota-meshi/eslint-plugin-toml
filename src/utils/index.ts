/* eslint @typescript-eslint/no-explicit-any: off -- util */
import type {
  RuleListener,
  RuleModule,
  PartialRuleModule,
  RuleContext,
} from "../types";
import type * as ESTree from "estree";
import type { Rule } from "eslint";
import type { AST } from "toml-eslint-parser";
import * as tomlESLintParser from "toml-eslint-parser";
import debug from "debug";
import path from "path";
const log = debug("eslint-plugin-toml:utils/index");

/**
 * Define the rule.
 * @param ruleName ruleName
 * @param rule rule module
 */
export function createRule(
  ruleName: string,
  rule: PartialRuleModule
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
    create(context: Rule.RuleContext): any {
      if (
        typeof context.parserServices.defineCustomBlocksVisitor ===
          "function" &&
        path.extname(context.getFilename()) === ".vue"
      ) {
        return context.parserServices.defineCustomBlocksVisitor(
          context,
          tomlESLintParser,
          {
            target: ["toml", "toml"],
            create(blockContext: Rule.RuleContext) {
              return rule.create(blockContext as any, {
                customBlock: true,
              });
            },
          }
        );
      }
      return rule.create(context as any, {
        customBlock: false,
      });
    },
  };
}

type CoreRuleListener = {
  [key: string]: (node: any) => void;
};
/**
 * Define the wrapped core rule.
 */
export function defineWrapperListener(
  coreRule: Rule.RuleModule,
  context: RuleContext,
  proxyOptions: {
    options: any[];
    createListenerProxy?: (listener: CoreRuleListener) => RuleListener;
    getNodeProxy?: (node: AST.TOMLNode) => any;
  }
): RuleListener {
  if (!context.parserServices.isTOML) {
    return {};
  }
  const sourceCode = context.getSourceCode();
  const proxySourceCode = {
    __proto__: sourceCode,
    ...(["getNodeByRangeIndex"] as const).reduce((obj, key) => {
      obj[key] = (...args: any[]) => {
        const node = (sourceCode[key] as any)(...args);
        return proxyOptions.getNodeProxy?.(node) || node;
      };
      return obj;
    }, {} as any),
  };
  const listener = coreRule.create({
    // @ts-expect-error -- proto
    __proto__: context,
    options: proxyOptions.options,
    getSourceCode() {
      return proxySourceCode;
    },
    sourceCode: proxySourceCode,
  }) as RuleListener;

  const tomlListener =
    proxyOptions.createListenerProxy?.(listener as CoreRuleListener) ??
    listener;

  return tomlListener;
}

/**
 * Get the proxy node
 */
export function getProxyNode(node: AST.TOMLNode, properties: any): any {
  const safeKeys = new Set<string | number | symbol>([
    "range",
    "typeAnnotation",
  ]);
  const cache: any = {};
  return new Proxy(node, {
    get(_t, key) {
      if (key in cache) {
        return cache[key];
      }
      if (key in properties) {
        return (cache[key] = properties[key]);
      }
      if (!safeKeys.has(key)) {
        log(`fallback: ${String(key)}`);
      }
      return (node as any)[key];
    },
  });
}

const convertedESNodeCache = new WeakMap<AST.TOMLNode, ESTree.Node>();
/**
 * Converts the given TOML node to the ES node and returns it.
 */
export function convertESNode(node: AST.TOMLNode): ESTree.Node {
  const converted = convertedESNodeCache.get(node);
  if (converted) {
    return converted;
  }
  let esNode: ESTree.Node;
  if (node.type === "TOMLInlineTable") {
    const properties = node.body;
    esNode = getProxyNode(node, {
      type: "ObjectExpression",
      get properties() {
        return properties.map(convertESNode);
      },
    });
  } else if (node.type === "TOMLArray") {
    const elements = node.elements;
    esNode = getProxyNode(node, {
      type: "ArrayExpression",
      get elements() {
        return elements.map(convertESNode);
      },
    });
  } else {
    esNode = node as any;
  }
  convertedESNodeCache.set(node, esNode);
  return esNode;
}

let ruleMap: Map<string, Rule.RuleModule> | null = null;

/**
 * Get the core rule implementation from the rule name
 */
export function getCoreRule(ruleName: string): Rule.RuleModule {
  let map: Map<string, Rule.RuleModule>;
  if (ruleMap) {
    map = ruleMap;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires -- load eslint
    ruleMap = map = new (require("eslint").Linter)().getRules();
  }
  return map.get(ruleName)!;
}
