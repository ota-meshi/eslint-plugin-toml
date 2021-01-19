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

You can check on the [Online DEMO](./playground/).

## Usage

See [User Guide](./user-guide/README.md).

## Rules

See [Available Rules](./rules/README.md).

## :couple: Related Packages

- [eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc) ... ESLint plugin for JSON, JSON with comments (JSONC) and JSON5.
- [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) ... ESLint plugin for YAML.
- [jsonc-eslint-parser](https://github.com/ota-meshi/jsonc-eslint-parser) ... JSON, JSONC and JSON5 parser for use with ESLint plugins.
- [yaml-eslint-parser](https://github.com/ota-meshi/yaml-eslint-parser) ... YAML parser for use with ESLint plugins.
- [toml-eslint-parser](https://github.com/ota-meshi/toml-eslint-parser) ... TOML parser for use with ESLint plugins.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).

[TOML]: https://toml.io/
