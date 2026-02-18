# eslint-plugin-toml

## 1.1.1

### Patch Changes

- [#322](https://github.com/ota-meshi/eslint-plugin-toml/pull/322) [`e9986c5`](https://github.com/ota-meshi/eslint-plugin-toml/commit/e9986c59058622b97b37c75477e8d9ba5239f003) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix: update `@ota-meshi/ast-token-store` to 0.2.1

## 1.1.0

### Minor Changes

- [#320](https://github.com/ota-meshi/eslint-plugin-toml/pull/320) [`f028eea`](https://github.com/ota-meshi/eslint-plugin-toml/commit/f028eeaab39a26deb316749c997ee20b25fb680f) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: use `@ota-meshi/ast-token-store`

## 1.0.4

### Patch Changes

- [#318](https://github.com/ota-meshi/eslint-plugin-toml/pull/318) [`ac42da3`](https://github.com/ota-meshi/eslint-plugin-toml/commit/ac42da3a39c66f644de4603bf526626ff583eb80) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix: some bug with eslint v10

## 1.0.3

### Patch Changes

- [#307](https://github.com/ota-meshi/eslint-plugin-toml/pull/307) [`4c85d56`](https://github.com/ota-meshi/eslint-plugin-toml/commit/4c85d56647e36de31d090e19b17c2ca14a3da994) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix: add fake scopeManager for SourceCode API compatibility

## 1.0.2

### Patch Changes

- [#305](https://github.com/ota-meshi/eslint-plugin-toml/pull/305) [`35db26e`](https://github.com/ota-meshi/eslint-plugin-toml/commit/35db26e68ccc3b6d5b5a7880af3a68a5b23268c3) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix: update exports in package.json to include types and default import

## 1.0.1

### Patch Changes

- [#302](https://github.com/ota-meshi/eslint-plugin-toml/pull/302) [`c2ab796`](https://github.com/ota-meshi/eslint-plugin-toml/commit/c2ab7960fd3a0b2be2568fca5c01eb8dd477dfab) Thanks [@ota-meshi](https://github.com/ota-meshi)! - Fixed a bug that `getFirstToken`, `getLastToken`, `getFirstTokenBetween`, `getTokenBefore`, and `getTokenAfter` in `SourceCode` always contained comments.

## 1.0.0

### Major Changes

- [#294](https://github.com/ota-meshi/eslint-plugin-toml/pull/294) [`84295b2`](https://github.com/ota-meshi/eslint-plugin-toml/commit/84295b2c20044a04739dd63c219ec6272076e821) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Drop support for legacy config. The plugin now exports flat configs as the main configuration format. The previous `flat/*` namespace is kept for backward compatibility.

- [#291](https://github.com/ota-meshi/eslint-plugin-toml/pull/291) [`e0eb3b9`](https://github.com/ota-meshi/eslint-plugin-toml/commit/e0eb3b97c962d2704ab61bddc16de5a41cc3ac24) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Drop support for older ESLint versions. The new supported version is `>=9.38.0`.

- [#287](https://github.com/ota-meshi/eslint-plugin-toml/pull/287) [`d328bb7`](https://github.com/ota-meshi/eslint-plugin-toml/commit/d328bb7635348554f20fc4fc3fc494c1449e10a4) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Drop support for older Node.js versions. The new supported version is `^20.19.0 || ^22.13.0 || >=24`.

- [#292](https://github.com/ota-meshi/eslint-plugin-toml/pull/292) [`d8c42e2`](https://github.com/ota-meshi/eslint-plugin-toml/commit/d8c42e210c4a3af81a9ec8a3f82b55c58edf3e13) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Changed to ESM-only package.

- [#295](https://github.com/ota-meshi/eslint-plugin-toml/pull/295) [`0a59c7d`](https://github.com/ota-meshi/eslint-plugin-toml/commit/0a59c7d2713109469bfb3bc365b123c4d052dcff) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add ESLint language plugin support. The package now exports a `languages` object containing a TOML language implementation, enabling it to work as an ESLint language plugin. The language plugin provides:

- [#296](https://github.com/ota-meshi/eslint-plugin-toml/pull/296) [`83f5a06`](https://github.com/ota-meshi/eslint-plugin-toml/commit/83f5a06e25bec7da3720a883729be237042935a6) Thanks [@ota-meshi](https://github.com/ota-meshi)! - Update dependency toml-eslint-parser to v1

## 0.13.1

### Patch Changes

- [#281](https://github.com/ota-meshi/eslint-plugin-toml/pull/281) [`7ad9894`](https://github.com/ota-meshi/eslint-plugin-toml/commit/7ad98949008775639a81f2a2539bd025a0231bd7) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat(deps): update toml-eslint-parser to v0.12.0

## 0.13.0

### Minor Changes

- [#267](https://github.com/ota-meshi/eslint-plugin-toml/pull/267) [`3afb35a`](https://github.com/ota-meshi/eslint-plugin-toml/commit/3afb35ae019e9e0593ab5974ea985e7f2a7bf658) Thanks [@andreww2012](https://github.com/andreww2012)! - refactor: get rid of lodash

- [#269](https://github.com/ota-meshi/eslint-plugin-toml/pull/269) [`0fc6837`](https://github.com/ota-meshi/eslint-plugin-toml/commit/0fc68370de52fc40c0cf4f06a66addd7dc9820bf) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat(deps): update toml-eslint-parser to ^0.11.0

## 0.12.0

### Minor Changes

- [#237](https://github.com/ota-meshi/eslint-plugin-toml/pull/237) [`152ba05`](https://github.com/ota-meshi/eslint-plugin-toml/commit/152ba05cd144857d302e3f135fdd228144fb8367) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: changed to prevent crash when used with language plugins.

## 0.11.1

### Patch Changes

- [#222](https://github.com/ota-meshi/eslint-plugin-toml/pull/222) [`9d26552`](https://github.com/ota-meshi/eslint-plugin-toml/commit/9d26552b00f83682186b2d22e87d02cbcb111c9a) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency toml-eslint-parser to ^0.10.0

## 0.11.0

### Minor Changes

- [#206](https://github.com/ota-meshi/eslint-plugin-toml/pull/206) [`d12e246`](https://github.com/ota-meshi/eslint-plugin-toml/commit/d12e246d595103d4a3b99dfac710b88419df962a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: improved compatibility with `@types/eslint` for flat config.

## 0.10.0

### Minor Changes

- [#198](https://github.com/ota-meshi/eslint-plugin-toml/pull/198) [`e5d939f`](https://github.com/ota-meshi/eslint-plugin-toml/commit/e5d939f02d6aa9b2a02ff17edf5099cc6068f181) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: add support for flat config

## 0.9.2

### Patch Changes

- [#191](https://github.com/ota-meshi/eslint-plugin-toml/pull/191) [`4a77e43`](https://github.com/ota-meshi/eslint-plugin-toml/commit/4a77e4320b637867bf139424bebb23c71a5c9313) Thanks [@ota-meshi](https://github.com/ota-meshi)! - fix(deps): update dependency eslint-compat-utils to ^0.4.0

## 0.9.1

### Patch Changes

- [#186](https://github.com/ota-meshi/eslint-plugin-toml/pull/186) [`d69ac0b`](https://github.com/ota-meshi/eslint-plugin-toml/commit/d69ac0bcb438ce7ea7f0117e08482960f7141589) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency eslint-compat-utils to ^0.3.0

## 0.9.0

### Minor Changes

- [#183](https://github.com/ota-meshi/eslint-plugin-toml/pull/183) [`2e569f7`](https://github.com/ota-meshi/eslint-plugin-toml/commit/2e569f749eeb09c5797199ce3904080ef0da2199) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency eslint-compat-utils to ^0.2.0

## 0.8.0

### Minor Changes

- [#177](https://github.com/ota-meshi/eslint-plugin-toml/pull/177) [`b141b45`](https://github.com/ota-meshi/eslint-plugin-toml/commit/b141b45f82fa224b63eb03ead08b855d7b78f241) Thanks [@ota-meshi](https://github.com/ota-meshi)! - Improve compatibility with ESLint v9

## 0.7.1

### Patch Changes

- [#168](https://github.com/ota-meshi/eslint-plugin-toml/pull/168) [`ec16c39`](https://github.com/ota-meshi/eslint-plugin-toml/commit/ec16c3930eb04e68fb024da2bbf8b8baac2e5965) Thanks [@ota-meshi](https://github.com/ota-meshi)! - Update toml-eslint-parser

## 0.7.0

### Minor Changes

- [#164](https://github.com/ota-meshi/eslint-plugin-toml/pull/164) [`08579a2`](https://github.com/ota-meshi/eslint-plugin-toml/commit/08579a2733332bc94744bbb37658f09611f5a71a) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: experimental support for TOML v1.1

## 0.6.1

### Patch Changes

- [#161](https://github.com/ota-meshi/eslint-plugin-toml/pull/161) [`1193452`](https://github.com/ota-meshi/eslint-plugin-toml/commit/119345282127a795211b62278ed4cb0a4002c713) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency toml-eslint-parser to ^0.7.0

## 0.6.0

### Minor Changes

- [#155](https://github.com/ota-meshi/eslint-plugin-toml/pull/155) [`884b74b`](https://github.com/ota-meshi/eslint-plugin-toml/commit/884b74b28d5aa72b0eda5ca9c6d468e7629e2190) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: use eslint-compat-utils

## 0.5.0

### Minor Changes

- [#141](https://github.com/ota-meshi/eslint-plugin-toml/pull/141) [`74b4ff0`](https://github.com/ota-meshi/eslint-plugin-toml/commit/74b4ff035d6b5a7d2ed1d66cba4f370f9f7c399d) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency toml-eslint-parser to ^0.6.0

- [#140](https://github.com/ota-meshi/eslint-plugin-toml/pull/140) [`eda86a9`](https://github.com/ota-meshi/eslint-plugin-toml/commit/eda86a9e24e90fc1901f52cd48702f235550d067) Thanks [@ota-meshi](https://github.com/ota-meshi)! - feat: export meta object
