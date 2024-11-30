import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";
import {
  isClosingBraceToken,
  isClosingBracketToken,
  isTokenOnSameLine,
} from "../utils/ast-utils";
import type { TOMLToken } from "../types";
interface Schema1 {
  arraysInObjects?: boolean;
  objectsInObjects?: boolean;
}
export default createRule("inline-table-curly-spacing", {
  meta: {
    docs: {
      description: "enforce consistent spacing inside braces",
      categories: ["standard"],
      extensionRule: "object-curly-spacing",
    },
    type: "layout",
    fixable: "whitespace",
    schema: [
      {
        type: "string",
        enum: ["always", "never"],
      },
      {
        type: "object",
        properties: {
          arraysInObjects: {
            type: "boolean",
          },
          objectsInObjects: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireSpaceBefore: "A space is required before '{{token}}'.",
      requireSpaceAfter: "A space is required after '{{token}}'.",
      unexpectedSpaceBefore: "There should be no space before '{{token}}'.",
      unexpectedSpaceAfter: "There should be no space after '{{token}}'.",
    },
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    const spaced = (context.options[0] || "always") === "always";

    /**
     * Determines whether an option is set, relative to the spacing option.
     * If spaced is "always", then check whether option is set to false.
     * If spaced is "never", then check whether option is set to true.
     * @param option The option to exclude.
     * @returns Whether or not the property is excluded.
     */
    function isOptionSet(option: keyof NonNullable<Schema1>): boolean {
      return context.options[1]
        ? context.options[1][option] === !spaced
        : false;
    }

    const options = {
      spaced,
      arraysInObjectsException: isOptionSet("arraysInObjects"),
      objectsInObjectsException: isOptionSet("objectsInObjects"),
      isOpeningCurlyBraceMustBeSpaced(_second: TOMLToken) {
        return options.spaced;
      },
      isClosingCurlyBraceMustBeSpaced(penultimate: TOMLToken) {
        const targetPenultimateType =
          options.arraysInObjectsException && isClosingBracketToken(penultimate)
            ? "TOMLArray"
            : options.objectsInObjectsException &&
                isClosingBraceToken(penultimate)
              ? "TOMLInlineTable"
              : null;

        return targetPenultimateType &&
          sourceCode.getNodeByRangeIndex(penultimate.range[0])?.type ===
            targetPenultimateType
          ? !options.spaced
          : options.spaced;
      },
    };

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoBeginningSpace(
      node: AST.TOMLInlineTable,
      token: AST.Token,
    ) {
      const nextToken = sourceCode.getTokenAfter(token, {
        includeComments: true,
      })!;

      context.report({
        node,
        loc: { start: token.loc.end, end: nextToken.loc.start },
        messageId: "unexpectedSpaceAfter",
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], nextToken.range[0]]);
        },
      });
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoEndingSpace(node: AST.TOMLInlineTable, token: TOMLToken) {
      const previousToken = sourceCode.getTokenBefore(token, {
        includeComments: true,
      })!;

      context.report({
        node,
        loc: { start: previousToken.loc.end, end: token.loc.start },
        messageId: "unexpectedSpaceBefore",
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([previousToken.range[1], token.range[0]]);
        },
      });
    }

    /**
     * Reports that there should be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningSpace(
      node: AST.TOMLInlineTable,
      token: TOMLToken,
    ) {
      context.report({
        node,
        loc: token.loc,
        messageId: "requireSpaceAfter",
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextAfter(token, " ");
        },
      });
    }

    /**
     * Reports that there should be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredEndingSpace(
      node: AST.TOMLInlineTable,
      token: TOMLToken,
    ) {
      context.report({
        node,
        loc: token.loc,
        messageId: "requireSpaceBefore",
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, " ");
        },
      });
    }

    /**
     * Determines if spacing in curly braces is valid.
     * @param node The AST node to check.
     * @param first The first token to check (should be the opening brace)
     * @param second The second token to check (should be first after the opening brace)
     * @param penultimate The penultimate token to check (should be last before closing brace)
     * @param last The last token to check (should be closing brace)
     */
    function validateBraceSpacing(
      node: AST.TOMLInlineTable,
      first: AST.Token,
      second: TOMLToken,
      penultimate: TOMLToken,
      last: TOMLToken,
    ) {
      if (isTokenOnSameLine(first, second)) {
        const firstSpaced = sourceCode.isSpaceBetweenTokens(first, second);

        if (options.isOpeningCurlyBraceMustBeSpaced(second)) {
          if (!firstSpaced) reportRequiredBeginningSpace(node, first);
        } else {
          if (firstSpaced && second.type !== "Block") {
            reportNoBeginningSpace(node, first);
          }
        }
      }

      if (isTokenOnSameLine(penultimate, last)) {
        const lastSpaced = sourceCode.isSpaceBetweenTokens(penultimate, last);

        if (options.isClosingCurlyBraceMustBeSpaced(penultimate)) {
          if (!lastSpaced) reportRequiredEndingSpace(node, last);
        } else {
          if (lastSpaced) reportNoEndingSpace(node, last);
        }
      }
    }

    /**
     * Gets '}' token of an object node.
     *
     * Because the last token of object patterns might be a type annotation,
     * this traverses tokens preceded by the last property, then returns the
     * first '}' token.
     * @param node The node to get. This node is an
     *      ObjectExpression or an ObjectPattern. And this node has one or
     *      more properties.
     * @returns '}' token.
     */
    function getClosingBraceOfObject(node: AST.TOMLInlineTable) {
      const lastProperty = node.body[node.body.length - 1];

      return sourceCode.getTokenAfter(lastProperty, isClosingBraceToken);
    }

    /**
     * Reports a given object node if spacing in curly braces is invalid.
     * @param node An ObjectExpression or ObjectPattern node to check.
     */
    function checkForObject(node: AST.TOMLInlineTable) {
      if (node.body.length === 0) return;

      const first = sourceCode.getFirstToken(node);
      const last = getClosingBraceOfObject(node)!;
      const second = sourceCode.getTokenAfter(first, {
        includeComments: true,
      })!;
      const penultimate = sourceCode.getTokenBefore(last, {
        includeComments: true,
      })!;

      validateBraceSpacing(node, first, second, penultimate, last);
    }

    return {
      TOMLInlineTable: checkForObject,
    };
  },
});
