import { createRule } from "../utils/index.ts";


export default createRule("quoted-keys", {
  meta: {
    docs: {
      description: "require or disallow quotes around keys",
      categories: ["standard"],
      extensionRule: false,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          prefer: {
            enum: ["as-needed", "always"],
          },
          numbers: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unnecessarilyQuotedKey: "Unnecessarily quoted key '{{key}}' found.",
      unquotedNumericKey: "Unquoted number '{{key}}' used as key.",
      unquotedKeyFound: "Unquoted key '{{key}}' found.",
    },
    type: "layout",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!sourceCode.parserServices?.isTOML) {
      return {};
    }

    const prefer: "as-needed" | "always" =
      context.options[0]?.prefer ?? "as-needed";
    const numbers: boolean = context.options[0]?.numbers !== false;

    return {
      TOMLBare(node) {
        if (prefer === "always") {
          context.report({
            node,
            messageId: "unquotedKeyFound",
            data: { key: node.name },
            fix(fixer) {
              return fixer.replaceText(node, `"${node.name}"`);
            },
          });
          return;
        }
        if (numbers && /^[\d-]+$/u.test(node.name)) {
          context.report({
            node,
            messageId: "unquotedNumericKey",
            data: { key: node.name },
            fix(fixer) {
              return fixer.replaceText(node, `"${node.name}"`);
            },
          });
        }
      },
      TOMLQuoted(node) {
        if (prefer === "always") {
          return;
        }
        if (
          // can use bare key
          /^[\w-]+$/u.test(node.value)
        ) {
          if (numbers && /^[\d-]+$/u.test(node.value)) {
            return;
          }
          context.report({
            node,
            messageId: "unnecessarilyQuotedKey",
            data: { key: node.value },
            fix(fixer) {
              return fixer.replaceText(node, node.value);
            },
          });
        }
      },
    };
  },
});
