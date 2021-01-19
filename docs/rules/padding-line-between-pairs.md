---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/padding-line-between-pairs"
description: "require or disallow padding lines between pairs"
---
# toml/padding-line-between-pairs

> require or disallow padding lines between pairs

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows blank lines between the pairs.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/padding-line-between-pairs: 'error'

# ✓ GOOD
[good]
a.a.a = "value"
a.a.b = "value"
a.a.c = "value"

a.b.a = "value"
a.b.b = "value"
a.b.c = "value"

a.c.a = "value"
a.c.b = "value"

a.d.a = "value"

# ✗ BAD
[bad]
a.a.a = "value"

a.a.b = "value"
a.a.c = "value"
a.b.a = "value"
a.b.b = "value"

a.b.c = "value"
a.c.a = "value"
a.c.b = "value"
a.d.a = "value"
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related rules

- [toml/padding-line-between-tables]
- [padding-line-between-statements]

[toml/padding-line-between-tables]: ./padding-line-between-tables.md
[padding-line-between-statements]: https://eslint.org/docs/rules/padding-line-between-statements

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/padding-line-between-pairs.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/padding-line-between-pairs.js)
