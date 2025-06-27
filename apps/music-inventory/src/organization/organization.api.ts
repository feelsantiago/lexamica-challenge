import { inject, injectable } from 'tsyringe';
import { ApplicationError, Http, Id } from '@lexamica/common';
import { Result } from '@sapphire/result';
import { Config } from '../config/config';
import { ApplicationErrors } from '../application-errors';

@injectable()
export class OrganizationApi {
  constructor(
    @inject(Http) private readonly _http: Http,
    @inject(Config) private readonly _config: Config
  ) {}

  public async find(
    id: Id,
    token: string,
    requestId: Id
  ): Promise<Result<Id, ApplicationError>> {
    const result = await this._http.get(
      `${this._config.organizationUrl()}/${id.value}`,
      {
        Authorization: token,
        'x-request-id': requestId.value,
      }
    );

    return result
      .map(() => id)
      .mapErr((err) => {
        return ApplicationError.from(
          'No organization found',
          ApplicationErrors.NO_ORGANIZATION_FOUND,
          {
            http: err,
          }
        );
      });
  }
}
