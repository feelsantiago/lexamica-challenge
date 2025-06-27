import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const ApplicationErrors = {
  INVENTORY_NOT_FOUND: 'INVENTORY_NOT_FOUND',
  INVALID_INVENTORY_DTO: 'INVALID_INVENTORY_DTO',
  NO_ORGANIZATION_FOUND: 'NO_ORGANIZATION_FOUND',
};

export function toInventoryHttpError(value: string): number {
  return match(value)
    .with(ApplicationErrors.INVENTORY_NOT_FOUND, () => HttpStatusCode.NotFound)
    .with(
      ApplicationErrors.NO_ORGANIZATION_FOUND,
      () => HttpStatusCode.BadRequest
    )
    .with(
      ApplicationErrors.INVALID_INVENTORY_DTO,
      () => HttpStatusCode.BadRequest
    )
    .otherwise(() => HttpStatusCode.InternalServerError);
}
