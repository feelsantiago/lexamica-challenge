import { err, Result } from '@sapphire/result';
import validator from 'validator';
import { z } from 'zod/v4';
import { ApplicationError } from './application-error';

export class Password {
  public static readonly schema$ = z
    .string()
    .min(8)
    .transform((password) => validator.escape(password));

  private constructor(public readonly value: string) {}

  public static from(value: string): Result<Password, ApplicationError> {
    return Result.from(() => Password.schema$.parse(value))
      .map((value) => new Password(value))
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Invalid password',
            'Unable to parser password',
            {
              zod: error,
              info: z.treeifyError(error as z.ZodError),
            }
          )
        )
      );
  }
}
