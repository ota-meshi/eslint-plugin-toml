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
  base,
  recommended,
  standard,
  "flat/base": flatBase,
  "flat/recommended": flatRecommended,
  "flat/standard": flatStandard,
};

const rules = ruleList.reduce(
  (obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
  },
  {} as { [key: string]: RuleModule },
);

export { meta, configs, rules };
export default { meta, configs, rules };
