import type { AST } from "toml-eslint-parser";
import type { TOMLToken } from "../types";
import { createRule } from "../utils/index.ts";

export default createRule("padding-line-between-tables", {
  meta: {
    docs: {
      description: "require or disallow padding lines between tables",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      unexpectedBlankLine: "Unexpected blank line before this table.",
      expectedBlankLine: "Expected blank line before this table.",
    },
    type: "layout",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }

    /**
     * Verify tables
     */
    function verifyTables(
      prevNode: AST.TOMLTable | AST.TOMLKeyValue,
      nextNode: AST.TOMLTable,
    ) {
      const tokens = sourceCode.getTokensBetween(prevNode, nextNode, {
        includeComments: true,
      });
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
    }

    /**
     * Verify top level table
     */
    function verify(node: AST.TOMLTopLevelTable) {
      let prev: AST.TOMLTable | AST.TOMLKeyValue | null = null;
      for (const body of node.body) {
        if (prev && body.type === "TOMLTable") {
          verifyTables(prev, body);
        }
        prev = body;
      }
    }

    return {
      TOMLTopLevelTable: verify,
    };
  },
});
