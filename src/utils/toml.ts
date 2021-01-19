import type { AST } from "toml-eslint-parser"

export function isKeyNode(node: AST.TOMLValue): node is AST.TOMLStringKey
export function isKeyNode(node: AST.TOMLBare): node is AST.TOMLBare
export function isKeyNode(
    node: AST.TOMLValue | AST.TOMLBare,
): node is AST.TOMLBare | AST.TOMLStringKey
/**
 * Check if the given node is key node.
 */
export function isKeyNode(
    node: AST.TOMLValue | AST.TOMLBare,
): node is AST.TOMLBare | AST.TOMLStringKey {
    if (node.type === "TOMLBare") {
        return true
    }
    if (node.type === "TOMLValue") {
        if (node.kind === "string" && !node.multiline) {
            if (node.parent.type === "TOMLKey") {
                return true
            }
        }
    }
    return false
}
