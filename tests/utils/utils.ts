import fs from "fs";
import path from "path";
import assert from "assert";
import type { RuleTester } from "eslint";
import { Linter } from "eslint";
import * as tomlESLintParser from "toml-eslint-parser";
import * as vueESLintParser from "vue-eslint-parser";
// eslint-disable-next-line @typescript-eslint/no-require-imports -- tests
import plugin = require("../../src/index");
import { applyFixes } from "./apply-fixer";

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 */
export function unIndent(strings: readonly string[]): string {
  const templateValue = strings[0];
  const lines = templateValue.split("\n");
  const minLineIndent = getMinIndent(lines);

  return lines.map((line) => line.slice(minLineIndent)).join("\n");
}

/**
 * for `code` and `output`
 */
export function unIndentCodeAndOutput([code]: readonly string[]): (
  args: readonly string[],
) => {
  code: string;
  output: string;
} {
  const codeLines = code.split("\n");
  const codeMinLineIndent = getMinIndent(codeLines);

  return ([output]: readonly string[]) => {
    const outputLines = output.split("\n");
    const minLineIndent = Math.min(
      getMinIndent(outputLines),
      codeMinLineIndent,
    );

    return {
      code: codeLines.map((line) => line.slice(minLineIndent)).join("\n"),
      output: outputLines.map((line) => line.slice(minLineIndent)).join("\n"),
    };
  };
}

/**
 * Get number of minimum indent
 */
function getMinIndent(lines: string[]) {
  const lineIndents = lines
    .filter((line) => line.trim())
    .map((line) => / */u.exec(line)![0].length);
  return Math.min(...lineIndents);
}

/**
 * Load test cases
 */
export function loadTestCases(
  ruleName: string,
  _options?: any,
  additionals?: {
    valid?: (RuleTester.ValidTestCase | string)[];
    invalid?: RuleTester.InvalidTestCase[];
  },
): {
  valid: RuleTester.ValidTestCase[];
  invalid: RuleTester.InvalidTestCase[];
} {
  const validFixtureRoot = path.resolve(
    __dirname,
    `../fixtures/rules/${ruleName}/valid/`,
  );
  const invalidFixtureRoot = path.resolve(
    __dirname,
    `../fixtures/rules/${ruleName}/invalid/`,
  );

  const valid = listupInput(validFixtureRoot).map((inputFile) =>
    getConfig(ruleName, inputFile),
  );

  const fixable = plugin.rules[ruleName].meta.fixable != null;

  const invalid = listupInput(invalidFixtureRoot).map((inputFile) => {
    const config = getConfig(ruleName, inputFile);
    const errorFile = inputFile.replace(/input\.(?:toml|vue)$/u, "errors.json");
    const outputFile = inputFile.replace(
      /input\.(?:toml|vue)$/u,
      isToml(inputFile) ? "output.toml" : "output.vue",
    );
    let errors;
    try {
      errors = fs.readFileSync(errorFile, "utf8");
    } catch (_e) {
      writeFixtures(ruleName, inputFile);
      errors = fs.readFileSync(errorFile, "utf8");
    }
    config.errors = JSON.parse(errors);
    if (fixable) {
      let output;
      try {
        output = fs.readFileSync(outputFile, "utf8");
      } catch (_e) {
        writeFixtures(ruleName, inputFile);
        output = fs.readFileSync(outputFile, "utf8");
      }
      config.output = output;
    }

    return config;
  });

  if (additionals) {
    if (additionals.valid) {
      valid.push(...additionals.valid);
    }
    if (additionals.invalid) {
      invalid.push(...additionals.invalid);
    }
  }
  for (const test of valid) {
    if (!test.code) {
      throw new Error(`Empty code: ${test.filename}`);
    }
  }
  for (const test of invalid) {
    if (!test.code) {
      throw new Error(`Empty code: ${test.filename}`);
    }
  }
  if (invalid.some((test) => test.output)) {
    describe(`Output test for ${ruleName}`, () => {
      for (const test of invalid.filter(({ filename }) => isToml(filename))) {
        it(test.filename, () => {
          const input = tomlESLintParser.parseForESLint(test.code, {
            tomlVersion: "next",
          });
          const output = tomlESLintParser.parseForESLint(test.output, {
            tomlVersion: "next",
          });
          assert.deepStrictEqual(
            tomlESLintParser.getStaticTOMLValue(input.ast),
            tomlESLintParser.getStaticTOMLValue(output.ast),
          );
        });
      }
    });
  }
  return {
    valid,
    invalid,
  };
}

