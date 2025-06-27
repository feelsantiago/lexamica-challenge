import axios from 'axios';
import { inject, injectable } from 'tsyringe';
import { Headers, HttpProvider, HttpResponse } from './http-types';
import { err, Result } from '@sapphire/result';
import { ApplicationError } from '../domain/application-error';

@injectable()
export class Http {
  constructor(@inject(HttpProvider) private readonly _http: HttpProvider) {}

  public async get<T>(
    url: string,
    headers?: Headers
  ): Promise<Result<T, ApplicationError>> {
    const request = await Result.fromAsync<HttpResponse<T>, Error>(() =>
      this._http.get<T>(url, { headers })
    );

    return request
      .map((response) => response.data)
      .mapErrInto((error) =>
        err(new ApplicationError(error, `[HTTP][GET] - ${url}`, { url }))
      );
  }

  public async post<T, K = unknown>(
    url: string,
    data: K,
    headers?: Headers
  ): Promise<Result<T, ApplicationError>> {
    const request = await Result.fromAsync<HttpResponse<T>, Error>(() =>
      axios.post<T>(url, data, { headers })
    );

    return request
      .map((response) => response.data)
      .mapErrInto((error) =>
        err(new ApplicationError(error, `[HTTP][POST] - ${url}`, { url, data }))
      );
  }

  public async delete<T>(
    url: string,
    headers?: Headers
  ): Promise<Result<T, ApplicationError>> {
    const request = await Result.fromAsync<HttpResponse<T>, Error>(() =>
      axios.delete<T>(url, { headers })
    );

    return request
      .map((response) => response.data)
      .mapErrInto((error) =>
        err(new ApplicationError(error, `[HTTP][POST] - ${url}`, { url }))
      );
  }
}
