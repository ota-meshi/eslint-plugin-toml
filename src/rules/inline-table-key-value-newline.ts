import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";
import { isTokenOnSameLine } from "../utils/ast-utils.ts";

type Schema1 = {
  allowAllPropertiesOnSameLine?: boolean;
};

/**
 * Parses the options for the rule and returns a normalized options object.
 * @param options The raw options provided to the rule.
 * @returns A normalized options object with default values applied.
 */
function parseOptions(options: Schema1 | undefined): Required<Schema1> {
  return {
    allowAllPropertiesOnSameLine:
      options?.allowAllPropertiesOnSameLine ?? false,
  };
}

export default createRule("inline-table-key-value-newline", {
  meta: {
    docs: {
      description:
        "enforce placing inline table key-value pairs on separate lines",
      categories: ["standard"],
      extensionRule: "object-property-newline",
    },
    fixable: "whitespace",
    hasSuggestions: false,
    schema: [
      {
        type: "object",
        properties: {
          allowAllPropertiesOnSameLine: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      propertiesOnNewlineAll:
        "Inline table key-value pairs must go on a new line if they aren't all on the same line.",
      propertiesOnNewline:
        "Inline table key-value pairs must go on a new line.",
    },
    type: "layout",
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
    const allowSameLine = parseOptions(
      context.options[0],
    ).allowAllPropertiesOnSameLine;

    const messageId = allowSameLine
      ? "propertiesOnNewlineAll"
      : "propertiesOnNewline";

    /**
     * Checks whether the given tokens are on the same line.
     * @param token1 The first token to compare.
     * @param token2 The second token to compare.
     * @returns True if the tokens are on the same line, false otherwise.
     */
    function check(node: AST.TOMLInlineTable, children: AST.TOMLKeyValue[]) {
      if (allowSameLine) {
        if (children.length > 1) {
          const firstTokenOfFirstProperty = sourceCode.getFirstToken(
            children[0],
          );
          const lastTokenOfLastProperty = sourceCode.getLastToken(
            children[children.length - 1],
          );

          if (
            isTokenOnSameLine(
              firstTokenOfFirstProperty,
              lastTokenOfLastProperty,
            )
          ) {
            // All keys and values are on the same line
            return;
          }
        }
      }

      for (let i = 1; i < children.length; i++) {
        const lastTokenOfPreviousProperty = sourceCode.getLastToken(
          children[i - 1],
        );
        const firstTokenOfCurrentProperty = sourceCode.getFirstToken(
          children[i],
        );

        if (
          isTokenOnSameLine(
            lastTokenOfPreviousProperty,
            firstTokenOfCurrentProperty,
          )
        ) {
          context.report({
            node,
            loc: firstTokenOfCurrentProperty.loc,
            messageId,
            fix(fixer) {
              const comma = sourceCode.getTokenBefore(
                firstTokenOfCurrentProperty,
              )!;
              const rangeAfterComma = [
                comma.range[1],
                firstTokenOfCurrentProperty.range[0],
              ] as [number, number];

              // Don't perform a fix if there are any comments between the comma and the next property.
              if (
                sourceCode.text
                  .slice(rangeAfterComma[0], rangeAfterComma[1])
                  .trim()
              )
                return null;

              return fixer.replaceTextRange(rangeAfterComma, "\n");
            },
          });
        }
      }
    }

    return {
      TOMLInlineTable(node) {
        check(node, node.body);
      },
    };
  },
});
