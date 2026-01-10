import type { AST } from "toml-eslint-parser";
import type { RuleContext, RuleListener } from "../types";
import { createRule } from "../utils/index.ts";
import { isEqualSign } from "../utils/ast-utils.ts";
import { getSourceCode } from "../utils/compat.ts";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether a string contains a line terminator as defined in
 * http://www.ecma-international.org/ecma-262/5.1/#sec-7.3
 * @param {string} str String to test.
 * @returns {boolean} True if str contains a line terminator.
 */
function containsLineTerminator(str: string): boolean {
  return /[\n\r\u2028\u2029]/u.test(str);
}

/**
 * Gets the last element of an array.
 * @param {Array} arr An array.
 * @returns {any} Last element of arr.
 */
function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

/**
 * Checks whether a node is contained on a single line.
 * @param {ASTNode} node AST Node being evaluated.
 * @returns {boolean} True if the node is a single line.
 */
function isSingleLine(node: AST.TOMLNode): boolean {
  return node.loc.end.line === node.loc.start.line;
}

/**
 * Checks whether the properties on a single line.
 * @param {ASTNode[]} properties List of Property AST nodes.
 * @returns {boolean} True if all properties is on a single line.
 */
function isSingleLineProperties(properties: AST.TOMLKeyValue[]) {
  const [firstProp] = properties;
  const lastProp = last(properties);

  return firstProp.loc.start.line === lastProp.loc.end.line;
}

type AlignOption = {
  mode: "strict" | "minimum";
  on: "equal" | "value";
  beforeEqual: boolean;
  afterEqual: boolean;
};

type UserOption = {
  mode?: "strict" | "minimum";
  beforeEqual?: boolean;
  afterEqual?: boolean;
  align?: "equal" | "value" | AlignOption;
};

type ParsedOption = {
  mode: "strict" | "minimum";
  beforeEqual: boolean;
  afterEqual: boolean;
  align: AlignOption | undefined;
};

/**
 * Initializes a single option property from the configuration with defaults for undefined values
 * @param {Object} fromOptions Object to be initialized from
 * @returns {Object} The object with correctly initialized options and values
 */
function initOptionProperty(fromOptions: UserOption): ParsedOption {
  const mode = fromOptions.mode || "strict";

  let beforeEqual: boolean, afterEqual: boolean;

  // Set value of beforeEqual
  if (typeof fromOptions.beforeEqual !== "undefined") {
    beforeEqual = fromOptions.beforeEqual;
  } else {
    beforeEqual = true;
  }

  // Set value of afterEqual
  if (typeof fromOptions.afterEqual !== "undefined") {
    afterEqual = fromOptions.afterEqual;
  } else {
    afterEqual = true;
  }

  let align: AlignOption | undefined = undefined;
  // Set align if exists
  if (typeof fromOptions.align !== "undefined") {
    if (typeof fromOptions.align === "object") {
      align = fromOptions.align;
    } else {
      // "string"
      align = {
        on: fromOptions.align,
        mode,
        beforeEqual,
        afterEqual,
      };
    }
  }

  return {
    mode,
    beforeEqual,
    afterEqual,
    align,
  };
}

/**
 * Initializes all the option values (singleLine, multiLine and align) from the configuration with defaults for undefined values
 * @param {Object} fromOptions Object to be initialized from
 * @returns {Object} The object with correctly initialized options and values
 */
