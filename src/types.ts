/* eslint @typescript-eslint/naming-convention: off, @typescript-eslint/no-explicit-any: off -- for type */
import type { JSONSchema4 } from "json-schema";
import type { AST } from "toml-eslint-parser";
import type * as core from "@eslint/core";
import type { TOMLLanguageOptions } from "./language/toml-language";
import type { TOMLSourceCode } from "./language";

export interface RuleListener {
  TOMLTopLevelTable?: (node: AST.TOMLTopLevelTable) => void;
  "TOMLTopLevelTable:exit"?: (node: AST.TOMLTopLevelTable) => void;
  TOMLTable?: (node: AST.TOMLTable) => void;
  "TOMLTable:exit"?: (node: AST.TOMLTable) => void;
  TOMLKeyValue?: (node: AST.TOMLKeyValue) => void;
  "TOMLKeyValue:exit"?: (node: AST.TOMLKeyValue) => void;
  TOMLKey?: (node: AST.TOMLKey) => void;
  "TOMLKey:exit"?: (node: AST.TOMLKey) => void;
  TOMLBare?: (node: AST.TOMLBare) => void;
  "TOMLBare:exit"?: (node: AST.TOMLBare) => void;
  TOMLQuoted?: (node: AST.TOMLQuoted) => void;
  "TOMLQuoted:exit"?: (node: AST.TOMLQuoted) => void;
  TOMLValue?: (node: AST.TOMLValue) => void;
  "TOMLValue:exit"?: (node: AST.TOMLValue) => void;
  TOMLArray?: (node: AST.TOMLArray) => void;
  "TOMLArray:exit"?: (node: AST.TOMLArray) => void;
  TOMLInlineTable?: (node: AST.TOMLInlineTable) => void;
  "TOMLInlineTable:exit"?: (node: AST.TOMLInlineTable) => void;

  Program?: (node: AST.TOMLProgram) => void;
  "Program:exit"?: (node: AST.TOMLProgram) => void;

  [key: string]: ((...args: any[]) => void) | undefined;
}

export interface RuleModule extends core.RuleDefinition<{
  LangOptions: TOMLLanguageOptions;
  Code: TOMLSourceCode;
  RuleOptions: unknown[];
  Visitor: RuleListener;
  Node: AST.TOMLNode;
  MessageIds: string;
  ExtRuleDocs: RuleMetaDocs;
}> {
  meta: RuleMetaData;
}

export type RuleMetaDocs = {
  description: string;
  categories: ("recommended" | "standard")[] | null;
  url: string;
  ruleId: string;
  ruleName: string;
  default?: "error" | "warn";
  extensionRule: string | false;
};

export interface RuleMetaData extends core.RulesMeta<
  string,
  unknown[],
  RuleMetaDocs
> {
  docs: RuleMetaDocs;
}

export interface PartialRuleModule {
  meta: PartialRuleMetaData;
  create(context: RuleContext, params: { customBlock: boolean }): RuleListener;
}

export interface PartialRuleMetaData {
  docs: {
    description: string;
    categories: ("recommended" | "standard")[] | null;
    default?: "error" | "warn";
    extensionRule: string | false;
  };
  messages: { [messageId: string]: string };
  fixable?: "code" | "whitespace";
  hasSuggestions?: boolean;
  schema: JSONSchema4 | JSONSchema4[];
  deprecated?: boolean;
  replacedBy?: string[];
  type: "problem" | "suggestion" | "layout";
}

export type RuleContext = core.RuleContext<{
  LangOptions: TOMLLanguageOptions;
  Code: TOMLSourceCode;
  RuleOptions: any[];
  Node: TOMLNodeOrToken;
  MessageIds: string;
}>;

export type TOMLToken = AST.Token | AST.Comment;
export type TOMLNodeOrToken = AST.TOMLNode | TOMLToken;

export type RuleFixer = core.RuleTextEditor<TOMLNodeOrToken>;
