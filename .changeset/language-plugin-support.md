---
"eslint-plugin-toml": minor
---

Add ESLint language plugin support. The package now exports a `languages` object containing a TOML language implementation, enabling it to work as an ESLint language plugin. The language plugin provides:

- `TOMLLanguage` class implementing the ESLint Language interface
- `TOMLSourceCode` class with backward compatibility for existing rules
- Support for both parser-based (legacy) and language plugin configurations

Existing parser-based configurations continue to work without changes. Users can opt-in to using the language plugin approach by configuring `language: "toml/toml"` in their ESLint config.
