# User Guide

## :cd: Installation

```bash
npm install --save-dev eslint eslint-plugin-toml
```

::: tip Requirements

- ESLint v9.38.0 and above
- Node.js v20.19.x, v22.13.x, v24.x and above
:::

## :book: Usage

<!--USAGE_GUIDE_START-->

### Configuration

Use `eslint.config.js` file to configure rules. See also: <https://eslint.org/docs/latest/use/configure/configuration-files-new>.

Example **eslint.config.js**:

```mjs
import eslintPluginToml from 'eslint-plugin-toml';
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginToml.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
    // 'toml/rule-name': 'error'
    }
  }
];
```

This plugin provides configs:

- `*.configs.base` ... Configuration to enable correct TOML parsing.
- `*.configs.recommended` ... Above, plus rules to prevent errors or unintended behavior.
- `*.configs.standard` ... Above, plus rules to enforce the common stylistic conventions.

For backward compatibility, you can also use the `flat/*` namespace:

- `*.configs['flat/base']`
- `*.configs['flat/recommended']`
- `*.configs['flat/standard']`

See [the rule list](../rules/index.md) to get the `rules` that this plugin provides.

#### Parser Configuration

If you have specified a parser, you need to configure a parser for `.toml`.

For example, if you are using the `"@babel/eslint-parser"`, configure it as follows:

```js
import eslintPluginToml from 'eslint-plugin-toml';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
    },
  },
  ...eslintPluginToml.configs.standard,
];
```

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
