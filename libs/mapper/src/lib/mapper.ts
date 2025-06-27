import { Result } from '@sapphire/result';
import { ApplicationError } from '@lexamica/common';

export type PropertyType = 'string' | 'number' | 'object' | 'array' | 'boolean';

export interface SourceProperty {
  source: string;
}

export interface DefaultValueProperty {
  defaultValue?: unknown;
}

export interface RequiredProperty {
  required: boolean;
}

export interface SimplePropertySchema {
  type: PropertyType;
}

export interface ObjectPropertySchema {
  type: 'object';
  properties: Record<string, PropertySchema>;
}

export interface ArrayPropertySchema {
  type: 'array';
  items: SimplePropertySchema | ObjectPropertySchema;
}

export type PropertyDefinition<T> = T &
  SourceProperty &
  RequiredProperty &
  DefaultValueProperty;

export type PropertySchema =
  | PropertyDefinition<SimplePropertySchema>
  | PropertyDefinition<ObjectPropertySchema>
  | PropertyDefinition<ArrayPropertySchema>;

export type MapperSchema = Record<string, PropertySchema>;

export interface Mapper<
  TInput = Record<string, unknown>,
  TOutput = Record<string, unknown>
> {
  parse(data: TInput): Result<TOutput, ApplicationError>;
}
