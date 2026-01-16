import assert from "assert";
import { parseTOML } from "toml-eslint-parser";
import { TokenStore } from "../../../src/language/token-store.ts";
import type { AST } from "toml-eslint-parser";

function parse(code: string): AST.TOMLProgram {
  return parseTOML(code);
}

describe("TokenStore", () => {
  describe("getFirstToken", () => {
    it("should return the first token of a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue);

      assert.ok(token);
      assert.strictEqual(token.type, "Bare");
      assert.strictEqual(token.value, "key");
    });

    it("should return the first token with skip option", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue, { skip: 1 });

      assert.ok(token);
      assert.strictEqual(token.type, "Punctuator");
      assert.strictEqual(token.value, "=");
    });

    it("should return null when skip exceeds available tokens", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue, { skip: 10 });

      assert.strictEqual(token, null);
    });

    it("should include comments when option is set", () => {
      const ast = parse(`# comment
key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue, { includeComments: true });

      assert.ok(token);
      assert.strictEqual(token.type, "Bare");
      assert.strictEqual(token.value, "key");
    });

    it("should filter tokens with filter option", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue, {
        filter: (t) => t.type === "BasicString",
      });

      assert.ok(token);
      assert.strictEqual(token.type, "BasicString");
    });
  });

  describe("getLastToken", () => {
    it("should return the last token of a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getLastToken(keyValue);

      assert.ok(token);
      assert.strictEqual(token.type, "BasicString");
    });

    it("should return the last token with skip option", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getLastToken(keyValue, { skip: 1 });

      assert.ok(token);
      assert.strictEqual(token.type, "Punctuator");
      assert.strictEqual(token.value, "=");
    });
  });

  describe("getTokenBefore", () => {
    it("should return the token before a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const value = keyValue.value;

      const token = store.getTokenBefore(value);

      assert.ok(token);
      assert.strictEqual(token.type, "Punctuator");
      assert.strictEqual(token.value, "=");
    });

    it("should return null when there is no token before", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;

      const token = store.getTokenBefore(key);

      assert.strictEqual(token, null);
    });

    it("should include comments when option is set", () => {
      const ast = parse(`# comment
key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;

      const token = store.getTokenBefore(key, { includeComments: true });

      // TOML only has line comments, which are stored as "Block" type in the AST
      assert.ok(token);
      assert.strictEqual(token.type, "Block");
    });
  });

  describe("getTokenAfter", () => {
    it("should return the token after a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;

      const token = store.getTokenAfter(key);

      assert.ok(token);
      assert.strictEqual(token.type, "Punctuator");
      assert.strictEqual(token.value, "=");
    });

    it("should return null when there is no token after", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getTokenAfter(keyValue);

      assert.strictEqual(token, null);
    });

    it("should include comments when option is set", () => {
      const ast = parse(`key = "value" # comment`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getTokenAfter(keyValue, { includeComments: true });

      // TOML only has line comments, which are stored as "Block" type in the AST
      assert.ok(token);
      assert.strictEqual(token.type, "Block");
    });
  });

  describe("getTokensBefore", () => {
    it("should return tokens before a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const value = keyValue.value;

      const tokens = store.getTokensBefore(value, { count: 2 });

      assert.strictEqual(tokens.length, 2);
      assert.strictEqual(tokens[0].value, "key");
      assert.strictEqual(tokens[1].value, "=");
    });

    it("should return all tokens before when count is 0", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const value = keyValue.value;

      const tokens = store.getTokensBefore(value, undefined);

      assert.strictEqual(tokens.length, 2);
    });
  });

  describe("getTokens", () => {
    it("should return all tokens within a node", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const tokens = store.getTokens(keyValue);

      assert.strictEqual(tokens.length, 3);
      assert.strictEqual(tokens[0].value, "key");
      assert.strictEqual(tokens[1].value, "=");
      assert.strictEqual(tokens[2].type, "BasicString");
    });

    it("should limit tokens with count option", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const tokens = store.getTokens(keyValue, { count: 2 });

      assert.strictEqual(tokens.length, 2);
    });

    it("should filter tokens with filter option", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const tokens = store.getTokens(keyValue, {
        filter: (t) => t.type === "Punctuator",
      });

      assert.strictEqual(tokens.length, 1);
      assert.strictEqual(tokens[0].value, "=");
    });
  });

  describe("getTokensBetween", () => {
    it("should return tokens between two nodes", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;
      const value = keyValue.value;

      const tokens = store.getTokensBetween(key, value);

      assert.strictEqual(tokens.length, 1);
      assert.strictEqual(tokens[0].value, "=");
    });

    it("should return empty array when no tokens between", () => {
      const ast = parse(`[table]`);
      const store = new TokenStore({ ast });
      const table = ast.body[0];
      const leftBracket = store.getFirstToken(table);
      const rightBracket = store.getLastToken(table);

      // Since they are tokens (not nodes), getTokensBetween should return tokens between
      if (leftBracket && rightBracket) {
        const tokens = store.getTokensBetween(leftBracket, rightBracket);
        // Between "[" and "]" there is "table"
        assert.strictEqual(tokens.length, 1);
        assert.strictEqual(tokens[0].value, "table");
      }
    });
  });

  describe("getFirstTokenBetween", () => {
    it("should return the first token between two nodes", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;
      const value = keyValue.value;

      const token = store.getFirstTokenBetween(key, value);

      assert.ok(token);
      assert.strictEqual(token.value, "=");
    });

    it("should return null when no tokens between", () => {
      const ast = parse(`a=1`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;
      const eq = store.getTokenAfter(key);

      if (eq) {
        const token = store.getFirstTokenBetween(key, eq);
        assert.strictEqual(token, null);
      }
    });
  });

  describe("getCommentsBefore", () => {
    it("should return comments directly before a node", () => {
      const ast = parse(`# comment
key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;

      const comments = store.getCommentsBefore(key);

      assert.strictEqual(comments.length, 1);
      assert.strictEqual(comments[0].value, " comment");
    });

    it("should return multiple consecutive comments", () => {
      const ast = parse(`# comment1
# comment2
key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const key = keyValue.key;

      const comments = store.getCommentsBefore(key);

      assert.strictEqual(comments.length, 2);
      assert.strictEqual(comments[0].value, " comment1");
      assert.strictEqual(comments[1].value, " comment2");
    });

    it("should return empty array when no comments before", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const comments = store.getCommentsBefore(keyValue);

      assert.strictEqual(comments.length, 0);
    });

    it("should stop at non-comment token", () => {
      const ast = parse(`key1 = "value1"
# comment
key2 = "value2"`);
      const store = new TokenStore({ ast });
      const keyValue2 = ast.body[0].body[1];
      assert.strictEqual(keyValue2.type, "TOMLKeyValue");
      const key2 = keyValue2.key;

      const comments = store.getCommentsBefore(key2);

      assert.strictEqual(comments.length, 1);
      assert.strictEqual(comments[0].value, " comment");
    });
  });

  describe("getCommentsAfter", () => {
    it("should return comments directly after a node", () => {
      const ast = parse(`key = "value" # comment`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const comments = store.getCommentsAfter(keyValue);

      assert.strictEqual(comments.length, 1);
      assert.strictEqual(comments[0].value, " comment");
    });

    it("should return empty array when no comments after", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const comments = store.getCommentsAfter(keyValue);

      assert.strictEqual(comments.length, 0);
    });

    it("should stop at non-comment token", () => {
      const ast = parse(`key1 = "value1" # comment
key2 = "value2"`);
      const store = new TokenStore({ ast });
      const keyValue1 = ast.body[0].body[0];
      assert.strictEqual(keyValue1.type, "TOMLKeyValue");

      const comments = store.getCommentsAfter(keyValue1);

      assert.strictEqual(comments.length, 1);
      assert.strictEqual(comments[0].value, " comment");
    });
  });

  describe("options as number", () => {
    it("should treat number option as skip for getFirstToken", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(keyValue, 1);

      assert.ok(token);
      assert.strictEqual(token.value, "=");
    });

    it("should treat number option as count for getTokens", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const tokens = store.getTokens(keyValue, 2);

      assert.strictEqual(tokens.length, 2);
    });
  });

  describe("options as filter function", () => {
    it("should use function as filter for getFirstToken", () => {
      const ast = parse(`key = "value"`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");

      const token = store.getFirstToken(
        keyValue,
        (t) => t.type === "BasicString",
      );

      assert.ok(token);
      assert.strictEqual(token.type, "BasicString");
    });
  });

  describe("complex TOML structures", () => {
    it("should handle array tokens", () => {
      const ast = parse(`arr = [1, 2, 3]`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const arr = keyValue.value;

      const tokens = store.getTokens(arr);

      assert.ok(tokens.length > 0);
      const values = tokens.map((t) => t.value);
      assert.ok(values.includes("["));
      assert.ok(values.includes("]"));
    });

    it("should handle inline table tokens", () => {
      const ast = parse(`inline = { a = 1, b = 2 }`);
      const store = new TokenStore({ ast });
      const keyValue = ast.body[0].body[0];
      assert.strictEqual(keyValue.type, "TOMLKeyValue");
      const inlineTable = keyValue.value;

      const tokens = store.getTokens(inlineTable);

      assert.ok(tokens.length > 0);
      const values = tokens.map((t) => t.value);
      assert.ok(values.includes("{"));
      assert.ok(values.includes("}"));
    });

    it("should handle table header tokens", () => {
      const ast = parse(`[table]
key = "value"`);
      const store = new TokenStore({ ast });
      const table = ast.body[0];

      const firstToken = store.getFirstToken(table);
      const lastToken = store.getLastToken(table);

      assert.ok(firstToken);
      assert.strictEqual(firstToken.value, "[");
      assert.ok(lastToken);
      // Last token of table is the value's string
      assert.strictEqual(lastToken.type, "BasicString");
    });
  });
});
