import type { RuleModule } from "./types";
import { rules as ruleList } from "./utils/rules";
import base from "./configs/base";
import recommended from "./configs/recommended";
import standard from "./configs/standard";
import flatBase from "./configs/flat/base";
import flatRecommended from "./configs/flat/recommended";
import flatStandard from "./configs/flat/standard";
import * as meta from "./meta";
import { plugin } from "./plugin-proxy.js";

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

// Fill in the proxy to ensure it's the same object everywhere
Object.assign(plugin, {
  meta,
  configs,
  rules,
});

export default plugin;
