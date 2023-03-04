import {
  ANCodec,
  AsciiNumber,
  BCDNumberCodec,
  BinaryCodec,
  ByteToNumberCodec,
  Codec,
  EBCDICCodec,
  HexCodec,
} from './codec';

const identity = <T>(x: T): T => x;

export type FieldOption = {
  length: number | Field<number>;
};

export type Field<T> = {
  parse: (iso: Buffer) => { value: T; rest: Buffer };
  prepare: (value: T) => Buffer;
};

export type FieldFactory<T = string> = (options: FieldOption) => Field<T>;

export const BasePacked: <T>(codec: Codec<T>, padding?: (x: Buffer, length: number) => Buffer) => FieldFactory<T> =
  (codec, padding = identity) =>
  (options) => ({
    parse: (iso) => {
      let length = options.length;
      let raw = iso;
      if (isField(length)) {
        const result = length.parse(raw);
        length = result.value;
        raw = result.rest;
      }

      length = Math.ceil(length / 2);
      const data = codec.decode(raw.subarray(0, length));
      return { value: data, rest: raw.subarray(length) };
    },
    prepare(value) {
      const result = [];
      const raw = codec.encode(value);

      if (isField(options.length)) {
        const length = options.length.prepare(raw.length * 2);
        result.push(length);
        result.push(raw);
      } else {
        result.push(padding(raw, Math.ceil(options.length / 2)));
      }

      return Buffer.concat(result);
    },
  });

export const Base: <T>(codec: Codec<T>, padding?: (x: Buffer, length: number) => Buffer) => FieldFactory<T> =
  (codec, padding = identity) =>
  (options) => ({
    parse: (iso) => {
      let length = options.length;
      let raw = iso;
      if (isField(length)) {
        const result = length.parse(raw);
        length = result.value;
        raw = result.rest;
      }

      const data = codec.decode(raw.subarray(0, length));
      return { value: data, rest: raw.subarray(length) };
    },
    prepare(value) {
      const result = [];
      const raw = codec.encode(value);

      if (isField(options.length)) {
        const length = options.length.prepare(raw.length);
        result.push(length);
        result.push(raw);
      } else {
        result.push(padding(raw, options.length));
      }

      return Buffer.concat(result);
    },
  });

export const PadLeftZero = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([Buffer.from(''.padEnd(padLength, '0')), value]);
};

export const PadLeftNull = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([Buffer.from(''.padEnd(padLength, '\x00')), value]);
};

export const PadRightSpace = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([value, Buffer.from(''.padEnd(padLength, ' '))]);
};

export const PadRightNull = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([value, Buffer.from(''.padEnd(padLength, '\x00'))]);
};

/**
 * Hex String (Raw value)
 */
export const HEX: FieldFactory<string> = Base(HexCodec);

export const BN: FieldFactory<number> = Base(ByteToNumberCodec, PadLeftNull);

export const B: FieldFactory<string> = Base(BinaryCodec, PadRightNull);

export const Packed_HEX: FieldFactory<string> = BasePacked(HexCodec);

export const BCD: FieldFactory<number> = BasePacked(BCDNumberCodec, PadLeftNull);

/**
 * Numeric with leading 0s
 */
export const N: FieldFactory<number> = Base(AsciiNumber, PadLeftZero);

/**
 * String encoded in EBCDIC
 */
export const EBCDIC: FieldFactory<string> = Base(EBCDICCodec);

/**
 * String encoded in ascii
 */
export const AN: FieldFactory<string> = Base(ANCodec, PadRightSpace);

/**
 * Variable Length Numeric
 */
export const LLVAR_N = N({ length: N({ length: 2 }) });

/**
 * 2 bytes Variable Length AlphaNumeric
 */
export const LLVAR_AN = AN({ length: N({ length: 2 }) });

/**
 * 2 bytes Variable Length Binary Data
 */
export const LLVAR_B = B({ length: N({ length: 2 }) });

/**
 * Variable Length String encoded in EBCDIC
 */
export const LLVAR_EBCDIC = EBCDIC({ length: BN({ length: 1 }) });

/**
 * Variable Length Hex string (Raw Value)
 */
export const LLVAR_HEX = HEX({ length: BN({ length: 1 }) });

/**
 * 3 bytes Variable Length AlphaNumeric
 */
export const LLLVAR_AN = AN({ length: N({ length: 3 }) });

/**
 * 3 bytes Variable Length Binary Data
 */
export const LLLVAR_B = B({ length: N({ length: 3 }) });

/**
 * 3 bytes Variable Length Binary Data
 */
export const LLLLVAR_B = B({ length: N({ length: 4 }) });

/**
 * Variable Length Hex string (Raw Value)
 */
export const LLLVAR_HEX = HEX({ length: BN({ length: 2 }) });

function isField(input: number | Field<number>): input is Field<number> {
  return typeof input !== 'number';
}
