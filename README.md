# Introduction

[eslint-plugin-toml](https://www.npmjs.com/package/eslint-plugin-toml) is ESLint plugin provides linting rules for [TOML].

[![NPM license](https://img.shields.io/npm/l/eslint-plugin-toml.svg)](https://www.npmjs.com/package/eslint-plugin-toml)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-toml.svg)](https://www.npmjs.com/package/eslint-plugin-toml)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/eslint-plugin-toml&maxAge=3600)](http://www.npmtrends.com/eslint-plugin-toml)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-toml.svg)](http://www.npmtrends.com/eslint-plugin-toml)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-toml.svg)](http://www.npmtrends.com/eslint-plugin-toml)
[![NPM downloads](https://img.shields.io/npm/dy/eslint-plugin-toml.svg)](http://www.npmtrends.com/eslint-plugin-toml)
[![NPM downloads](https://img.shields.io/npm/dt/eslint-plugin-toml.svg)](http://www.npmtrends.com/eslint-plugin-toml)
[![Build Status](https://github.com/ota-meshi/eslint-plugin-toml/workflows/CI/badge.svg?branch=main)](https://github.com/ota-meshi/eslint-plugin-toml/actions?query=workflow%3ACI)

## Features

This ESLint plugin provides linting rules for [TOML].

- You can use ESLint to lint [TOML].
- You can find out the problem with your [TOML] files.
- You can apply consistent code styles to your [TOML] files.
- Supports [Vue SFC](https://vue-loader.vuejs.org/spec.html) custom blocks such as `<custom-block lang="toml">`.  
  Requirements `vue-eslint-parser` v7.3.0 and above.
- Supports ESLint directives. e.g. `# eslint-disable-next-line`
- You can check your code in real-time using the ESLint editor integrations.

You can check on the [Online DEMO](https://ota-meshi.github.io/eslint-plugin-toml/playground/).

<!--DOCS_IGNORE_START-->

## Documentation

See [documents](https://ota-meshi.github.io/eslint-plugin-toml/).

## Installation

```bash
npm install --save-dev eslint eslint-plugin-toml
```

> **Requirements**
> 
> - ESLint v6.0.0 and above
> - Node.js v8.10.0 and above

<!--DOCS_IGNORE_END-->

## Usage

<!--USAGE_SECTION_START-->
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

See [the rule list](https://ota-meshi.github.io/eslint-plugin-toml/rules/) to get the `rules` that this plugin provides.

### Running ESLint from the command line

If you want to run `eslint` from the command line, make sure you include the `.toml` extension using [the `--ext` option](https://eslint.org/docs/user-guide/configuring#specifying-file-extensions-to-lint) or a glob pattern, because ESLint targets only `.js` files by default.

Examples:

```bash
eslint --ext .js,.toml src
eslint "src/**/*.{js,toml}"
```

## Editor Integrations

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
<!--USAGE_SECTION_END-->

## Rules

<!--RULES_SECTION_START-->

The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) automatically fixes problems reported by rules which have a wrench :wrench: below.  
The rules with the following star :star: are included in the config.

<!--RULES_TABLE_START-->

### TOML Rules

| Rule ID | Description | Fixable | RECOMMENDED | STANDARD |
|:--------|:------------|:-------:|:-----------:|:--------:|
| [toml/no-space-dots](https://ota-meshi.github.io/eslint-plugin-toml/rules/no-space-dots.html) | disallow spacing around infix operators | :wrench: |  | :star: |
| [toml/quoted-keys](https://ota-meshi.github.io/eslint-plugin-toml/rules/quoted-keys.html) | require or disallow quotes around keys | :wrench: |  | :star: |
| [toml/vue-custom-block/no-parsing-error](https://ota-meshi.github.io/eslint-plugin-toml/rules/vue-custom-block/no-parsing-error.html) | disallow parsing errors in Vue custom blocks |  | :star: | :star: |

### Extension Rules

| Rule ID | Description | Fixable | RECOMMENDED | STANDARD |
|:--------|:------------|:-------:|:-----------:|:--------:|
| [toml/spaced-comment](https://ota-meshi.github.io/eslint-plugin-toml/rules/spaced-comment.html) | enforce consistent spacing after the `#` in a comment | :wrench: |  | :star: |

<!--RULES_TABLE_END-->
<!--RULES_SECTION_END-->

<!--DOCS_IGNORE_START-->

## Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

### Working With Rules

This plugin uses [toml-eslint-parser](https://github.com/ota-meshi/toml-eslint-parser) for the parser. Check [here](https://ota-meshi.github.io/toml-eslint-parser/) to find out about AST.

<!--DOCS_IGNORE_END-->

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).

[TOML]: https://toml.io/
