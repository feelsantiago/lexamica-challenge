import { inject, injectable } from 'tsyringe';
import { ApplicationError, Id } from '@lexamica/common';
import { err, Result } from '@sapphire/result';
import { InventorySync } from '../integration/inventory.sync';
import { MapperRepository } from '../database/mapper.repository';
import { ApplicationErrors } from '../application-errors';

@injectable()
export class WebhooksController {
  constructor(
    @inject(InventorySync) private readonly _sync: InventorySync,
    @inject(MapperRepository)
    private readonly _mappers: MapperRepository
  ) {}

  public create(
    orgId: Id,
    dto: Record<string, unknown>,
    reqId: Id
  ): Result<void, ApplicationError> {
    const mappers = this._mappers.find(orgId);

    if (mappers.isNone()) {
      return err(
        ApplicationError.from(
          'Missing Mappers',
          ApplicationErrors.MAPPER_NOT_FOUND
        )
      );
    }

    return this._sync.create(mappers.unwrap(), dto, orgId, reqId);
  }

  public delete(externalId: Id, reqId: Id): Result<void, ApplicationError> {
    return this._sync.remove(externalId, reqId);
  }
}
