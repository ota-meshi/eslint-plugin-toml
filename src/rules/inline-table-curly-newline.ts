import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";

import { isCommentToken, isTokenOnSameLine } from "../utils/ast-utils.ts";

type Schema1 =
  | "always"
  | "never"
  | {
      multiline?: boolean;
      minProperties?: number;
      consistent?: boolean;
    };

type NormalizedOptions = {
  multiline: boolean;
  minProperties: number;
  consistent: boolean;
};

export default createRule("inline-table-curly-newline", {
  meta: {
    docs: {
      description: "enforce linebreaks after opening and before closing braces",
      categories: ["standard"],
      extensionRule: "object-curly-newline",
    },
    type: "layout",
    fixable: "whitespace",
    schema: [
      {
        oneOf: [
          {
            type: "string",
            enum: ["always", "never"],
          },
          {
            type: "object",
            properties: {
              multiline: {
                type: "boolean",
              },
              minProperties: {
                type: "integer",
                minimum: 0,
              },
              consistent: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            minProperties: 1,
          },
        ],
      },
    ],
    messages: {
      unexpectedLinebreakBeforeClosingBrace:
        "Unexpected line break before this closing brace.",
      unexpectedLinebreakAfterOpeningBrace:
        "Unexpected line break after this opening brace.",
      expectedLinebreakBeforeClosingBrace:
        "Expected a line break before this closing brace.",
      expectedLinebreakAfterOpeningBrace:
        "Expected a line break after this opening brace.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    if (context.languageOptions.parserOptions?.tomlVersion) {
      const tomlVersion =
        context.languageOptions.parserOptions.tomlVersion.includes(".") &&
        context.languageOptions.parserOptions.tomlVersion.split(".");
      if (tomlVersion && tomlVersion[0] === "1" && tomlVersion[1] === "0") {
        // The rule is only for TOML v1.1 or later
        // because of the multiline inline table syntax.
        return {};
      }
    }

    /**
     * Normalizes a given option.
     * @param value An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptions(value: Schema1 | undefined): NormalizedOptions {
      let multiline = false;
      let minProperties = Number.POSITIVE_INFINITY;
      let consistent = false;

      if (value) {
        if (value === "always") {
          minProperties = 0;
        } else if (value === "never") {
          minProperties = Number.POSITIVE_INFINITY;
        } else {
          multiline = Boolean(value.multiline);
          minProperties = value.minProperties || Number.POSITIVE_INFINITY;
          consistent = Boolean(value.consistent);
        }
      } else {
        consistent = true;
      }

      return { multiline, minProperties, consistent };
    }

    const options = normalizeOptions(context.options[0]);

    /**
     * Determines if ObjectExpression, ObjectPattern, ImportDeclaration, ExportNamedDeclaration, TSTypeLiteral or TSInterfaceBody
     * node needs to be checked for missing line breaks
     * @param node Node under inspection
     * @param options option specific to node type
     * @param first First object property
     * @param last Last object property
     * @returns `true` if node needs to be checked for missing line breaks
     */
    function areLineBreaksRequired(
      node: AST.TOMLInlineTable,
      options: {
        multiline: boolean;
        minProperties: number;
        consistent: boolean;
      },
      first: AST.Token | AST.Comment,
      last: AST.Token | AST.Comment,
    ) {
      const objectProperties = node.body;

      return (
        objectProperties.length >= options.minProperties ||
        (options.multiline &&
          objectProperties.length > 0 &&
          !isTokenOnSameLine(last, first))
      );
    }

    /**
     * Reports a given node if it violated this rule.
     * @param node A node to check. This is an ObjectExpression, ObjectPattern, ImportDeclaration, ExportNamedDeclaration, TSTypeLiteral or TSInterfaceBody node.
     */
    function check(node: AST.TOMLInlineTable) {
      const openBrace = sourceCode.getFirstToken(
        node,
        (token) => token.value === "{",
      )!;

      const closeBrace = sourceCode.getLastToken(
        node,
        (token) => token.value === "}",
      )!;

      const firstTokenOrComment = sourceCode.getTokenAfter(openBrace, {
        includeComments: true,
      })!;
      const lastTokenOrComment = sourceCode.getTokenBefore(closeBrace, {
        includeComments: true,
      })!;

      const needsLineBreaks = areLineBreaksRequired(
        node,
        options,
        firstTokenOrComment,
        lastTokenOrComment,
      );

      const hasCommentsFirstToken = isCommentToken(firstTokenOrComment);
      const hasCommentsLastToken = isCommentToken(lastTokenOrComment);

      /**
       * Use tokens or comments to check multiline or not.
       * But use only tokens to check whether line breaks are needed.
       * This allows:
       *     obj = { # eslint-disable-line foo
       *         a: 1
       *     }
       */
      const firstToken = sourceCode.getTokenAfter(openBrace)!;
      const lastToken = sourceCode.getTokenBefore(closeBrace)!;

      if (needsLineBreaks) {
        if (isTokenOnSameLine(openBrace, firstToken)) {
          context.report({
            messageId: "expectedLinebreakAfterOpeningBrace",
            node,
            loc: openBrace.loc,
            fix(fixer) {
              if (hasCommentsFirstToken) return null;

              return fixer.insertTextAfter(openBrace, "\n");
            },
          });
        }
        if (isTokenOnSameLine(lastToken, closeBrace)) {
          context.report({
            messageId: "expectedLinebreakBeforeClosingBrace",
            node,
            loc: closeBrace.loc,
            fix(fixer) {
              if (hasCommentsLastToken) return null;

              return fixer.insertTextBefore(closeBrace, "\n");
            },
          });
        }
      } else {
        const consistent = options.consistent;
        const hasLineBreakBetweenOpenBraceAndFirst = !isTokenOnSameLine(
          openBrace,
          firstToken,
        );
        const hasLineBreakBetweenCloseBraceAndLast = !isTokenOnSameLine(
          lastToken,
          closeBrace,
        );

        if (
          (!consistent && hasLineBreakBetweenOpenBraceAndFirst) ||
          (consistent &&
            hasLineBreakBetweenOpenBraceAndFirst &&
            !hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            messageId: "unexpectedLinebreakAfterOpeningBrace",
            node,
            loc: openBrace.loc,
            fix(fixer) {
              if (hasCommentsFirstToken) return null;

              return fixer.removeRange([
                openBrace.range[1],
                firstToken.range[0],
              ]);
            },
          });
        }
        if (
          (!consistent && hasLineBreakBetweenCloseBraceAndLast) ||
          (consistent &&
            !hasLineBreakBetweenOpenBraceAndFirst &&
            hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            messageId: "unexpectedLinebreakBeforeClosingBrace",
            node,
            loc: closeBrace.loc,
            fix(fixer) {
              if (hasCommentsLastToken) return null;

              return fixer.removeRange([
                lastToken.range[1],
                closeBrace.range[0],
              ]);
            },
          });
        }
      }
    }

    return { TOMLInlineTable: check };
  },
});
