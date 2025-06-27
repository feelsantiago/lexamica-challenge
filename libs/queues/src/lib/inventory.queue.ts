import { inject, singleton } from 'tsyringe';
import { Queue, Worker } from 'bullmq';
import { Inventory } from '@lexamica/models';
import { Id } from '@lexamica/common';
import {
  InventoryQueueJob,
  QueueConnection,
  QueueOptions,
} from './queue.types';

@singleton()
export class InventoryQueue {
  public readonly name = 'inventory-queue';

  private readonly _queue: Queue<InventoryQueueJob>;

  constructor(
    @inject(QueueConnection) private readonly _connection: QueueConnection
  ) {
    this._queue = new Queue(this.name, {
      connection: this._connection,
    });
  }

  public add(inventory: Inventory, requestId: Id): void {
    this._queue.add(
      'inventory',
      {
        type: 'add',
        data: inventory.toJSON(),
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public remove(inventory: Inventory, requestId: Id): void {
    this._queue.add(
      'inventory',
      {
        type: 'remove',
        id: inventory.id.value,
        inventory: inventory.toJSON(),
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public worker(
    cb: (inventory: InventoryQueueJob) => Promise<void>
  ): Worker<InventoryQueueJob> {
    return new Worker<InventoryQueueJob>(
      this.name,
      async (job) => {
        await cb(job.data);
      },
      { connection: this._connection }
    );
  }
}