function initOptions(
  fromOptions: {
    align?: Partial<AlignOption>;
    multiLine?: UserOption;
    singleLine?: UserOption;
  } & UserOption,
) {
  let align: AlignOption | undefined,
    multiLine: ParsedOption,
    singleLine: ParsedOption;

  if (typeof fromOptions.align === "object") {
    // Initialize the alignment configuration
    align = {
      ...initOptionProperty(fromOptions.align),
      on: fromOptions.align.on || "equal",
      mode: fromOptions.align.mode || "strict",
    };

    multiLine = initOptionProperty(fromOptions.multiLine || fromOptions);
    singleLine = initOptionProperty(fromOptions.singleLine || fromOptions);
  } else {
    // string or undefined
    multiLine = initOptionProperty(fromOptions.multiLine || fromOptions);
    singleLine = initOptionProperty(fromOptions.singleLine || fromOptions);

    // If alignment options are defined in multiLine, pull them out into the general align configuration
    if (multiLine.align) {
      align = {
        on: multiLine.align.on,
        mode: multiLine.align.mode || multiLine.mode,
        beforeEqual: multiLine.align.beforeEqual,
        afterEqual: multiLine.align.afterEqual,
      };
    }
  }

  return {
    align,
    multiLine,
    singleLine,
  };
}

const ON_SCHEMA = {
  enum: ["equal", "value"],
};
const OBJECT_WITHOUT_ON_SCHEMA = {
  type: "object",
  properties: {
    mode: {
      enum: ["strict", "minimum"],
    },
    beforeEqual: {
      type: "boolean",
    },
    afterEqual: {
      type: "boolean",
    },
  },
  additionalProperties: false,
};

