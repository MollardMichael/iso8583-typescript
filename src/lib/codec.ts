import codepage from 'codepage';

/**
 * A codec defines a bi-directional mapping between a binary representation (in the form of a Buffer)
 * and a logical representation (in some other type). The codec is responsible for encoding instances
 * of the logical type to Buffers, and decoding Buffers to instances of the logical type.
 *
 * @template T The logical type of the codec
 */
export type Codec<T = string> = {
  /** The name of the codec */
  name: string;
  /** Decode a binary representation into an instance of the logical type */
  decode: (input: Buffer) => T;
  /** Encode an instance of the logical type into a binary representation */
  encode: (input: T) => Buffer;
};

/**
 * A codec that can encode and decode hexadecimal strings
 */
export const HexCodec: Codec = {
  name: 'HexCodec',
  decode: function (input: Buffer): string {
    return input.toString('hex');
  },
  encode: function (input: string): Buffer {
    return Buffer.from(input, 'hex');
  },
};

/**
 * A codec that can encode and decode ASCII strings with trailing spaces trimmed
 */
export const ANCodec: Codec = {
  name: 'ANCodec',
  decode: function (input: Buffer): string {
    return input.toString('ascii').trim();
  },
  encode: function (input: string): Buffer {
    return Buffer.from(input, 'ascii');
  },
};

/**
 * A codec that can encode and decode binary strings
 */
export const BinaryCodec: Codec<string> = {
  name: 'ByteToNumberCodec',
  decode: function (input: Buffer): string {
    // eslint-disable-next-line no-control-regex
    return input.toString('binary').replace(/\x00*$/, '');
  },
  encode: function (input: string): Buffer {
    return Buffer.from(input, 'binary');
  },
};

/**
 * A codec that can encode and decode numbers encoded as hexadecimal strings
 */
export const ByteToNumberCodec: Codec<number> = {
  name: 'ByteToNumberCodec',
  decode: function (input: Buffer): number {
    return Number.parseInt(input.toString('hex'), 16);
  },
  encode: function (input: number): Buffer {
    let hex = input.toString(16);
    if (hex.length % 2 === 1) hex = '0' + hex;
    return Buffer.from(hex, 'hex');
  },
};

/**
 * A codec that can encode and decode numbers encoded as BCD (binary-coded decimal) strings
 */
export const BCDNumberCodec: Codec<number> = {
  name: 'ByteToNumberCodec',
  decode: function (input: Buffer): number {
    return Number.parseInt(input.toString('hex'));
  },
  encode: function (input: number): Buffer {
    let hex = input.toString();
    if (hex.length % 2 === 1) hex = '0' + hex;
    return Buffer.from(hex, 'hex');
  },
};

/**
 * A codec that can encode and decode numbers encoded as ASCII strings
 */
export const AsciiNumber: Codec<number> = {
  name: 'ByteToNumberCodec',
  decode: function (input: Buffer): number {
    return Number.parseInt(input.toString(), 10);
  },
  encode: function (input: number): Buffer {
    return Buffer.from(input.toString());
  },
};

/**
 * A codec that can encode and decode EBCDIC-encoded strings
 */
export const EBCDICCodec: Codec<string> = {
  name: 'EBCDICCodec',
  decode: function (input: Buffer): string {
    return codepage.utils.decode(1047, input);
  },
  encode: function (input: string): Buffer {
    return codepage.utils.encode(1047, input, 'buf') as Buffer;
  },
};
