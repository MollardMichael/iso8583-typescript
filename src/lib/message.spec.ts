import { expect, test } from 'vitest';
import { EBCDIC, HEX, LLVAR_EBCDIC, LLVAR_HEX } from './fields';
import { MessageDefinition, parse, printMessage } from './message';

test('test works', () => {
  expect(true).toEqual(true);
});

test('We can parse a complete ISO message', () => {
  const buffer = Buffer.from(
    '0100f620440004e1a000000000420000000010f5f1f7f0f0f3a585a883d885f8f9f0f901000000000000010000000000010002231137454249893250010181d6d883d599d3a3f191d3c591a7f1e998f9c4f182a5c1a7e7d9f382a9c2e3848883a7e798e6a240404040404040404040404040f697d4c9f699c5a3e2a84040404040e4e20c03020206020011020112010009780978000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  );

  const message: MessageDefinition = {
    allowedMTI: ['0100'],
    fields: {
      2: {
        name: 'PAN',
        field: LLVAR_EBCDIC,
      },
      3: {
        name: 'Type',
        field: HEX({ length: 3 }),
      },
      4: {
        name: 'Amount',
        field: HEX({ length: 6 }),
      },
      6: {
        name: 'Original Amount',
        field: HEX({ length: 6 }),
      },
      7: {
        name: 'Time',
        field: HEX({ length: 5 }),
      },
      11: {
        name: 'Audit',
        field: HEX({ length: 3 }),
      },
      12: {
        name: 'Local Hour',
        field: HEX({ length: 3 }),
      },
      13: {
        name: 'Local Date',
        field: HEX({ length: 2 }),
      },
      14: {
        name: 'Expiration Date',
        field: HEX({ length: 2 }),
      },
      15: {
        name: 'Value Date',
        field: HEX({ length: 2 }),
      },
      18: {
        name: 'MCC',
        field: HEX({ length: 2 }),
      },
      22: {
        name: 'Read Type',
        field: HEX({ length: 2 }),
      },
      25: {
        name: 'RUF',
        field: HEX({ length: 2 }),
      },
      38: {
        name: 'Authorization ID',
        field: EBCDIC({ length: 6 }),
      },
      39: {
        name: 'Response Code',
        field: EBCDIC({ length: 2 }),
      },
      41: {
        name: 'Terminal ID',
        field: EBCDIC({ length: 8 }),
      },
      42: {
        name: 'POS Owner ID',
        field: EBCDIC({ length: 15 }),
      },
      43: {
        name: 'Name & Address',
        field: EBCDIC({ length: 40 }),
      },
      48: {
        name: 'Payment Options',
        field: LLVAR_HEX,
      },
      49: {
        name: 'Currency',
        field: HEX({ length: 2 }),
      },
      51: {
        name: 'Original Currency',
        field: HEX({ length: 2 }),
      },
      90: {
        name: 'Original Transaction Information',
        field: HEX({ length: 21 }),
      },
      95: {
        name: 'Amount Update',
        field: HEX({ length: 21 }),
      },
    },
    mtiField: HEX({ length: 2 }),
  };

  const parsed = parse(message, buffer);
  expect(parsed.content).toEqual({
    '2': '517003veycQe8909', // cspell:disable-line
    '3': '010000',
    '4': '000000000100',
    '6': '000000000100',
    '7': '0223113745',
    '11': '424989',
    '18': '3250',
    '22': '0101',
    '38': 'aOQcNr',
    '41': 'Lt1jLEjx',
    '42': '1Zq9D1bvAxXR3bz',
    '43': 'BTdhcxXqWs             6pMI6rEtSy     US', // cspell:disable-line
    '48': '030202060200110201120100',
    '49': '0978',
    '51': '0978',
    '90': '000000000000000000000000000000000000000000',
    '95': '000000000000000000000000000000000000000000',
  });

  expect(printMessage(parsed)).toBe(
    `MTI -> 0100
Bitmap ->
\tType -> Extended
\tFields Set -> 2, 3, 4, 6, 7, 11, 18, 22, 38, 41, 42, 43, 48, 49, 51, 90, 95
Fields ->
\tPAN: 517003veycQe8909` + // cspell:disable-line
      `\n\tType: 010000
\tAmount: 000000000100
\tOriginal Amount: 000000000100
\tTime: 0223113745
\tAudit: 424989
\tMCC: 3250
\tRead Type: 0101
\tAuthorization ID: aOQcNr
\tTerminal ID: Lt1jLEjx
\tPOS Owner ID: 1Zq9D1bvAxXR3bz
\tName & Address: BTdhcxXqWs             6pMI6rEtSy     US` + // cspell:disable-line
      `\n\tPayment Options: 030202060200110201120100
\tCurrency: 0978
\tOriginal Currency: 0978
\tOriginal Transaction Information: 000000000000000000000000000000000000000000
\tAmount Update: 000000000000000000000000000000000000000000`
  );
});
