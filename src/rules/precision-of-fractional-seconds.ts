import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils";
import { getSourceCode } from "../utils/compat";

export default createRule("precision-of-fractional-seconds", {
  meta: {
    docs: {
      description:
        "disallow precision of fractional seconds greater than the specified value.",
      categories: ["recommended", "standard"],
      extensionRule: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "number",
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      over: "Precision of fractional seconds greater than {{max}} are forbidden.",
    },
    type: "problem",
  },
  create(context) {
    const sourceCode = getSourceCode(context);
    if (!sourceCode.parserServices.isTOML) {
      return {};
    }
    const max = context.options[0]?.max ?? 3;

    /**
     * Verify date time value node text
     */
    function verifyText(node: AST.TOMLDateTimeValue) {
      const text = node.datetime;

      const fractional =
        /^\d{4}-\d{2}-\d{2}[ Tt]\d{2}:\d{2}:\d{2}.(\d+)/u.exec(text)?.[1] ||
        /^\d{2}:\d{2}:\d{2}.(\d+)/u.exec(text)?.[1];
      if (!fractional) {
        return;
      }

      if (fractional.length > max) {
        context.report({
          node,
          messageId: "over",
          data: { max },
        });
      }
    }

    return {
      TOMLValue(node) {
        if (
          node.kind === "offset-date-time" ||
          node.kind === "local-date-time" ||
          node.kind === "local-time"
        ) {
          verifyText(node);
        }
      },
    };
  },
});
