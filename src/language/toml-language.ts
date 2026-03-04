/**
 * @fileoverview The TOML language implementation for ESLint.
 */
import type { Language, File, OkParseResult, ParseResult } from "@eslint/core";
import { parseTOML } from "toml-eslint-parser";
import { VisitorKeys } from "toml-eslint-parser";
import type { AST } from "toml-eslint-parser";
import { TOMLSourceCode } from "./toml-source-code.ts";
import type { TOMLVersionOption } from "toml-eslint-parser";

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
    const fakeProperties: Record<string, unknown> = {
      ecmaVersion: "latest",
    };
    return {
      ...fakeProperties,
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
  ): ParseResult<AST.TOMLProgram> {
    // Note: BOM already removed
    const text = file.body as string;

    try {
      const ast = parseTOML(text, {
        filePath: file.path,
        tomlVersion: context.languageOptions?.parserOptions?.tomlVersion,
      });

      return {
        ok: true,
        ast,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const parseError = error as {
        lineNumber?: number;
        column?: number;
      };
      return {
        ok: false,
        errors: [
          {
            message,
            line: parseError.lineNumber ?? 1,
            column: parseError.column ?? 1,
          },
        ],
      };
    }
  }

  /**
   * Creates a new SourceCode object for the given file and parse result.
   */
  public createSourceCode(
    file: File,
    parseResult: OkParseResult<AST.TOMLProgram>,
  ): TOMLSourceCode {
    return new TOMLSourceCode({
      text: file.body as string,
      ast: parseResult.ast,
      hasBOM: file.bom,
      parserServices: { isTOML: true },
      visitorKeys: VisitorKeys,
    });
  }
}
