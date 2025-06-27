import { inject, injectable } from 'tsyringe';
import {
  ApplicationError,
  AuthUser,
  Jwt,
  JwtPayload,
  SignInDto,
} from '@lexamica/common';
import { User } from '@lexamica/models';
import { err, ok, Result } from '@sapphire/result';
import { ApplicationErrors } from '../application-errors';
import { UserRepository } from '../database/user.repository';
import { Config } from '../config/config';

@injectable()
export class AuthController {
  constructor(
    @inject(Jwt) private readonly _jwt: Jwt,
    @inject(UserRepository) private readonly _users: UserRepository,
    @inject(Config) private readonly _config: Config
  ) {}

  public validate(user: AuthUser): Result<AuthUser, ApplicationError> {
    return this._users.find(user.id).match({
      some: () => ok(user),
      none: () =>
        err(
          ApplicationError.from(
            'Unauthorized',
            ApplicationErrors.UNAUTHORIZED,
            { id: user.id, email: user.email }
          )
        ),
    });
  }

  public async signIn(
    dto: SignInDto
  ): Promise<Result<JwtPayload, ApplicationError>> {
    const user = this._users.findByEmail(dto.email);
    const model = user.unwrapOr(User.empty(this._config.password()));

    const authorized = await model.password.compare(dto.password);
    const unauthorized = ApplicationError.from(
      'Unauthorized',
      ApplicationErrors.UNAUTHORIZED,
      {
        email: dto.email,
      }
    );

    return authorized
      .andThen((result) => (result ? ok(model) : err(unauthorized)))
      .map((data) => new AuthUser(data.id, data.email))
      .map((auth) => this._jwt.sign(auth));
  }

  public async signUp(
    dto: SignInDto
  ): Promise<Result<JwtPayload, ApplicationError>> {
    const model = await User.create(dto.email, dto.password);
    return model
      .andThen((user) => this._users.create(user))
      .map((data: User) => new AuthUser(data.id, data.email))
      .map((auth: AuthUser) => this._jwt.sign(auth))
      .mapErr(
        (error) =>
          new ApplicationError(error, ApplicationErrors.UNABLE_TO_CREATE_USER)
      );
  }
}
