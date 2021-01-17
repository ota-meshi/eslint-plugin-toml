import { RuleTester } from "eslint"
import rule from "../../../src/rules/array-element-newline"
import { loadTestCases } from "../../utils/utils"

const tester = new RuleTester({
    parser: require.resolve("toml-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2020,
    },
})

tester.run(
    "array-element-newline",
    rule as any,
    loadTestCases("array-element-newline"),
)
