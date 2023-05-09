---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/tables-order"
description: "disallow defining tables out-of-order"
since: "v0.1.0"
---

# toml/tables-order

> disallow defining tables out-of-order

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports out-of-order table keys.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/tables-order: 'error'

# ✓ GOOD
[good.fruit.apple]
[good.fruit.orange]
[good.animal]

# ✗ BAD
[bad.fruit.apple]
[bad.animal]
[bad.fruit.orange]
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [TOML v1.0.0 - Table](https://toml.io/en/v1.0.0#table)

## :couple: Related rules

- [toml/keys-order]

[toml/keys-order]: ./keys-order.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/tables-order.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/tables-order.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/tables-order)
