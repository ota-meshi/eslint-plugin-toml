import type { AST } from "toml-eslint-parser"
import { createRule } from "../utils"

export default createRule("space-eq-sign", {
    meta: {
        docs: {
            description: "require spacing around equals sign",
            categories: ["standard"],
            extensionRule: false,
        },
        fixable: "whitespace",
        schema: [],
        messages: {
            missingSpace: "Equals sign '=' must be spaced.",
        },
        type: "layout",
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }
        const sourceCode = context.getSourceCode()

        /**
         * Reports an equal sign token as a rule violation
         */
        function report(equalToken: AST.Token) {
            context.report({
                loc: equalToken.loc,
                messageId: "missingSpace",
                *fix(fixer) {
                    const previousToken = sourceCode.getTokenBefore(equalToken)!
                    const afterToken = sourceCode.getTokenAfter(equalToken)!

                    if (previousToken.range[1] === equalToken.range[0]) {
                        yield fixer.insertTextBefore(equalToken, " ")
                    }
                    if (equalToken.range[1] === afterToken.range[0]) {
                        yield fixer.insertTextAfter(equalToken, " ")
                    }
                },
            })
        }

        return {
            TOMLKeyValue(node) {
                const equalToken = sourceCode.getTokenBefore(node.value)!
                if (
                    node.key.range[1] === equalToken.range[0] ||
                    equalToken.range[1] === node.value.range[0]
                ) {
                    report(equalToken)
                }
            },
        }
    },
})
