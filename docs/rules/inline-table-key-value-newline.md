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

This rule reports ???.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/inline-table-key-value-newline: 'error'

# ✓ GOOD
"good" = "foo"

# ✗ BAD
"bad" = "bar"
```

</eslint-code-block>

## :wrench: Options

Nothing.

```yaml
toml/inline-table-key-value-newline:
  - error
  - opt
```

Same as [inline-table-key-value-newline] rule option. See [here](https://eslint.org/docs/rules/inline-table-key-value-newline#options) for details.

-

## :books: Further reading

-

## :couple: Related rules

- [inline-table-key-value-newline]

[inline-table-key-value-newline]: https://eslint.org/docs/rules/inline-table-key-value-newline

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/inline-table-key-value-newline.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/inline-table-key-value-newline.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/inline-table-key-value-newline)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/object-property-newline)</sup>
