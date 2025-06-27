import z from 'zod/v4';
import { match, P } from 'ts-pattern';
import {
  ArrayPropertySchema,
  ObjectPropertySchema,
  PropertyDefinition,
  PropertySchema,
  SimplePropertySchema,
} from '../mapper';
import { ObjectProperty } from './object-property';
import { SimpleProperty } from './simple-property';
import { ArrayProperty } from './array-property';
import { PropertyOptions } from './property-options';

export class PropertyBuilder {
  constructor(
    private readonly _key: string,
    private readonly _schema:
      | SimplePropertySchema
      | ArrayPropertySchema
      | ObjectPropertySchema
      | PropertySchema
  ) {}

  public build(): z.ZodType {
    const schema = match(this._schema)
      .with({ type: P.union('number', 'boolean', 'string') }, (schema) =>
        new SimpleProperty(this._key, schema as PropertySchema).build()
      )
      .with(
        { type: 'object' },
        (schema: PropertyDefinition<ObjectPropertySchema>) =>
          new ObjectProperty(this._key, schema).build()
      )
      .with(
        { type: 'array' },
        (schema: PropertyDefinition<ArrayPropertySchema>) =>
          new ArrayProperty(this._key, schema).build()
      )
      .exhaustive();

    if ('required' in this._schema || 'defaultValue' in this._schema) {
      return new PropertyOptions(this._schema, schema).build();
    }

    return schema;
  }
}
