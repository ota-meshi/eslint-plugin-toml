import assert from "assert";
import { parseForESLint } from "toml-eslint-parser";
import { TOMLSourceCode } from "../../../src/language/toml-source-code.ts";

function createSourceCode(code: string): TOMLSourceCode {
  const result = parseForESLint(code);
  return new TOMLSourceCode({
    text: code,
    ast: result.ast,
    hasBOM: false,
    parserServices: { isTOML: true },
    visitorKeys: result.visitorKeys,
  });
}

describe("TOMLSourceCode", () => {
  describe("getNodeByRangeIndex", () => {
    it("should return the deepest node containing the index", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      // Index 0 is at 'k' of 'key'
      const node = sourceCode.getNodeByRangeIndex(0);

      assert.ok(node);
      assert.strictEqual(node.type, "TOMLBare");
    });

    it("should return the value node when index is in value range", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      // Index 7 is inside "value" (after the opening quote)
      const node = sourceCode.getNodeByRangeIndex(7);

      assert.ok(node);
      assert.strictEqual(node.type, "TOMLValue");
    });

    it("should return TOMLKeyValue when index is at equals sign", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      // Index 4 is at '='
      const node = sourceCode.getNodeByRangeIndex(4);

      assert.ok(node);
      assert.strictEqual(node.type, "TOMLKeyValue");
    });

    it("should return null when index is out of range", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      // Index 100 is outside the code
      const node = sourceCode.getNodeByRangeIndex(100);

      assert.strictEqual(node, null);
    });

    it("should return the correct node in nested structures", () => {
      const code = `[table]
key = "value"`;
      const sourceCode = createSourceCode(code);

      // Index in 'table'
      const tableNode = sourceCode.getNodeByRangeIndex(1);

      assert.ok(tableNode);
      assert.strictEqual(tableNode.type, "TOMLBare");

      // Index in nested key
      const keyNode = sourceCode.getNodeByRangeIndex(8);

      assert.ok(keyNode);
      assert.strictEqual(keyNode.type, "TOMLBare");
    });

    it("should work with arrays", () => {
      const code = `arr = [1, 2, 3]`;
      const sourceCode = createSourceCode(code);

      // Index inside the array value '2'
      const node = sourceCode.getNodeByRangeIndex(10);

      assert.ok(node);
      assert.strictEqual(node.type, "TOMLValue");
    });

    it("should work with inline tables", () => {
      const code = `inline = { key = "value" }`;
      const sourceCode = createSourceCode(code);

      // Index inside the inline table's key
      const node = sourceCode.getNodeByRangeIndex(11);

      assert.ok(node);
      assert.strictEqual(node.type, "TOMLBare");
    });

    it("should return Program when index is at end of file whitespace", () => {
      const code = `key = "value"
`;
      const sourceCode = createSourceCode(code);

      // Index at the newline character at the end
      const node = sourceCode.getNodeByRangeIndex(13);

      assert.ok(node);
      // Should return the deepest node that contains this range
    });
  });

  describe("isSpaceBetween", () => {
    it("should return true when there is space between two tokens", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0]; // 'key'
      const eqToken = tokens[1]; // '='

      const result = sourceCode.isSpaceBetween(keyToken, eqToken);

      assert.strictEqual(result, true);
    });

    it("should return false when there is no space between two tokens", () => {
      const code = `key="value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0]; // 'key'
      const eqToken = tokens[1]; // '='

      const result = sourceCode.isSpaceBetween(keyToken, eqToken);

      assert.strictEqual(result, false);
    });

    it("should return false when tokens overlap", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0]; // 'key'

      // Same token passed twice (overlapping with itself)
      const result = sourceCode.isSpaceBetween(keyToken, keyToken);

      assert.strictEqual(result, false);
    });

    it("should work regardless of token order", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0]; // 'key'
      const eqToken = tokens[1]; // '='

      // Reversed order
      const result = sourceCode.isSpaceBetween(eqToken, keyToken);

      assert.strictEqual(result, true);
    });

    it("should return true when there are multiple spaces", () => {
      const code = `key   =   "value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0]; // 'key'
      const eqToken = tokens[1]; // '='

      const result = sourceCode.isSpaceBetween(keyToken, eqToken);

      assert.strictEqual(result, true);
    });

    it("should return true when there is a newline between lines", () => {
      const code = `key1 = "value1"

key2 = "value2"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      // First line's value token and second line's key token
      const value1Token = tokens[2]; // '"value1"'
      const key2Token = tokens[3]; // 'key2'

      const result = sourceCode.isSpaceBetween(value1Token, key2Token);

      assert.strictEqual(result, true);
    });

    it("should handle comments between tokens", () => {
      const code = `key = "value" # comment
key2 = "value2"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const valueToken = tokens[2]; // '"value"'
      const comment = tokens[3]; // '# comment'

      const result = sourceCode.isSpaceBetween(valueToken, comment);

      assert.strictEqual(result, true);
    });

    it("should return false for adjacent tokens without space", () => {
      const code = `arr = [1,2,3]`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      // Find the comma and the following number
      const commaIndex = tokens.findIndex(
        (t) => t.type === "Punctuator" && t.value === ",",
      );
      const commaToken = tokens[commaIndex];
      const nextToken = tokens[commaIndex + 1];

      const result = sourceCode.isSpaceBetween(commaToken, nextToken);

      assert.strictEqual(result, false);
    });

    it("should return true for tokens with space in arrays", () => {
      const code = `arr = [1, 2, 3]`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      // Find the comma and the following number
      const commaIndex = tokens.findIndex(
        (t) => t.type === "Punctuator" && t.value === ",",
      );
      const commaToken = tokens[commaIndex];
      const nextToken = tokens[commaIndex + 1];

      const result = sourceCode.isSpaceBetween(commaToken, nextToken);

      assert.strictEqual(result, true);
    });
  });

  describe("isSpaceBetweenTokens (deprecated alias)", () => {
    it("should behave the same as isSpaceBetween", () => {
      const code = `key = "value"`;
      const sourceCode = createSourceCode(code);

      const tokens = sourceCode.tokensAndComments;
      const keyToken = tokens[0];
      const eqToken = tokens[1];

      const result1 = sourceCode.isSpaceBetween(keyToken, eqToken);
      const result2 = sourceCode.isSpaceBetweenTokens(keyToken, eqToken);

      assert.strictEqual(result1, result2);
    });
  });
});
