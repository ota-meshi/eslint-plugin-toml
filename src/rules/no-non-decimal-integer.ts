import type { AST } from "toml-eslint-parser";
import type { Fix, RuleFixer } from "../types";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";

/**
 * Convert the given string to decimal string
 */
function toDecimalText(str: string, radix: 16 | 8 | 2) {
  const digits: number[] = [0];
  for (const c of str) {
    let num = parseInt(c, radix);
    for (let place = 0; place < digits.length; place++) {
      num = digits[place] * radix + num;
      digits[place] = num % 10;
      num = Math.floor(num / 10);
    }
    while (num > 0) {
      digits.push(num % 10);
      num = Math.floor(num / 10);
    }
  }
  return digits.reverse().join("");
}

export default createRule("no-non-decimal-integer", {
  meta: {
    docs: {
      description: "disallow hexadecimal, octal and binary integer",
      categories: null,
      extensionRule: false,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          allowHexadecimal: {
            type: "boolean",
          },
          allowOctal: {
            type: "boolean",
          },
          allowBinary: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      disallowHex: "Hexadecimal integers are forbidden.",
      disallowOctal: "Octal integers are forbidden.",
      disallowBinary: "Binary integers are forbidden.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    const allowHexadecimal = Boolean(context.options[0]?.allowHexadecimal);
    const allowOctal = Boolean(context.options[0]?.allowOctal);
    const allowBinary = Boolean(context.options[0]?.allowBinary);

    /**
     * Build fixer
     */
    function buildFixer(
      node: AST.TOMLNumberValue,
      text: string,
      mark: "x" | "o" | "b",
    ): ((fixer: RuleFixer) => Fix) | undefined {
      if (allowHexadecimal || allowOctal || allowBinary) {
        return undefined;
      }
      return (fixer) => {
        const d = mark === "x" ? 16 : mark === "o" ? 8 : 2;

        const code = text.slice(2);
        const decimalText = toDecimalText(code, d);
        return fixer.replaceText(node, decimalText);
      };
    }

    /**
     * Verify number value node text
     */
    function verifyText(node: AST.TOMLNumberValue) {
      const text = node.number;
      if (text.startsWith("0")) {
        const maybeMark = text[1];
        if (maybeMark === "x" && !allowHexadecimal) {
          context.report({
            node,
            messageId: "disallowHex",
            fix: buildFixer(node, text, maybeMark),
          });
        } else if (maybeMark === "o" && !allowOctal) {
          context.report({
            node,
            messageId: "disallowOctal",
            fix: buildFixer(node, text, maybeMark),
          });
        } else if (maybeMark === "b" && !allowBinary) {
          context.report({
            node,
            messageId: "disallowBinary",
            fix: buildFixer(node, text, maybeMark),
          });
        }
      }
    }

    return {
      TOMLValue(node) {
        if (node.kind === "integer") {
          verifyText(node);
        }
      },
    };
  },
});
