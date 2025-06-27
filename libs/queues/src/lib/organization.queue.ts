import { inject, singleton } from 'tsyringe';
import { Queue, Worker } from 'bullmq';
import { Organization } from '@lexamica/models';
import {
  OrganizationQueueJob,
  QueueConnection,
  QueueOptions,
} from './queue.types';
import { Id } from '@lexamica/common';

@singleton()
export class OrganizationQueue {
  public readonly name = 'organization-queue';

  private readonly _queue: Queue<OrganizationQueueJob>;

  constructor(
    @inject(QueueConnection) private readonly _connection: QueueConnection
  ) {
    this._queue = new Queue(this.name, {
      connection: this._connection,
    });
  }

  public add(organization: Organization, requestId: Id): void {
    this._queue.add(
      'organization',
      {
        type: 'add',
        data: organization.toJSON(),
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public remove(id: Id, requestId: Id): void {
    this._queue.add(
      'organization',
      {
        type: 'remove',
        id: id.value,
        requestId: requestId.value,
      },
      QueueOptions
    );
  }

  public worker(
    cb: (organization: OrganizationQueueJob) => Promise<void>
  ): Worker<OrganizationQueueJob> {
    return new Worker<OrganizationQueueJob>(
      this.name,
      async (job) => {
        await cb(job.data);
      },
      { connection: this._connection }
    );
  }
}
