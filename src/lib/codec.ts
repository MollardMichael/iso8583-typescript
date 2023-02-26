import codepage from 'codepage';

export type Codec<T = string> = {
  decode: (input: Buffer) => T;
  encode: (input: T) => Buffer;
};

export const HexCodec: Codec = {
  decode: function (input: Buffer): string {
    return input.toString('hex');
  },
  encode: function (input: string): Buffer {
    return Buffer.from(input, 'hex');
  },
};

export const ByteToNumberCodec: Codec<number> = {
  decode: function (input: Buffer): number {
    return Number.parseInt(input.toString('hex'), 16);
  },
  encode: function (input: number): Buffer {
    return Buffer.from(input.toString(16), 'hex');
  },
};

export const EBCDICCodec: Codec<string> = {
  decode: function (input: Buffer): string {
    return codepage.utils.decode(1047, input);
  },
  encode: function (input: string): Buffer {
    throw new Error('Not Implemented' + input);
  },
};
