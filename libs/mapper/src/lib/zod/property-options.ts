import z from 'zod/v4';
import { ok } from '@sapphire/result';
import { match, P } from 'ts-pattern';
import { DefaultValueProperty, RequiredProperty } from '../mapper';
import { ZodMapperBuilder } from './zod-mapper';

export class PropertyOptions implements ZodMapperBuilder {
  constructor(
    private readonly _property: RequiredProperty | DefaultValueProperty,
    private readonly _schema: z.ZodType
  ) {}

  public build(): z.ZodType {
    return ok(this._schema)
      .map((data) => this._required(data))
      .map((data) => this._defaultValue(data))
      .unwrap();
  }

  private _required(property: z.ZodType): z.ZodType {
    return match(this._property)
      .with({ required: true }, () => property.nullish())
      .otherwise(() => property);
  }

  private _defaultValue(property: z.ZodType): z.ZodType {
    return match(this._property)
      .with({ defaultValue: P.any }, (value) => {
        return property.default(value.defaultValue);
      })
      .otherwise(() => property);
  }
}
