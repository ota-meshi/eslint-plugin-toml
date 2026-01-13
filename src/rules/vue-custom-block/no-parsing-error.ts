import type { AST } from "toml-eslint-parser";
import { createRule } from "../../utils/index.ts";

export default createRule("vue-custom-block/no-parsing-error", {
  meta: {
    docs: {
      description: "disallow parsing errors in Vue custom blocks",
      categories: ["recommended", "standard"],
      extensionRule: false,
    },
    schema: [],
    messages: {},
    type: "problem",
  },
  create(context, { customBlock }) {
    if (!customBlock) {
      return {};
    }
    const sourceCode = context.sourceCode;
    const parserServices = sourceCode.parserServices;
    const parseError = parserServices?.parseError;
    if (parseError && typeof parseError === "object") {
      let loc: AST.Position | undefined = undefined;
      if ("column" in parseError && "lineNumber" in parseError) {
        loc = {
          line: parseError.lineNumber as number,
          column: parseError.column as number,
        };
      }
      return {
        Program(node) {
          context.report({
            node,
            loc,
            message: (parseError as Record<string, unknown>).message as string,
          });
        },
      };
    }
    return {};
  },
});
