import { RuleTester } from "eslint"
import rule from "../../../src/rules/precision-of-fractional-seconds"
import { loadTestCases } from "../../utils/utils"

const tester = new RuleTester({
    parser: require.resolve("toml-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2020,
    },
})

tester.run(
    "precision-of-fractional-seconds",
    rule as any,
    loadTestCases("precision-of-fractional-seconds"),
)
