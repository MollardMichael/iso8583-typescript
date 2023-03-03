import { test, describe, expect } from 'vitest';
import {
  ANCodec,
  AsciiNumber,
  BinaryCodec,
  ByteToNumberCodec,
  EBCDICCodec,
  HexCodec,
} from './codec';

describe('Codecs', () => {
  [
    { codec: EBCDICCodec, input: 'String' },
    { codec: ByteToNumberCodec, input: 555 },
    { codec: ByteToNumberCodec, input: 55 },
    { codec: ByteToNumberCodec, input: 1 },
    { codec: HexCodec, input: 'af00cc' },
    { codec: HexCodec, input: '0f00cc' },
    { codec: ANCodec, input: 'Fire Bird' },
    { codec: ANCodec, input: 'Red Panda 123456' },
    { codec: BinaryCodec, input: 'Here 456é&é(' },
    { codec: AsciiNumber, input: NaN },
    { codec: AsciiNumber, input: 123456 },
  ].map(({ codec, input }: any) => {
    test(
      'should be able to encode and decode to get the initial input using ' +
        codec.name,
      () => {
        expect(codec.decode(codec.encode(input))).toBe(input);
      }
    );
  });
});