const ALIGN_OBJECT_SCHEMA = {
  type: "object",
  properties: {
    on: ON_SCHEMA,
    ...OBJECT_WITHOUT_ON_SCHEMA.properties,
  },
  additionalProperties: false,
};
export default createRule("key-spacing", {
  meta: {
    docs: {
      description:
        "enforce consistent spacing between keys and values in key/value pairs",
      categories: ["standard"],
      extensionRule: "key-spacing",
    },
    fixable: "whitespace",
    schema: [
      {
        anyOf: [
          {
            type: "object",
            properties: {
              align: {
                anyOf: [ON_SCHEMA, ALIGN_OBJECT_SCHEMA],
              },
              ...OBJECT_WITHOUT_ON_SCHEMA.properties,
            },
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              singleLine: OBJECT_WITHOUT_ON_SCHEMA,
              multiLine: {
                type: "object",
                properties: {
                  align: {
                    anyOf: [ON_SCHEMA, ALIGN_OBJECT_SCHEMA],
                  },
                  ...OBJECT_WITHOUT_ON_SCHEMA.properties,
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              singleLine: OBJECT_WITHOUT_ON_SCHEMA,
              multiLine: OBJECT_WITHOUT_ON_SCHEMA,
              align: ALIGN_OBJECT_SCHEMA,
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      extraKey: "Extra space after key '{{key}}'.",
      extraValue: "Extra space before value for key '{{key}}'.",
      missingKey: "Missing space after key '{{key}}'.",
      missingValue: "Missing space before value for key '{{key}}'.",
    },
    type: "layout",
  },
  create,
});

/**
 * Create rule visitor
 */
function create(context: RuleContext): RuleListener {
  const sourceCode = getSourceCode(context);
  if (!sourceCode.parserServices?.isTOML) {
    return {};
  }
  /**
   * OPTIONS
   * "key-spacing": [2, {
   *     beforeEqual: false,
   *     afterEqual: true,
   *     align: "equal" // Optional, or "value"
   * }
   */
  const options = context.options[0] || {};
  const {
    multiLine: multiLineOptions,
    singleLine: singleLineOptions,
    align: alignmentOptions,
  } = initOptions(options);

  /**
   * Determines if the given property is key/value property.
   * @param {ASTNode} property Property node to check.
   * @returns {boolean} Whether the property is a key/value property.
   */
  function isKeyValueProperty(
    property: AST.TOMLKeyValue | AST.TOMLTable,
  ): property is AST.TOMLKeyValue {
    return property.type === "TOMLKeyValue";
  }

  /**
   * Starting from the given a node (a property.key node here) looks forward
   * until it finds the last token before a equal punctuator and returns it.
   * @param {ASTNode} node The node to start looking from.
   * @returns {ASTNode} The last token before a equal punctuator.
   */
  function getLastTokenBeforeEqual(node: AST.TOMLKeyValue["key"]) {
    const equalToken = sourceCode.getTokenAfter(node, isEqualSign)!;

    return sourceCode.getTokenBefore(equalToken)!;
  }

  /**
   * Starting from the given a node (a property.key node here) looks forward
   * until it finds the equal punctuator and returns it.
   * @param {ASTNode} node The node to start looking from.
   * @returns {ASTNode} The equal punctuator.
   */
  function getNextEqual(node: AST.TOMLKeyValue["key"]) {
    return sourceCode.getTokenAfter(node, isEqualSign)!;
  }

  /**
   * Gets an object literal property's key as the identifier name or string value.
   * @param {ASTNode} property Property node whose key to retrieve.
   * @returns {string} The property's key.
   */
  function getKey(property: AST.TOMLKeyValue) {
    const keys = property.key.keys;

    return keys
      .map((key) => sourceCode.getText().slice(key.range[0], key.range[1]))
      .join(".");
  }

  /**
   * Reports an appropriately-formatted error if spacing is incorrect on one
   * side of the equal.
   * @param {ASTNode} property Key-value pair in an object literal.
   * @param {string} side Side being verified - either "key" or "value".
   * @param {string} whitespace Actual whitespace string.
   * @param {int} expected Expected whitespace length.
   * @param {string} mode Value of the mode as "strict" or "minimum"
   * @returns {void}
   */
  function report(
    property: AST.TOMLKeyValue,
    side: "key" | "value",
    whitespace: string,
    expected: number,
    mode: "strict" | "minimum",
  ) {
    const diff = whitespace.length - expected;
    const nextEqual = getNextEqual(property.key);
    const tokenBeforeEqual = sourceCode.getTokenBefore(nextEqual, {
      includeComments: true,
    })!;
    const tokenAfterEqual = sourceCode.getTokenAfter(nextEqual, {
      includeComments: true,
    })!;

    const invalid =
      (mode === "strict"
        ? diff !== 0
        : // mode === "minimum"
          diff < 0 || (diff > 0 && expected === 0)) &&
      !(expected && containsLineTerminator(whitespace));

    if (!invalid) {
      return;
    }
    const { locStart, locEnd, missingLoc } =
      side === "key"
        ? {
            locStart: tokenBeforeEqual.loc.end,
            locEnd: nextEqual.loc.start,
            missingLoc: tokenBeforeEqual.loc,
          }
        : {
            locStart: nextEqual.loc.start,
            locEnd: tokenAfterEqual.loc.start,
            missingLoc: tokenAfterEqual.loc,
          };
    const { loc, messageId } =
      diff > 0
        ? {
            loc: { start: locStart, end: locEnd },
            messageId: side === "key" ? "extraKey" : "extraValue",
          }
        : {
            loc: missingLoc,
            messageId: side === "key" ? "missingKey" : "missingValue",
          };

    context.report({
      node: property[side],
      loc,
      messageId,
      data: {
        key: getKey(property),
      },
      fix(fixer) {
        if (diff > 0) {
          // Remove whitespace
          if (side === "key") {
            return fixer.removeRange([
              tokenBeforeEqual.range[1],
              tokenBeforeEqual.range[1] + diff,
            ]);
          }
          return fixer.removeRange([
            tokenAfterEqual.range[0] - diff,
            tokenAfterEqual.range[0],
          ]);
        }
        const spaces = " ".repeat(-diff);
        // Add whitespace
        if (side === "key") {
          return fixer.insertTextAfter(tokenBeforeEqual, spaces);
        }
        return fixer.insertTextBefore(tokenAfterEqual, spaces);
      },
    });
  }

  /**
   * Gets the number of characters in a key, including quotes around string
   * keys and braces around computed property keys.
   * @param {ASTNode} property Property of on object literal.
   * @returns {int} Width of the key.
   */
  function getKeyWidth(pair: AST.TOMLKeyValue) {
    const startToken = sourceCode.getFirstToken(pair);
    const endToken = getLastTokenBeforeEqual(pair.key);

    return endToken.range[1] - startToken.range[0];
  }

  /**
   * Gets the whitespace around the equal in an object literal property.
   * @param {ASTNode} property Property node from an object literal.
   * @returns {Object} Whitespace before and after the property's equal.
   */
  function getPropertyWhitespace(pair: AST.TOMLKeyValue) {
    const whitespace = /(\s*)=(\s*)/u.exec(
      sourceCode.getText().slice(pair.key.range[1], pair.value.range[0]),
    );

    if (whitespace) {
      return {
        beforeEqual: whitespace[1],
        afterEqual: whitespace[2],
      };
    }
    return null;
  }

  /**
   * Verifies spacing of property conforms to specified options.
   * @param  {ASTNode} node Property node being evaluated.
   * @param {Object} lineOptions Configured singleLine or multiLine options
   * @returns {void}
   */
  function verifySpacing(node: AST.TOMLKeyValue, lineOptions: ParsedOption) {
    const actual = getPropertyWhitespace(node);

    if (actual) {
      // Object literal getters/setters lack equals
      report(
        node,
        "key",
        actual.beforeEqual,
        lineOptions.beforeEqual ? 1 : 0,
        lineOptions.mode,
      );
      report(
        node,
        "value",
        actual.afterEqual,
        lineOptions.afterEqual ? 1 : 0,
        lineOptions.mode,
      );
    }
  }

  /**
   * Verifies spacing of each property in a list.
   * @param {ASTNode[]} properties List of Property AST nodes.
   * @param {Object} lineOptions Configured singleLine or multiLine options
   * @returns {void}
   */
  function verifyListSpacing(
    properties: AST.TOMLKeyValue[],
    lineOptions: ParsedOption,
  ) {
    const length = properties.length;

    for (let i = 0; i < length; i++) {
      verifySpacing(properties[i], lineOptions);
    }
  }

  //--------------------------------------------------------------------------
  // Public API
  //--------------------------------------------------------------------------

  if (alignmentOptions) {
    // Verify vertical alignment
    return defineAlignmentVisitor(alignmentOptions);
  }

  return defineSpacingVisitor();

  /**
   * Define alignment rule visitor
   */
  function defineAlignmentVisitor(alignmentOptions: AlignOption) {
    return {
      "TOMLTopLevelTable, TOMLTable, TOMLInlineTable"(
        node: AST.TOMLTopLevelTable | AST.TOMLTable | AST.TOMLInlineTable,
      ) {
        if (isSingleLine(node)) {
          const body: (AST.TOMLKeyValue | AST.TOMLTable)[] = node.body;
          verifyListSpacing(body.filter(isKeyValueProperty), singleLineOptions);
        } else {
          verifyAlignment(node);
        }
      },
    };

    /**
     * Verifies correct vertical alignment of a group of properties.
     * @param {ASTNode[]} properties List of Property AST nodes.
     * @returns {void}
     */
    function verifyGroupAlignment(properties: AST.TOMLKeyValue[]) {
      const length = properties.length;
      const widths = properties.map(getKeyWidth); // Width of keys, including quotes
      const align = alignmentOptions.on; // "value" or "equal"
      let targetWidth = Math.max(...widths);
      let beforeEqual: number, afterEqual: number, mode: "strict" | "minimum";

      if (alignmentOptions && length > 1) {
        // When aligning values within a group, use the alignment configuration.
        beforeEqual = alignmentOptions.beforeEqual ? 1 : 0;
        afterEqual = alignmentOptions.afterEqual ? 1 : 0;
        mode = alignmentOptions.mode;
      } else {
        beforeEqual = multiLineOptions.beforeEqual ? 1 : 0;
        afterEqual = multiLineOptions.afterEqual ? 1 : 0;
        mode = alignmentOptions.mode;
      }

      // Conditionally include one space before or after equal
      targetWidth += align === "equal" ? beforeEqual : afterEqual;

      for (let i = 0; i < length; i++) {
        const property = properties[i];
        const whitespace = getPropertyWhitespace(property);

        if (whitespace) {
          // Object literal getters/setters lack a equal
          const width = widths[i];

          if (align === "value") {
            report(property, "key", whitespace.beforeEqual, beforeEqual, mode);
            report(
              property,
              "value",
              whitespace.afterEqual,
              targetWidth - width,
              mode,
            );
          } else {
            // align = "equal"
            report(
              property,
              "key",
              whitespace.beforeEqual,
              targetWidth - width,
              mode,
            );
            report(property, "value", whitespace.afterEqual, afterEqual, mode);
          }
        }
      }
    }

    /**
     * Checks whether a property is a member of the property group it follows.
     * @param {ASTNode} lastMember The last Property known to be in the group.
     * @param {ASTNode} candidate The next Property that might be in the group.
     * @returns {boolean} True if the candidate property is part of the group.
     */
    function continuesPropertyGroup(
      lastMember: AST.TOMLKeyValue,
      candidate: AST.TOMLKeyValue,
    ) {
      const groupEndLine = lastMember.loc.start.line;
      const candidateStartLine = candidate.loc.start.line;

      if (candidateStartLine - groupEndLine <= 1) {
        return true;
      }

      // Check that the first comment is adjacent to the end of the group, the
      // last comment is adjacent to the candidate property, and that successive
      // comments are adjacent to each other.
      const leadingComments = sourceCode.getCommentsBefore(candidate);

      if (
        leadingComments.length &&
        leadingComments[0].loc.start.line - groupEndLine <= 1 &&
        candidateStartLine - last(leadingComments).loc.end.line <= 1
      ) {
        for (let i = 1; i < leadingComments.length; i++) {
          if (
            leadingComments[i].loc.start.line -
              leadingComments[i - 1].loc.end.line >
            1
          ) {
            return false;
          }
        }
        return true;
      }

      return false;
    }

    /**
     * Creates groups of properties.
     * @param  {ASTNode} node ObjectExpression node being evaluated.
     * @returns {Array.<ASTNode[]>} Groups of property AST node lists.
     */
    function createGroups(
      node: AST.TOMLTopLevelTable | AST.TOMLTable | AST.TOMLInlineTable,
    ) {
      const body: (AST.TOMLKeyValue | AST.TOMLTable)[] = node.body;
      const pairs = body.filter(isKeyValueProperty);
      if (pairs.length === 1) {
        return [pairs];
      }

      return pairs.reduce(
        (groups, property) => {
          const currentGroup = last(groups);
          const prev = last(currentGroup);

          if (!prev || continuesPropertyGroup(prev, property)) {
            currentGroup.push(property);
          } else {
            groups.push([property]);
          }

          return groups;
        },
        [[]] as AST.TOMLKeyValue[][],
      );
    }

    /**
     * Verifies vertical alignment, taking into account groups of properties.
     * @param  {ASTNode} node ObjectExpression node being evaluated.
     * @returns {void}
     */
    function verifyAlignment(
      node: AST.TOMLTopLevelTable | AST.TOMLTable | AST.TOMLInlineTable,
    ) {
      createGroups(node).forEach((group) => {
        const properties = group;

        if (properties.length > 0 && isSingleLineProperties(properties)) {
          verifyListSpacing(properties, multiLineOptions);
        } else {
          verifyGroupAlignment(properties);
        }
      });
    }
  }

  /**
   * Define spacing rule visitor
   */
  function defineSpacingVisitor() {
    // Obey beforeEqual and afterEqual in each property as configured
    return {
      TOMLKeyValue(node: AST.TOMLKeyValue) {
        if (!isKeyValueProperty(node)) return;
        verifySpacing(
          node,
          isSingleLine(node.parent) ? singleLineOptions : multiLineOptions,
        );
      },
    };
  }
}
