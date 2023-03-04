import type { FixedArray } from '../types/array';

export type Digit9 = Digit8 | 9;
export type Digit8 = Digit7 | 8;
export type Digit7 = Digit4 | 5 | 6 | 7;
export type Digit4 = Digit2 | 3 | 4;
export type Digit2 = Digit1 | 2;
export type Digit1 = 0 | 1;

export type HexDigit = Digit9 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

export type HexByte = `${HexDigit}${HexDigit}`;

export type Bitmap = FixedArray<HexByte, 8> | FixedArray<HexByte, 16>;

export const ExtendedBitmap: Bitmap = Array(16).fill('00') as FixedArray<HexByte, 16>;
export const SimpleBitmap: Bitmap = Array(8).fill('00') as FixedArray<HexByte, 8>;

const isExtended = (bitmap: Bitmap) => {
  return bitmap.length === 16;
};

export function isBitOn(byte: HexByte, index: Digit7) {
  return Boolean(Number.parseInt(byte, 16) & (1 << (7 - index)));
}

function setBit(buffer: Buffer, i: number, bit: number, value: number) {
  if (value == 0) {
    buffer[i] &= ~(1 << bit);
  } else {
    buffer[i] |= 1 << bit;
  }
}

export const readBitmap = (buffer: Buffer) => {
  if (isBitOn(buffer.toString('hex', 0, 1) as HexByte, 0)) {
    return {
      bitmap: buffer.toString('hex', 0, 16).match(/..?/g) as Bitmap,
      rest: buffer.subarray(16),
    };
  }

  return {
    bitmap: buffer.toString('hex', 0, 8).match(/..?/g) as Bitmap,
    rest: buffer.subarray(8),
  };
};

export const writeBitmap = (fields: number[]) => {
  const sorted = fields.sort((a, b) => a - b);
  const isExtended = (sorted.at(-1) || 0) > 64;
  const bitmap: Buffer = isExtended ? Buffer.alloc(16) : Buffer.alloc(8);

  if (isExtended) {
    setBit(bitmap, 0, 7, 1);
  }

  for (const field of sorted) {
    setBit(bitmap, Math.floor((field - 1) / 8), 7 - ((field - 1) % 8), 1);
  }

  return bitmap;
};

export const iterate = function* (bitmap: Bitmap) {
  const maxField = bitmap.length * 8;
  for (let field = 2; field <= maxField; field++) {
    // Example: Field 11 is the 11 bit in the bit map. It's thus part of the second Byte (11/8 > 1)
    // The first bit of the second byte if for field 9. By applying a modulo 8 we get
    // (8 * n) + x field -> x - 1 bit in byte (bit are zero indexed)
    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
    // 0 0 0 0 0 0 0 0 1 1  1  1  1  1  1  1  2  2
    // 0 1 2 3 4 5 6 7
    const byteContainingInfo = bitmap[Math.floor((field - 1) / 8)];
    const positionInByte = ((field - 1) % 8) as Digit7;
    if (isBitOn(byteContainingInfo, positionInByte)) {
      yield field;
    }
  }
};

export const printBitmap = (bitmap: Bitmap) => {
  return `Bitmap ->\n\tType -> ${isExtended(bitmap) ? 'Extended' : 'Simple'}\n\tFields Set -> ${Array.from(
    iterate(bitmap)
  ).join(', ')}`;
};
