import type { AST } from "toml-eslint-parser";
import { createRule } from "../utils/index.ts";


type TypeMap = {
  string: string;
  boolean: string;
  integer: string;
  float: string;
  offsetDateTime: string;
  localDateTime: string;
  localDate: string;
  localTime: string;
  array: string;
  inlineTable: string;
};

export default createRule("no-mixed-type-in-array", {
  meta: {
    docs: {
      description: "disallow mixed data types in array",
      categories: null,
      extensionRule: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          typeMap: {
            type: "object",
            properties: {
              string: { type: "string" },
              boolean: { type: "string" },
              integer: { type: "string" },
              float: { type: "string" },
              offsetDateTime: { type: "string" },
              localDateTime: { type: "string" },
              localDate: { type: "string" },
              localTime: { type: "string" },
              array: { type: "string" },
              inlineTable: { type: "string" },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      mixedDataType: "Data types may not be mixed in an array.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }
    const typeMap: TypeMap = {
      // Default
      // https://toml.io/en/v0.5.0#keyvalue-pair
      string: "String",
      integer: "Integer",
      float: "Float",
      boolean: "Boolean",
      offsetDateTime: "Datetime",
      localDateTime: "Datetime",
      localDate: "Datetime",
      localTime: "Datetime",
      array: "Array",
      inlineTable: "Inline Table",
      ...(context.options[0]?.typeMap || {}),
    };

    /**
     * Get data type from given node
     */
    function getDataType(node: AST.TOMLContentNode): keyof TypeMap | null {
      if (node.type === "TOMLArray") {
        return "array";
      }
      if (node.type === "TOMLInlineTable") {
        return "inlineTable";
      }
      if (node.type === "TOMLValue") {
        if (
          node.kind === "string" ||
          node.kind === "integer" ||
          node.kind === "float" ||
          node.kind === "boolean"
        ) {
          return node.kind;
        }
        if (node.kind === "offset-date-time") {
          return "offsetDateTime";
        }
        if (node.kind === "local-date-time") {
          return "localDateTime";
        }
        if (node.kind === "local-date") {
          return "localDate";
        }
        if (node.kind === "local-time") {
          return "localTime";
        }
      }
      // unknown
      return null;
    }

    return {
      TOMLArray(node) {
        let typeName: string | null = null;
        for (const element of node.elements) {
          const type = getDataType(element);
          if (typeName == null) {
            if (type != null) {
              typeName = typeMap[type];
            }
          } else {
            if (type == null || typeName !== typeMap[type]) {
              context.report({
                node: element,
                messageId: "mixedDataType",
              });
            }
          }
        }
      },
    };
  },
});
