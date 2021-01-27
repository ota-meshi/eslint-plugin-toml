---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/key-spacing"
description: "enforce consistent spacing between keys and values in key/value pairs"
---
# toml/key-spacing

> enforce consistent spacing between keys and values in key/value pairs

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent spacing between keys and values in key/value pairs. In the case of long lines, it is acceptable to add a new line wherever whitespace is allowed.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/key-spacing: 'error'

# ✓ GOOD
"good" = "foo"

# ✗ BAD
"bad"="bar"
```

</eslint-code-block>

## :wrench: Options

```yaml
"toml/key-spacing":
  - error
  - beforeEqual: false
    afterEqual: true
    mode: strict # or "minimum"
    # "align": "value" or "equal"
    # "singleLine": {}
    # "multiLine": {}
```

Same as [key-spacing] rule option. See [here](https://eslint.org/docs/rules/key-spacing#options) for details. However, you need to replace "colon" with "equal".

### `align: "equal"`

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/key-spacing: ['error', {align: equal}]

# ✓ GOOD
[good]
a.a   = 42
a.b.a = 42
a.b.b = 42
a.cd  = 42

# ✗ BAD
[bad]
a.a = 42
a.b.a = 42
a.b.b = 42
a.cd = 42
```

</eslint-code-block>

## :couple: Related rules

- [key-spacing]

[key-spacing]: https://eslint.org/docs/rules/key-spacing

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/key-spacing.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/key-spacing.js)

<sup>Taken with ❤️ [from ESLint core](https://eslint.org/docs/rules/key-spacing)</sup>
