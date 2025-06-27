import { ApplicationError, Id, Logger } from '@lexamica/common';
import { MapperSchema, ZodMapper } from '@lexamica/mapper';
import { Inventory, PlainInventory } from '@lexamica/models';
import { IntegrationQueue } from '@lexamica/queues';
import { err, ok, Result } from '@sapphire/result';
import { inject, injectable } from 'tsyringe';
import { ResponsePayload } from './integration.types';

@injectable()
export class InventorySync {
  constructor(
    @inject(IntegrationQueue) private readonly _integration: IntegrationQueue,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public create(
    mappings: MapperSchema,
    payload: ResponsePayload,
    organizationId: Id,
    requestId: Id
  ): Result<void, ApplicationError> {
    // TODO: Inject a factory
    const mapper = new ZodMapper<Record<string, unknown>, PlainInventory>(
      mappings
    );
    const items = Array.isArray(payload) ? payload : [payload];

    const results = items.map((item) =>
      mapper
        .parse(item)
        .inspect((inventory) => {
          this._logger.info(
            `${requestId.value} - Sending data - externalId ${inventory.externalId}`
          );
          const model = Inventory.create(organizationId, inventory);
          this._integration.add(model, requestId);
        })
        .inspectErr((error) => {
          this._logger.error(`${requestId.value} - Error while mapping data`);
          this._logger.applicationError(requestId, error);
        })
    );

    const errors = results.filter((item) => item.isErr());
    if (errors.length > 0) {
      this._logger.error(
        `${requestId.value} - Finishing process with some errors`
      );
      return err(
        ApplicationError.from(
          'Finishing process with some errors',
          'PoolingWorker',
          {
            errors: errors.map((error) => error.unwrapErr()),
            organization: organizationId.value,
          }
        )
      );
    }

    return ok();
  }

  public remove(externalId: Id, requestId: Id): Result<void, ApplicationError> {
    this._integration.remove(externalId, requestId);
    return ok();
  }
}
