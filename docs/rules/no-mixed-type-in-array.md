---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/no-mixed-type-in-array"
description: "disallow mixed data types in array"
---
# toml/no-mixed-type-in-array

> disallow mixed data types in array

## :book: Rule Details

This rule reports mixed data types in an array.  
It was prohibited in TOML v0.5.0. [https://toml.io/en/v0.5.0#array](https://toml.io/en/v0.5.0#array)

<eslint-code-block>

<!-- eslint-skip -->

```toml
# eslint toml/no-mixed-type-in-array: 'error'

# ✓ GOOD
good.arr1 = [ 1, 2, 3 ]
good.arr2 = [ "red", "yellow", "green" ]
good.arr3 = [ [ 1, 2 ], [3, 4, 5] ]
good.arr4 = [ "all", 'strings', """are the same""", '''type''']
good.arr5 = [ [ 1, 2 ], ["a", "b", "c"] ]

# ✗ BAD
bad.arr6 = [ 1, 2.0 ]
bad.arr7 = [ 1, 'foo' ]
```

</eslint-code-block>

## :wrench: Options

```yaml
"toml/no-mixed-type-in-array":
  - error
  - typeMap:
      string: String
      integer: Integer
      float: Float
      boolean: Boolean
      offsetDateTime: Datetime
      localDateTime: Datetime
      localDate: Datetime
      localTime: Datetime
      array: Array
      inlineTable: Inline Table
```

- `typeMap` ... Specifies the type and its actual type name. For example, if you want to check `offsetDateTime` and `localDateTime` as different types, specify different names for each.  
  e.g.  
  
  ```yaml
  offsetDateTime: OffsetDatetime
  localDateTime: LocalDatetime
  ```

## :books: Further reading

- [TOML v0.5.0 - Array](https://toml.io/en/v0.5.0#array)

## :couple: Related rules

- [no-mixed-type-in-array]

[no-mixed-type-in-array]: https://eslint.org/docs/rules/no-mixed-type-in-array

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/no-mixed-type-in-array.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/no-mixed-type-in-array.js)
