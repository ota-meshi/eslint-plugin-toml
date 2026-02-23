---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/inline-table-curly-newline"
description: "enforce linebreaks after opening and before closing braces"
since: "v1.3.0"
---

# toml/inline-table-curly-newline

> enforce linebreaks after opening and before closing braces

- :gear: This rule is included in `"configs.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces line breaks after opening and before closing braces of TOML inline tables. It is analogous to ESLint's `object-curly-newline` but for TOML inline tables (multiline inline table syntax is available in TOML v1.1+).

Note: The rule is skipped when the parser's TOML version is v1.0 because multiline inline tables are not available in that version.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/inline-table-curly-newline: 'error'

# ✓ GOOD (multiline)
val1 = {
  a = 1,
  b = 2
}

# ✓ GOOD (single line)
val2 = { a = 1, b = 2 }

# ✗ BAD (mixed)
val3 = {
  a = 1, b = 2 }

```

</eslint-code-block>

## :wrench: Options

```yaml
toml/inline-table-curly-newline:
  - error
  - always # or "never" 
  # or an object
  # - multiline: false
  #   minProperties: 2
  #   consistent: true
```

- `"always"` ... require line breaks after `{` and before `}`.
- `"never"` ... disallow line breaks after `{` and before `}`.
- object option
  - `multiline` ... `true` requires line breaks if there are line breaks inside properties or between properties. Otherwise, it disallows line breaks.
  - `minProperties` ... requires line breaks if the number of properties is at least the given integer. By default, an error will also be reported if an object contains linebreaks and has fewer properties than the given integer. However, the second behavior is disabled if the `consistent` option is set to `true`.
  - `consistent` ... `true` (default) requires that either both curly braces, or neither, directly enclose newlines. Note that enabling this option will also change the behavior of the `minProperties` option. (See `minProperties` above for more information)

## :couple: Related rules

- [toml/inline-table-curly-spacing]
- [object-curly-newline]

[toml/inline-table-curly-spacing]: ./inline-table-curly-spacing.md
[object-curly-newline]: https://eslint.org/docs/rules/object-curly-newline

## :rocket: Version

This rule was introduced in eslint-plugin-toml v1.3.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/inline-table-curly-newline.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/inline-table-curly-newline.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/inline-table-curly-newline)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/object-curly-newline)</sup>
