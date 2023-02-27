import { test, describe, expect } from 'vitest';
import { ByteToNumberCodec, EBCDICCodec, HexCodec } from './codec';

describe('Codecs', () => {
  [
    { codec: EBCDICCodec, input: 'String' },
    { codec: ByteToNumberCodec, input: 555 },
    { codec: ByteToNumberCodec, input: 55 },
    { codec: ByteToNumberCodec, input: 1 },
    { codec: HexCodec, input: 'af00cc' },
    { codec: HexCodec, input: '0f00cc' },
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
