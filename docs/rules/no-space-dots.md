---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/no-space-dots"
description: "disallow spacing around infix operators"
---
# toml/no-space-dots

> disallow spacing around infix operators

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule disallows whitespace around the dot.


<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/no-space-dots: 'error'

# ✓ GOOD
[good.key]
good.key = "foo"

# ✗ BAD
[bad . key]
bad      .      key = "bar"
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :books: Further reading

- [TOML v1.0.0 - Keys](https://toml.io/en/v1.0.0#keys)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/no-space-dots.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/no-space-dots.js)
