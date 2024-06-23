import tseslint from "typescript-eslint";
import myPlugin from "@ota-meshi/eslint-plugin";

export default [
  {
    ignores: [
      ".nyc_output",
      "coverage",
      "node_modules",
      "tests/fixtures/integrations",
      "tests/fixtures/**/*.vue",
      "tests/fixtures/**/*.toml",
      "assets",
      "dist",
      "lib",
      "!.github",
      "!.vscode",
      "!.devcontainer",
      "!docs/.vuepress",
      "!docs/.vitepress",
      "docs/.vuepress/dist",
      "docs/.vuepress/components/demo/demo-code.js",
      "docs/.vitepress/cache",
      "docs/.vitepress/build-system/shim",
      "docs/.vitepress/dist",
    ],
  },
  ...myPlugin.config({
    node: true,
    ts: true,
    eslintPlugin: true,
    vue3: true,
    json: true,
    yaml: true,
    md: true,
    prettier: true,
    packageJson: true,
  }),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },
    rules: {
      "@eslint-community/eslint-comments/no-unused-disable": "error",
      "jsdoc/require-jsdoc": "error",
      "no-warning-comments": "warn",
      "no-lonely-if": "off",
      "new-cap": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "off",
      "jsonc/object-curly-spacing": "off",
      "jsonc/array-element-newline": "off",
      "jsonc/object-property-newline": "off",
      "jsonc/object-curly-newline": "off",
      "no-restricted-properties": [
        "error",
        {
          object: "context",
          property: "getSourceCode",
        },
        {
          object: "context",
          property: "getFilename",
        },
        {
          object: "context",
          property: "getCwd",
        },
        {
          object: "context",
          property: "getScope",
        },
        {
          object: "context",
          property: "parserServices",
        },
      ],
    },
  },
  {
    files: ["**/*.{mjs,ts,mts}", "*.md/*.js", "**/*.md/*.js"],
    languageOptions: {
      sourceType: "module",
    },
  },
  {
    files: ["**/*.ts", "**/*.mts"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "method",
          format: null,
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["scripts/**/*.ts", "tests/**/*.ts"],
    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-console": "off",
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
  {
    files: ["*.md/*.js", "**/*.md/*.js"],
    rules: {
      "n/no-missing-import": "off",
    },
  },
  ...tseslint.config({
    files: ["docs/.vitepress/**/*.{js,mjs,ts,mts,vue}"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: {
        window: true,
      },
      sourceType: "module",
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "jsdoc/require-jsdoc": "off",
      "n/file-extension-in-import": "off",
      "eslint-plugin/require-meta-docs-description": "off",
      "eslint-plugin/require-meta-docs-url": "off",
      "eslint-plugin/require-meta-type": "off",
      "eslint-plugin/prefer-message-ids": "off",
      "eslint-plugin/prefer-object-rule": "off",
      "eslint-plugin/require-meta-schema": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  }),
];
