import path from "path";
import fs from "fs";
import os from "os";
// import eslint from "eslint"
import { rules } from "./lib/load-rules.ts";
const isWin = os.platform().startsWith("win");

const RULESET_NAME = {
  recommended: "../src/configs/recommended.ts",
  standard: "../src/configs/standard.ts",
};
const FLAT_RULESET_NAME = {
  recommended: "../src/configs/flat/recommended.ts",
  standard: "../src/configs/flat/standard.ts",
};

for (const rec of ["recommended", "standard"] as const) {
  let content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
export default {
    extends: ["plugin:toml/base"],
    rules: {
        // eslint-plugin-toml rules
        ${rules
          .filter(
            (rule) =>
              rule.meta.docs.categories &&
              !rule.meta.deprecated &&
              rule.meta.docs.categories.includes(rec),
          )
          .map((rule) => {
            const conf = rule.meta.docs.default || "error";
            return `"${rule.meta.docs.ruleId}": "${conf}"`;
          })
          .join(",\n")}
    },
}
`;

  const dirname = import.meta.dirname;
  const filePath = path.resolve(dirname, RULESET_NAME[rec]);

  if (isWin) {
    content = content
      .replace(/\r?\n/gu, "\n")
      .replace(/\r/gu, "\n")
      .replace(/\n/gu, "\r\n");
  }

  // Update file.
  fs.writeFileSync(filePath, content);
}

for (const rec of ["recommended", "standard"] as const) {
  let content = `/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import type { Linter } from "eslint";
import base from './base.ts';
export default [
  ...base,
  {
    rules: {
      // eslint-plugin-toml rules
      ${rules
        .filter(
          (rule) =>
            rule.meta.docs.categories &&
            !rule.meta.deprecated &&
            rule.meta.docs.categories.includes(rec),
        )
        .map((rule) => {
          const conf = rule.meta.docs.default || "error";
          return `"${rule.meta.docs.ruleId}": "${conf}"`;
        })
        .join(",\n")}
    },
  }
] satisfies Linter.Config[]
`;

  const dirname = import.meta.dirname;
  const filePath = path.resolve(dirname, FLAT_RULESET_NAME[rec]);

  if (isWin) {
    content = content
      .replace(/\r?\n/gu, "\n")
      .replace(/\r/gu, "\n")
      .replace(/\n/gu, "\r\n");
  }

  // Update file.
  fs.writeFileSync(filePath, content);
}
