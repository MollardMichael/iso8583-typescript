export type { FixedArray, GrowToSize } from './types/array';
export type { ParseFieldDefinition, ExtractGeneric } from './types/utils';

export {
  createFieldDefinition,
  createNewMessage,
  parse,
  prepare,
  printMessage,
  Message,
  MessageDefinition,
  FieldDefinition,
} from './lib/message';
