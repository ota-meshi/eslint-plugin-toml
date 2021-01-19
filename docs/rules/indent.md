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
```

- Number option ... The number of spaces used for indentation.
- `"tab"` ... Use tabs for indentation.

## :couple: Related rules

- [indent]

[indent]: https://eslint.org/docs/rules/indent

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/indent.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/indent.js)
