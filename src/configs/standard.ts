import path from "path"
const base = require.resolve("./base")
const baseExtend = path.extname(`${base}`) === ".ts" ? "plugin:toml/base" : base
export = {
    extends: [baseExtend],
    rules: {
        // eslint-plugin-toml rules
        "toml/array-bracket-newline": "error",
        "toml/array-bracket-spacing": "error",
        "toml/array-element-newline": "error",
        "toml/inline-table-curly-spacing": "error",
        "toml/keys-order": "error",
        "toml/no-space-dots": "error",
        "toml/no-unreadable-number-separator": "error",
        "toml/padding-line-between-pairs": "error",
        "toml/padding-line-between-tables": "error",
        "toml/quoted-keys": "error",
        "toml/space-eq-sign": "error",
        "toml/spaced-comment": "error",
        "toml/table-bracket-spacing": "error",
        "toml/tables-order": "error",
        "toml/vue-custom-block/no-parsing-error": "error",
    },
}
