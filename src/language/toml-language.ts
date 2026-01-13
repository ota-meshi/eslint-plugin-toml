/**
 * @fileoverview The TOML language implementation for ESLint.
 */
import type { Language, File, OkParseResult } from "@eslint/core";
import { parseForESLint } from "toml-eslint-parser";
import { VisitorKeys } from "toml-eslint-parser";
import type { AST } from "toml-eslint-parser";
import { TOMLSourceCode } from "./toml-source-code.ts";
import type { TOMLVersionOption } from "toml-eslint-parser/lib/parser-options";

/**
 * Parse result
 */
interface TOMLParseResult {
  ok: true;
  ast: AST.TOMLProgram;
}

/**
 * Language options for TOML
 * Currently no options are defined.
 */
export type TOMLLanguageOptions = {
  parserOptions?: {
    tomlVersion?: TOMLVersionOption;
  };
};

/**
 * The TOML language implementation for ESLint.
 */
export class TOMLLanguage implements Language<{
  LangOptions: TOMLLanguageOptions;
  Code: TOMLSourceCode;
  RootNode: AST.TOMLProgram;
  Node: AST.TOMLNode;
}> {
  /**
   * The type of file to read.
   */
  public fileType = "text" as const;

  /**
   * The line number at which the parser starts counting.
   */
  public lineStart = 1 as const;

  /**
   * The column number at which the parser starts counting.
   */
  public columnStart = 0 as const;

  /**
   * The name of the key that holds the type of the node.
   */
  public nodeTypeKey = "type" as const;

  /**
   * Validates the language options.
   */
  public validateLanguageOptions(_languageOptions: TOMLLanguageOptions): void {
    // Currently no validation needed
  }

  public normalizeLanguageOptions(
    languageOptions: TOMLLanguageOptions,
  ): TOMLLanguageOptions {
    return {
      ...languageOptions,
      parserOptions: {
        ...languageOptions.parserOptions,
      },
    };
  }

  /**
   * Parses the given file into an AST.
   */
  public parse(
    file: File,
    context: { languageOptions?: TOMLLanguageOptions },
  ): OkParseResult<AST.TOMLProgram> | TOMLParseResult {
    // Note: BOM already removed
    const text = file.body as string;

    const result = parseForESLint(text, {
      filePath: file.path,
      tomlVersion: context.languageOptions?.parserOptions?.tomlVersion,
    });

    return {
      ok: true,
      ast: result.ast,
    };
  }

  /**
   * Creates a new SourceCode object for the given file and parse result.
   */
  public createSourceCode(
    file: File,
    parseResult: OkParseResult<AST.TOMLProgram> | TOMLParseResult,
  ): TOMLSourceCode {
    return new TOMLSourceCode({
      text: file.body as string,
      ast: parseResult.ast,
      hasBOM: file.bom,
      parserServices: { isTOML: true },
      visitorKeys: VisitorKeys,
    }) as unknown as TOMLSourceCode;
  }
}
