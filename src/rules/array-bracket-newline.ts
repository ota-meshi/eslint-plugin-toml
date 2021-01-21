import {
    convertESNode,
    createRule,
    defineWrapperListener,
    getCoreRule,
} from "../utils"
const coreRule = getCoreRule("array-bracket-newline")

export default createRule("array-bracket-newline", {
    meta: {
        docs: {
            description:
                "enforce linebreaks after opening and before closing array brackets",
            categories: ["standard"],
            extensionRule: "array-bracket-newline",
        },
        fixable: coreRule.meta!.fixable,
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
                        listener.ArrayExpression(convertESNode(node))
                    },
                }
            },
        })
    },
})
