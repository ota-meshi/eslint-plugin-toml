// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types.ts";
import arrayBracketNewline from "../rules/array-bracket-newline.ts";
import arrayBracketSpacing from "../rules/array-bracket-spacing.ts";
import arrayElementNewline from "../rules/array-element-newline.ts";
import commaStyle from "../rules/comma-style.ts";
import indent from "../rules/indent.ts";
import inlineTableCurlySpacing from "../rules/inline-table-curly-spacing.ts";
import keySpacing from "../rules/key-spacing.ts";
import keysOrder from "../rules/keys-order.ts";
import noMixedTypeInArray from "../rules/no-mixed-type-in-array.ts";
import noNonDecimalInteger from "../rules/no-non-decimal-integer.ts";
import noSpaceDots from "../rules/no-space-dots.ts";
import noUnreadableNumberSeparator from "../rules/no-unreadable-number-separator.ts";
import paddingLineBetweenPairs from "../rules/padding-line-between-pairs.ts";
import paddingLineBetweenTables from "../rules/padding-line-between-tables.ts";
import precisionOfFractionalSeconds from "../rules/precision-of-fractional-seconds.ts";
import precisionOfInteger from "../rules/precision-of-integer.ts";
import quotedKeys from "../rules/quoted-keys.ts";
import spaceEqSign from "../rules/space-eq-sign.ts";
import spacedComment from "../rules/spaced-comment.ts";
import tableBracketSpacing from "../rules/table-bracket-spacing.ts";
import tablesOrder from "../rules/tables-order.ts";
import vueCustomBlockNoParsingError from "../rules/vue-custom-block/no-parsing-error.ts";

export const rules = [
  arrayBracketNewline,
  arrayBracketSpacing,
  arrayElementNewline,
  commaStyle,
  indent,
  inlineTableCurlySpacing,
  keySpacing,
  keysOrder,
  noMixedTypeInArray,
  noNonDecimalInteger,
  noSpaceDots,
  noUnreadableNumberSeparator,
  paddingLineBetweenPairs,
  paddingLineBetweenTables,
  precisionOfFractionalSeconds,
  precisionOfInteger,
  quotedKeys,
  spaceEqSign,
  spacedComment,
  tableBracketSpacing,
  tablesOrder,
  vueCustomBlockNoParsingError,
] as RuleModule[];
