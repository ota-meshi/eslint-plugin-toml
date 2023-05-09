---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/array-bracket-spacing"
description: "enforce consistent spacing inside array brackets"
since: "v0.1.0"
---

# toml/array-bracket-spacing

> enforce consistent spacing inside array brackets

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent spacing inside array brackets.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/array-bracket-spacing: 'error'

# ✓ GOOD
good = [ 1, 2 ]

# ✗ BAD
bad = [1, 2]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/array-bracket-spacing:
  - error
  - always # or "never"
  - singleValue: true
    objectsInArrays: true
    arraysInArrays: true
```

Same as [array-bracket-spacing] rule option. See [here](https://eslint.org/docs/rules/array-bracket-spacing#options) for details.

## :couple: Related rules

- [array-bracket-spacing]
- [toml/inline-table-curly-spacing]

[array-bracket-spacing]: https://eslint.org/docs/rules/array-bracket-spacing
[toml/inline-table-curly-spacing]: ./inline-table-curly-spacing.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/array-bracket-spacing.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/array-bracket-spacing.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/array-bracket-spacing)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/array-bracket-spacing)</sup>
