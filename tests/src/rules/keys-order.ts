import { RuleTester } from "eslint"
import rule from "../../../src/rules/keys-order"
import { loadTestCases } from "../../utils/utils"

const tester = new RuleTester({
    parser: require.resolve("toml-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2020,
    },
})

tester.run("keys-order", rule as any, loadTestCases("keys-order"))
