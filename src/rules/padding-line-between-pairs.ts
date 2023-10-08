import type { AST } from "toml-eslint-parser";
import { getStaticTOMLValue } from "toml-eslint-parser";
import type { TOMLToken } from "../types";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";

export default createRule("padding-line-between-pairs", {
  meta: {
    docs: {
      description: "require or disallow padding lines between pairs",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      unexpectedBlankLine: "Unexpected blank line before this pair.",
      expectedBlankLine: "Expected blank line before this pair.",
    },
    type: "layout",
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices.isTOML) {
      return {};
    }

    /**
     * Verify pairs
     */
    function verifyPairs(
      prevNode: AST.TOMLKeyValue,
      prevKeys: string[],
      nextNode: AST.TOMLKeyValue,
      nextKeys: string[],
    ) {
      const needPadding =
        nextKeys.length !== prevKeys.length ||
        nextKeys.slice(0, -1).some((key, index) => key !== prevKeys[index]);

      const tokens = sourceCode.getTokensBetween(prevNode, nextNode, {
        includeComments: true,
      });
      if (needPadding) {
        let prevTarget: AST.TOMLNode | TOMLToken = prevNode;
        for (const token of [...tokens, nextNode]) {
          if (prevTarget.loc.end.line + 1 < token.loc.start.line) {
            return;
          }
          prevTarget = token;
        }
        context.report({
          node: nextNode.key,
          messageId: "expectedBlankLine",
          fix(fixer) {
            return fixer.insertTextAfter(prevNode, "\n");
          },
        });
      } else {
        const prevTarget = [prevNode, ...tokens].pop()!;
        if (prevTarget.loc.end.line + 1 >= nextNode.loc.start.line) {
          return;
        }

        context.report({
          node: nextNode.key,
          messageId: "unexpectedBlankLine",
          *fix(fixer) {
            yield fixer.replaceTextRange(
              [prevTarget.range[1], nextNode.range[0]],
              "\n",
            );
          },
        });
      }
    }

    /**
     * Verify table
     */
    function verify(node: AST.TOMLTopLevelTable | AST.TOMLTable) {
      let prev: {
        node: AST.TOMLKeyValue;
        keys: string[];
      } | null = null;
      for (const body of node.body) {
        if (body.type !== "TOMLKeyValue") {
          continue;
        }

        const keys = getStaticTOMLValue(body.key);

        if (prev) {
          verifyPairs(prev.node, prev.keys, body, keys);
        }
        prev = { node: body, keys };
      }
    }

    return {
      TOMLTopLevelTable: verify,
      TOMLTable: verify,
    };
  },
});
