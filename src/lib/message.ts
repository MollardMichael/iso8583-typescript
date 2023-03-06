import { ParseFieldDefinition } from '../types/utils';

import { Bitmap, iterate, printBitmap, readBitmap, SimpleBitmap, writeBitmap } from './bitmap';
import { Field } from './fields';

/**
 * A `FieldDefinition` represents a definition of a set of fields,
 * where each field has a name and a {@link Field} object that can be used to encode/decode the value
 */
export type FieldDefinition = {
  [key: string]: {
    name: string;
    field: Field<string> | Field<number>;
  };
};

/**
 * A `Message` represents a ISO message once parsed,
 * consisting of a `MessageDefinition`, an MTI (Message Type Indicator),
 * a bitmap indicating which fields are present in the message,
 * a `content` object with the actual field values,
 * and a `show` method for displaying the message in a human-readable format.
 *
 * @template FD - The `FieldDefinition` for the message.
 */
export type Message<FD extends FieldDefinition> = {
  definition: MessageDefinition<FD>;
  mti: number;
  bitmap: Bitmap;
  content: Partial<ParseFieldDefinition<FD>>;
  show: () => string;
};

/**
 * A `MessageDefinition` represents the definition of a ISO message,
 * consisting of an MTI field (to handle the MTI) and a set of fields defined by a `FieldDefinition`.
 *
 * @template FD - The `FieldDefinition` for the message.
 */
export type MessageDefinition<FD extends FieldDefinition> = {
  mtiField: Field<number>;
  fields: FD;
};

/**
 * Create a string version of the message that can be displayed for human eyes to understand.
 *
 * @param message
 * @returns a string representation fo the message
 *
 * @example
 *
 * console.log(printMessage(message));
 */
export const printMessage = <FD extends FieldDefinition>(message: Omit<Message<FD>, 'show'>): string => {
  return `MTI -> ${message.mti}\n${printBitmap(message.bitmap)}\nFields ->\n\t${Object.entries(message.content)
    .map(([field, value]) => `${message.definition.fields[Number(field)].name}: ${value}`)
    .join('\n\t')}`;
};

/**
 * Create a new empty Message. You can then fill in the empty fields before calling {@link prepare}
 *
 * @param definition an object that will constrain the type of the fields that can be used.
 * @param mti the MTI to use for this message.
 * @returns an message with empty fields
 *
 * @example
 *
 * const message = createNewMessage(isoDefinition, mti);
 */
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

/**
 * Parse an ISO message according to the definition.
 *
 * @param definition an object that will constrain the type of the fields that can be used. It will be used while parsing the buffer
 * @param iso a buffer to the raw ISO message
 * @returns a message with all the field parsed
 *
 * @throws if the iso definition does not allow for the complete parsing of the ISO message
 *
 * @example
 *
 * const buffer = Buffer.from("0100ca......", "hex");
 * const message = parse(isoDefinition, buffer);
 *
 * // All the fields are parsed here
 * console.log(message.content)
 */
export const parse = <FD extends FieldDefinition>(definition: MessageDefinition<FD>, iso: Buffer): Message<FD> => {
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

/**
 * Prepare a message as a ISO buffer before sending it to the ISO capable server/client
 *
 * @param definition an object that will constrain the type of the fields that can be used. It will be used while preparing the buffer
 * @param message the message that we want to write in an ISO format
 * @returns a buffer to the ISO message
 *
 * @example
 *
 * const iso = Buffer.from("0100ca......", "hex");
 * const message = parse(isoDefinition, buffer);
 * message.content[2] = "576aze45623";
 * const newIso = prepare(isoDefinition, message);
 *
 */
export const prepare = <FD extends FieldDefinition>(
  definition: MessageDefinition<FD>,
  message: Message<FD>
): Buffer => {
  const result = [];
  result.push(definition.mtiField.prepare(message.mti));
  result.push(writeBitmap(Object.keys(message.content).map(Number)));
  const orderedFields = Object.entries(message.content).sort(([a], [b]) => Number(a) - Number(b));
  const fieldBuffers = orderedFields.map(
    ([field, value]) => definition.fields[field].field.prepare(value as never) // TODO FIX
  );
  return Buffer.concat(result.concat(fieldBuffers));
};

/**
 * Create a MessageDefinition object while coercing it's type
 *
 * @param messageDef an object that define the fields of the ISO message. It's type will be used as the base to type the result of this function and provide type safety
 * @returns a strongly typed message definition
 *
 * @example
 *
 * const IsoDefinition = createFieldDefinition({"2": {name: "PAN", field: AN({length: 19})}});
 */
export const createFieldDefinition = <FD extends FieldDefinition>(messageDef: MessageDefinition<FD>) => {
  return {
    ...messageDef,
    parse: (iso: Buffer) => parse(messageDef, iso),
    prepare: (message: Message<FD>) => prepare(messageDef, message),
    createNewMessage: (mti: number) => createNewMessage(messageDef, mti),
  };
};

const extractMTI = <FD extends FieldDefinition>(definition: MessageDefinition<FD>, iso: Buffer) => {
  const result = definition.mtiField.parse(iso);

  return {
    value: result.value,
    rest: result.rest,
  };
};

const extractFields = <FD extends FieldDefinition>(
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
