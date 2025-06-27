import { Disposable, inject, injectable } from 'tsyringe';
import {
  ApplicationWorker,
  InventoryQueue,
  InventoryQueueJob,
} from '@lexamica/queues';
import { PlainInventory } from '@lexamica/models';
import { Worker } from 'bullmq';
import { match } from 'ts-pattern';
import { Logger } from '@lexamica/common';
import { OutputQueue } from './output.queue';
import { OutputRepository } from '../database/output.repository';

@injectable()
export class InventoryWorker implements ApplicationWorker, Disposable {
  private _worker!: Worker<InventoryQueueJob>;

  constructor(
    @inject(InventoryQueue) private readonly _queue: InventoryQueue,
    @inject(OutputQueue) private readonly _output: OutputQueue,
    @inject(OutputRepository) private readonly _repository: OutputRepository,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public register(): void {
    this._worker = this._queue.worker(async (data) => {
      match(data)
        .with({ type: 'add' }, ({ data: inventory, requestId }) =>
          this._add(inventory, requestId)
        )
        .with({ type: 'remove' }, ({ inventory, requestId }) =>
          this._remove(inventory, requestId)
        );
    });

    this._worker.resume();
  }

  public dispose(): void {
    this._worker.close();
  }

  private _add(inventory: PlainInventory, requestId: string): void {
    this._logger.info(
      `${requestId} - Sending new inventory ${inventory.id} to external webhooks`
    );
    const webhooks = this._repository.find('output', 'POST');
    webhooks.forEach((webhook) => {
      this._output.add({
        id: inventory.organizationId,
        weebhook: webhook,
        inventory,
        requestId,
      });
    });
  }

  private _remove(inventory: PlainInventory, requestId: string): void {
    this._logger.info(
      `${requestId} - Sending deleted inventory ${inventory.id} to exernal webhooks`
    );
    const webhooks = this._repository.find('output', 'DELETE');
    webhooks.forEach((webhook) => {
      this._output.add({
        id: inventory.organizationId,
        weebhook: webhook,
        inventory,
        requestId,
      });
    });
  }
}
