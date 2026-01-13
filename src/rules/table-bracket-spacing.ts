import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";


export default createRule("table-bracket-spacing", {
  meta: {
    docs: {
      description: "enforce consistent spacing inside table brackets",
      categories: ["standard"],
      extensionRule: "array-bracket-spacing",
    },
    fixable: "whitespace",
    schema: [
      {
        enum: ["always", "never"],
      },
    ],
    messages: {
      unexpectedSpaceAfter: "There should be no space after '{{tokenValue}}'.",
      unexpectedSpaceBefore:
        "There should be no space before '{{tokenValue}}'.",
      missingSpaceAfter: "A space is required after '{{tokenValue}}'.",
      missingSpaceBefore: "A space is required before '{{tokenValue}}'.",
    },
    type: "layout",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    const prefer: "never" | "always" = context.options[0] || "never";

    /**
     * Reports that there should be a space after the first token
     * @param {ASTNode} node The node to report in the event of an error.
     * @param {Token} token The token to use for the report.
     * @returns {void}
     */
    function reportRequiredBeginningSpace(
      node: AST.TOMLTable,
      token: AST.Token,
    ) {
      context.report({
        node,
        loc: token.loc,
        messageId: "missingSpaceAfter",
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.insertTextAfter(token, " ");
        },
      });
    }

    /**
     * Reports that there shouldn't be a space after the first token
     * @param {ASTNode} node The node to report in the event of an error.
     * @param {Token} token The token to use for the report.
     * @returns {void}
     */
    function reportNoBeginningSpace(node: AST.TOMLTable, token: AST.Token) {
      const nextToken = sourceCode.getTokenAfter(token)!;

      context.report({
        node,
        loc: { start: token.loc.end, end: nextToken.loc.start },
        messageId: "unexpectedSpaceAfter",
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], nextToken.range[0]]);
        },
      });
    }

    /**
     * Reports that there should be a space before the last token
     * @param {ASTNode} node The node to report in the event of an error.
     * @param {Token} token The token to use for the report.
     * @returns {void}
     */
    function reportRequiredEndingSpace(node: AST.TOMLTable, token: AST.Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: "missingSpaceBefore",
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, " ");
        },
      });
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param {ASTNode} node The node to report in the event of an error.
     * @param {Token} token The token to use for the report.
     * @returns {void}
     */
    function reportNoEndingSpace(node: AST.TOMLTable, token: AST.Token) {
      const previousToken = sourceCode.getTokenBefore(token)!;

      context.report({
        node,
        loc: { start: previousToken.loc.end, end: token.loc.start },
        messageId: "unexpectedSpaceBefore",
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([previousToken.range[1], token.range[0]]);
        },
      });
    }

    /**
     * Validates the spacing around table brackets
     * @param {ASTNode} node The node we're checking for spacing
     * @returns {void}
     */
    function validateArraySpacing(node: AST.TOMLTable) {
      const key = node.key;
      const first = sourceCode.getTokenBefore(key)!;
      const last = sourceCode.getTokenAfter(key)!;
      if (prefer === "always" && first.range[1] === key.range[0]) {
        reportRequiredBeginningSpace(node, first);
      }
      if (prefer === "never" && first.range[1] < key.range[0]) {
        reportNoBeginningSpace(node, first);
      }

      if (prefer === "always" && key.range[1] === last.range[0]) {
        reportRequiredEndingSpace(node, last);
      }
      if (prefer === "never" && key.range[1] < last.range[0]) {
        reportNoEndingSpace(node, last);
      }
    }

    return {
      TOMLTable: validateArraySpacing,
    };
  },
});
