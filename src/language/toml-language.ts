/**
 * @fileoverview The TOML language implementation for ESLint.
 */

import type { Language, File, OkParseResult } from "@eslint/core";
import { parseForESLint } from "toml-eslint-parser";
import { VisitorKeys } from "toml-eslint-parser";
import type { AST } from "toml-eslint-parser";
import {
  TOMLSourceCode,
  type TOMLLanguageOptions,
  type TOMLParseResult,
} from "./toml-source-code.ts";

/**
 * The TOML language implementation for ESLint.
 */
export class TOMLLanguage implements Language<{
  LanguageOptions: TOMLLanguageOptions;
  RootNode: AST.TOMLProgram;
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
   * The visitor keys.
   */
  public visitorKeys: Record<string, string[]>;

  /**
   * Creates a new instance.
   */
  public constructor() {
    this.visitorKeys = { ...VisitorKeys };
  }

  /**
   * Validates the language options.
   */
  public validateLanguageOptions(_languageOptions: TOMLLanguageOptions): void {
    // Currently no validation needed
  }

  /**
   * Parses the given file into an AST.
   */
  public parse(
    file: File,
    _context?: { languageOptions?: TOMLLanguageOptions },
  ): OkParseResult<AST.TOMLProgram> | TOMLParseResult {
    // Note: BOM already removed
    const text = file.body as string;

    const result = parseForESLint(text, {
      filePath: file.path,
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
    });
  }
}
