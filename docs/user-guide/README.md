# User Guide

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-toml
```

::: tip Requirements
- ESLint v6.0.0 and above
- Node.js v8.10.0 and above
:::

## :book: Usage

<!--USAGE_GUIDE_START-->

### Configuration

Use `.eslintrc.*` file to configure rules. See also: [https://eslint.org/docs/user-guide/configuring](https://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:toml/standard'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'toml/rule-name': 'error'
  }
}
```

This plugin provides configs:

- `plugin:toml/base` ... Configuration to enable correct TOML parsing.
- `plugin:toml/recommended` ... Above, plus rules to prevent errors or unintended behavior.
- `plugin:toml/standard` ... Above, plus rules to enforce the common stylistic conventions.

Note that these configurations do not enable ESLint's core rules.
For example, the following style rules can also be used in TOML.

```json5
{
    "rules": {
        "comma-spacing": "error",
        "no-multi-spaces": ["error", { "exceptions": { "TOMLKeyValue": true } }],
        "no-multiple-empty-lines": "error",
        "no-trailing-spaces": "error"
    }
}
```

See [the rule list](../rules/README.md) to get the `rules` that this plugin provides.

### Running ESLint from the command line

If you want to run `eslint` from the command line, make sure you include the `.toml` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern, because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.toml src
eslint "src/**/*.{js,toml}"
```

## :computer: Editor Integrations

### Visual Studio Code

Use the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension that Microsoft provides officially.

You have to configure the `eslint.validate` option of the extension to check `.toml` files, because the extension targets only `*.js` or `*.jsx` files by default.

Example **.vscode/settings.json**:

```json
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "toml"
    ]
}
```

<!--USAGE_GUIDE_END-->

## :question: FAQ

- TODO
