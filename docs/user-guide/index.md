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

Use `eslint.config.js` file to configure rules. See also: <https://eslint.org/docs/latest/use/configure/configuration-files>.

Example **eslint.config.js**:

```js
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

#### Languages

This plugin provides the following language identifiers for use in ESLint configurations:

- `toml/toml` ... TOML files

For example, to apply settings specifically to TOML files, you can use the `language` field in your ESLint configuration:

```js
import eslintPluginToml from 'eslint-plugin-toml';
export default [
  {
    files: ["*.toml", "**/*.toml"],
    plugins: {
      toml: eslintPluginToml,
    },
    language: "toml/toml",
  }
]
```

The configuration above is included in the shareable configs provided by this plugin, so using `configs` is generally recommended.

See also <https://eslint.org/docs/latest/use/configure/plugins#specify-a-language>

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
