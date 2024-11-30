
import { getPlugin } from "../plugin-store.cjs";
const toml = getPlugin()
export default [
    {
        files: ["**/*.js"],
    },
    ...toml.configs["flat/recommended"]
]
