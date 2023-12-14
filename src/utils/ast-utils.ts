import type { TOMLToken } from "../types";
export const LINEBREAK_MATCHER = /\r\n|[\n\r\u2028\u2029]/u;
/**
 * Checks if the given token is a comment token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
export function isCommentToken(token: TOMLToken | null): boolean {
  return Boolean(token && token.type === "Block");
}

/**
 * Checks if the given token is a comma token or not.
 * @param token The token to check.
 * @returns `true` if the token is a comma token.
 */
export function isCommaToken(token: TOMLToken | null): token is TOMLToken {
  return token != null && token.value === "," && token.type === "Punctuator";
}
/**
 * Check whether the given token is a equal sign.
 * @param token The token to check.
 * @returns `true` if the token is a equal sign.
 */
export function isEqualSign(token: TOMLToken | null): token is TOMLToken {
  return token != null && token.type === "Punctuator" && token.value === "=";
}

/**
 * Checks if the given token is a closing parenthesis token or not.
 * @param token The token to check.
 * @returns `true` if the token is a closing parenthesis token.
 */
export function isClosingParenToken(
  token: TOMLToken | null,
): token is TOMLToken {
  return token != null && token.value === ")" && token.type === "Punctuator";
}
export const isNotClosingParenToken = negate(isClosingParenToken);

/**
 * Checks if the given token is a closing square bracket token or not.
 * @param token The token to check.
 * @returns `true` if the token is a closing square bracket token.
 */
export function isClosingBracketToken(
  token: TOMLToken | null,
): token is TOMLToken {
  return token != null && token.value === "]" && token.type === "Punctuator";
}

/**
 * Checks if the given token is a closing brace token or not.
 * @param token The token to check.
 * @returns `true` if the token is a closing brace token.
 */
export function isClosingBraceToken(
  token: TOMLToken | null,
): token is TOMLToken {
  return token != null && token.value === "}" && token.type === "Punctuator";
}

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param left The left token object.
 * @param right The right token object.
 * @returns Whether or not the tokens are on the same line.
 * @public
 */
export function isTokenOnSameLine(
  left: TOMLToken | null,
  right: TOMLToken | null,
): boolean {
  return left?.loc?.end.line === right?.loc?.start.line;
}

/**
 * Creates the negate function of the given function.
 * @param f The function to negate.
 * @returns Negated function.
 */
function negate<
  // eslint-disable-next-line @typescript-eslint/ban-types -- ignore
  T extends Function,
>(f: T): T {
  return ((token: unknown) => !f(token)) as unknown as T;
}
