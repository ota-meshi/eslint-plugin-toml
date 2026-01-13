import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";

import type { MaxValues } from "../utils/bit.ts";
import { maxBitToMaxValues } from "../utils/bit.ts";

const cacheMaxValues: Record<number, MaxValues> = {};

/**
 * Get max values
 */
function getMaxValues(bit: number): MaxValues {
  if (cacheMaxValues[bit]) {
    return cacheMaxValues[bit];
  }
  return (cacheMaxValues[bit] = maxBitToMaxValues(bit));
}

export default createRule("precision-of-integer", {
  meta: {
    docs: {
      description:
        "disallow precision of integer greater than the specified value.",
      categories: ["recommended", "standard"],
      extensionRule: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          maxBit: {
            type: "number",
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      over: "Integers with precision greater than {{maxBit}}-bit are forbidden.",
    },
    type: "problem",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    const maxBit = context.options[0]?.maxBit ?? 64;
    const maxValues = getMaxValues(maxBit);

    /**
     * Verify number text
     */
    function verifyMaxValue(
      node: AST.TOMLNumberValue,
      numText: string,
      max: string,
    ) {
      const num = numText.replace(/^0+/, "").toLowerCase();
      if (num.length < max.length) {
        return;
      }
      if (num.length === max.length && num <= max) {
        return;
      }
      context.report({
        node,
        messageId: "over",
        data: {
          maxBit,
        },
      });
    }

    /**
     * Verify integer value node text
     */
    function verifyText(node: AST.TOMLNumberValue) {
      const text = node.number;
      if (text.startsWith("0")) {
        const maybeMark = text[1];
        if (maybeMark === "x") {
          verifyMaxValue(node, text.slice(2), maxValues["0x"]);
          return;
        } else if (maybeMark === "o") {
          verifyMaxValue(node, text.slice(2), maxValues["0o"]);
          return;
        } else if (maybeMark === "b") {
          verifyMaxValue(node, text.slice(2), maxValues["0b"]);
          return;
        }
      } else if (text.startsWith("-")) {
        verifyMaxValue(node, text.slice(1), maxValues["-"]);
        return;
      } else if (text.startsWith("+")) {
        verifyMaxValue(node, text.slice(1), maxValues["+"]);
        return;
      }
      verifyMaxValue(node, text, maxValues["+"]);
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
