import type { MTI } from '../types/mti';

import { Bitmap, iterate, printBitmap, readBitmap } from './bitmap';
import type { Field } from './fields';

type ExtractMTI = (
  definition: MessageDefinition,
  iso: Buffer
) => { rest: Buffer; value: MTI };

type ExtractFields = (
  message: MessageDefinition,
  bitmap: Bitmap,
  iso: Buffer
) => Message['content'];

export type Parse = (definition: MessageDefinition, iso: Buffer) => Message;
export type PrintMessage = (message: Message) => string;

export type Message = {
  definition: MessageDefinition;
  mti: MTI;
  bitmap: Bitmap;
  content: Record<number, unknown>;
};

export type MessageDefinition = {
  allowedMTI: MTI[];
  mtiField: Field<string>;
  fields: Record<
    number,
    {
      name: string;
      field: Field;
    }
  >;
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

export const extractMTI: ExtractMTI = (message, iso) => {
  const result = message.mtiField.parse(iso);
  if (!message.allowedMTI.includes(result.value as MTI)) {
    throw new Error('Could not parse MTI correctly');
  }
  return {
    value: result.value as MTI,
    rest: result.rest,
  };
};

export const extractFields: ExtractFields = (
  messageDefinition,
  bitmap,
  iso
) => {
  let rest = iso;
  const result: Record<number, unknown> = {};
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
