export = {
  plugins: ["toml"],
  overrides: [
    {
      files: ["*.toml"],
      parser: require.resolve("toml-eslint-parser"),
      rules: {
        // ESLint core rules known to cause problems with TOML.
        "no-irregular-whitespace": "off",
        "spaced-comment": "off",
      },
    },
  ],
};
