import { Digit7, HexByte } from './bitmap';
import { expect, test } from 'vitest';
import { isBitOn, readBitmap, printBitmap, iterate, writeBitmap } from './bitmap';

test('we are able to parse buffer byte by byte and check the bits', () => {
  const buffer = Buffer.from('7010001102C04804', 'hex');
  const bit = '0111000000010000000000000001000100000010110000000100100000000100';
  for (let i = 0; i < 8; i++) {
    const int = buffer.toString('hex', i, i + 1) as HexByte;
    for (let j = 0; j < 8; j++) {
      expect(isBitOn(int, j as Digit7)).toEqual(Boolean(Number(bit[i * 8 + j])));
    }
  }

  expect(true).toEqual(true);
});

test('we can parse a simple bitmap', () => {
  const buffer = Buffer.from('7010001102C04804FFFFFFFFFFFFFFFF', 'hex');
  const { bitmap, rest } = readBitmap(buffer);

  expect(bitmap.length).toBe(8);
  expect(bitmap).toStrictEqual(['70', '10', '00', '11', '02', 'c0', '48', '04']);
  expect(rest).toEqual(Buffer.from('FFFFFFFFFFFFFFFF', 'hex'));
});

test('we can parse an extended bitmap', () => {
  const buffer = Buffer.from('8010001102C04804FFFFFFFFFFFFFFFF', 'hex');
  const { bitmap, rest } = readBitmap(buffer);

  expect(bitmap.length).toBe(16);
  expect(bitmap).toStrictEqual([
    '80',
    '10',
    '00',
    '11',
    '02',
    'c0',
    '48',
    '04',
    'ff',
    'ff',
    'ff',
    'ff',
    'ff',
    'ff',
    'ff',
    'ff',
  ]);
  expect(rest).toEqual(Buffer.from('', 'hex'));
});

test('we can print it for easy debugging', () => {
  const buffer = Buffer.from('7010001102C04804FFFFFFFFFFFFFFFF', 'hex');
  const { bitmap } = readBitmap(buffer);

  expect(printBitmap(bitmap)).toEqual(`Bitmap ->
\tType -> Simple
\tFields Set -> 2, 3, 4, 12, 28, 32, 39, 41, 42, 50, 53, 62`);
});

test('we can read and write the same bitmap', () => {
  const buffer = Buffer.from('7010001102C04804', 'hex');
  const { bitmap } = readBitmap(buffer);
  const fields = Array.from(iterate(bitmap));
  const result = writeBitmap(fields);
  expect(result).toEqual(buffer);
});
