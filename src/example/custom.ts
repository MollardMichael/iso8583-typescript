import { EBCDIC, HEX, LLVAR_EBCDIC, LLVAR_HEX } from '../lib/fields';
import { MessageDefinition } from '../lib/message';

export const customDefinition: MessageDefinition = {
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
