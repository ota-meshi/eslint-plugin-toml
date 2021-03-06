import {
    convertESNode,
    createRule,
    defineWrapperListener,
    getCoreRule,
} from "../utils"
const coreRule = getCoreRule("comma-style")

export default createRule("comma-style", {
    meta: {
        docs: {
            description: "enforce consistent comma style in array",
            categories: ["standard"],
            extensionRule: "comma-style",
        },
        fixable: coreRule.meta!.fixable,
        schema: coreRule.meta!.schema!,
        messages: coreRule.meta!.messages!,
        type: coreRule.meta!.type!,
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }

        return defineWrapperListener(coreRule, context, {
            options: [context.options[0]],
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
