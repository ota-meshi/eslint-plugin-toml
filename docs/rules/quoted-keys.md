---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/quoted-keys"
description: "require or disallow quotes around keys"
---
# toml/quoted-keys

> require or disallow quotes around keys

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports quoted keys that can use bare keys.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/quoted-keys: 'error'

# ✓ GOOD
[good]
good = "foo"

# ✗ BAD
["bad"]
"bad" = "bar"
```

</eslint-code-block>

## :wrench: Options

```yaml
"toml/quoted-keys":
  - error
  - prefer: "as-needed" # or "always"
    numbers: true
```

- `prefer`
  - `"as-needed"` ... Disallows quotes around key names that are not strictly required. It is default.
  - `"always"` ... Requires quotes around all key names.
- `numbers` ... If `true`, requires quotes around numbers used as key names (only applies when using `"as-needed"`). Default `true`,

## :books: Further reading

- [TOML v1.0.0 - Keys](https://toml.io/en/v1.0.0#keys)

## :couple: Related rules

- [quote-props]

[quote-props]: https://eslint.org/docs/rules/quote-props

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/quoted-keys.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/quoted-keys.js)
