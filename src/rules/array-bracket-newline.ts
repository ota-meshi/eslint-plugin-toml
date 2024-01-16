import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";
import { isCommentToken, isTokenOnSameLine } from "../utils/ast-utils";
type Schema0 =
  | ("always" | "never" | "consistent")
  | {
      multiline?: boolean;
      minItems?: number | null;
    };
export default createRule("array-bracket-newline", {
  meta: {
    docs: {
      description:
        "enforce linebreaks after opening and before closing array brackets",
      categories: ["standard"],
      extensionRule: "array-bracket-newline",
    },
    type: "layout",
    fixable: "whitespace",
    schema: [
      {
        oneOf: [
          {
            type: "string",
            enum: ["always", "never", "consistent"],
          },
          {
            type: "object",
            properties: {
              multiline: {
                type: "boolean",
              },
              minItems: {
                type: ["integer", "null"],
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      unexpectedOpeningLinebreak: "There should be no linebreak after '['.",
      unexpectedClosingLinebreak: "There should be no linebreak before ']'.",
      missingOpeningLinebreak: "A linebreak is required after '['.",
      missingClosingLinebreak: "A linebreak is required before ']'.",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices.isTOML) {
      return {};
    }

    /**
     * Normalizes a given option value.
     * @param option An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptionValue(option: Schema0) {
      let consistent = false;
      let multiline = false;
      let minItems = 0;

      if (option) {
        if (option === "consistent") {
          consistent = true;
          minItems = Number.POSITIVE_INFINITY;
        } else if (
          option === "always" ||
          (typeof option !== "string" && option.minItems === 0)
        ) {
          minItems = 0;
        } else if (option === "never") {
          minItems = Number.POSITIVE_INFINITY;
        } else {
          multiline = Boolean(option.multiline);
          minItems = option.minItems || Number.POSITIVE_INFINITY;
        }
      } else {
        consistent = false;
        multiline = true;
        minItems = Number.POSITIVE_INFINITY;
      }

      return { consistent, multiline, minItems };
    }

    /**
     * Normalizes a given option value.
     * @param options An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptions(options: Schema0) {
      const value = normalizeOptionValue(options);

      return { TOMLArray: value };
    }

    /**
     * Reports that there shouldn't be a linebreak after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoBeginningLinebreak(node: AST.TOMLArray, token: AST.Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: "unexpectedOpeningLinebreak",
        fix(fixer) {
          const nextToken = sourceCode.getTokenAfter(token, {
            includeComments: true,
          });

          if (!nextToken || isCommentToken(nextToken)) return null;

          return fixer.removeRange([token.range[1], nextToken.range[0]]);
        },
      });
    }

    /**
     * Reports that there shouldn't be a linebreak before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoEndingLinebreak(node: AST.TOMLArray, token: AST.Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: "unexpectedClosingLinebreak",
        fix(fixer) {
          const previousToken = sourceCode.getTokenBefore(token, {
            includeComments: true,
          });

          if (!previousToken || isCommentToken(previousToken)) return null;

          return fixer.removeRange([previousToken.range[1], token.range[0]]);
        },
      });
    }

    /**
     * Reports that there should be a linebreak after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningLinebreak(
      node: AST.TOMLArray,
      token: AST.Token,
    ) {
      context.report({
        node,
        loc: token.loc,
        messageId: "missingOpeningLinebreak",
        fix(fixer) {
          return fixer.insertTextAfter(token, "\n");
        },
      });
    }

    /**
     * Reports that there should be a linebreak before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredEndingLinebreak(
      node: AST.TOMLArray,
      token: AST.Token,
    ) {
      context.report({
        node,
        loc: token.loc,
        messageId: "missingClosingLinebreak",
        fix(fixer) {
          return fixer.insertTextBefore(token, "\n");
        },
      });
    }

    /**
     * Reports a given node if it violated this rule.
     * @param node A node to check. This is an ArrayExpression node or an ArrayPattern node.
     */
    function check(node: AST.TOMLArray) {
      const elements = node.elements;
      const normalizedOptions = normalizeOptions(context.options[0]);
      const options = normalizedOptions[node.type];
      const openBracket = sourceCode.getFirstToken(node);
      const closeBracket = sourceCode.getLastToken(node);
      const firstIncComment = sourceCode.getTokenAfter(openBracket, {
        includeComments: true,
      })!;
      const lastIncComment = sourceCode.getTokenBefore(closeBracket, {
        includeComments: true,
      })!;
      const first = sourceCode.getTokenAfter(openBracket)!;
      const last = sourceCode.getTokenBefore(closeBracket)!;
      const needsLinebreaks =
        elements.length >= options.minItems ||
        (options.multiline &&
          elements.length > 0 &&
          firstIncComment.loc.start.line !== lastIncComment.loc.end.line) ||
        (elements.length === 0 &&
          firstIncComment.type === "Block" &&
          firstIncComment.loc.start.line !== lastIncComment.loc.end.line &&
          firstIncComment === lastIncComment) ||
        (options.consistent &&
          openBracket.loc.end.line !== first.loc.start.line);

      /**
       * Use tokens or comments to check multiline or not.
       * But use only tokens to check whether linebreaks are needed.
       * This allows:
       *     var arr = [ // eslint-disable-line foo
       *         'a'
       *     ]
       */

      if (needsLinebreaks) {
        if (isTokenOnSameLine(openBracket, first))
          reportRequiredBeginningLinebreak(node, openBracket);
        if (isTokenOnSameLine(last, closeBracket))
          reportRequiredEndingLinebreak(node, closeBracket);
      } else {
        if (!isTokenOnSameLine(openBracket, first))
          reportNoBeginningLinebreak(node, openBracket);
        if (!isTokenOnSameLine(last, closeBracket))
          reportNoEndingLinebreak(node, closeBracket);
      }
    }

    return {
      TOMLArray: check,
    };
  },
});
