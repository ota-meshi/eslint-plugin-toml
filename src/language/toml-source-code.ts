/**
 * @fileoverview The TOMLSourceCode class.
 */

import { traverseNodes, type AST } from "toml-eslint-parser";
import type {
  TraversalStep,
  IDirective as Directive,
} from "@eslint/plugin-kit";
import {
  TextSourceCodeBase,
  CallMethodStep,
  VisitNodeStep,
  ConfigCommentParser,
  Directive as DirectiveImpl,
} from "@eslint/plugin-kit";
import type { DirectiveType, FileProblem, RulesConfig } from "@eslint/core";
import {
  TokenStore,
  type CursorWithSkipOptionsWithoutFilter,
  type CursorWithSkipOptionsWithFilter,
  type CursorWithSkipOptionsWithComment,
  type CursorWithCountOptionsWithoutFilter,
  type CursorWithCountOptionsWithFilter,
  type CursorWithCountOptionsWithComment,
} from "@ota-meshi/ast-token-store";
import type { Scope } from "eslint";

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const commentParser = new ConfigCommentParser();

/**
 * Pattern to match ESLint inline configuration comments in TOML.
 * Matches: eslint, eslint-disable, eslint-enable, eslint-disable-line, eslint-disable-next-line
 */
const INLINE_CONFIG =
  /^\s*eslint(?:-enable|-disable(?:(?:-next)?-line)?)?(?:\s|$)/u;

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

  private readonly tokenStore: TokenStore<AST.TOMLNode, AST.Token, AST.Comment>;

  #steps: TraversalStep[] | null = null;

  #cacheTokensAndComments: (AST.Token | AST.Comment)[] | null = null;

  #inlineConfigComments: AST.Comment[] | null = null;

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
    this.tokenStore = new TokenStore<AST.TOMLNode, AST.Token, AST.Comment>({
      tokens: [...config.ast.tokens, ...config.ast.comments],
      isComment: (token): token is AST.Comment => token.type === "Block",
    });
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
    return this.tokenStore.getAllComments();
  }

  /**
   * Returns an array of all inline configuration nodes found in the source code.
   * This includes eslint-disable, eslint-enable, eslint-disable-line,
   * eslint-disable-next-line, and eslint (for inline config) comments.
   */
  public getInlineConfigNodes(): AST.Comment[] {
    if (!this.#inlineConfigComments) {
      this.#inlineConfigComments = this.ast.comments.filter((comment) =>
        INLINE_CONFIG.test(comment.value),
      );
    }

    return this.#inlineConfigComments;
  }

  /**
   * Returns directives that enable or disable rules along with any problems
   * encountered while parsing the directives.
   */
  public getDisableDirectives(): {
    directives: Directive[];
    problems: FileProblem[];
  } {
    const problems: FileProblem[] = [];
    const directives: Directive[] = [];

    this.getInlineConfigNodes().forEach((comment) => {
      const directive = commentParser.parseDirective(comment.value);

      if (!directive) {
        return;
      }

      const { label, value, justification } = directive;

      // `eslint-disable-line` directives are not allowed to span multiple lines
      // as it would be confusing to which lines they apply
      if (
        label === "eslint-disable-line" &&
        comment.loc.start.line !== comment.loc.end.line
      ) {
        const message = `${label} comment should not span multiple lines.`;

        problems.push({
          ruleId: null,
          message,
          loc: comment.loc,
        });
        return;
      }

      switch (label) {
        case "eslint-disable":
        case "eslint-enable":
        case "eslint-disable-next-line":
        case "eslint-disable-line": {
          const directiveType = label.slice("eslint-".length);

          directives.push(
            new DirectiveImpl({
              type: directiveType as DirectiveType,
              node: comment,
              value,
              justification,
            }),
          );
          break;
        }
        // no default
      }
    });

    return { problems, directives };
  }

  /**
   * Returns inline rule configurations along with any problems
   * encountered while parsing the configurations.
   */
  public applyInlineConfig(): {
    configs: { config: { rules: RulesConfig }; loc: AST.SourceLocation }[];
    problems: FileProblem[];
  } {
    const problems: FileProblem[] = [];
    const configs: {
      config: { rules: RulesConfig };
      loc: AST.SourceLocation;
    }[] = [];

    this.getInlineConfigNodes().forEach((comment) => {
      const directive = commentParser.parseDirective(comment.value);

      if (!directive) {
        return;
      }

      const { label, value } = directive;

      if (label === "eslint") {
        const parseResult = commentParser.parseJSONLikeConfig(value);

        if (parseResult.ok) {
          configs.push({
            config: {
              rules: parseResult.config,
            },
            loc: comment.loc,
          });
        } else {
          problems.push({
            ruleId: null,
            message: parseResult.error.message,
            loc: comment.loc,
          });
        }
      }
    });

    return { configs, problems };
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

  /**
   * Gets the first token of the given node.
   */
  public getFirstToken(node: TOMLSyntaxElement): AST.Token;

  /**
   * Gets the first token of the given node with options.
   */
  public getFirstToken(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the first token of the given node with filter options.
   */
  public getFirstToken<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the first token of the given node with comment options.
   */
  public getFirstToken<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getFirstToken(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): AST.Token | AST.Comment | null {
    return this.tokenStore.getFirstToken(node, options as never);
  }

  /**
   * Gets the first tokens of the given node.
   */
  public getFirstTokens(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets the first tokens of the given node with filter options.
   */
  public getFirstTokens<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets the first tokens of the given node with comment options.
   */
  public getFirstTokens<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getFirstTokens(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getFirstTokens(node, options as never);
  }

  /**
   * Gets the last token of the given node.
   */
  public getLastToken(node: TOMLSyntaxElement): AST.Token;

  /**
   * Gets the last token of the given node with options.
   */
  public getLastToken(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the last token of the given node with filter options.
   */
  public getLastToken<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the last token of the given node with comment options.
   */
  public getLastToken<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getLastToken(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment) | null {
    return this.tokenStore.getLastToken(node, options as never);
  }

  /**
   * Get the last tokens of the given node.
   */
  public getLastTokens(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Get the last tokens of the given node with filter options.
   */
  public getLastTokens<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Get the last tokens of the given node with comment options.
   */
  public getLastTokens<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getLastTokens(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getLastTokens(node, options as never);
  }

  /**
   * Gets the token that precedes a given node or token.
   */
  public getTokenBefore(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the token that precedes a given node or token with filter options.
   */
  public getTokenBefore<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the token that precedes a given node or token with comment options.
   */
  public getTokenBefore<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getTokenBefore(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): AST.Token | AST.Comment | null {
    return this.tokenStore.getTokenBefore(node, options as never);
  }

  /**
   * Gets the `count` tokens that precedes a given node or token.
   */
  public getTokensBefore(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets the `count` tokens that precedes a given node or token with filter options.
   */
  public getTokensBefore<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets the `count` tokens that precedes a given node or token with comment options.
   */
  public getTokensBefore<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getTokensBefore(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getTokensBefore(node, options as never);
  }

  /**
   * Gets the token that follows a given node or token.
   */
  public getTokenAfter(
    node: TOMLSyntaxElement,
    options?: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the token that follows a given node or token with filter options.
   */
  public getTokenAfter<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the token that follows a given node or token with comment options.
   */
  public getTokenAfter<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getTokenAfter(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): AST.Token | AST.Comment | null {
    return this.tokenStore.getTokenAfter(node, options as never);
  }

  /**
   * Gets the `count` tokens that follows a given node or token.
   */
  public getTokensAfter(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets the `count` tokens that follows a given node or token with filter options.
   */
  public getTokensAfter<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets the `count` tokens that follows a given node or token with comment options.
   */
  public getTokensAfter<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getTokensAfter(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getTokensAfter(node, options as never);
  }

  /**
   * Gets the first token between two non-overlapping nodes.
   */
  public getFirstTokenBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the first token between two non-overlapping nodes with filter options.
   */
  public getFirstTokenBetween<R extends AST.Token>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the first token between two non-overlapping nodes with comment options.
   */
  public getFirstTokenBetween<R extends AST.Token | AST.Comment>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getFirstTokenBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): AST.Token | AST.Comment | null {
    return this.tokenStore.getFirstTokenBetween(left, right, options as never);
  }

  /**
   * Gets the first tokens between two non-overlapping nodes.
   */
  public getFirstTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets the first tokens between two non-overlapping nodes with filter options.
   */
  public getFirstTokensBetween<R extends AST.Token>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets the first tokens between two non-overlapping nodes with comment options.
   */
  public getFirstTokensBetween<R extends AST.Token | AST.Comment>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getFirstTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getFirstTokensBetween(left, right, options as never);
  }

  /**
   * Gets the last token between two non-overlapping nodes.
   */
  public getLastTokenBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithSkipOptionsWithoutFilter,
  ): AST.Token | null;

  /**
   * Gets the last token between two non-overlapping nodes with filter options.
   */
  public getLastTokenBetween<R extends AST.Token>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithFilter<AST.Token, R>,
  ): R | null;

  /**
   * Gets the last token between two non-overlapping nodes with comment options.
   */
  public getLastTokenBetween<R extends AST.Token | AST.Comment>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithSkipOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R | null;

  public getLastTokenBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?:
      | CursorWithSkipOptionsWithoutFilter
      | CursorWithSkipOptionsWithFilter<AST.Token>
      | CursorWithSkipOptionsWithComment<AST.Token, AST.Comment>,
  ): AST.Token | AST.Comment | null {
    return this.tokenStore.getLastTokenBetween(left, right, options as never);
  }

  /**
   * Gets the last tokens between two non-overlapping nodes.
   */
  public getLastTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets the last tokens between two non-overlapping nodes with filter options.
   */
  public getLastTokensBetween<R extends AST.Token>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets the last tokens between two non-overlapping nodes with comment options.
   */
  public getLastTokensBetween<R extends AST.Token | AST.Comment>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getLastTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getLastTokensBetween(left, right, options as never);
  }

  /**
   * Gets all tokens that are related to the given node.
   */
  public getTokens(
    node: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets all tokens that are related to the given node with filter options.
   */
  public getTokens<R extends AST.Token>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets all tokens that are related to the given node with comment options.
   */
  public getTokens<R extends AST.Token | AST.Comment>(
    node: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getTokens(
    node: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getTokens(node, options as never);
  }

  /**
   * Gets all of the tokens between two non-overlapping nodes.
   */
  public getTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?: CursorWithCountOptionsWithoutFilter,
  ): AST.Token[];

  /**
   * Gets all of the tokens between two non-overlapping nodes with filter options.
   */
  public getTokensBetween<R extends AST.Token>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithFilter<AST.Token, R>,
  ): R[];

  /**
   * Gets all of the tokens between two non-overlapping nodes with comment options.
   */
  public getTokensBetween<R extends AST.Token | AST.Comment>(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options: CursorWithCountOptionsWithComment<AST.Token, AST.Comment, R>,
  ): R[];

  public getTokensBetween(
    left: TOMLSyntaxElement,
    right: TOMLSyntaxElement,
    options?:
      | CursorWithCountOptionsWithoutFilter
      | CursorWithCountOptionsWithFilter<AST.Token>
      | CursorWithCountOptionsWithComment<AST.Token, AST.Comment>,
  ): (AST.Token | AST.Comment)[] {
    return this.tokenStore.getTokensBetween(left, right, options as never);
  }

  public getCommentsInside(nodeOrToken: TOMLSyntaxElement): AST.Comment[] {
    return this.tokenStore.getCommentsInside(nodeOrToken);
  }

  public getCommentsBefore(nodeOrToken: TOMLSyntaxElement): AST.Comment[] {
    return this.tokenStore.getCommentsBefore(nodeOrToken);
  }

  public getCommentsAfter(nodeOrToken: TOMLSyntaxElement): AST.Comment[] {
    return this.tokenStore.getCommentsAfter(nodeOrToken);
  }

  public isSpaceBetween(
    first: AST.Token | AST.Comment,
    second: AST.Token | AST.Comment,
  ): boolean {
    // Normalize order: ensure left comes before right
    const [left, right] =
      first.range[1] <= second.range[0] ? [first, second] : [second, first];
    return this.tokenStore.isSpaceBetween(left, right);
  }

  /**
   * Compatibility for ESLint's SourceCode API
   * @deprecated TOML does not have scopes
   */
  public getScope(node?: AST.TOMLNode): Scope.Scope | null {
    if (node?.type !== "Program") {
      return null;
    }
    return createFakeGlobalScope(this.ast);
  }

  /**
   * Compatibility for ESLint's SourceCode API
   * @deprecated TOML does not have scopes
   */
  public get scopeManager(): Scope.ScopeManager | null {
    return {
      scopes: [],
      globalScope: createFakeGlobalScope(this.ast),
      acquire: (node) => {
        if (node.type === "Program") {
          return createFakeGlobalScope(this.ast);
        }
        return null;
      },
      getDeclaredVariables: () => [],
      addGlobals: () => {
        // noop
      },
    };
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
 * Creates a fake global scope for TOML files.
 * @deprecated TOML does not have scopes
 */
function createFakeGlobalScope(node: AST.TOMLProgram): Scope.Scope {
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
