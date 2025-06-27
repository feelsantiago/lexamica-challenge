import { match } from 'ts-pattern';
import z from 'zod/v4';
import {
  ArrayPropertySchema,
  ObjectPropertySchema,
  PropertyDefinition,
  SimplePropertySchema,
} from '../mapper';
import { ZodMapperBuilder } from './zod-mapper';
import { PropertyBuilder } from './property-builder';

export class ArrayProperty implements ZodMapperBuilder {
  constructor(
    private readonly _key: string,
    private readonly _property: PropertyDefinition<ArrayPropertySchema>
  ) {}

  public build(): z.ZodType {
    const schema = match(this._property.items)
      .with(
        { type: 'object' },
        (items: ObjectPropertySchema) =>
          new PropertyBuilder(this._property.source, items)
      )
      .otherwise(
        (items: SimplePropertySchema) => new PropertyBuilder('', items)
      );

    return z.array(schema.build()).transform((data) => ({ [this._key]: data }));
  }
}
