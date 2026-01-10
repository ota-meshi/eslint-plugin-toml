import type { Linter } from "eslint";
import type { RuleDefinition } from "@eslint/core";
import type { RuleModule } from "./types.ts";
import { rules as ruleList } from "./utils/rules.ts";
import base from "./configs/base.ts";
import recommended from "./configs/recommended.ts";
import standard from "./configs/standard.ts";
import flatBase from "./configs/flat/base.ts";
import flatRecommended from "./configs/flat/recommended.ts";
import flatStandard from "./configs/flat/standard.ts";
import * as meta from "./meta.ts";

const configs = {
  base: base as Linter.LegacyConfig,
  recommended: recommended as Linter.LegacyConfig,
  standard: standard as Linter.LegacyConfig,
  "flat/base": flatBase as Linter.Config,
  "flat/recommended": flatRecommended as Linter.Config,
  "flat/standard": flatStandard as Linter.Config,
};

const rules = ruleList.reduce(
  (obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
  },
  {} as { [key: string]: RuleModule },
) as Record<string, RuleDefinition>;

export { meta, configs, rules };
export default { meta, configs, rules };
