import { Result } from '@sapphire/result';
import { inject, injectable } from 'tsyringe';
import {
  AuthUser,
  ApplicationError,
  Http,
  AuthErros,
  Id,
} from '@lexamica/common';

@injectable()
export class Auth {
  private _baseUrl = 'http://localhost:3001';

  constructor(@inject(Http) private readonly _http: Http) {}

  public async validate(
    token: string,
    id: Id
  ): Promise<Result<AuthUser, ApplicationError>> {
    const result = await this._http.get<AuthUser>(
      `${this._baseUrl}/auth/validate`,
      {
        Authorization: token,
        'x-request-id': id.value,
      }
    );

    return result.mapErr(
      (error) => new ApplicationError(error, AuthErros.UNAUTHORIZED_USER)
    );
  }
}
