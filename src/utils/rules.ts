import type { RuleModule } from "../types"
import arrayBracketNewline from "../rules/array-bracket-newline"
import arrayBracketSpacing from "../rules/array-bracket-spacing"
import arrayElementNewline from "../rules/array-element-newline"
import inlineTableCurlySpacing from "../rules/inline-table-curly-spacing"
import keysOrder from "../rules/keys-order"
import noSpaceDots from "../rules/no-space-dots"
import noUnreadableNumberSeparator from "../rules/no-unreadable-number-separator"
import paddingLineBetweenPairs from "../rules/padding-line-between-pairs"
import paddingLineBetweenTables from "../rules/padding-line-between-tables"
import precisionOfFractionalSeconds from "../rules/precision-of-fractional-seconds"
import quotedKeys from "../rules/quoted-keys"
import spaceEqSign from "../rules/space-eq-sign"
import spacedComment from "../rules/spaced-comment"
import tableBracketSpacing from "../rules/table-bracket-spacing"
import tablesOrder from "../rules/tables-order"
import vueCustomBlockNoParsingError from "../rules/vue-custom-block/no-parsing-error"

export const rules = [
    arrayBracketNewline,
    arrayBracketSpacing,
    arrayElementNewline,
    inlineTableCurlySpacing,
    keysOrder,
    noSpaceDots,
    noUnreadableNumberSeparator,
    paddingLineBetweenPairs,
    paddingLineBetweenTables,
    precisionOfFractionalSeconds,
    quotedKeys,
    spaceEqSign,
    spacedComment,
    tableBracketSpacing,
    tablesOrder,
    vueCustomBlockNoParsingError,
] as RuleModule[]
