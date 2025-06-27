import {
  ApplicationWorker,
  IntegrationQueue,
  IntegrationQueueJob,
} from '@lexamica/queues';
import { Inventory, PlainInventory } from '@lexamica/models';
import { Id, Logger } from '@lexamica/common';
import { Worker } from 'bullmq';
import { Disposable, inject, injectable } from 'tsyringe';
import { InventoryRepository } from '../database/inventory.repository';
import { match } from 'ts-pattern';

@injectable()
export class IntegrationWorker implements ApplicationWorker, Disposable {
  private _woker!: Worker<IntegrationQueueJob>;

  constructor(
    @inject(IntegrationQueue) private readonly _queue: IntegrationQueue,
    @inject(InventoryRepository)
    private readonly _repository: InventoryRepository,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public register(): void {
    this._queue.worker(async (job) =>
      match(job)
        .with({ type: 'add' }, (add) => this._add(add.requestId, add.data))
        .with({ type: 'remove' }, (remove) =>
          this._remove(remove.requestId, remove.id)
        )
        .exhaustive()
    );
  }

  dispose(): void {
    this._woker.close();
  }

  private _add(requestId: string, inventory: PlainInventory): void {
    this._logger.info(
      `${requestId} - Adding new Inventory to database for organization ${inventory.organizationId}`
    );
    const exist = this._repository.findByExternalId(inventory.externalId);

    if (exist.isSome()) {
      this._logger.info(
        `${requestId} - Inventory already exists - skipping - externalId: ${inventory.externalId}`
      );
      return;
    }

    this._repository.create(Inventory.from(inventory)).match({
      ok: (model) =>
        this._logger.info(
          `${requestId} - Inventory added to database - externalId: ${model.externalId}`
        ),
      err: (error) => {
        this._logger.error(
          `${requestId} - Error adding Inventory to database - externalId: ${inventory.externalId} - error: ${error.message}`
        );
        throw error;
      },
    });
  }

  private _remove(requestId: string, id: string): void {
    this._logger.info(
      `${requestId} - Removing new Inventory to database for external ${id}`
    );

    this._repository.removeByExternalId(Id.from(id).unwrap()).match({
      ok: () =>
        this._logger.info(
          `${requestId} - Inventory removed to database - externalId: ${id}`
        ),
      err: (error) => {
        this._logger.error(
          `${requestId} - Error removing Inventory to database - externalId: ${id} - error: ${error.message}`
        );
        throw error;
      },
    });
  }
}
