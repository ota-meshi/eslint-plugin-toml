// eslint-disable-next-line node/no-unsupported-features/es-syntax -- build
export const language = {
    tokenPostfix: ".toml",
    brackets: [
        { token: "delimiter.bracket", open: "{", close: "}" },
        { token: "delimiter.square", open: "[", close: "]" },
    ],
    keywords: ["true", "false", "nan", "inf"],
    numberInteger: /(?:0|[+-]?\d+)/,
    numberFloat: /(?:0|[+-]?\d+)(?:\.\d+)?(?:e[-+][1-9]\d*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[\da-fA-F]+/,
    numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes: /\\(?:[btnfr\\"])/,
    tokenizer: {
        root: [
            { include: "@whitespace" },
            { include: "@comment" },
            { include: "@inlineCollections" },
            // Numbers
            [/@numberInteger(?![ \t]*\S+)/, "number"],
            [/@numberFloat(?![ \t]*\S+)/, "number.float"],
            [/@numberOctal(?![ \t]*\S+)/, "number.octal"],
            [/@numberHex(?![ \t]*\S+)/, "number.hex"],
            [/@numberDate(?![ \t]*\S+)/, "number.date"],
            // Key=Value pair
            [
                /(".*?"|'.*?'|.*?)([ \t]*)(=)(\s*|$)/,
                ["type", "white", "operators", "white"],
            ],
            { include: "@scalars" },
            // String nodes
            [
                /.+$/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@default": "string",
                    },
                },
            ],
        ],
        // Inline Table
        object: [
            { include: "@whitespace" },
            { include: "@comment" },
            // termination
            [/\}/, "@brackets", "@pop"],
            // delimiter
            [/,/, "delimiter.comma"],
            // Key=Value delimiter
            [/[=](?= )/, "operators"],
            // Key=Value key
            [/(?:".*?"|'.*?'|[^,{[]+?)(?=[=] )/u, "type"],
            // Values
            { include: "@inlineCollections" },
            { include: "@scalars" },
            { include: "@numbersInCollection" },
            // Other value (keyword or string)
            [
                /[^},]+/u,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@default": "string",
                    },
                },
            ],
        ],
        // Array or Table
        array: [
            { include: "@whitespace" },
            { include: "@comment" },
            // termination
            [/\]/, "@brackets", "@pop"],
            // delimiter
            [/,/, "delimiter.comma"],
            // Table delimiter
            [/\./, "delimiter.comma"],
            // Values
            { include: "@inlineCollections" },
            { include: "@scalars" },
            { include: "@numbersInCollection" },
            // Other value (keyword or string)
            [
                /[^\],.]+/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@default": "string",
                    },
                },
            ],
        ],
        whitespace: [[/[ \t\r\n]+/, "white"]],
        // Only line comments
        comment: [[/#.*$/, "comment"]],
        // Start collections
        inlineCollections: [
            [/\[/, "@brackets", "@array"],
            [/\{/, "@brackets", "@object"],
        ],
        // Start Scalars (quoted strings)
        scalars: [
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/'''[^']*'''/, "string"],
            [/'[^']*'/, "string"],
            [/"""/, "string", "@mlDoubleQuotedString"],
            [/"/, "string", "@doubleQuotedString"],
        ],
        mlDoubleQuotedString: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"""/, "string", "@pop"],
        ],
        doubleQuotedString: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"],
        ],
        // Numbers in collections (terminate with ,]})
        numbersInCollection: [
            [/@numberInteger(?=[ \t]*[,\]}])/u, "number"],
            [/@numberFloat(?=[ \t]*[,\]}])/u, "number.float"],
            [/@numberOctal(?=[ \t]*[,\]}])/u, "number.octal"],
            [/@numberHex(?=[ \t]*[,\]}])/u, "number.hex"],
            [/@numberDate(?=[ \t]*[,\]}])/u, "number.date"],
        ],
    },
}
