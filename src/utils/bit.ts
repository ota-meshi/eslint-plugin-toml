export type MaxValues = {
  "+": string;
  "-": string; // Does not include a minus sign.
  "0x": string;
  "0o": string;
  "0b": string;
};
/**
 * Convert the given maxBit to max hex, octal, binary and decimal number strings
 *
 * *Export for testing.
 */
export function maxBitToMaxValues(maxBit: number): MaxValues {
  const binaryMax: number[] = [];
  const minusMax: number[] = [0];
  const plusMax: number[] = [0];
  const hexMax: number[] = [0];
  const octalMax: number[] = [0];
  for (let index = 0; index < maxBit; index++) {
    const binaryNum = index === 0 ? 1 : 0;
    binaryMax.push(binaryNum);

    processDigits(minusMax, binaryNum, 10);
    processDigits(hexMax, binaryNum, 16);
    processDigits(octalMax, binaryNum, 8);
    if (index > 0) {
      processDigits(plusMax, 1, 10);
    }
  }
  return {
    "+": plusMax.reverse().join(""),
    "-": minusMax.reverse().join(""),
    "0x": hexMax
      .map((i) => i.toString(16))
      .reverse()
      .join("")
      .toLowerCase(),
    "0o": octalMax.reverse().join(""),
    "0b": binaryMax.join(""),
  };

  /** Process digits */
  function processDigits(
    digits: number[],
    binaryNum: number,
    radix: 10 | 16 | 8,
  ) {
    let num = binaryNum;
    for (let place = 0; place < digits.length; place++) {
      num = digits[place] * 2 + num;
      digits[place] = num % radix;
      num = Math.floor(num / radix);
    }
    while (num > 0) {
      digits.push(num % radix);
      num = Math.floor(num / radix);
    }
  }
}
