import {
    convertESNode,
    createRule,
    defineWrapperListener,
    getCoreRule,
} from "../utils"
const coreRule = getCoreRule("object-curly-spacing")

export default createRule("inline-table-curly-spacing", {
    meta: {
        docs: {
            description: "enforce consistent spacing inside braces",
            categories: ["standard"],
            extensionRule: "object-curly-spacing",
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
            options: [
                context.options[0] || "always",
                ...context.options.slice(1),
            ],
            createListenerProxy(listener) {
                return {
                    TOMLInlineTable(node) {
                        listener.ObjectExpression(convertESNode(node))
                    },
                }
            },
            getNodeProxy: convertESNode,
        })
    },
})
