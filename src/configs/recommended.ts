import path from "path"
const base = require.resolve("./base")
const baseExtend = path.extname(`${base}`) === ".ts" ? "plugin:toml/base" : base
export = {
    extends: [baseExtend],
    rules: {
        // eslint-plugin-toml rules
        "toml/no-unreadable-number-separator": "error",
        "toml/precision-of-fractional-seconds": "error",
        "toml/vue-custom-block/no-parsing-error": "error",
    },
}
