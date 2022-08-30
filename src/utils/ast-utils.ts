import type { TOMLToken } from "../types";

/**
 * Checks if the given token is a comment token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
export function isCommentToken(token: TOMLToken | null): boolean {
  return Boolean(token && token.type === "Block");
}

/**
 * Check whether the given token is a equal sign.
 * @param token The token to check.
 * @returns `true` if the token is a equal sign.
 */
export function isEqualSign(token: TOMLToken | null): token is TOMLToken {
  return token != null && token.type === "Punctuator" && token.value === "=";
}
