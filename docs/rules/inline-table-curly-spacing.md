---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/inline-table-curly-spacing"
description: "enforce consistent spacing inside braces"
since: "v0.1.0"
---

# toml/inline-table-curly-spacing

> enforce consistent spacing inside braces

- :gear: This rule is included in `"configs.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent spacing inside braces of inline tables.

<eslint-code-block fix>

<!-- eslint-skip -->

```yaml
# eslint toml/inline-table-curly-spacing: 'error'

# ✓ GOOD
good = { a = 42 }

# ✗ BAD
bad = {a = 42}
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/inline-table-curly-spacing:
  - error
  - always # or "never"
  - arraysInObjects: false
    objectsInObjects: false
    emptyObjects: ignore
```

This rule has two options, a string option and an object option.

- First option:

  - `"never"` (default) disallows spacing inside of braces
  - `"always"` requires spacing inside of braces (except `{}`)

- Second option:

  - `"arraysInObjects"` control spacing inside of braces of inline tables beginning and/or ending with an array element.
    - `true` requires spacing inside of braces of inline tables beginning and/or ending with an array element (applies when the first option is set to `never`)
    - `false` disallows spacing inside of braces of inline tables beginning and/or ending with an array element (applies when the first option is set to `always`)
  - `"objectsInObjects"` control spacing inside of braces of inline tables beginning and/or ending with an inline table element.
    - `true` requires spacing inside of braces of inline tables beginning and/or ending with an inline table element (applies when the first option is set to `never`)
    - `false` disallows spacing inside of braces of inline tables beginning and/or ending with an inline table element (applies when the first option is set to `always`)
  - `"emptyObjects"` control spacing within empty inline tables.
    - `"ignore"`(default) do not check spacing in empty inline tables.
    - `"always"` require a space in empty inline tables.
    - `"never"` disallow spaces in empty inline tables.

These options are almost identical to those of the [@stylistic/object-curly-spacing] rule.
See [here](https://eslint.style/rules/object-curly-spacing#options) for details.

## :couple: Related rules

- [@stylistic/object-curly-spacing]
- [object-curly-spacing]
- [toml/array-bracket-spacing]

[object-curly-spacing]: https://eslint.org/docs/rules/object-curly-spacing
[toml/array-bracket-spacing]: ./array-bracket-spacing.md
[@stylistic/object-curly-spacing]: https://eslint.style/rules/object-curly-spacing#options

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/inline-table-curly-spacing.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/inline-table-curly-spacing.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/inline-table-curly-spacing)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/object-curly-spacing)</sup>
