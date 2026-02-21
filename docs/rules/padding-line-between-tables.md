---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/padding-line-between-tables"
description: "require or disallow padding lines between tables"
since: "v0.1.0"
---

# toml/padding-line-between-tables

> require or disallow padding lines between tables

- :gear: This rule is included in `"config.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows blank lines between the tables.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/padding-line-between-tables: 'error'

# ✓ GOOD
[good.a]
key = 'value'

[good.b]
key = 'value'

[good.c]
key = 'value'

# ✗ BAD
[bad.a]
key = 'value'
[bad.b]
key = 'value'
[[bad.c]]
key = 'value'
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related rules

- [toml/padding-line-between-pairs]
- [padding-line-between-statements]

[toml/padding-line-between-pairs]: ./padding-line-between-pairs.md
[padding-line-between-statements]: https://eslint.org/docs/rules/padding-line-between-statements

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/padding-line-between-tables.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/padding-line-between-tables.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/padding-line-between-tables)