function listupInput(rootDir: string) {
  return [...itrListupInput(rootDir)];
}

function* itrListupInput(rootDir: string): IterableIterator<string> {
  for (const filename of fs.readdirSync(rootDir)) {
    if (filename.startsWith("_")) {
      // ignore
      continue;
    }
    const abs = path.join(rootDir, filename);
    if (filename.endsWith("input.toml") || filename.endsWith("input.vue")) {
      yield abs;
    } else if (fs.statSync(abs).isDirectory()) {
      yield* itrListupInput(abs);
    }
  }
}

function writeFixtures(
  ruleName: string,
  inputFile: string,
  { force }: { force?: boolean } = {},
) {
  const linter = getLinter(ruleName);
  const errorFile = inputFile.replace(/input\.(?:toml|vue)$/u, "errors.json");
  const outputFile = inputFile.replace(
    /input\.(?:toml|vue)$/u,
    isToml(inputFile) ? "output.toml" : "output.vue",
  );

  const config = getConfig(ruleName, inputFile);

  const result = linter.verify(
    config.code,
    {
      rules: {
        [ruleName]: ["error", ...(config.options || [])],
      },
      ...({
        languageOptions: {
          parser: isToml(inputFile) ? tomlESLintParser : vueESLintParser,
          parserOptions: { tomlVersion: "next" },
        },
      } as any),
      settings: {
        toml: { indent: 8 },
      },
    },
    config.filename,
  );
  if (force || !fs.existsSync(errorFile)) {
    fs.writeFileSync(
      errorFile,
      `${JSON.stringify(
        result.map((m) => ({
          message: m.message,
          line: m.line,
          column: m.column,
        })),
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  if (force || !fs.existsSync(outputFile)) {
    const output = applyFixes(config.code, result).output;

    if (plugin.rules[ruleName].meta.fixable != null) {
      fs.writeFileSync(outputFile, output, "utf8");
    }
  }
}

// function verify(
//     linter: Linter,
//     code: string,
//     config: Linter.Config,
//     filename: string,
// ): Linter.LintMessage[] {
//     try {
//         return linter.verify(code, config, filename)
//     } catch (e) {
//         console.error(`@ ${filename}`)
//         throw e
//     }
// }

function getLinter(ruleName: string) {
  const linter = new Linter();
  // @ts-expect-error for test
  linter.defineParser("toml-eslint-parser", tomlESLintParser);
  linter.defineParser("vue-eslint-parser", vueESLintParser as any);
  // @ts-expect-error for test
  linter.defineRule(ruleName, plugin.rules[ruleName]);

  return linter;
}

function getConfig(ruleName: string, inputFile: string) {
  const filename = inputFile.slice(inputFile.indexOf(ruleName));
  const code0 = fs.readFileSync(inputFile, "utf8");
  let code, config;
  let configFile: string = inputFile.replace(
    /input\.(?:toml|vue)$/u,
    "config.json",
  );
  if (!fs.existsSync(configFile)) {
    configFile = path.join(path.dirname(inputFile), "_config.json");
  }
  if (fs.existsSync(configFile)) {
    config = JSON.parse(fs.readFileSync(configFile, "utf8"));
  }
  if (config && typeof config === "object") {
    code = isToml(inputFile)
      ? `# ${filename}\n${code0}`
      : `<!--${filename}-->\n${code0}`;
    return Object.assign(
      isVue(inputFile) ? { languageOptions: { parser: vueESLintParser } } : {},
      config,
      { code, filename },
    );
  }
  // inline config
  const configStr = isToml(inputFile)
    ? /^#([^\n]+)\n/u.exec(code0)
    : /^<!--(.*?)-->/u.exec(code0);
  if (!configStr) {
    fs.writeFileSync(inputFile, `# {}\n${code0}`, "utf8");
    throw new Error("missing config");
  } else {
    code = isToml(inputFile)
      ? code0.replace(/^#([^\n]+)\n/u, `# ${filename}\n`)
      : code0.replace(/^<!--(.*?)-->/u, `<!--${filename}-->`);
    try {
      config = configStr ? JSON.parse(configStr[1]) : {};
    } catch (e: any) {
      throw new Error(`${e.message} in @ ${inputFile}`);
    }
  }

  return Object.assign(
    isVue(inputFile) ? { languageOptions: { parser: vueESLintParser } } : {},
    config,
    { code, filename },
  );
}

function isToml(fileName: string) {
  return fileName.endsWith(".toml");
}

function isVue(fileName: string) {
  return fileName.endsWith(".vue");
}
