---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/no-unreadable-number-separator"
description: "disallow number separators that to not enhance readability."
since: "v0.1.0"
---
# toml/no-unreadable-number-separator

> disallow number separators that to not enhance readability.

- :gear: This rule is included in `"plugin:toml/recommended"` and `"plugin:toml/standard"`.

## :book: Rule Details

This rule disallow number separators that to not enhance readability.

<eslint-code-block>

<!-- eslint-skip -->

```toml
# eslint toml/no-unreadable-number-separator: 'error'

# ✓ GOOD
"good" = 12_345

# ✗ BAD
"bad" = 1_2_3_4_5
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [TOML v1.0.0 - Integer](https://toml.io/en/v1.0.0#integer)
- [TOML v1.0.0 - Float](https://toml.io/en/v1.0.0#float)

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/src/rules/no-unreadable-number-separator.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/tests/src/rules/no-unreadable-number-separator.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/master/tests/fixtures/rules/no-unreadable-number-separator)
