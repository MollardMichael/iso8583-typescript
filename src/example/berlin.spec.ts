import { describe, expect, test } from 'vitest';
import { BerlinGroupIsoDefinition } from './berlin';

describe('Berlin ISO Format', () => {
  test('should extract the MTI', () => {
    const buffer = Buffer.from(
      '0100\x40\x00\x00\x00\x00\x00\x00\x0012474747474747',
      'ascii'
    );
    console.log(buffer);

    const message = BerlinGroupIsoDefinition.parse(buffer);

    expect(message.mti).toEqual(100);
  });

  test('should extract the PAN', () => {
    const buffer = Buffer.from(
      '0100\x40\x00\x00\x00\x00\x00\x00\x0012474747474747',
      'ascii'
    );

    const message = BerlinGroupIsoDefinition.parse(buffer);

    expect(message.content[2]).toEqual(474747474747);
  });
});
