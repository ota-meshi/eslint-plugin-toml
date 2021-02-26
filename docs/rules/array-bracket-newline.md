---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/array-bracket-newline"
description: "enforce linebreaks after opening and before closing array brackets"
since: "v0.1.0"
---
# toml/array-bracket-newline

> enforce linebreaks after opening and before closing array brackets

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces line breaks after opening and before closing array brackets.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/array-bracket-newline: 'error'

# ✓ GOOD
good1 = [ 1, 2, 3 ]
good2 = [
  1,
  2,
  3
]

# ✗ BAD
bad1 = [
  1, 2, 3
]
bad2 = [ 1, 2, 3
]
bad3 = [
  1, 2, 3]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/array-bracket-newline:
  - error
  - always # or "never" or "consistent"
  - multiline: true
    minItems: null
```

Same as [array-bracket-newline] rule option. See [here](https://eslint.org/docs/rules/array-bracket-newline#options) for details.

## :couple: Related rules

- [array-bracket-newline]
- [toml/array-bracket-spacing]

[array-bracket-newline]: https://eslint.org/docs/rules/array-bracket-newline
[toml/array-bracket-spacing]: ./array-bracket-spacing.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/src/rules/array-bracket-newline.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/tests/src/rules/array-bracket-newline.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/master/tests/fixtures/rules/array-bracket-newline)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/array-bracket-newline)</sup>
