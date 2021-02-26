---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/array-element-newline"
description: "enforce line breaks between array elements"
since: "v0.1.0"
---
# toml/array-element-newline

> enforce line breaks between array elements

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces line breaks between array elements.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/array-element-newline: 'error'

# ✓ GOOD
"good" = [
  1,
  2,
  3
]

# ✗ BAD
"bad" = [1, 2, 3]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/array-element-newline:
  - error
  - always # or "never" or "consistent"
  - multiline: true
    minItems: null
```

Same as [array-element-newline] rule option. See [here](https://eslint.org/docs/rules/array-element-newline#options) for details.

## :couple: Related rules

- [array-element-newline]
- [toml/array-bracket-newline]

[array-element-newline]: https://eslint.org/docs/rules/array-element-newline
[toml/array-bracket-newline]: ./array-bracket-newline.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/src/rules/array-element-newline.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/tests/src/rules/array-element-newline.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/master/tests/fixtures/rules/array-element-newline)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/array-element-newline)</sup>
