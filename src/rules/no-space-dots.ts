import { createRule } from "../utils";

export default createRule("no-space-dots", {
  meta: {
    docs: {
      description: "disallow spacing around infix operators",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      unexpectedBefore: "Unexpected whitespace before dot.",
      unexpectedAfter: "Unexpected whitespace after dot.",
    },
    type: "layout",
  },
  create(context) {
    if (!context.parserServices.isTOML) {
      return {};
    }
    const sourceCode = context.getSourceCode();

    return {
      TOMLKey(node) {
        for (let index = 0; index < node.keys.length - 1; index++) {
          const prev = node.keys[index];
          const next = node.keys[index + 1];

          const comma = sourceCode.getTokenAfter(prev)!;

          if (prev.range[1] < comma.range[0]) {
            context.report({
              loc: {
                start: prev.loc.end,
                end: comma.loc.start,
              },
              messageId: "unexpectedBefore",
              fix(fixer) {
                return fixer.removeRange([prev.range[1], comma.range[0]]);
              },
            });
          }

          if (comma.range[1] < next.range[0]) {
            context.report({
              loc: {
                start: comma.loc.end,
                end: next.loc.start,
              },
              messageId: "unexpectedAfter",
              fix(fixer) {
                return fixer.removeRange([comma.range[1], next.range[0]]);
              },
            });
          }
        }
      },
    };
  },
});
