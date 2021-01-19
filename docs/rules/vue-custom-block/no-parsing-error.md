---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/vue-custom-block/no-parsing-error"
description: "disallow parsing errors in Vue custom blocks"
---
# toml/vue-custom-block/no-parsing-error

> disallow parsing errors in Vue custom blocks

- :gear: This rule is included in `"plugin:toml/recommended"` and `"plugin:toml/standard"`.

## :book: Rule Details

This rule reports YAML parsing errors in Vue custom blocks.

<eslint-code-block parser="vue-eslint-parser" file-name="sample.vue" language="html">

<!-- eslint-skip -->

```vue
<my-block lang="toml">
key =
</my-block>

<script>
/* eslint toml/vue-custom-block/no-parsing-error: 'error' */
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/src/rules/vue-custom-block/no-parsing-error.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/main/tests/src/rules/vue-custom-block/no-parsing-error.js)
