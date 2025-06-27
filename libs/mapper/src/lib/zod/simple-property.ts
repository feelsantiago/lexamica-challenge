import { match } from 'ts-pattern';
import z from 'zod/v4';
import { PropertySchema } from '../mapper';
import { ZodMapperBuilder } from './zod-mapper';

export class SimpleProperty implements ZodMapperBuilder {
  constructor(
    private readonly _key: string,
    private readonly _porperty: PropertySchema
  ) {}

  public build(): z.ZodType {
    const schema = match(this._porperty.type)
      .with('string', () => z.string())
      .with('number', () => z.number())
      .with('boolean', () => z.boolean())
      .otherwise(() => z.any());

    if (this._key) {
      return schema.transform((value) => ({ [this._key]: value }));
    }

    return schema;
  }
}
