/**
 * @fileoverview The TOMLSourceCode class.
 */

import { traverseNodes, type AST } from "toml-eslint-parser";
import type { TraversalStep } from "@eslint/plugin-kit";
import {
  TextSourceCodeBase,
  CallMethodStep,
  VisitNodeStep,
} from "@eslint/plugin-kit";
import type {
  CursorWithCountOptions,
  CursorWithSkipOptions,
  FilterPredicate,
} from "./token-store.ts";
import { TokenStore } from "./token-store.ts";
import type { Scope } from "eslint";

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
/**
 * TOML-specific syntax element type
 */
export type TOMLSyntaxElement = AST.TOMLNode | AST.Token | AST.Comment;
export type TOMLToken = AST.Token | AST.Comment;

/**
 * TOML Source Code Object
 */
export class TOMLSourceCode extends TextSourceCodeBase<{
  LangOptions: Record<never, never>;
  RootNode: AST.TOMLProgram;
  SyntaxElementWithLoc: TOMLSyntaxElement;
  ConfigNode: AST.Comment;
}> {
  public readonly hasBOM: boolean;

  public readonly parserServices: { isTOML?: boolean; parseError?: unknown };

  public readonly visitorKeys: Record<string, string[]>;

  private readonly tokenStore: TokenStore;

  #steps: TraversalStep[] | null = null;

  #cacheTokensAndComments: (AST.Token | AST.Comment)[] | null = null;

  /**
   * Creates a new instance.
   */
  public constructor(config: {
    text: string;
    ast: AST.TOMLProgram;
    hasBOM: boolean;
    parserServices: { isTOML: boolean; parseError?: unknown };
    visitorKeys?: Record<string, string[]> | null | undefined;
  }) {
    super({
      ast: config.ast,
      text: config.text,
    });
    this.hasBOM = Boolean(config.hasBOM);
    this.parserServices = config.parserServices;
    this.visitorKeys = config.visitorKeys || {};
    this.tokenStore = new TokenStore({ ast: this.ast });
  }

  public traverse(): Iterable<TraversalStep> {
    if (this.#steps != null) {
      return this.#steps;
    }

    const steps: (VisitNodeStep | CallMethodStep)[] = [];
    this.#steps = steps;

    const root = this.ast;
    steps.push(
      // ESLint core rule compatibility: onCodePathStart is called with two arguments.
      new CallMethodStep({
        target: "onCodePathStart",
        args: [{}, root],
      }),
    );

    traverseNodes(root, {
      enterNode(n) {
        steps.push(
          new VisitNodeStep({
            target: n,
            phase: 1,
            args: [n],
          }),
        );
      },
      leaveNode(n) {
        steps.push(
          new VisitNodeStep({
            target: n,
            phase: 2,
            args: [n],
          }),
        );
      },
    });

    steps.push(
      // ESLint core rule compatibility: onCodePathEnd is called with two arguments.
      new CallMethodStep({
        target: "onCodePathEnd",
        args: [{}, root],
      }),
    );
    return steps;
  }

  /**
   * Gets all tokens and comments.
   */
  public get tokensAndComments(): TOMLToken[] {
    return (this.#cacheTokensAndComments ??= [
      ...this.ast.tokens,
      ...this.ast.comments,
    ].sort((a, b) => a.range[0] - b.range[0]));
  }

  public getLines(): string[] {
    return this.lines;
  }

  public getAllComments(): AST.Comment[] {
    return this.ast.comments;
  }

  public getNodeByRangeIndex(index: number): AST.TOMLNode | null {
    let node = find([this.ast]);
    if (!node) return null;
    while (true) {
      const child = find(this._getChildren(node));
      if (!child) return node;
      node = child;
    }

    /**
     * Finds a node that contains the given index.
     */
    function find(nodes: AST.TOMLNode[]) {
      for (const node of nodes) {
        if (node.range[0] <= index && index < node.range[1]) {
          return node;
        }
      }
      return null;
    }
  }

  public getFirstToken(node: TOMLSyntaxElement): AST.Token;

  public getFirstToken(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null;

  public getFirstToken(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null {
    return this.tokenStore.getFirstToken(node, options);
  }

  public getLastToken(node: TOMLSyntaxElement): AST.Token;

  public getLastToken(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null;

  public getLastToken(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null {
    return this.tokenStore.getLastToken(node, options);
  }

  public getTokenBefore(node: TOMLSyntaxElement): AST.Token | null;

  public getTokenBefore(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null;

  public getTokenBefore(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null {
    return this.tokenStore.getTokenBefore(node, options);
  }

  public getTokensBefore(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptions,
  ): TOMLToken[] {
    return this.tokenStore.getTokensBefore(node, options);
  }

  public getTokenAfter(node: TOMLSyntaxElement): AST.Token | null;

  public getTokenAfter(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null;

  public getTokenAfter(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null {
    return this.tokenStore.getTokenAfter(node, options);
  }

  // getTokensAfter(
  //   node: TOMLSyntaxElement,
  //   options?: CursorWithCountOptions,
  // ): TOMLToken[];

  public getFirstTokenBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithSkipOptions,
  ): TOMLToken | null {
    return this.tokenStore.getFirstTokenBetween(left, right, options);
  }

  public getTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    paddingOrOptions?: number | FilterPredicate | CursorWithCountOptions,
  ): TOMLToken[] {
    return this.tokenStore.getTokensBetween(left, right, paddingOrOptions);
  }

  public getTokens(
    node: AST.TOMLNode,
    options?: FilterPredicate | CursorWithCountOptions,
  ): TOMLToken[] {
    return this.tokenStore.getTokens(node, options);
  }

  public getCommentsBefore(nodeOrToken: TOMLSyntaxElement): AST.Comment[] {
    return this.tokenStore.getCommentsBefore(nodeOrToken);
  }

  public getCommentsAfter(nodeOrToken: TOMLSyntaxElement): AST.Comment[] {
    return this.tokenStore.getCommentsAfter(nodeOrToken);
  }

  public isSpaceBetween(first: TOMLToken, second: TOMLToken): boolean {
    if (nodesOrTokensOverlap(first, second)) {
      return false;
    }

    const [startingNodeOrToken, endingNodeOrToken] =
      first.range[1] <= second.range[0] ? [first, second] : [second, first];
    const firstToken =
      this.getLastToken(startingNodeOrToken) || startingNodeOrToken;
    const finalToken =
      this.getFirstToken(endingNodeOrToken) || endingNodeOrToken;
    let currentToken: TOMLToken = firstToken;

    while (currentToken !== finalToken) {
      const nextToken: TOMLToken = this.getTokenAfter(currentToken, {
        includeComments: true,
      })!;

      if (currentToken.range[1] !== nextToken.range[0]) {
        return true;
      }

      currentToken = nextToken;
    }

    return false;
  }

  /**
   * Compatibility for ESLint's SourceCode API
   * @deprecated TOML does not have scopes
   */
  public getScope(node?: AST.TOMLNode): Scope.Scope | null {
    if (node?.type !== "Program") {
      return null;
    }
    const fakeGlobalScope: Scope.Scope = {
      type: "global",
      block: node as never,
      set: new Map(),
      through: [],
      childScopes: [],
      variableScope: null as never,
      variables: [],
      references: [],
      functionExpressionScope: false,
      isStrict: false,
      upper: null,
      implicit: {
        variables: [],
        set: new Map(),
      },
    };
    fakeGlobalScope.variableScope = fakeGlobalScope;
    return fakeGlobalScope;
  }

  /**
   * Compatibility for ESLint's SourceCode API
   * @deprecated
   */
  public isSpaceBetweenTokens(first: TOMLToken, second: TOMLToken): boolean {
    return this.isSpaceBetween(first, second);
  }

  private _getChildren(node: AST.TOMLNode) {
    const keys = this.visitorKeys[node.type] || [];
    const children: AST.TOMLNode[] = [];
    for (const key of keys) {
      const value = (node as unknown as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        for (const element of value) {
          if (isNode(element)) {
            children.push(element);
          }
        }
      } else if (isNode(value)) {
        children.push(value);
      }
    }
    return children;
  }
}

/**
 * Determines whether the given value is a TOML AST node.
 */
function isNode(value: unknown): value is AST.TOMLNode {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).type === "string" &&
    Array.isArray((value as Record<string, unknown>).range) &&
    Boolean((value as Record<string, unknown>).loc) &&
    typeof (value as Record<string, unknown>).loc === "object"
  );
}

/**
 * Determines whether two nodes or tokens overlap.
 */
function nodesOrTokensOverlap(first: TOMLToken, second: TOMLToken): boolean {
  return first.range[0] < second.range[1] && second.range[0] < first.range[1];
}
