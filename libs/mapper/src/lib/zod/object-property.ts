import z from 'zod/v4';
import { ObjectPropertySchema, PropertyDefinition } from '../mapper';
import { ZodMapperBuilder } from './zod-mapper';
import { PropertyBuilder } from './property-builder';

export class ObjectProperty implements ZodMapperBuilder {
  constructor(
    private readonly _key: string,
    private readonly _property: PropertyDefinition<ObjectPropertySchema>
  ) {}

  public build(): z.ZodType {
    const keys = Object.keys(this._property.properties);
    const schema = z
      .object({
        ...keys.reduce((acc, key) => {
          const property = this._property.properties[key];
          const schema = new PropertyBuilder(key, property);
          return {
            ...acc,
            [property.source]: schema.build(),
          };
        }, {}),
      })
      .transform((data) =>
        Object.values<Record<string, unknown>>(data).reduce(
          (acc, value) => ({ ...acc, ...value }),
          {}
        )
      );

    if ('source' in this._property) {
      return schema.transform((data) => ({ [this._key]: data }));
    }

    return schema;
  }
}
