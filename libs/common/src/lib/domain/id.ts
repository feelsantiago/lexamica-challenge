import { err, Result } from '@sapphire/result';
import z from 'zod/v4';
import uuid from 'node-uuid';
import { ApplicationError } from './application-error';

export class Id {
  public static readonly schema$ = z.uuid();

  private constructor(public readonly value: string) {}

  public static from(value: string): Result<Id, ApplicationError> {
    return Result.from(() => Id.schema$.parse(value))
      .map((value) => new Id(value))
      .mapErrInto((error) =>
        err(
          ApplicationError.from('Invalid id', 'Unable to parser id', {
            zod: error,
            id: value,
            info: z.treeifyError(error as z.ZodError),
          })
        )
      );
  }

  public static generate(): Id {
    return new Id(uuid.v4());
  }
}
