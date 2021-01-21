---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/indent"
description: "enforce consistent indentation"
---
# toml/indent

> enforce consistent indentation

- :gear: This rule is included in `"plugin:toml/standard"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports enforces a consistent indentation style. The default style is 2 spaces.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# eslint toml/indent: 'error'

# ✓ GOOD
"good" = [
  1,
  2
]

# ✗ BAD
"bad" = [
1,
    2
]
```

</eslint-code-block>

## :wrench: Options

```yaml
toml/indent:
  - error
  - 2 # number of spaces or "tab"
  - subTables: 0
    keyValuePairs: 0
```

- First Option
  - Number option ... The number of spaces used for indentation.
  - `"tab"` ... Use tabs for indentation.
- Second Option
  - `subTables` ... The multiplier of indentation for sub-tables. Default is `0`.
  - `keyValuePairs` ... The multiplier of indentation for key/value pairs. Default is `0`.

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# ✓ GOOD
# eslint toml/indent: [error, 2, { subTables: 1, keyValuePairs: 1 }]

# Taken from https://toml.io/

# This is a TOML document

title = "TOML Example"

[owner]
  name = "Tom Preston-Werner"
  dob = 1979-05-27T07:32:00-08:00

[database]
  enabled = true
  ports = [ 8001, 8001, 8002 ]
  data = [ ["delta", "phi"], [3.14] ]
  temp_targets = { cpu = 79.5, case = 72.0 }

[servers]

  [servers.alpha]
    ip = "10.0.0.1"
    role = "frontend"

  [servers.beta]
    ip = "10.0.0.2"
    role = "backend"
```

</eslint-code-block>

<eslint-code-block fix>

<!-- eslint-skip -->

```toml
# ✗ BAD
# eslint toml/indent: [error, 2, { subTables: 1, keyValuePairs: 1 }]

# Taken from https://toml.io/

# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
enabled = true
ports = [ 8001, 8001, 8002 ]
data = [ ["delta", "phi"], [3.14] ]
temp_targets = { cpu = 79.5, case = 72.0 }

[servers]

[servers.alpha]
ip = "10.0.0.1"
role = "frontend"

[servers.beta]
ip = "10.0.0.2"
role = "backend"
```

</eslint-code-block>

## :couple: Related rules

- [indent]

[indent]: https://eslint.org/docs/rules/indent

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/indent.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/indent.js)
