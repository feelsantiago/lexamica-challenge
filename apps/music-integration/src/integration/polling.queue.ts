import { Job, Queue, Worker } from 'bullmq';
import { Disposable, inject, singleton } from 'tsyringe';
import { Id, Logger, Polling } from '@lexamica/common';
import { PlainOrganizaton } from '@lexamica/models';
import { MapperSchema } from '@lexamica/mapper';
import { QueueConnection } from '@lexamica/queues';

export interface PollingJob {
  id: string;
  url: string;
  mappings: MapperSchema;
}

@singleton()
export class PollingQueue implements Disposable {
  public readonly name = 'pooling';

  private readonly _queue: Queue<PollingJob>;
  private _jobs: Job[] = [];

  constructor(
    @inject(QueueConnection) private readonly _connection: QueueConnection,
    @inject(Logger) private readonly _logger: Logger
  ) {
    this._queue = new Queue(this.name, { connection: this._connection });
  }

  public add(organization: PlainOrganizaton): void {
    const jobs = organization.polling.map((item) => {
      const pooling = Polling.from(item).unwrap();
      return this._queue.upsertJobScheduler(
        organization.id,
        { pattern: pooling.toCron() },
        {
          data: {
            id: organization.id,
            url: pooling.endpoint,
            mappings: organization.mappings,
          },
        }
      );
    });

    Promise.all(jobs).then((items) => this._jobs.push(...items));
  }

  public remove(id: Id): void {
    this._queue.removeJobScheduler(id.value);
  }

  public worker(cb: (data: PollingJob) => Promise<void>): Worker<PollingJob> {
    return new Worker<PollingJob>(this.name, async (job) => cb(job.data), {
      connection: this._connection,
    });
  }

  public async clear(): Promise<void> {
    this._logger.info('Running polling queue cleanup');
    this._queue.pause();
    await Promise.all(this._jobs.map((job) => job.remove()));
    await this._queue.obliterate({ force: true });
    this._queue.resume();
    this._logger.info('Finish polling queue cleanup');
  }

  public async dispose(): Promise<void> {
    await this.clear();
  }
}
