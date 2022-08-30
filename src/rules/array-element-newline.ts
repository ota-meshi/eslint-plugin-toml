import {
  convertESNode,
  createRule,
  defineWrapperListener,
  getCoreRule,
} from "../utils";
const coreRule = getCoreRule("array-element-newline");

export default createRule("array-element-newline", {
  meta: {
    docs: {
      description: "enforce line breaks between array elements",
      categories: ["standard"],
      extensionRule: "array-element-newline",
    },
    fixable: coreRule.meta!.fixable,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
    hasSuggestions: (coreRule.meta as any).hasSuggestions,
    schema: coreRule.meta!.schema!,
    messages: coreRule.meta!.messages!,
    type: coreRule.meta!.type!,
  },
  create(context) {
    return defineWrapperListener(coreRule, context, {
      options: context.options,
      createListenerProxy(listener) {
        return {
          TOMLArray(node) {
            listener.ArrayExpression(convertESNode(node));
          },
        };
      },
    });
  },
});
