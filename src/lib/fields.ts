import { ByteToNumberCodec, Codec, EBCDICCodec, HexCodec } from './codec';

export type FieldOption = {
  length: number | Field<number>;
};

export type Field<T> = {
  parse: (iso: Buffer) => { value: T; rest: Buffer };
  prepare: (value: T) => Buffer;
};

export type FieldFactory<T = string> = (options: FieldOption) => Field<T>;

const Base: <T>(codec: Codec<T>) => FieldFactory<T> = (codec) => (options) => ({
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
    }

    result.push(raw);
    return Buffer.concat(result);
  },
});

export const HEX: FieldFactory<string> = Base(HexCodec);

export const BN: FieldFactory<number> = Base(ByteToNumberCodec);

export const EBCDIC: FieldFactory<string> = Base(EBCDICCodec);

export const LLVAR_EBCDIC = EBCDIC({ length: BN({ length: 1 }) });

export const LLVAR_HEX = HEX({ length: BN({ length: 1 }) });

function isField(input: number | Field<number>): input is Field<number> {
  return typeof input !== 'number';
}
