import assert from "assert";
import plugin, { TOMLLanguage, TOMLSourceCode } from "../../src/index.ts";

describe("Language plugin", () => {
  it("should export languages object", () => {
    assert(plugin.languages);
    assert(plugin.languages.toml);
  });

  it("should export TOMLLanguage class", () => {
    assert(TOMLLanguage);
    assert(typeof TOMLLanguage === "function");
  });

  it("should export TOMLSourceCode class", () => {
    assert(TOMLSourceCode);
    assert(typeof TOMLSourceCode === "function");
  });

  it("TOMLLanguage should have required properties", () => {
    const lang = plugin.languages.toml;
    assert.strictEqual(lang.fileType, "text");
    assert.strictEqual(lang.lineStart, 1);
    assert.strictEqual(lang.columnStart, 0);
    assert.strictEqual(lang.nodeTypeKey, "type");
    assert(lang.visitorKeys);
    assert(typeof lang.parse === "function");
    assert(typeof lang.createSourceCode === "function");
  });

  it("TOMLLanguage should parse TOML correctly", () => {
    const lang = plugin.languages.toml;
    const code = "foo = 42";
    const file = {
      path: "test.toml",
      body: code,
      bom: false,
    };

    const result = lang.parse(file, {});
    assert(result.ok);
    assert(result.ast);
    assert.strictEqual(result.ast.type, "Program");
  });

  it("TOMLSourceCode should have parserServices.isTOML", () => {
    const lang = plugin.languages.toml;
    const code = "foo = 42";
    const file = {
      path: "test.toml",
      body: code,
      bom: false,
    };

    const parseResult = lang.parse(file, {});
    const sourceCode = lang.createSourceCode(file, parseResult);
    assert(sourceCode.parserServices);
    assert.strictEqual(sourceCode.parserServices.isTOML, true);
  });

  it("TOMLSourceCode should provide getAllComments method", () => {
    const lang = plugin.languages.toml;
    const code = "# comment\nfoo = 42";
    const file = {
      path: "test.toml",
      body: code,
      bom: false,
    };

    const parseResult = lang.parse(file, {});
    const sourceCode = lang.createSourceCode(file, parseResult);
    assert(typeof sourceCode.getAllComments === "function");
    const comments = sourceCode.getAllComments();
    assert(Array.isArray(comments));
    assert.strictEqual(comments.length, 1);
    assert.strictEqual(comments[0].value, " comment");
  });
});
