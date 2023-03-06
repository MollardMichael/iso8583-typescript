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

/**
 * Identity function that does nothing
 *
 * @param x value
 * @returns the same value unmodified
 */
const identity = <T>(x: T): T => x;

/**
 * FieldOption represents the configuration options for a field.
 */
export type FieldOption = {
  length: number | Field<number>;
};

/**
 * Field represents a single field in a message, which has a parser and a preparation function.
 */
export type Field<T> = {
  /**
   * Parses the given ISO buffer and returns the field value along with the remaining buffer.
   * @param iso The ISO buffer to parse.
   * @returns An object containing the field value and the remaining buffer after parsing.
   */
  parse: (iso: Buffer) => { value: T; rest: Buffer };

  /**
   * Prepares the given value and returns the resulting buffer.
   * @param value The value to prepare.
   * @returns The prepared buffer.
   */
  prepare: (value: T) => Buffer;
};

/**
 * FieldFactory represents a factory function that creates a Field instance for the given type.
 * @template T The type of value that the created field handles.
 * @param options The configuration options for the field.
 * @returns A Field instance that handles values of type T.
 */
export type FieldFactory<T = string> = (options: FieldOption) => Field<T>;

/**
 * Creates a field factory for fields that store packed values (i.e., where the
 * value is stored in half-bytes instead of full bytes).
 *
 * @param codec The codec used to encode/decode the value.
 * @param padding A function used to pad the encoded value if necessary.
 * @returns A field factory function that creates fields with the specified
 * codec and padding function.
 */
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

/**
 * Base function for creating field factories that parse and prepare binary data with a given codec.
 *
 * @template T The type of the field's value.
 * @param {Codec<T>} codec A codec for encoding and decoding binary data to and from values of type T.
 * @param {(x: Buffer, length: number) => Buffer} [padding=identity] A function for padding binary data to a given length.
 * @returns {FieldFactory<T>} A factory for creating fields that parse and prepare binary data with the given codec.
 */
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

/**
 * Pads a Buffer with zeros on the left until the length is equal to the specified length.
 * If the value's length is greater than the specified length, returns the original value.
 *
 * @param value The value to be padded with zeros
 * @param length The desired length of the padded value
 * @returns A new Buffer that is the original value padded with zeros
 */
export const PadLeftZero = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([Buffer.from(''.padEnd(padLength, '0')), value]);
};

/**
 * Pads a Buffer with null characters on the left until the length is equal to the specified length.
 * If the value's length is greater than the specified length, returns the original value.
 *
 * @param value The value to be padded with null characters
 * @param length The desired length of the padded value
 * @returns A new Buffer that is the original value padded with null characters
 */
export const PadLeftNull = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([Buffer.from(''.padEnd(padLength, '\x00')), value]);
};

/**
 * Pads a Buffer with spaces on the right until the length is equal to the specified length.
 * If the value's length is greater than the specified length, returns the original value.
 *
 * @param value The value to be padded with spaces
 * @param length The desired length of the padded value
 * @returns A new Buffer that is the original value padded with spaces
 */
export const PadRightSpace = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([value, Buffer.from(''.padEnd(padLength, ' '))]);
};

/**
 * Pads a Buffer with null characters on the right until the length is equal to the specified length.
 * If the value's length is greater than the specified length, returns the original value.
 *
 * @param value The value to be padded with null characters
 * @param length The desired length of the padded value
 * @returns A new Buffer that is the original value padded with null characters
 */
export const PadRightNull = (value: Buffer, length: number) => {
  const padLength = length - value.length;
  return Buffer.concat([value, Buffer.from(''.padEnd(padLength, '\x00'))]);
};

/**
 * Hex String (Raw value)
 */
export const HEX: FieldFactory<string> = Base(HexCodec);

/**
 * Hex Number
 *
 * Padded on the left with null bytes
 */
export const BN: FieldFactory<number> = Base(ByteToNumberCodec, PadLeftNull);

/**
 * Binary Data
 *
 * Padded on the right with null bytes
 */
export const B: FieldFactory<string> = Base(BinaryCodec, PadRightNull);

/**
 * Packed Hex String (Raw value)
 */
export const Packed_HEX: FieldFactory<string> = BasePacked(HexCodec);

/**
 * Packed Number
 *
 * hex  -> number
 * 0101 -> 101
 *
 * Padded on the left with null bytes
 */
export const BCD: FieldFactory<number> = BasePacked(BCDNumberCodec, PadLeftNull);

/**
 * Numeric
 *
 * Padded on the left with zeros
 */
export const N: FieldFactory<number> = Base(AsciiNumber, PadLeftZero);

/**
 * String encoded in EBCDIC
 */
export const EBCDIC: FieldFactory<string> = Base(EBCDICCodec);

/**
 * String encoded in ascii
 *
 * Padded on the right with spaces
 */
export const AN: FieldFactory<string> = Base(ANCodec, PadRightSpace);

/**
 * 2-bytes Variable Length Numeric
 */
export const LLVAR_N = N({ length: N({ length: 2 }) });

/**
 * 2-bytes Variable Length AlphaNumeric
 */
export const LLVAR_AN = AN({ length: N({ length: 2 }) });

/**
 * 2-bytes Variable Length Binary Data
 */
export const LLVAR_B = B({ length: N({ length: 2 }) });

/**
 * 1-bytes Variable Length String encoded in EBCDIC
 */
export const LLVAR_EBCDIC = EBCDIC({ length: BN({ length: 1 }) });

/**
 * 1-bytes Variable Length Hex string (Raw Value)
 */
export const LLVAR_HEX = HEX({ length: BN({ length: 1 }) });

/**
 * 3-bytes Variable Length AlphaNumeric
 */
export const LLLVAR_AN = AN({ length: N({ length: 3 }) });

/**
 * 3-bytes Variable Length Binary Data
 */
export const LLLVAR_B = B({ length: N({ length: 3 }) });

/**
 * 3-bytes Variable Length Binary Data
 */
export const LLLLVAR_B = B({ length: N({ length: 4 }) });

/**
 * 2-bytes Variable Length Hex string (Raw Value)
 */
export const LLLVAR_HEX = HEX({ length: BN({ length: 2 }) });

function isField(input: number | Field<number>): input is Field<number> {
  return typeof input !== 'number';
}
