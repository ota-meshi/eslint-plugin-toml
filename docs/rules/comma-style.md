---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/comma-style"
description: "enforce consistent comma style in array"
since: "v0.1.0"
---

# toml/comma-style

> enforce consistent comma style in array

- :gear: This rule is included in `"config.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforce consistent comma style in array.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/comma-style: 'error'

# ✓ GOOD
good = [
  1,
  2,
  3
]

# ✗ BAD
bad = [
  1
  ,2
  ,3
]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/comma-style:
  - error
  - last # or "first"
```

Same as [comma-style] rule option. See [here](https://eslint.org/docs/rules/comma-style#options) for details.

## :couple: Related rules

- [comma-style]

[comma-style]: https://eslint.org/docs/rules/comma-style

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/comma-style.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/comma-style.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/comma-style)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/comma-style)</sup>
