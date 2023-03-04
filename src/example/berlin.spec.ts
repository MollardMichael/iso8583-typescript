import { describe, expect, test } from 'vitest';
import { BerlinGroupIsoDefinition } from './berlin';

describe('Berlin ISO Format', () => {
  test('should extract the MTI', () => {
    const buffer = Buffer.from(
      '0100\x40\x00\x00\x00\x00\x00\x00\x0012474747474747',
      'ascii'
    );

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

  test('Write a full message from scratch', () => {
    const message = BerlinGroupIsoDefinition.createNewMessage(1814);
    message.content[2] = 12341234;
    message.content[3] = 1111;
    message.content[4] = 100;
    message.content[6] = 101;
    message.content[7] = '0808120000';
    message.content[10] = 100;
    message.content[11] = 0;
    message.content[12] = '740808120000';
    message.content[14] = '1010';
    message.content[22] = 'AAAAAAAAAAAA';
    message.content[23] = 0;
    message.content[24] = 1;
    message.content[25] = 90;
    message.content[26] = 4444;
    message.content[30] = 150;
    message.content[32] = 321321;
    message.content[35] = ';123123123=123?5';
    message.content[37] = '123 123';
    message.content[38] = '90';
    message.content[39] = 90;
    message.content[41] = 'TermLoc!';
    message.content[42] = 'ID Code!';
    message.content[43] = 'Card Acceptor Name Location';
    message.content[49] = 840;
    message.content[51] = 978;
    message.content[52] = '\x00\x01\x02\x03';
    message.content[53] = '\x07\x06\x05\x04';
    message.content[54] = 'No additional amount';
    message.content[55] = '\x07\x06\x05\x04';
    message.content[56] = 88888888888;
    message.content[59] = "I'm you're private data, data for money...";
    message.content[64] = '\xF0\xF0\xF0\xF0';

    expect(BerlinGroupIsoDefinition.prepare(message)).toBeDefined();
    const parsed = BerlinGroupIsoDefinition.parse(
      BerlinGroupIsoDefinition.prepare(message)
    );

    expect(message.mti).toEqual(parsed.mti);
    expect(message.content).toEqual(parsed.content);
  });
});
