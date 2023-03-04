import {
  BCD,
  BN,
  EBCDIC,
  HEX,
  LLLVAR_HEX,
  LLVAR_EBCDIC,
  LLVAR_HEX,
  Packed_HEX,
} from '../lib/fields';

import { createFieldDefinition } from './../lib/message';

export const CustomIsoDefinition = createFieldDefinition({
  fields: {
    '2': { name: 'PAN', field: LLVAR_EBCDIC },
    '3': { name: 'Type', field: Packed_HEX({ length: 6 }) },
    '4': { name: 'Amount', field: BCD({ length: 12 }) },
    '6': { name: 'Original Amount', field: BCD({ length: 12 }) },
    '7': { name: 'Time', field: Packed_HEX({ length: 10 }) },
    '11': { name: 'Audit', field: BCD({ length: 6 }) },
    '12': { name: 'Local Hour', field: Packed_HEX({ length: 6 }) },
    '13': { name: 'Local Date', field: Packed_HEX({ length: 4 }) },
    '14': { name: 'Expiration Date', field: Packed_HEX({ length: 4 }) },
    '15': { name: 'Value Date', field: Packed_HEX({ length: 4 }) },
    '18': { name: 'MCC', field: BCD({ length: 4 }) },
    '22': { name: 'Read Type', field: Packed_HEX({ length: 4 }) }, // TODO: Handle subfields
    '23': { name: 'PAN Sequence Number', field: BCD({ length: 3 }) },
    '25': { name: 'RUF', field: BCD({ length: 2 }) },
    '32': {
      name: 'Acquiring ID',
      field: Packed_HEX({ length: BN({ length: 1 }) }),
    },
    '37': { name: 'Retrieval Reference Number', field: EBCDIC({ length: 12 }) },
    '38': { name: 'Authorization ID', field: EBCDIC({ length: 6 }) },
    '39': { name: 'Response Code', field: EBCDIC({ length: 2 }) },
    '41': { name: 'Terminal ID', field: EBCDIC({ length: 8 }) },
    '42': { name: 'POS Owner ID', field: EBCDIC({ length: 15 }) },
    '43': { name: 'Name & Address', field: EBCDIC({ length: 40 }) }, // TODO: Handle subfields
    '44': { name: 'Additional Information', field: LLVAR_EBCDIC }, // TODO: Handle subfields
    '46': { name: 'Wallet Info', field: LLLVAR_HEX }, // TODO: Handle subfields
    '47': { name: 'Additional Information (National)', field: LLVAR_HEX }, // TODO: Handle subfields
    '48': { name: 'Payment Options', field: LLVAR_HEX }, // TODO: Handle subfields
    '49': { name: 'Currency', field: BCD({ length: 3 }) },
    '51': { name: 'Original Currency', field: BCD({ length: 3 }) },
    '53': { name: 'Security Information', field: LLVAR_HEX },
    '54': { name: 'Supplementary amount', field: EBCDIC({ length: 20 }) },
    '55': { name: 'RUF', field: LLVAR_HEX },
    '64': { name: 'MAC', field: HEX({ length: 8 }) },
    '90': {
      name: 'Original Transaction Info',
      field: Packed_HEX({ length: 42 }),
    }, // TODO: Handle subfields
    '95': { name: 'Amount Update', field: Packed_HEX({ length: 42 }) }, // TODO: Handle subfields
    '128': { name: 'MAC 2', field: Packed_HEX({ length: 8 }) },
  },
  mtiField: BCD({ length: 4 }),
});
