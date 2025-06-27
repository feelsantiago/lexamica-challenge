import { Queue, Worker } from 'bullmq';
import { Disposable, inject, singleton } from 'tsyringe';
import { Webhook } from '@lexamica/common';
import { PlainInventory } from '@lexamica/models';
import { QueueConnection } from '@lexamica/queues';

export interface OutputJob {
  id: string;
  weebhook: Webhook;
  inventory: PlainInventory;
  requestId: string;
}

@singleton()
export class OutputQueue implements Disposable {
  public readonly name = 'output';

  private readonly _queue: Queue<OutputJob>;

  constructor(
    @inject(QueueConnection) private readonly _connection: QueueConnection
  ) {
    this._queue = new Queue(this.name, { connection: this._connection });
    this._queue.resume();
  }

  public add(job: OutputJob): void {
    this._queue.add(this.name, job);
  }

  public worker(cb: (data: OutputJob) => Promise<void>): Worker<OutputJob> {
    return new Worker<OutputJob>(this.name, async (job) => cb(job.data), {
      connection: this._connection,
    });
  }

  public async dispose(): Promise<void> {
    this._queue.pause();
    await this._queue.obliterate({ force: true });
  }
}
