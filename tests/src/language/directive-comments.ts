import assert from "assert";
import { Linter } from "eslint";
import plugin from "../../../src/index.ts";

/**
 * Test suite for ESLint directive comments in TOML files.
 *
 * Tests that eslint-disable, eslint-disable-line, eslint-disable-next-line,
 * and eslint-enable directives work correctly in TOML files.
 */
describe("Directive Comments", () => {
  let linter: Linter;

  beforeEach(() => {
    linter = new Linter();
  });

  /**
   * Creates a config array for testing with the specified rules.
   */
  function createConfig(rules: Linter.RulesRecord): Linter.Config[] {
    return [
      {
        files: ["**/*.toml"],
        plugins: { toml: plugin },
        language: "toml/toml",
        rules,
      },
    ];
  }

  describe("eslint-disable", () => {
    it("should disable all rules for the rest of the file", () => {
      const code = `# eslint-disable
"foo" = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        0,
        "Rule should be disabled by eslint-disable comment",
      );
    });

    it("should disable a specific rule for the rest of the file", () => {
      const code = `# eslint-disable toml/quoted-keys
"foo" = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        0,
        "Rule should be disabled by eslint-disable comment",
      );
    });

    it("should not disable rules not mentioned in the directive", () => {
      const code = `# eslint-disable toml/some-other-rule
"foo" = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        1,
        "Rule should not be disabled when different rule is specified",
      );
    });
  });

  describe("eslint-enable", () => {
    it("should re-enable rules after eslint-disable", () => {
      const code = `# eslint-disable toml/quoted-keys
"foo" = "bar"
# eslint-enable toml/quoted-keys
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 4, "Error should be on line 4");
    });

    it("should re-enable all rules after eslint-disable all", () => {
      const code = `# eslint-disable
"foo" = "bar"
# eslint-enable
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 4, "Error should be on line 4");
    });
  });

  describe("eslint-disable-line", () => {
    it("should disable all rules for the current line", () => {
      const code = `"foo" = "bar" # eslint-disable-line
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 2, "Error should be on line 2");
    });

    it("should disable a specific rule for the current line", () => {
      const code = `"foo" = "bar" # eslint-disable-line toml/quoted-keys
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 2, "Error should be on line 2");
    });

    it("should not disable other rules on the same line", () => {
      const code = `"foo"  =  "bar" # eslint-disable-line toml/quoted-keys
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
        "toml/key-spacing": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const quotedKeysErrors = messages.filter(
        (m) => m.ruleId === "toml/quoted-keys",
      );
      const keySpacingErrors = messages.filter(
        (m) => m.ruleId === "toml/key-spacing",
      );

      assert.strictEqual(
        quotedKeysErrors.length,
        0,
        "quoted-keys should be disabled",
      );
      assert.ok(
        keySpacingErrors.length > 0,
        "key-spacing should report errors",
      );
    });
  });

  describe("eslint-disable-next-line", () => {
    it("should disable all rules for the next line", () => {
      const code = `# eslint-disable-next-line
"foo" = "bar"
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 3, "Error should be on line 3");
    });

    it("should disable a specific rule for the next line", () => {
      const code = `# eslint-disable-next-line toml/quoted-keys
"foo" = "bar"
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 3, "Error should be on line 3");
    });

    it("should work with description after --", () => {
      const code = `# eslint-disable-next-line toml/quoted-keys -- this is intentional
"foo" = "bar"
"baz" = "qux"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 3, "Error should be on line 3");
    });

    it("should not disable other rules on the next line", () => {
      const code = `# eslint-disable-next-line toml/quoted-keys
"foo"  =  "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
        "toml/key-spacing": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const quotedKeysErrors = messages.filter(
        (m) => m.ruleId === "toml/quoted-keys",
      );
      const keySpacingErrors = messages.filter(
        (m) => m.ruleId === "toml/key-spacing",
      );

      assert.strictEqual(
        quotedKeysErrors.length,
        0,
        "quoted-keys should be disabled",
      );
      assert.ok(
        keySpacingErrors.length > 0,
        "key-spacing should report errors",
      );
    });
  });

  describe("multiple rules", () => {
    it("should disable multiple rules separated by commas", () => {
      const code = `# eslint-disable-next-line toml/quoted-keys, toml/key-spacing
"foo"  =  "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
        "toml/key-spacing": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId?.startsWith("toml/"));

      assert.strictEqual(errors.length, 0, "Both rules should be disabled");
    });

    it("should disable multiple rules in eslint-disable", () => {
      const code = `# eslint-disable toml/quoted-keys, toml/key-spacing
"foo"  =  "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
        "toml/key-spacing": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId?.startsWith("toml/"));

      assert.strictEqual(errors.length, 0, "Both rules should be disabled");
    });
  });

  describe("baseline - no directive", () => {
    it("should report errors when no directive is present", () => {
      const code = `"foo" = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        1,
        "Should report an error for unnecessarily quoted key",
      );
    });

    it("should report errors for unquoted keys when prefer: always", () => {
      const code = `foo = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": ["error", { prefer: "always" }],
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        1,
        "Should report an error for unquoted key when prefer: always",
      );
    });
  });
});

