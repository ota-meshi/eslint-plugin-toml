---
"eslint-plugin-toml": major
---

Convert to ESM-only package with tsdown bundling. The package now uses ESM module format exclusively and is bundled using tsdown for optimized distribution.

**Breaking Changes:**
- Package is now ESM-only (`"type": "module"` in package.json)
- Main export changed from `lib/index.js` to `lib/index.mjs`
- Requires Node.js with ESM support (already required: `^20.19.0 || ^22.13.0 || >=24`)
- TypeScript declaration files now use `.d.mts` extension

**Improvements:**
- Bundled with tsdown for better tree-shaking and smaller package size
- Optimized build output with code splitting
- Modern ESM-first approach
