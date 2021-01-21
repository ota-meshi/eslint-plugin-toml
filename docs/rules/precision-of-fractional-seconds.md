---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/precision-of-fractional-seconds"
description: "disallow precision of fractional seconds greater than the specified value."
---
# toml/precision-of-fractional-seconds

> disallow precision of fractional seconds greater than the specified value.

- :gear: This rule is included in `"plugin:toml/recommended"` and `"plugin:toml/standard"`.

## :book: Rule Details

This rule disallow precision of fractional seconds greater than the specified value.  
Prevent unintended rounding errors by specifying the maximum precision of the TOML implementation you use.

[https://toml.io/en/v1.0.0#local-time](https://toml.io/en/v1.0.0#local-time)

> Millisecond precision is required. Further precision of fractional seconds is implementation-specific.

<eslint-code-block>

<!-- eslint-skip -->

```toml
# eslint toml/precision-of-fractional-seconds: 'error'

# ✓ GOOD
"good"."odt" = 1979-05-27T00:32:00.999-07:00
"good"."ldt" = 1979-05-27T00:32:00.999
"good"."ld" = 00:32:00.999

# ✗ BAD
"bad"."odt" = 1979-05-27T00:32:00.999999-07:00
"bad"."ldt" = 1979-05-27T00:32:00.999999
"bad"."ld" = 00:32:00.999999
```

</eslint-code-block>

## :wrench: Options

```yaml
"toml/precision-of-fractional-seconds":
  - error
  - max: 3
```

- `max` ... Specifies the maximum precision.

## :books: Further reading

- [TOML v1.0.0 - Offset Date-Time](https://toml.io/en/v1.0.0#offset-date-time)
- [TOML v1.0.0 - Local Date-Time](https://toml.io/en/v1.0.0#local-date-time)
- [TOML v1.0.0 - Local Time](https://toml.io/en/v1.0.0#local-time)

## :couple: Related rules

- [toml/precision-of-integer]

[toml/precision-of-integer]: ./precision-of-integer.md

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/precision-of-fractional-seconds.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/precision-of-fractional-seconds.js)
