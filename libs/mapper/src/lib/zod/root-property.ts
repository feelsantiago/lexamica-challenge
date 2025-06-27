import z from 'zod/v4';
import { MapperSchema, PropertySchema } from '../mapper';
import { ZodMapperBuilder } from './zod-mapper';
import { ObjectProperty } from './object-property';
import { match, P } from 'ts-pattern';

export class RootProperty implements ZodMapperBuilder {
  constructor(private readonly _schema: MapperSchema) {}

  public build(): z.ZodType {
    const root: PropertySchema = {
      type: 'object',
      source: 'root',
      required: true,
      properties: this._schema,
    };

    return new ObjectProperty('root', root).build().transform((data) =>
      match(data)
        .with({ root: P.any }, (value) => value.root)
        .otherwise(() => data)
    );
  }
}
