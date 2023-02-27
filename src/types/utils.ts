import { Field } from '../lib/fields';
import { FieldDefinition } from '../lib/message';

export type ExtractGeneric<Type> = Type extends Field<infer X> ? X : never;
export type ParseFieldDefinition<FD extends FieldDefinition> = {
  [K in keyof FD]: ExtractGeneric<FD[K]['field']>;
};
