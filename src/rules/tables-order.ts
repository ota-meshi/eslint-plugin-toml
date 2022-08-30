import type { AST } from "toml-eslint-parser";
import { getStaticTOMLValue } from "toml-eslint-parser";
import lodash from "lodash";
import { createRule } from "../utils";

type KeyData = {
  key: string | number;
  node: AST.TOMLTable;
  keys: KeyData[];
};

/**
 * Get first key node
 */
function getFirst(keys: KeyData[]): AST.TOMLTable | null {
  const first = keys[0];
  if (first) {
    return getFirst(first.keys) || first.node;
  }
  return null;
}

/**
 * Get last key node
 */
function getLast(keys: KeyData[]): AST.TOMLTable | null {
  const last = lodash.last(keys);
  if (last) {
    return getLast(last.keys) || last.node;
  }
  return null;
}

export default createRule("tables-order", {
  meta: {
    docs: {
      description: "disallow defining tables out-of-order",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "code",
    schema: [],
    messages: {
      outOfOrder: "'{{target}}' must be next to '{{before}}'.",
      outOfOrderToBefore: "'{{target}}' must be previous to '{{after}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    if (!context.parserServices.isTOML) {
      return {};
    }
    const sourceCode = context.getSourceCode();

    /**
     * Apply new key
     */
    function applyKey(
      rootKeys: KeyData[],
      node: AST.TOMLTable
    ):
      | { before: AST.TOMLTable; after: null }
      | { before: null; after: AST.TOMLTable }
      | { before: null; after: null } {
      const keyNames = [...node.resolvedKey];

      let before: AST.TOMLTable | null = null;
      let keys = rootKeys;
      while (keyNames.length) {
        const key = keyNames.shift()!;
        const isLast = !keyNames.length;
        let next = keys.find((e) => e.key === key);
        if (!next) {
          next = {
            key,
            node,
            keys: [],
          };
          if (isLast) {
            before = getLast(keys);
          }
          keys.push(next);
        } else {
          if (isLast) {
            if (next.keys.length > 0) {
              const after = getFirst(next.keys);
              return {
                before: null,
                after,
              };
            }
            // Probably unreachable.
            /* istanbul ignore next */
            before = getLast(keys);
          }
        }
        keys = next.keys;
      }

      return {
        before,
        after: null,
      };
    }

    /**
     * Verify tables
     */
    function verify(node: AST.TOMLTopLevelTable) {
      const keys: KeyData[] = [];

      let prev: AST.TOMLTable | null = null;
      for (const body of node.body) {
        if (body.type !== "TOMLTable") {
          continue;
        }

        const { before, after } = applyKey(keys, body);

        if (after) {
          context.report({
            node: body.key,
            messageId: "outOfOrderToBefore",
            data: {
              target: getStaticTOMLValue(body.key).join("."),
              after: getStaticTOMLValue(after.key).join("."),
            },
            fix(fixer) {
              const startToken = sourceCode.getTokenBefore(body)!;
              const code = sourceCode.text.slice(
                startToken.range[1],
                body.range[1]
              );
              return [
                fixer.insertTextBefore(after, `${code.trim()}\n`),
                fixer.removeRange([startToken.range[1], body.range[1]]),
              ];
            },
          });
        } else if (before && before !== prev) {
          context.report({
            node: body.key,
            messageId: "outOfOrder",
            data: {
              target: getStaticTOMLValue(body.key).join("."),
              before: getStaticTOMLValue(before.key).join("."),
            },
            fix(fixer) {
              const startToken = sourceCode.getTokenBefore(body)!;
              const code = sourceCode.text.slice(
                startToken.range[1],
                body.range[1]
              );
              return [
                fixer.insertTextAfter(before, `\n${code.trim()}`),
                fixer.removeRange([startToken.range[1], body.range[1]]),
              ];
            },
          });
        }
        prev = body;
      }
    }

    return {
      TOMLTopLevelTable: verify,
    };
  },
});
