import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/precision-of-integer";
import { loadTestCases } from "../../utils/utils";
import assert from "assert";
import * as tomlParser from "toml-eslint-parser";
import { maxBitToMaxValues } from "../../../src/utils/bit";

const tester = new RuleTester({
  languageOptions: {
    parser: tomlParser,
    parserOptions: {
      tomlVersion: "next",
    },
  },
});

tester.run(
  "precision-of-integer",
  rule as any,
  loadTestCases("precision-of-integer"),
);

if (typeof BigInt !== "undefined") {
  const one = BigInt("1");
  const minusOne = BigInt("-1");
  describe("Test for precision-of-integer.maxBitToMaxValues.", () => {
    for (let bit = 1; bit <= 128; bit++) {
      it(`The result of ${bit} should be the expected value.`, () => {
        const maxValues = maxBitToMaxValues(bit);
        const plus = BigInt(maxValues["+"]);
        const minus = BigInt(maxValues["-"]);

        assert.strictEqual(minus * minusOne, BigInt.asIntN(bit, plus + one));
        assert.strictEqual(minus, BigInt(`0x${maxValues["0x"]}`));
        assert.strictEqual(minus, BigInt(`0o${maxValues["0o"]}`));
        assert.strictEqual(minus, BigInt(`0b${maxValues["0b"]}`));
      });
    }
  });
}
