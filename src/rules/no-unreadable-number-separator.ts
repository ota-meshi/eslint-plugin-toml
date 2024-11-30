import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";

export default createRule("no-unreadable-number-separator", {
  meta: {
    docs: {
      description:
        "disallow number separators that to not enhance readability.",
      categories: ["recommended", "standard"],
      extensionRule: false,
    },
    schema: [],
    messages: {
      unexpected:
        "Unexpected number separator that does not enhance readability.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }

    type CharCountData = {
      count: number;
      range: [number, number];
    };

    /**
     * Parse character counts
     */
    function parseCharCounts(
      text: string,
      startIndex: number,
      exitChars: string[],
    ) {
      let start = startIndex;
      let count = 0;
      const charCounts: CharCountData[] = [];
      let index = startIndex;
      for (; index < text.length; index++) {
        const char = text[index];
        if (exitChars.includes(char)) {
          break;
        }
        if (char === "_") {
          charCounts.push({
            count,
            range: [start, index],
          });
          start = index + 1;
          count = 0;
        } else {
          count++;
        }
      }
      charCounts.push({
        count,
        range: [start, index],
      });

      return {
        charCounts,
        index,
      };
    }

    /**
     * Verify parts of number
     */
    function verifyParts(
      node: AST.TOMLNumberValue,
      {
        integerCharCounts,
        fractionalCharCounts,
        exponentCharCounts,
      }: {
        integerCharCounts: CharCountData[];
        fractionalCharCounts: CharCountData[];
        exponentCharCounts: CharCountData[];
      },
    ) {
      for (const { count, range } of [
        ...integerCharCounts.slice(1),
        ...fractionalCharCounts.slice(0, -1),
        ...exponentCharCounts.slice(1),
      ]) {
        if (count === 1) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(node.range[0] + range[0]),
              end: sourceCode.getLocFromIndex(node.range[0] + range[1]),
            },
            messageId: "unexpected",
          });
        }
      }
    }

    /**
     * Verify number value node text
     */
    function verifyText(node: AST.TOMLNumberValue, text: string) {
      let index = 0;

      if (text[index] === "+" || text[index] === "-") {
        index++;
      }
      let integer = false;
      if (text[index] === "0") {
        const maybeMark = text[index + 1];
        if (maybeMark === "x" || maybeMark === "o" || maybeMark === "b") {
          index += 2;
          integer = true;
        }
      }

      const parsedInteger = parseCharCounts(
        text,
        index,
        integer ? [] : [".", "E", "e"],
      );
      const integerCharCounts = parsedInteger.charCounts;
      const fractionalCharCounts: CharCountData[] = [];
      const exponentCharCounts: CharCountData[] = [];

      if (!integer) {
        index = parsedInteger.index;
        if (text[index] === ".") {
          index++;
          const parsedFractional = parseCharCounts(text, index, ["E", "e"]);
          fractionalCharCounts.push(...parsedFractional.charCounts);
          index = parsedFractional.index;
        }
        if (text[index] === "e" || text[index] === "E") {
          index++;
          if (text[index] === "+" || text[index] === "-") {
            index++;
          }
          const parsedExponent = parseCharCounts(text, index, []);
          exponentCharCounts.push(...parsedExponent.charCounts);
        }
      }

      verifyParts(node, {
        integerCharCounts,
        fractionalCharCounts,
        exponentCharCounts,
      });
    }

    return {
      TOMLValue(node) {
        if (node.kind === "integer" || node.kind === "float") {
          const text = sourceCode.getText(node);
          if (text.endsWith("nan") || text.endsWith("inf")) {
            return;
          }
          verifyText(node, text);
        }
      },
    };
  },
});
