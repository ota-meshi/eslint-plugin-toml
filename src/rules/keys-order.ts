import type { AST } from "toml-eslint-parser"
import { getStaticTOMLValue } from "toml-eslint-parser"
import lodash from "lodash"
import { createRule } from "../utils"

type KeyData = {
    key: string
    lastNode: AST.TOMLKey
    keys: KeyData[]
}

export default createRule("keys-order", {
    meta: {
        docs: {
            description: "disallow defining pair keys out-of-order",
            categories: ["standard"],
            extensionRule: false,
        },
        fixable: "code",
        schema: [],
        messages: {
            outOfOrder: "'{{target}}' must be next to '{{before}}'.",
        },
        type: "suggestion",
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }

        const sourceCode = context.getSourceCode()

        /**
         * Apply new key
         */
        function applyKey(
            tableKeys: KeyData[],
            node: AST.TOMLKey,
        ): AST.TOMLKey | null {
            const keyNames = getStaticTOMLValue(node)

            let before: AST.TOMLKey | null = null
            let keys = tableKeys
            while (keyNames.length) {
                const key = keyNames.shift()!
                let next = keys.find((e) => e.key === key)
                if (!next) {
                    next = {
                        key,
                        lastNode: node,
                        keys: [],
                    }
                    before = lodash.last(keys)?.lastNode || null
                    keys.push(next)
                } else {
                    next.lastNode = node
                }
                keys = next.keys
            }

            return before
        }

        /**
         * Verify table
         */
        function verify(
            node: AST.TOMLTopLevelTable | AST.TOMLTable | AST.TOMLInlineTable,
        ) {
            const keys: KeyData[] = []
            const map = new Map<AST.TOMLKey, AST.TOMLKeyValue>()

            let pre: AST.TOMLKey | null = null
            for (const body of node.body) {
                if (body.type !== "TOMLKeyValue") {
                    continue
                }
                map.set(body.key, body)

                const before = applyKey(keys, body.key)

                if (before && before !== pre) {
                    context.report({
                        node: body.key,
                        messageId: "outOfOrder",
                        data: {
                            target: getStaticTOMLValue(body.key).join("."),
                            before: getStaticTOMLValue(before).join("."),
                        },
                        fix(fixer) {
                            const startToken = sourceCode.getTokenBefore(body)!
                            const start =
                                node.type === "TOMLInlineTable"
                                    ? startToken.range[0]
                                    : startToken.range[1]
                            const code = sourceCode.text.slice(
                                start,
                                body.range[1],
                            )
                            return [
                                fixer.insertTextAfter(
                                    map.get(before)!,
                                    node.type === "TOMLInlineTable"
                                        ? code
                                        : `\n${code.trim()}`,
                                ),
                                fixer.removeRange([start, body.range[1]]),
                            ]
                        },
                    })
                }
                pre = body.key
            }
        }

        return {
            TOMLTopLevelTable: verify,
            TOMLTable: verify,
            TOMLInlineTable: verify,
        }
    },
})
