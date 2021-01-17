---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/space-eq-sign"
description: "require spacing around equals sign"
---
# toml/space-eq-sign

> require spacing around equals sign

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule is aimed at ensuring there are spaces around equals sign.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/space-eq-sign: 'error'

# ✓ GOOD
"good" = 42

"bad"=42
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :couple: Related rules

- [space-infix-ops]

[space-infix-ops]: https://eslint.org/docs/rules/space-infix-ops

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/space-eq-sign.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/space-eq-sign.js)
