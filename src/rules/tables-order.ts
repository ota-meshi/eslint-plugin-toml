import type { AST } from "toml-eslint-parser"
import { getStaticTOMLValue } from "toml-eslint-parser"
import lodash from "lodash"
import { createRule } from "../utils"

type KeyData = {
    key: string | number
    array: boolean
    firstNode: AST.TOMLTable | null
    lastNode: AST.TOMLTable | null
    keys: KeyData[]
}

/**
 * Get first key node
 */
function getFirst(keys: KeyData[]): AST.TOMLTable | null {
    const first = keys[0]
    if (first) {
        return getFirst(first.keys) || first.firstNode
    }
    return null
}

/**
 * Get last key node
 */
function getLast(keys: KeyData[]): AST.TOMLTable | null {
    const last = lodash.last(keys)
    if (last) {
        return getLast(last.keys) || last.lastNode
    }
    return null
}

export default createRule("tables-order", {
    meta: {
        docs: {
            description: "disallow defining tables out-of-order",
            categories: ["standard"],
            extensionRule: false,
        },
        fixable: "code",
        schema: [],
        messages: {
            outOfOrder: "'{{target}}' must be next to '{{before}}'.",
            outOfOrderToBefore: "'{{target}}' must be previous to '{{after}}'.",
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
            rootKeys: KeyData[],
            node: AST.TOMLTable,
        ):
            | { before: AST.TOMLTable; after: null }
            | { before: null; after: AST.TOMLTable }
            | { before: null; after: null } {
            const keyNames = getStaticTOMLValue(node.key)

            let before: AST.TOMLTable | null = null
            let keys = rootKeys
            while (keyNames.length) {
                const key = keyNames.shift()!
                const isLast = !keyNames.length
                const nextIndex = keys.findIndex((e) => e.key === key)
                if (nextIndex < 0) {
                    const targetNode = isLast ? node : null
                    const next: KeyData = {
                        key,
                        array: node.kind === "array" && isLast,
                        firstNode: targetNode,
                        lastNode: targetNode,
                        keys: [],
                    }
                    if (isLast) {
                        before = getLast(keys)
                    }
                    keys.push(next)
                    keys = next.keys
                } else {
                    const next = keys[nextIndex]
                    if (next.array) {
                        if (isLast) {
                            before = getLast(next.keys) || next.lastNode
                            next.lastNode = node
                            next.keys = []
                            break
                        }
                    }
                    if (isLast) {
                        if (!next.firstNode && next.keys.length > 0) {
                            const after = getFirst(next.keys)
                            return {
                                before: null,
                                after,
                            }
                        }
                        before = getLast(keys)
                    }
                    keys = next.keys
                }
            }

            return {
                before,
                after: null,
            }
        }

        /**
         * Verify tables
         */
        function verify(node: AST.TOMLTopLevelTable) {
            const keys: KeyData[] = []

            let pre: AST.TOMLTable | null = null
            for (const body of node.body) {
                if (body.type !== "TOMLTable") {
                    continue
                }

                const { before, after } = applyKey(keys, body)

                if (after) {
                    context.report({
                        node: body.key,
                        messageId: "outOfOrderToBefore",
                        data: {
                            target: getStaticTOMLValue(body.key).join("."),
                            after: getStaticTOMLValue(after.key).join("."),
                        },
                        fix(fixer) {
                            const startToken = sourceCode.getTokenBefore(body)!
                            const code = sourceCode.text.slice(
                                startToken.range[1],
                                body.range[1],
                            )
                            return [
                                fixer.insertTextBefore(
                                    after,
                                    `${code.trim()}\n`,
                                ),
                                fixer.removeRange([
                                    startToken.range[1],
                                    body.range[1],
                                ]),
                            ]
                        },
                    })
                } else if (before && before !== pre) {
                    context.report({
                        node: body.key,
                        messageId: "outOfOrder",
                        data: {
                            target: getStaticTOMLValue(body.key).join("."),
                            before: getStaticTOMLValue(before.key).join("."),
                        },
                        fix(fixer) {
                            const startToken = sourceCode.getTokenBefore(body)!
                            const code = sourceCode.text.slice(
                                startToken.range[1],
                                body.range[1],
                            )
                            return [
                                fixer.insertTextAfter(
                                    before,
                                    `\n${code.trim()}`,
                                ),
                                fixer.removeRange([
                                    startToken.range[1],
                                    body.range[1],
                                ]),
                            ]
                        },
                    })
                }
                pre = body
            }
        }

        return {
            TOMLTopLevelTable: verify,
        }
    },
})
