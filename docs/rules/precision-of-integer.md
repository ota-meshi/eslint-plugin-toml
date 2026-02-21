---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/precision-of-integer"
description: "disallow precision of integer greater than the specified value."
since: "v0.1.0"
---

# toml/precision-of-integer

> disallow precision of integer greater than the specified value.

- :gear: This rule is included in `"configs.recommended"` and `"configs.standard"`.

## :book: Rule Details

This rule reports an integer that exceeds the specified precision. Default 64-bit.  
Prevent unintended errors by specifying the maximum precision of the TOML implementation you use.

<eslint-code-block>

<!-- eslint-skip -->

```toml
# eslint toml/precision-of-integer: 'error'

# ✓ GOOD
"good"."plus" = 9223372036854775807
"good"."minus" = -9223372036854775808
"good"."hex" = 0x8000000000000000
"good"."octal" = 0o1000000000000000000000
"good"."binary" = 0b1000000000000000000000000000000000000000000000000000000000000000

# ✗ BAD
"bad"."plus" = 9223372036854775808
"bad"."minus" = -9223372036854775809
"bad"."hex" = 0x8000000000000001
"bad"."octal" = 0o1000000000000000000001
"bad"."binary" = 0b1000000000000000000000000000000000000000000000000000000000000001
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/precision-of-integer:
  - error
  - maxBit: 64
```

- `maxBit` ... Specifies the maximum bit precision.

## :books: Further reading

- [TOML v1.0.0 - Integer](https://toml.io/en/v1.0.0#integer)

## :couple: Related rules

- [toml/precision-of-fractional-seconds]

[toml/precision-of-fractional-seconds]: ./precision-of-fractional-seconds.md

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/precision-of-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/precision-of-integer.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/main/tests/fixtures/rules/precision-of-integer)
