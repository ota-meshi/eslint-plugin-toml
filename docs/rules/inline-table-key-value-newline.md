---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/inline-table-key-value-newline"
description: "enforce placing inline table key-value pairs on separate lines"
---

# toml/inline-table-key-value-newline

> enforce placing inline table key-value pairs on separate lines

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>
- :gear: This rule is included in `"configs.standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces placing each key-value pair of TOML inline tables on a separate line.
It is analogous to ESLint's `object-property-newline` but for TOML inline tables (multiline inline table syntax is available in TOML v1.1+).

Note: The rule is skipped when the parser's TOML version is v1.0 because multiline inline tables are not available in that version.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/inline-table-key-value-newline: 'error'

# ✓ GOOD (multiline)
val1 = {
  a = 1,
  b = 2
}

# ✗ BAD (key-value pairs not on separate lines)
val2 = { a = 1, b = 2 }

```

</eslint-code-block>

## :wrench: Options

```yaml
toml/inline-table-key-value-newline:
  - error
  - allowAllPropertiesOnSameLine: false # or true
```

- `allowAllPropertiesOnSameLine` ... when `true` (default), all properties may be on the same single line (e.g. `{ a = 1, b = 2 }`). When `false`, each property must be on its own line.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/inline-table-key-value-newline: ["error", { allowAllPropertiesOnSameLine: true }]

# ✓ GOOD (single line when allowed)
val2 = { a = 1, b = 2 }

# ✗ BAD
val3 = { a = 1, b = 2,
c = 2 }

```

</eslint-code-block>

## :couple: Related rules

- [toml/inline-table-curly-newline]
- [object-property-newline]

[toml/inline-table-curly-newline]: ./inline-table-curly-newline.md
[object-property-newline]: https://eslint.org/docs/rules/object-property-newline

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/inline-table-key-value-newline.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/inline-table-key-value-newline.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/inline-table-key-value-newline)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/object-property-newline)</sup>