/**
 * Test suite for ESLint inline configuration comments in TOML files.
 *
 * Tests that eslint comments can be used to configure rules inline.
 */
describe("Inline Configuration Comments", () => {
  let linter: Linter;

  beforeEach(() => {
    linter = new Linter();
  });

  /**
   * Creates a config array for testing with the specified rules.
   */
  function createConfig(rules: Linter.RulesRecord): Linter.Config[] {
    return [
      {
        files: ["**/*.toml"],
        plugins: { toml: plugin },
        language: "toml/toml",
        rules,
      },
    ];
  }

  describe("eslint inline config", () => {
    it("should configure rules via eslint comment", () => {
      // Enable a rule via inline config
      const code = `# eslint toml/quoted-keys: ["error", { "prefer": "always" }]
foo = "bar"
`;
      const config = createConfig({});

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        1,
        "Rule should be enabled by inline config",
      );
    });

    it("should override existing rule configuration", () => {
      // Rule is set to error in config, but inline config disables it
      const code = `# eslint toml/quoted-keys: "off"
"foo" = "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      assert.strictEqual(
        errors.length,
        0,
        "Rule should be disabled by inline config",
      );
    });

    it("should configure multiple rules in one comment", () => {
      const code = `# eslint toml/quoted-keys: "off", toml/key-spacing: "off"
"foo"  =  "bar"
`;
      const config = createConfig({
        "toml/quoted-keys": "error",
        "toml/key-spacing": "error",
      });

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId?.startsWith("toml/"));

      assert.strictEqual(
        errors.length,
        0,
        "Both rules should be disabled by inline config",
      );
    });

    it("should report error for invalid inline config syntax", () => {
      const code = `# eslint { invalid json
foo = "bar"
`;
      const config = createConfig({});

      const messages = linter.verify(code, config, "test.toml");
      // Invalid syntax should be reported as a problem
      const configErrors = messages.filter((m) => m.ruleId === null);

      assert.ok(
        configErrors.length > 0,
        "Should report an error for invalid inline config syntax",
      );
    });

    it("should report error for unknown rule in inline config", () => {
      const code = `# eslint unknown-rule: "error"
foo = "bar"
`;
      const config = createConfig({});

      const messages = linter.verify(code, config, "test.toml");
      // Unknown rule should be reported
      const unknownRuleErrors = messages.filter((m) =>
        m.message.includes("Definition for rule"),
      );

      assert.ok(
        unknownRuleErrors.length > 0,
        "Should report an error for unknown rule",
      );
    });
  });

  describe("combining directives and inline config", () => {
    it("should work with both inline config and disable directives", () => {
      const code = `# eslint toml/quoted-keys: ["error", { "prefer": "always" }]
# eslint-disable-next-line toml/quoted-keys
foo = "bar"
baz = "qux"
`;
      const config = createConfig({});

      const messages = linter.verify(code, config, "test.toml");
      const errors = messages.filter((m) => m.ruleId === "toml/quoted-keys");

      // Line 3 should be disabled, line 4 should report error
      assert.strictEqual(errors.length, 1, "Should have exactly one error");
      assert.strictEqual(errors[0].line, 4, "Error should be on line 4");
    });
  });
});
