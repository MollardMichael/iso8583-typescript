import codepage from 'codepage';

export type Codec<T = string> = {
  name: string;
  decode: (input: Buffer) => T;
  encode: (input: T) => Buffer;
};

export const HexCodec: Codec = {
  name: 'HexCodec',
  decode: function (input: Buffer): string {
    return input.toString('hex');
  },
  encode: function (input: string): Buffer {
    return Buffer.from(input, 'hex');
  },
};

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

export const EBCDICCodec: Codec<string> = {
  name: 'EBCDICCodec',
  decode: function (input: Buffer): string {
    return codepage.utils.decode(1047, input);
  },
  encode: function (input: string): Buffer {
    return codepage.utils.encode(1047, input, 'buf') as Buffer;
  },
};
