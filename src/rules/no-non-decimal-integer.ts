import type { AST } from "toml-eslint-parser"
import type { Fix, RuleFixer } from "../types"
import { createRule } from "../utils"

export default createRule("no-non-decimal-integer", {
    meta: {
        docs: {
            description: "disallow hexadecimal, octal and binary integer",
            categories: null,
            extensionRule: false,
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    allowHexadecimal: {
                        type: "boolean",
                    },
                    allowOctal: {
                        type: "boolean",
                    },
                    allowBinary: {
                        type: "boolean",
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            disallowHex: "Hexadecimal integers are forbidden.",
            disallowOctal: "Octal integers are forbidden.",
            disallowBinary: "Binary integers are forbidden.",
        },
        type: "suggestion",
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }
        const allowHexadecimal = Boolean(context.options[0]?.allowHexadecimal)
        const allowOctal = Boolean(context.options[0]?.allowOctal)
        const allowBinary = Boolean(context.options[0]?.allowBinary)

        const sourceCode = context.getSourceCode()

        /**
         * Build fixer
         */
        function buildFixer(
            node: AST.TOMLNumberValue,
            text: string,
            mark: "x" | "o" | "b",
        ): ((fixer: RuleFixer) => Fix) | undefined {
            if (allowHexadecimal || allowOctal || allowBinary) {
                return undefined
            }
            const d = mark === "x" ? 16 : mark === "o" ? 8 : 2

            const code = text
                .slice(2)
                .toLowerCase()
                .replace(/_/gu, "")
                .replace(/^0+/gu, "")
            const value = parseInt(code, d)
            const decimalText = value.toString(d)
            if (decimalText !== code) {
                // Since it is irreversible, auto-fix will be stopped.
                return undefined
            }
            const str = String(value)
            if (!/^-?\d+$/u.test(str)) {
                // Avoid exponential notation.
                return undefined
            }
            return (fixer) => {
                return fixer.replaceText(node, String(value))
            }
        }

        /**
         * Verify number value node text
         */
        function verifyText(node: AST.TOMLNumberValue) {
            const text = sourceCode.getText(node)
            if (text.startsWith("0")) {
                const maybeMark = text[1]
                if (maybeMark === "x" && !allowHexadecimal) {
                    context.report({
                        node,
                        messageId: "disallowHex",
                        fix: buildFixer(node, text, maybeMark),
                    })
                } else if (maybeMark === "o" && !allowOctal) {
                    context.report({
                        node,
                        messageId: "disallowOctal",
                        fix: buildFixer(node, text, maybeMark),
                    })
                } else if (maybeMark === "b" && !allowBinary) {
                    context.report({
                        node,
                        messageId: "disallowBinary",
                        fix: buildFixer(node, text, maybeMark),
                    })
                }
            }
        }

        return {
            TOMLValue(node) {
                if (node.kind === "integer") {
                    verifyText(node)
                }
            },
        }
    },
})
