import z from 'zod/v4';
import validator from 'validator';
import { err, Result } from '@sapphire/result';
import { ApplicationError } from './application-error';

export class Email {
  public static readonly schema$ = z
    .email()
    .transform((value) => validator.escape(value));

  private constructor(public readonly value: string) {}

  public static from(value: string): Result<Email, ApplicationError> {
    return Result.from(() => Email.schema$.parse(value))
      .map((value) => new Email(value))
      .mapErrInto((error) =>
        err(
          ApplicationError.from('Invalid email', 'Unable to parser email', {
            zod: error,
            email: value,
            info: z.treeifyError(error as z.ZodError),
          })
        )
      );
  }
}
