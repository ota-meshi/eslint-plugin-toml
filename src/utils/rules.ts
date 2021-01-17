import type { RuleModule } from "../types"
import noSpaceDots from "../rules/no-space-dots"
import quotedKeys from "../rules/quoted-keys"
import spacedComment from "../rules/spaced-comment"
import vueCustomBlockNoParsingError from "../rules/vue-custom-block/no-parsing-error"

export const rules = [
    noSpaceDots,
    quotedKeys,
    spacedComment,
    vueCustomBlockNoParsingError,
] as RuleModule[]
