import type { Linter } from "eslint";
import type { RuleDefinition } from "@eslint/core";
import type { RuleModule } from "./types.ts";
import { rules as ruleList } from "./utils/rules.ts";
import base from "./configs/flat/base.ts";
import recommended from "./configs/flat/recommended.ts";
import standard from "./configs/flat/standard.ts";
import * as meta from "./meta.ts";
import type { TOMLSourceCode, TOMLLanguageOptions } from "./language/index.ts";
import { TOMLLanguage } from "./language/index.ts";

const configs = {
  base: base as Linter.Config[],
  recommended: recommended as Linter.Config[],
  standard: standard as Linter.Config[],
  // Backward compatibility aliases
  "flat/base": base as Linter.Config[],
  "flat/recommended": recommended as Linter.Config[],
  "flat/standard": standard as Linter.Config[],
};

const rules = ruleList.reduce(
  (obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
  },
  {} as { [key: string]: RuleModule },
) as Record<string, RuleDefinition>;

const languages = {
  toml: new TOMLLanguage(),
};

export type { TOMLLanguageOptions, TOMLSourceCode };
export { meta, configs, rules, languages };
export default { meta, configs, rules, languages };
