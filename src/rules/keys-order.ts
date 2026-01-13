import type { AST } from "toml-eslint-parser";
import { getStaticTOMLValue } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";

type KeyData = {
  key: string;
  node: AST.TOMLKeyValue;
  keys: KeyData[];
};

export default createRule("keys-order", {
  meta: {
    docs: {
      description: "disallow defining pair keys out-of-order",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "code",
    schema: [],
    messages: {
      outOfOrder: "'{{target}}' must be next to '{{before}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }

    /**
     * Apply new key
     */
    function applyKey(
      tableKeys: KeyData[],
      node: AST.TOMLKeyValue,
    ): AST.TOMLKeyValue | null {
      const keyNames = getStaticTOMLValue(node.key);

      let before: AST.TOMLKeyValue | null = null;
      let keys = tableKeys;
      while (keyNames.length) {
        const key = keyNames.shift()!;
        let next = keys.find((e) => e.key === key);
        if (!next) {
          next = {
            key,
            node,
            keys: [],
          };
          before = keys[keys.length - 1]?.node || null;
          keys.push(next);
        } else {
          next.node = node;
        }
        keys = next.keys;
      }

      return before;
    }

    /**
     * Verify table
     */
    function verify(
      node: AST.TOMLTopLevelTable | AST.TOMLTable | AST.TOMLInlineTable,
    ) {
      const keys: KeyData[] = [];
      let prev: AST.TOMLKeyValue | null = null;
      for (const body of node.body) {
        if (body.type !== "TOMLKeyValue") {
          continue;
        }

        const before = applyKey(keys, body);

        if (before && before !== prev) {
          context.report({
            node: body.key,
            messageId: "outOfOrder",
            data: {
              target: getStaticTOMLValue(body.key).join("."),
              before: getStaticTOMLValue(before.key).join("."),
            },
            fix(fixer) {
              const startToken = sourceCode.getTokenBefore(body)!;
              const start =
                node.type === "TOMLInlineTable"
                  ? startToken.range[0]
                  : startToken.range[1];
              const code = sourceCode.text.slice(start, body.range[1]);
              return [
                fixer.insertTextAfter(
                  before,
                  node.type === "TOMLInlineTable" ? code : `\n${code.trim()}`,
                ),
                fixer.removeRange([start, body.range[1]]),
              ];
            },
          });
        }
        prev = body;
      }
    }

    return {
      TOMLTopLevelTable: verify,
      TOMLTable: verify,
      TOMLInlineTable: verify,
    };
  },
});
