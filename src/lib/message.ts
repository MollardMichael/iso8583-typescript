import type { MTI } from '../types/mti';

import {
  Bitmap,
  iterate,
  printBitmap,
  readBitmap,
  writeBitmap,
} from './bitmap';
import type { Field } from './fields';

export type Message = {
  definition: MessageDefinition;
  mti: MTI;
  bitmap: Bitmap;
  content: Record<number, string>;
};

export type MessageDefinition = {
  mtiField: Field<string>;
  fields: Record<
    number,
    {
      name: string;
      field: Field;
    }
  >;
};

export type Parse = (definition: MessageDefinition, iso: Buffer) => Message;
export type Prepare = (
  definition: MessageDefinition,
  message: Message
) => Buffer;
export type PrintMessage = (message: Message) => string;

type ExtractMTI = (
  definition: MessageDefinition,
  iso: Buffer
) => { rest: Buffer; value: MTI };

type ExtractFields = (
  message: MessageDefinition,
  bitmap: Bitmap,
  iso: Buffer
) => Message['content'];

export const printMessage: PrintMessage = (message) => {
  return `MTI -> ${message.mti}\n${printBitmap(
    message.bitmap
  )}\nFields ->\n\t${Object.entries(message.content)
    .map(
      ([field, value]) =>
        `${message.definition.fields[Number(field)].name}: ${value}`
    )
    .join('\n\t')}`;
};

export const parse: Parse = (definition, iso) => {
  const { value: mti, rest: withBitmap } = extractMTI(definition, iso);
  const { bitmap: bitmap, rest: fieldData } = readBitmap(withBitmap);
  const content = extractFields(definition, bitmap, fieldData);

  return {
    mti,
    bitmap,
    definition: definition,
    content,
  };
};

export const prepare: Prepare = (definition, message) => {
  const result = [];
  result.push(definition.mtiField.prepare(message.mti));
  result.push(writeBitmap(Object.keys(message.content).map(Number)));
  const orderedFields = Object.entries(message.content).sort(
    ([a], [b]) => Number(a) - Number(b)
  );
  const fieldBuffers = orderedFields.map(([field, value]) =>
    definition.fields[Number(field)].field.prepare(value)
  );
  return Buffer.concat(result.concat(fieldBuffers));
};

const extractMTI: ExtractMTI = (definition, iso) => {
  const result = definition.mtiField.parse(iso);

  return {
    value: result.value as MTI,
    rest: result.rest,
  };
};

const extractFields: ExtractFields = (messageDefinition, bitmap, iso) => {
  let rest = iso;
  const result: Record<number, string> = {};
  for (const field of iterate(bitmap)) {
    const definition = messageDefinition.fields[field];
    if (!definition) {
      console.log('field ', field, ', buffer ', rest);
      console.log('step', result);
      throw new Error('Encountered unknown field in bitmap');
    }

    const parsed = definition.field.parse(rest);
    rest = parsed.rest;
    result[field] = parsed.value;
  }

  return result;
};
