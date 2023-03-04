import { ParseFieldDefinition } from '../types/utils';

import {
  Bitmap,
  iterate,
  printBitmap,
  readBitmap,
  SimpleBitmap,
  writeBitmap,
} from './bitmap';
import { Field } from './fields';

export type FieldDefinition = {
  [key: string]: {
    name: string;
    field: Field<string> | Field<number>;
  };
};

export type Message<FD extends FieldDefinition> = {
  definition: MessageDefinition<FD>;
  mti: number;
  bitmap: Bitmap;
  content: Partial<ParseFieldDefinition<FD>>;
  show: () => string;
};

export type MessageDefinition<FD extends FieldDefinition> = {
  mtiField: Field<number>;
  fields: FD;
};

export type Parse = <FD extends FieldDefinition>(
  definition: MessageDefinition<FD>,
  iso: Buffer
) => Message<FD>;

export type Prepare = <FD extends FieldDefinition>(
  definition: MessageDefinition<FD>,
  message: Message<FD>
) => Buffer;

type ExtractMTI = <FD extends FieldDefinition>(
  definition: MessageDefinition<FD>,
  iso: Buffer
) => { rest: Buffer; value: number };

type ExtractFields = <FD extends FieldDefinition>(
  message: MessageDefinition<FD>,
  bitmap: Bitmap,
  iso: Buffer
) => ParseFieldDefinition<FD>;

export const printMessage = <FD extends FieldDefinition>(
  message: Omit<Message<FD>, 'show'>
): string => {
  return `MTI -> ${message.mti}\n${printBitmap(
    message.bitmap
  )}\nFields ->\n\t${Object.entries(message.content)
    .map(
      ([field, value]) =>
        `${message.definition.fields[Number(field)].name}: ${value}`
    )
    .join('\n\t')}`;
};

export const createNewMessage = <FD extends FieldDefinition>(
  definition: MessageDefinition<FD>,
  mti: number
): Message<FD> => {
  const messageContent = {
    mti,
    bitmap: SimpleBitmap,
    definition,
    content: {},
  };

  return { ...messageContent, show: () => printMessage(messageContent) };
};

export const parse: Parse = (definition, iso) => {
  const { value: mti, rest: withBitmap } = extractMTI(definition, iso);
  const { bitmap: bitmap, rest: fieldData } = readBitmap(withBitmap);
  const content = extractFields(definition, bitmap, fieldData);

  const messageContent = {
    mti,
    bitmap,
    definition,
    content,
  };

  return {
    ...messageContent,
    show: () => printMessage(messageContent),
  };
};

export const prepare: Prepare = (definition, message) => {
  const result = [];
  result.push(definition.mtiField.prepare(message.mti));
  result.push(writeBitmap(Object.keys(message.content).map(Number)));
  const orderedFields = Object.entries(message.content).sort(
    ([a], [b]) => Number(a) - Number(b)
  );
  const fieldBuffers = orderedFields.map(
    ([field, value]) => definition.fields[field].field.prepare(value as never) // TODO FIX
  );
  return Buffer.concat(result.concat(fieldBuffers));
};

const extractMTI: ExtractMTI = (definition, iso) => {
  const result = definition.mtiField.parse(iso);

  return {
    value: result.value,
    rest: result.rest,
  };
};

const extractFields: ExtractFields = <FD extends FieldDefinition>(
  messageDefinition: MessageDefinition<FD>,
  bitmap: Bitmap,
  iso: Buffer
) => {
  let rest = iso;
  const result: { [x: string]: string | number } = {};
  for (const field of iterate(bitmap)) {
    const definition = messageDefinition.fields[field];
    if (!definition) {
      console.error(printBitmap(bitmap));
      console.error('field ', field, ', buffer ', rest);
      console.error('step', result);
      throw new Error('Encountered unknown field in bitmap');
    }

    const parsed = definition.field.parse(rest);
    rest = parsed.rest;
    result[field.toString()] = parsed.value;
  }

  return result as ParseFieldDefinition<FD>;
};

export const createFieldDefinition = <FD extends FieldDefinition>(
  messageDef: MessageDefinition<FD>
) => {
  return {
    ...messageDef,
    parse: (iso: Buffer) => parse(messageDef, iso),
    prepare: (message: Message<FD>) => prepare(messageDef, message),
    createNewMessage: (mti: number) => createNewMessage(messageDef, mti),
  };
};
