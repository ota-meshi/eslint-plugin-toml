import type { TOMLToken } from "../types"

/**
 * Checks if the given token is a comment token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
export function isCommentToken(token: TOMLToken | null): boolean {
    return Boolean(token && token.type === "Block")
}
/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {Object} left The left token object.
 * @param {Object} right The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 * @public
 */
export function isTokenOnSameLine(left: TOMLToken, right: TOMLToken): boolean {
    return left.loc.end.line === right.loc.start.line
}

/**
 * Check whether the given token is a equal sign.
 * @param token The token to check.
 * @returns `true` if the token is a equal sign.
 */
export function isEqualSign(token: TOMLToken | null): token is TOMLToken {
    return token != null && token.type === "Punctuator" && token.value === "="
}

/**
 * Check whether the given token is a comma.
 * @param token The token to check.
 * @returns `true` if the token is a comma.
 */
export function isComma(token: TOMLToken | null): token is TOMLToken {
    return token != null && token.type === "Punctuator" && token.value === ","
}
