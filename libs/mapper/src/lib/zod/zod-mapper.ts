import z from 'zod/v4';
import { err, Result } from '@sapphire/result';
import { ApplicationError } from '@lexamica/common';
import { Mapper, MapperSchema } from '../mapper';
import { RootProperty } from './root-property';

export interface ZodMapperBuilder {
  build(): z.ZodType;
}

export class ZodMapper<T = Record<string, unknown>, K = Record<string, unknown>>
  implements Mapper<T, K>
{
  constructor(private readonly schema: MapperSchema) {}

  public parse(data: T): Result<K, ApplicationError> {
    return Result.from<z.ZodType, Error>(() =>
      new RootProperty(this.schema).build()
    )
      .mapErr(
        (error) =>
          new ApplicationError(error, 'Building Zod Mapper', {
            schema: this.schema,
          })
      )
      .andThen((schema) => Result.from(schema.parse(data)))
      .mapErrInto((error) => {
        return err(
          ApplicationError.from('Data is invalid', 'ZodMapper Error', {
            zod: error,
            data,
            info: z.treeifyError(error as z.ZodError),
          })
        );
      });
  }
}
