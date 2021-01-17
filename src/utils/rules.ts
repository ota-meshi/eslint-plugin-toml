import type { RuleModule } from "../types"
import arrayBracketSpacing from "../rules/array-bracket-spacing"
import inlineTableCurlySpacing from "../rules/inline-table-curly-spacing"
import noSpaceDots from "../rules/no-space-dots"
import quotedKeys from "../rules/quoted-keys"
import spacedComment from "../rules/spaced-comment"
import tableBracketSpacing from "../rules/table-bracket-spacing"
import vueCustomBlockNoParsingError from "../rules/vue-custom-block/no-parsing-error"

export const rules = [
    arrayBracketSpacing,
    inlineTableCurlySpacing,
    noSpaceDots,
    quotedKeys,
    spacedComment,
    tableBracketSpacing,
    vueCustomBlockNoParsingError,
] as RuleModule[]
