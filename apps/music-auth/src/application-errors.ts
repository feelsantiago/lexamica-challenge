import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const ApplicationErrors = {
  PASSWORD_DOES_NOT_MATCH: 'PASSWORD_DOES_NOT_MATCH',
  UNABLE_TO_GENERATE_PASSWORD_HASH: 'UNABLE_TO_GENERATE_PASSWORD_HASH',
  UNABLE_TO_CREATE_USER: 'UNABLE_TO_CREATE_USER',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

export function toApplicationHttpError(error: string): number {
  return match(error)
    .with(
      ApplicationErrors.UNABLE_TO_GENERATE_PASSWORD_HASH,
      () => HttpStatusCode.InternalServerError
    )
    .with(
      ApplicationErrors.UNABLE_TO_CREATE_USER,
      () => HttpStatusCode.Conflict
    )
    .with(
      ApplicationErrors.PASSWORD_DOES_NOT_MATCH,
      () => HttpStatusCode.Unauthorized
    )
    .with(ApplicationErrors.UNAUTHORIZED, () => HttpStatusCode.Unauthorized)
    .otherwise(() => HttpStatusCode.InternalServerError);
}
