import { z } from 'zod/v4';
import { err, Result } from '@sapphire/result';
import { Email } from '../../domain/email';
import { ApplicationError } from '../../domain/application-error';
import { AuthErros } from '../auth-errors';
import { Password } from '../../domain/password';

export class SignInDto {
  public static readonly schema$ = z.object({
    email: Email.schema$,
    password: Password.schema$,
  });

  private constructor(
    public readonly email: Email,
    public readonly password: Password
  ) {}

  public static from(
    body: Record<string, unknown>
  ): Result<SignInDto, ApplicationError> {
    return Result.from(() => SignInDto.schema$.parse(body))
      .map((value) => {
        const email = Email.from(value.email);
        const password = Password.from(value.password);
        return new SignInDto(email.unwrap(), password.unwrap());
      })
      .mapErrInto((error) => {
        return err(
          ApplicationError.from(
            'Invalid email and/or password',
            AuthErros.INVALID_SIGN_IN_DATA,
            {
              zod: error,
              data: body,
              info: z.treeifyError(error as z.ZodError),
            }
          )
        );
      });
  }
}
