import { expect, test } from 'vitest';
import { CustomIsoDefinition } from '../example/custom';
import { createNewMessage, parse, prepare, printMessage } from './message';

test('test works', () => {
  expect(true).toEqual(true);
});

test('We can parse a complete ISO message', () => {
  const buffer = Buffer.from(
    '0100f620440004e1a000000000420000000010f5f1f7f0f0f3a585a883d885f8f9f0f901000000000000010000000000010002231137454249893250010181d6d883d599d3a3f191d3c591a7f1e998f9c4f182a5c1a7e7d9f382a9c2e3848883a7e798e6a240404040404040404040404040f697d4c9f699c5a3e2a84040404040e4e20c03020206020011020112010009780978000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  );

  const parsed = parse(CustomIsoDefinition, buffer);
  expect(parsed.mti).toBe(100);
  expect(parsed.content).toEqual({
    '2': '517003veycQe8909', // cspell:disable-line
    '3': '010000',
    '4': 100,
    '6': 100,
    '7': '0223113745',
    '11': 424989,
    '18': 3250,
    '22': '0101',
    '38': 'aOQcNr',
    '41': 'Lt1jLEjx',
    '42': '1Zq9D1bvAxXR3bz',
    '43': 'BTdhcxXqWs             6pMI6rEtSy     US', // cspell:disable-line
    '48': '030202060200110201120100',
    '49': 978,
    '51': 978,
    '90': '000000000000000000000000000000000000000000',
    '95': '000000000000000000000000000000000000000000',
  });

  expect(printMessage(parsed)).toBe(
    `MTI -> 100
Bitmap ->
\tType -> Extended
\tFields Set -> 2, 3, 4, 6, 7, 11, 18, 22, 38, 41, 42, 43, 48, 49, 51, 90, 95
Fields ->
\tPAN: 517003veycQe8909` + // cspell:disable-line
      `\n\tType: 010000
\tAmount: 100
\tOriginal Amount: 100
\tTime: 0223113745
\tAudit: 424989
\tMCC: 3250
\tRead Type: 0101
\tAuthorization ID: aOQcNr
\tTerminal ID: Lt1jLEjx
\tPOS Owner ID: 1Zq9D1bvAxXR3bz
\tName & Address: BTdhcxXqWs             6pMI6rEtSy     US` + // cspell:disable-line
      `\n\tPayment Options: 030202060200110201120100
\tCurrency: 978
\tOriginal Currency: 978
\tOriginal Transaction Info: 000000000000000000000000000000000000000000
\tAmount Update: 000000000000000000000000000000000000000000`
  );
});

test('parsing and preparing should return the same data', () => {
  const buffer = Buffer.from(
    '0100f620440004e1a000000000420000000010f5f1f7f0f0f3a585a883d885f8f9f0f901000000000000010000000000010002231137454249893250010181d6d883d599d3a3f191d3c591a7f1e998f9c4f182a5c1a7e7d9f382a9c2e3848883a7e798e6a240404040404040404040404040f697d4c9f699c5a3e2a84040404040e4e20c03020206020011020112010009780978000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  );

  const parsed = parse(CustomIsoDefinition, buffer);
  const result = prepare(CustomIsoDefinition, parsed);
  expect(result).toEqual(buffer);
});

test('parsing and preparing should also work using object call', () => {
  const buffer = Buffer.from(
    '0100f620440004e1a000000000420000000010f5f1f7f0f0f3a585a883d885f8f9f0f901000000000000010000000000010002231137454249893250010181d6d883d599d3a3f191d3c591a7f1e998f9c4f182a5c1a7e7d9f382a9c2e3848883a7e798e6a240404040404040404040404040f697d4c9f699c5a3e2a84040404040e4e20c03020206020011020112010009780978000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  );

  const message = CustomIsoDefinition.parse(buffer);
  const result = CustomIsoDefinition.prepare(message);
  expect(result).toEqual(buffer);
});

// TODO Fix printing of the bitmap
test('we can edit a newly created message', () => {
  const message = createNewMessage(CustomIsoDefinition, 100);
  message.content[2] = '534271829301';
  expect(message.show()).toEqual(`MTI -> 100
Bitmap ->
\tType -> Simple
\tFields Set -> \nFields ->
\tPAN: 534271829301`);
});
