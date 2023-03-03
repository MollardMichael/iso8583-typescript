import {
  AN,
  B,
  LLLLVAR_B,
  LLLVAR_AN,
  LLLVAR_B,
  LLVAR_AN,
  LLVAR_B,
  LLVAR_N,
  N,
} from '../lib/fields';

import { createFieldDefinition } from './../lib/message';

/*
  Example implementation of the Berlin Group ISO 8583 Protocol -> https://www.berlin-group.org/_files/ugd/c2914b_389fa9f9863d4fd2b17b6494d62560de.pdf

  In this example, sub fields are not parsed

  **This implementation has never been tested in production**
*/
export const BerlinGroupIsoDefinition = createFieldDefinition({
  fields: {
    '2': { name: 'PAN', field: LLVAR_N },
    '3': { name: 'Processing Code', field: N({ length: 6 }) },
    '4': { name: 'Amount, Transaction', field: N({ length: 12 }) },
    '6': { name: 'Amount, Billing', field: N({ length: 12 }) },
    '7': { name: 'Date and Time, Transmission', field: AN({ length: 10 }) },
    '10': {
      name: 'Conversion Rate, Cardholder Billing',
      field: N({ length: 8 }),
    },
    '11': { name: 'System Trace Audit Number (STAN)', field: N({ length: 6 }) },
    '12': {
      name: 'Date and Time, Local Transaction',
      field: AN({ length: 12 }),
    },
    '14': { name: 'Date, Expiration', field: AN({ length: 4 }) },
    '22': { name: 'POS Data Code', field: AN({ length: 12 }) },
    '23': { name: 'Card Sequence Number', field: N({ length: 3 }) },
    '24': { name: 'Function Code', field: N({ length: 3 }) },
    '25': { name: 'Message Reason Code', field: N({ length: 4 }) },
    '26': { name: 'Card Acceptor Business Code', field: N({ length: 4 }) },
    '30': { name: 'Amounts, Original ', field: N({ length: 24 }) },
    '32': {
      name: 'Acquiring Institution Identification Code',
      field: LLVAR_N,
    },
    '35': { name: 'Track 2 Data ', field: LLVAR_AN },
    '37': { name: 'Retrieval Reference Number', field: AN({ length: 12 }) },
    '38': { name: 'Approval Code', field: AN({ length: 6 }) },
    '39': { name: 'Action Code', field: N({ length: 3 }) },
    '41': {
      name: 'Card Acceptor Terminal Identification',
      field: AN({ length: 8 }),
    },
    '42': {
      name: 'Card Acceptor Identification Code',
      field: AN({ length: 15 }),
    },
    '43': { name: 'Card Acceptor Name/Location', field: LLVAR_AN },
    '48': { name: 'Additional Data - Private', field: LLLVAR_AN },
    '49': { name: 'Currency Code, Transaction', field: N({ length: 3 }) },
    '51': {
      name: 'Currency Code, Cardholder Billing',
      field: N({ length: 3 }),
    },
    '52': {
      name: 'Personal Identification Number (PIN) Data',
      field: B({ length: 8 }),
    },
    '53': { name: 'Security Related Control Information', field: LLVAR_B },
    '54': { name: 'Amounts, Additional', field: LLLVAR_AN },
    '55': {
      name: 'Integrated Circuit Card (ICC) System Related Data',
      field: LLLVAR_B,
    },
    '56': { name: 'Original Data Elements', field: LLVAR_N },
    '57': { name: 'Authorization Life Cycle Code', field: N({ length: 3 }) },
    '58': {
      name: 'Authorizing Agent Institution Identification Code',
      field: LLVAR_N,
    },
    '59': {
      name: 'Acquirer Reference Data (Transport Data) ',
      field: LLLVAR_AN,
    },
    '62': { name: 'e-Payment Data', field: LLLVAR_AN },
    '64': {
      name: 'Message Authentication Code (MAC) Field',
      field: B({ length: 8 }),
    },
    '95': { name: 'Card Issuer Reference Data', field: LLVAR_AN },
    '111': { name: 'Encryption Data', field: LLLLVAR_B },
    '128': {
      name: 'Message Authentication Code (MAC) Field',
      field: B({ length: 8 }),
    },
  },
  mtiField: N({ length: 4 }),
});
