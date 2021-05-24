import type { AST } from "toml-eslint-parser"
import { createRule } from "../utils"

type MaxValues = {
    "+": string
    "-": string // Does not include a minus sign.
    "0x": string
    "0o": string
    "0b": string
}
const cacheMaxValues: Record<number, MaxValues> = {}

/**
 * Convert the given maxBit to max hex, octal, binary and decimal number strings
 *
 * *Export for testing.
 */
export function maxBitToMaxValues(maxBit: number): MaxValues {
    const binaryMax: number[] = []
    const minusMax: number[] = [0]
    const plusMax: number[] = [0]
    const hexMax: number[] = [0]
    const octalMax: number[] = [0]
    for (let index = 0; index < maxBit; index++) {
        const binaryNum = index === 0 ? 1 : 0
        binaryMax.push(binaryNum)

        processDigits(minusMax, binaryNum, 10)
        processDigits(hexMax, binaryNum, 16)
        processDigits(octalMax, binaryNum, 8)
        if (index > 0) {
            processDigits(plusMax, 1, 10)
        }
    }
    return {
        "+": plusMax.reverse().join(""),
        "-": minusMax.reverse().join(""),
        "0x": hexMax
            .map((i) => i.toString(16))
            .reverse()
            .join("")
            .toLowerCase(),
        "0o": octalMax.reverse().join(""),
        "0b": binaryMax.join(""),
    }

    /** Process digits */
    function processDigits(
        digits: number[],
        binaryNum: number,
        radix: 10 | 16 | 8,
    ) {
        let num = binaryNum
        for (let place = 0; place < digits.length; place++) {
            num = digits[place] * 2 + num
            digits[place] = num % radix
            num = Math.floor(num / radix)
        }
        while (num > 0) {
            digits.push(num % radix)
            num = Math.floor(num / radix)
        }
    }
}

/**
 * Get max values
 */
function getMaxValues(bit: number): MaxValues {
    if (cacheMaxValues[bit]) {
        return cacheMaxValues[bit]
    }
    return (cacheMaxValues[bit] = maxBitToMaxValues(bit))
}

export default createRule("precision-of-integer", {
    meta: {
        docs: {
            description:
                "disallow precision of integer greater than the specified value.",
            categories: ["recommended", "standard"],
            extensionRule: false,
        },
        schema: [
            {
                type: "object",
                properties: {
                    maxBit: {
                        type: "number",
                        minimum: 1,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            over: "Integers with precision greater than {{maxBit}}-bit are forbidden.",
        },
        type: "problem",
    },
    create(context) {
        if (!context.parserServices.isTOML) {
            return {}
        }
        const maxBit = context.options[0]?.maxBit ?? 64
        const maxValues = getMaxValues(maxBit)

        /**
         * Verify number text
         */
        function verifyMaxValue(
            node: AST.TOMLNumberValue,
            numText: string,
            max: string,
        ) {
            const num = numText.replace(/^0+/, "").toLowerCase()
            if (num.length < max.length) {
                return
            }
            if (num.length === max.length && num <= max) {
                return
            }
            context.report({
                node,
                messageId: "over",
                data: {
                    maxBit,
                },
            })
        }

        /**
         * Verify integer value node text
         */
        function verifyText(node: AST.TOMLNumberValue) {
            const text = node.number
            if (text.startsWith("0")) {
                const maybeMark = text[1]
                if (maybeMark === "x") {
                    verifyMaxValue(node, text.slice(2), maxValues["0x"])
                    return
                } else if (maybeMark === "o") {
                    verifyMaxValue(node, text.slice(2), maxValues["0o"])
                    return
                } else if (maybeMark === "b") {
                    verifyMaxValue(node, text.slice(2), maxValues["0b"])
                    return
                }
            } else if (text.startsWith("-")) {
                verifyMaxValue(node, text.slice(1), maxValues["-"])
                return
            } else if (text.startsWith("+")) {
                verifyMaxValue(node, text.slice(1), maxValues["+"])
                return
            }
            verifyMaxValue(node, text, maxValues["+"])
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
