---
pageClass: "rule-details"
sidebarDepth: 0
title: "toml/vue-custom-block/no-parsing-error"
description: "disallow parsing errors in Vue custom blocks"
since: "v0.1.0"
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

## :rocket: Version

This rule was introduced in eslint-plugin-toml v0.1.0

## :mag: Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/src/rules/vue-custom-block/no-parsing-error.ts)
- [Test source](https://github.com/ota-meshi/eslint-plugin-toml/blob/master/tests/src/rules/vue-custom-block/no-parsing-error.ts)
- [Test fixture sources](https://github.com/ota-meshi/eslint-plugin-toml/tree/master/tests/fixtures/rules/vue-custom-block/no-parsing-error)
