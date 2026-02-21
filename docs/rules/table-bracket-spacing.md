---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/table-bracket-spacing"
description: "enforce consistent spacing inside table brackets"
since: "v0.1.0"
---

# toml/table-bracket-spacing

> enforce consistent spacing inside table brackets

- :gear: This rule is included in `"config.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent spacing inside table brackets.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/table-bracket-spacing: 'error'

# ✓ GOOD
[good]
[[good.array]]

# ✗ BAD
[ bad ]
[[ bad.array ]]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/table-bracket-spacing:
  - error
  - never # or "always"
```

- `"never"` ... Disallows spaces inside table brackets. It is default.
- `"always"` ... Requires one or more spaces or newlines inside table brackets

Same as [array-bracket-spacing] rule option. See [here](https://eslint.org/docs/rules/array-bracket-spacing#options) for details.

## :couple: Related rules

- [array-bracket-spacing]
- [toml/inline-table-curly-spacing]
- [toml/array-bracket-spacing]

[array-bracket-spacing]: https://eslint.org/docs/rules/array-bracket-spacing
[toml/inline-table-curly-spacing]: ./inline-table-curly-spacing.md
[toml/array-bracket-spacing]: ./array-bracket-spacing.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/table-bracket-spacing.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/table-bracket-spacing.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/table-bracket-spacing)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/array-bracket-spacing)</sup>
