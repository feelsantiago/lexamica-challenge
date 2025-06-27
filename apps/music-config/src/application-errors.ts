import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const ApplicationErrors = {
  INVALID_ORGANIZATION_DTO: 'INVALID_ORGANIZATION_DTO',
  ORGANIZATION_NOT_FOUND: 'ORGANIZATION_NOT_FOUND',
};

export function toOrganizationHttpError(value: string): number {
  return match(value)
    .with(
      ApplicationErrors.INVALID_ORGANIZATION_DTO,
      () => HttpStatusCode.BadRequest
    )
    .with(
      ApplicationErrors.ORGANIZATION_NOT_FOUND,
      () => HttpStatusCode.NotFound
    )
    .otherwise(() => HttpStatusCode.InternalServerError);
}
