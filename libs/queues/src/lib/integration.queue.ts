import { inject, singleton } from 'tsyringe';
import { Queue, Worker } from 'bullmq';
import { Inventory } from '@lexamica/models';
import {
  IntegrationQueueJob,
  QueueConnection,
  QueueOptions,
} from './queue.types';
import { Id } from '@lexamica/common';

@singleton()
export class IntegrationQueue {
  public readonly name = 'integration-queue';

  private readonly _queue: Queue<IntegrationQueueJob>;

  constructor(
    @inject(QueueConnection) private readonly _connection: QueueConnection
  ) {
    this._queue = new Queue(this.name, {
      connection: this._connection,
    });
  }

  public add(inventory: Inventory, requestId: Id): void {
    this._queue.add(
      'add',
      {
        type: 'add',
        data: inventory.toJSON(),
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public remove(externalId: Id, requestId: Id): void {
    this._queue.add(
      'remove',
      {
        type: 'remove',
        id: externalId.value,
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public worker(
    cb: (data: IntegrationQueueJob) => Promise<void>
  ): Worker<IntegrationQueueJob> {
    return new Worker<IntegrationQueueJob>(
      this.name,
      async (job) => {
        await cb(job.data);
      },
      { connection: this._connection }
    );
  }
}
