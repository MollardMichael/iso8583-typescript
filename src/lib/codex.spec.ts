import { test, describe, expect } from 'vitest';
import { ANCodec, AsciiNumber, BCDNumberCodec, BinaryCodec, ByteToNumberCodec, EBCDICCodec, HexCodec } from './codec';

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
    { codec: BCDNumberCodec, input: 100 },
  ].map(({ codec, input }: any) => {
    test('should be able to encode and decode to get the initial input using ' + codec.name, () => {
      expect(codec.decode(codec.encode(input))).toBe(input);
    });
  });

  describe('Packed', () => {
    test('should be able to parse MTI', () => {
      expect(BCDNumberCodec.decode(Buffer.from('\x01\x00'))).toEqual(100);
      expect(BCDNumberCodec.encode(100)).toEqual(Buffer.from('\x01\x00'));
    });
  });
});
