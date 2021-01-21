import {
    createRule,
    defineWrapperListener,
    getCoreRule,
    convertESNode,
} from "../utils"
const coreRule = getCoreRule("array-bracket-spacing")

export default createRule("array-bracket-spacing", {
    meta: {
        docs: {
            description: "enforce consistent spacing inside array brackets",
            categories: ["standard"],
            extensionRule: "array-bracket-spacing",
        },
        fixable: coreRule.meta!.fixable,
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
                    TOMLArray(node) {
                        listener.ArrayExpression(convertESNode(node))
                    },
                }
            },
        })
    },
})
