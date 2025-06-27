import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const ApplicationErrors = {
  NO_ORGANIZATION_FOUND: 'NO_ORGANIZATION_FOUND',
  MAPPER_NOT_FOUND: 'MAPPER_NOT_FOUND',
  INVALID_DELETE_QUERY: 'INVALID_DELETE_QUERY',
};

export function toIntegrationHttpError(value: string): number {
  return match(value)
    .with(
      ApplicationErrors.NO_ORGANIZATION_FOUND,
      () => HttpStatusCode.BadRequest
    )
    .with(ApplicationErrors.MAPPER_NOT_FOUND, () => HttpStatusCode.BadRequest)
    .with(
      ApplicationErrors.INVALID_DELETE_QUERY,
      () => HttpStatusCode.BadRequest
    )
    .otherwise(() => HttpStatusCode.InternalServerError);
}
