import { err, Result } from '@sapphire/result';
import bcrypt from 'bcrypt';
import { ApplicationError } from './application-error';
import { Password } from './password';

export class HashPassword {
  constructor(public readonly value: string) {}

  public static async from(
    password: Password
  ): Promise<Result<HashPassword, ApplicationError>> {
    const salt = await Result.fromAsync<string, Error>(() =>
      bcrypt.genSalt(10)
    );

    if (salt.isErr()) {
      return err(
        new ApplicationError(
          salt.unwrapErr(),
          'Unalbe to generate password salt'
        )
      );
    }

    const hash = await Result.fromAsync<string, Error>(() =>
      bcrypt.hash(password.value, salt.unwrap())
    );

    return hash
      .map((value) => new HashPassword(value))
      .mapErrInto((error) =>
        err(new ApplicationError(error, 'Unable to hash password'))
      );
  }

  public async compare(
    password: Password
  ): Promise<Result<boolean, ApplicationError>> {
    const result = await Result.fromAsync<boolean, Error>(() =>
      bcrypt.compare(password.value, this.value)
    );

    return result.mapErr(
      (error) => new ApplicationError(error, 'Unable to compare password')
    );
  }
}
