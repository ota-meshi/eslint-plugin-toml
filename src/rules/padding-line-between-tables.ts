import type { AST } from "toml-eslint-parser"
import type { TOMLToken } from "../types"
import { createRule } from "../utils"

export default createRule("padding-line-between-tables", {
    meta: {
        docs: {
            description: "require or disallow padding lines between tables",
            categories: ["standard"],
            extensionRule: false,
        },
        fixable: "whitespace",
        schema: [],
        messages: {
            unexpectedBlankLine: "Unexpected blank line before this table.",
            expectedBlankLine: "Expected blank line before this table.",
        },
        type: "layout",
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }
        const sourceCode = context.getSourceCode()

        /**
         * Verify tables
         */
        function verifyTables(
            prevNode: AST.TOMLTable,
            nextNode: AST.TOMLTable,
        ) {
            const tokens = sourceCode.getTokensBetween(prevNode, nextNode, {
                includeComments: true,
            })
            let prevTarget: AST.TOMLNode | TOMLToken = prevNode
            for (const token of [...tokens, nextNode]) {
                if (prevTarget.loc.end.line + 1 < token.loc.start.line) {
                    return
                }
                prevTarget = token
            }
            context.report({
                node: nextNode.key,
                messageId: "expectedBlankLine",
                fix(fixer) {
                    return fixer.insertTextAfter(prevNode, "\n")
                },
            })
        }

        /**
         * Verify top level table
         */
        function verify(node: AST.TOMLTopLevelTable) {
            let prev: AST.TOMLTable | null = null
            for (const body of node.body) {
                if (body.type !== "TOMLTable") {
                    continue
                }

                if (prev) {
                    verifyTables(prev, body)
                }
                prev = body
            }
        }

        return {
            TOMLTopLevelTable: verify,
        }
    },
})
