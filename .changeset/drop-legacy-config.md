---
"eslint-plugin-toml": major
---

Drop support for legacy config. The plugin now exports flat configs as the main configuration format. The previous `flat/*` namespace is kept for backward compatibility.

**Breaking Changes:**
- Removed legacy config files (`base`, `recommended`, `standard`) for `.eslintrc` style configuration
- Flat configs (`flat/base`, `flat/recommended`, `flat/standard`) are now exported as the main configs (`base`, `recommended`, `standard`)
- The `flat/*` namespace is kept as aliases for backward compatibility

**Migration:**
- Update your `eslint.config.js` to use `configs.recommended` instead of `configs['flat/recommended']`
- If you were using legacy `.eslintrc` config, migrate to flat config format (`eslint.config.js`)
