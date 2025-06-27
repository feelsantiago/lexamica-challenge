import { err, Result } from '@sapphire/result';
import { z } from 'zod/v4';
import { ApplicationError } from '../../domain/application-error';
import { AuthErros } from '../auth-errors';
import { JwtPayload } from './jwt-payload';
import { Email } from '../../domain/email';

export class AuthUser {
  public static readonly schema$ = z.object({
    id: z.string(),
    email: Email.schema$,
  });

  public constructor(
    public readonly id: string,
    public readonly email: Email
  ) {}

  public static from(
    id: string,
    email: string
  ): Result<AuthUser, ApplicationError> {
    const _email = Email.from(email);
    return _email
      .map((value) => new AuthUser(id, value))
      .mapErr(
        (error) => new ApplicationError(error, AuthErros.INVALID_AUTH_USER)
      );
  }

  public static authenticate(
    jwt: JwtPayload
  ): Result<AuthUser, ApplicationError> {
    return Result.from(() => AuthUser.schema$.parse(jwt))
      .map((value) => new AuthUser(value.id, Email.from(value.email).unwrap()))
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Invalid Jwt Payload',
            AuthErros.INVALID_AUTH_USER,
            {
              zod: error,
              data: jwt,
              info: z.treeifyError(error as z.ZodError),
            }
          )
        )
      );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email.value,
    };
  }
}
