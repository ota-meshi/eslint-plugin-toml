import path from "path"
const base = require.resolve("./base")
const baseExtend = path.extname(`${base}`) === ".ts" ? "plugin:toml/base" : base
export = {
    extends: [baseExtend],
    rules: {
        // eslint-plugin-toml rules
        "toml/no-space-dots": "error",
        "toml/quoted-keys": "error",
        "toml/spaced-comment": "error",
        "toml/vue-custom-block/no-parsing-error": "error",
    },
}
