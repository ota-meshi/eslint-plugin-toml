---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/no-non-decimal-integer"
description: "disallow hexadecimal, octal and binary integer"
---
# toml/no-non-decimal-integer

> disallow hexadecimal, octal and binary integer

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports disallow hexadecimal, octal and binary integer.

Hexadecimal numbers are very easy to read when expressing colors etc., but using non-decimal numbers in your system can be difficult to read.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/no-non-decimal-integer: 'error'

# ✓ GOOD
int1 = +99
int2 = 42
int3 = 0
int4 = -17

int5 = 1_000
int6 = 5_349_221

# ✗ BAD
# hexadecimal with prefix `0x`
hex1 = 0xDEADBEEF
hex2 = 0xdeadbeef
hex3 = 0xdead_beef

# octal with prefix `0o`
oct1 = 0o01234567
oct2 = 0o755 # useful for Unix file permissions

# binary with prefix `0b`
bin1 = 0b11010110
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/no-non-decimal-integer:
  - error
  - allowHexadecimal: false
    allowOctal: false
    allowBinary: false
```

## :books: Further reading

- [TOML v1.0.0 - Integer](https://toml.io/en/v1.0.0#integer)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/no-non-decimal-integer.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/no-non-decimal-integer.js)
