/**
 * @fileoverview The TOMLSourceCode class.
 */

import type { AST } from "toml-eslint-parser";
import {
  TextSourceCodeBase,
  VisitNodeStep,
  ConfigCommentParser,
} from "@eslint/plugin-kit";
import type { FileProblem, DirectiveType } from "@eslint/core";
import { VisitorKeys } from "toml-eslint-parser";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/**
 * TOML-specific syntax element type
 */
export type TOMLSyntaxElement = AST.TOMLNode | AST.Token | AST.Comment;

/**
 * Language options for TOML
 */
export interface TOMLLanguageOptions {
  // Reserved for future options
}

/**
 * Parse result
 */
export interface TOMLParseResult {
  ok: true;
  ast: AST.TOMLProgram;
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const commentParser = new ConfigCommentParser();

const INLINE_CONFIG =
  /^\s*eslint(?:-enable|-disable(?:(?:-next)?-line)?)?(?:\s|$)/u;

/**
 * A class to represent a step in the traversal process.
 */
class TOMLTraversalStep extends VisitNodeStep {
  /**
   * The target of the step.
   */
  target: AST.TOMLNode;

  /**
   * Creates a new instance.
   */
  constructor({
    target,
    phase,
    args,
  }: {
    target: AST.TOMLNode;
    phase: 1 | 2;
    args: Array<unknown>;
  }) {
    super({ target, phase, args });

    this.target = target;
  }
}

/**
 * Processes tokens to extract comments and their starting tokens.
 */
function processTokens(tokens: Array<AST.Token | AST.Comment>): {
  comments: Array<AST.Comment>;
  starts: Map<number, number>;
  ends: Map<number, number>;
} {
  const comments: Array<AST.Comment> = [];
  const starts = new Map<number, number>();
  const ends = new Map<number, number>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "Block") {
      comments.push(token as AST.Comment);
    }

    starts.set(token.range[0], i);
    ends.set(token.range[1], i);
  }

  return { comments, starts, ends };
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * TOML Source Code Object
 */
export class TOMLSourceCode extends TextSourceCodeBase<{
  LanguageOptions: TOMLLanguageOptions;
  RootNode: AST.TOMLProgram;
  SyntaxElementWithLoc: TOMLSyntaxElement;
  ConfigNode: AST.Comment;
}> {
  /**
   * Cached traversal steps.
   */
  #steps: Array<TOMLTraversalStep> | undefined;

  /**
   * The tokens and comments in the source code.
   */
  #tokensAndComments: Array<AST.Token | AST.Comment>;

  /**
   * The comment tokens in the source code.
   */
  #comments: Array<AST.Comment>;

  /**
   * A map of token starting positions to their indices.
   */
  #tokenStartsMap: Map<number, number>;

  /**
   * A map of token ending positions to their indices.
   */
  #tokenEndsMap: Map<number, number>;

  /**
   * Creates a new instance.
   */
  constructor({ text, ast }: { text: string; ast: AST.TOMLProgram }) {
    super({ text, ast });

    // Get all tokens and comments
    this.#tokensAndComments = [...(ast.tokens || []), ...(ast.comments || [])];
    this.#tokensAndComments.sort((a, b) => a.range[0] - b.range[0]);

    const { comments, starts, ends } = processTokens(this.#tokensAndComments);

    this.#comments = comments;
    this.#tokenStartsMap = starts;
    this.#tokenEndsMap = ends;
  }

  /**
   * Returns an array of all tokens in the source code.
   */
  getTokens(): Array<AST.Token | AST.Comment> {
    return this.#tokensAndComments;
  }

  /**
   * Returns an array of all comment tokens in the source code.
   */
  getComments(): Array<AST.Comment> {
    return this.#comments;
  }

  /**
   * Gets all comments for the given node.
   */
  getCommentsForNode(node: AST.TOMLNode): {
    leading: Array<AST.Comment>;
    trailing: Array<AST.Comment>;
  } {
    const leading: Array<AST.Comment> = [];
    const trailing: Array<AST.Comment> = [];

    for (const comment of this.#comments) {
      if (comment.range[1] <= node.range[0]) {
        leading.push(comment);
      } else if (comment.range[0] >= node.range[1]) {
        trailing.push(comment);
      }
    }

    return { leading, trailing };
  }

  /**
   * Gets the token that starts at the given index.
   */
  getTokenByRangeStart(offset: number): AST.Token | AST.Comment | null {
    const index = this.#tokenStartsMap.get(offset);
    return index !== undefined ? this.#tokensAndComments[index] : null;
  }

  /**
   * Traverses the syntax tree.
   */
  traverse(): Iterable<TOMLTraversalStep> {
    // Return cached steps if available
    if (this.#steps) {
      return this.#steps;
    }

    const steps: Array<TOMLTraversalStep> = [];

    /**
     * Recursively traverse the AST
     */
    const traverse = (
      node: AST.TOMLNode,
      parent: AST.TOMLNode | null,
    ): void => {
      // Enter the node
      steps.push(
        new TOMLTraversalStep({
          target: node,
          phase: 1 /* enter */,
          args: [node, parent],
        }),
      );

      // Get the visitor keys for this node type
      const keys = VisitorKeys[node.type] || [];

      // Visit children
      for (const key of keys) {
        const value = (node as Record<string, unknown>)[key];

        if (Array.isArray(value)) {
          for (const child of value) {
            if (child && typeof child === "object" && "type" in child) {
              traverse(child as AST.TOMLNode, node);
            }
          }
        } else if (value && typeof value === "object" && "type" in value) {
          traverse(value as AST.TOMLNode, node);
        }
      }

      // Exit the node
      steps.push(
        new TOMLTraversalStep({
          target: node,
          phase: 2 /* exit */,
          args: [node, parent],
        }),
      );
    };

    // Start traversal from root
    traverse(this.ast, null);

    // Cache the steps
    this.#steps = steps;

    return steps;
  }

  /**
   * Applies language-specific options.
   */
  static applyLanguageOptions(): TOMLLanguageOptions {
    return {};
  }

  /**
   * Parses a directive from a comment.
   */
  static getDirectiveFromComment(comment: AST.Comment): {
    label: string;
    value: string;
    justification: string;
    directiveType: DirectiveType;
  } | null {
    if (!INLINE_CONFIG.test(comment.value)) {
      return null;
    }

    const result = commentParser.parseDirective(comment.value);

    if (!result) {
      return null;
    }

    return {
      label: result.label,
      value: result.value,
      justification: result.justification,
      directiveType: result.directiveType,
    };
  }

  /**
   * Parses inline config from a comment.
   */
  static parseInlineConfig(comment: AST.Comment):
    | {
        config: {
          rules?: Record<string, unknown>;
        };
        ruleConfigList?: Array<{
          key: string;
          value: unknown;
        }>;
      }
    | {
        error: FileProblem;
      }
    | null {
    if (!INLINE_CONFIG.test(comment.value)) {
      return null;
    }

    return commentParser.parseJsonConfig(comment.value, comment.loc);
  }
}
