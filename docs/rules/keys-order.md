---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/keys-order"
description: "disallow defining pair keys out-of-order"
since: "v0.1.0"
---

# toml/keys-order

> disallow defining pair keys out-of-order

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports out-of-order pair keys.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/keys-order: 'error'

# ✓ GOOD
[good]
apple.type = "fruit"
apple.skin = "thin"
apple.color = "red"

orange.type = "fruit"
orange.skin = "thick"
orange.color = "orange"

# ✗ BAD
[bad]
apple.type = "fruit"
orange.type = "fruit"

apple.skin = "thin"
orange.skin = "thick"

apple.color = "red"
orange.color = "orange"
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [TOML v1.0.0 - Keys](https://toml.io/en/v1.0.0#keys)

## :couple: Related rules

- [toml/tables-order]

[toml/tables-order]: ./tables-order.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/keys-order.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/keys-order.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/keys-order)
