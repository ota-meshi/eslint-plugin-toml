import {
    createRule,
    defineWrapperListener,
    getCoreRule,
    getProxyNode,
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
                        listener.ArrayExpression(
                            getProxyNode(node, {
                                type: "ArrayExpression",
                                get elements() {
                                    return node.elements
                                },
                            }),
                        )
                    },
                }
            },
            getNodeProxy(node) {
                if (node.type === "TOMLInlineTable") {
                    return getProxyNode(node, {
                        type: "ObjectExpression",
                        properties: node.body,
                    })
                }
                if (node.type === "TOMLArray") {
                    return getProxyNode(node, {
                        type: "ArrayExpression",
                        elements: node.elements,
                    })
                }
                return node
            },
        })
    },
})
