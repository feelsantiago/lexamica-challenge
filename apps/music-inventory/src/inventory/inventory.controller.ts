import { inject, injectable } from 'tsyringe';
import { err, ok, Result } from '@sapphire/result';
import { ApplicationError, Id } from '@lexamica/common';
import { Inventory } from '@lexamica/models';
import { InventoryQueue } from '@lexamica/queues';
import { InventoryRepository } from '../database/inventory.repository';
import { ApplicationErrors } from '../application-errors';
import { InventoryDto } from './domain/inventory.dto';

@injectable()
export class InventoryController {
  constructor(
    @inject(InventoryRepository)
    private readonly _repository: InventoryRepository,
    @inject(InventoryQueue) private readonly _queue: InventoryQueue
  ) {}

  public create(
    organizationId: Id,
    inventory: InventoryDto,
    requestId: Id
  ): Result<Inventory, ApplicationError> {
    const model = Inventory.create(organizationId, {
      ...inventory,
      organizationId: organizationId.value,
    });
    return this._repository
      .create(model)
      .inspect((data) => this._queue.add(data, requestId));
  }

  public find(id: Id): Result<Inventory, ApplicationError> {
    const model = this._repository.find(id);
    return model.match({
      some: (inventory) => ok(inventory),
      none: () =>
        err(
          ApplicationError.from(
            'Inventory not found',
            ApplicationErrors.INVENTORY_NOT_FOUND,
            {
              id,
            }
          )
        ),
    });
  }

  public findByOrganization(id: Id): Inventory[] {
    return this._repository.findByOrganization(id);
  }

  public findAll(): Inventory[] {
    return this._repository.findAll();
  }

  public delete(id: Id, requestId: Id): Result<Inventory, ApplicationError> {
    return this._repository
      .remove(id)
      .inspect((inventory) => this._queue.remove(inventory, requestId));
  }
}
