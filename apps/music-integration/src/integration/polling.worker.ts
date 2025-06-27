import { Disposable, inject, singleton } from 'tsyringe';
import { ApplicationWorker } from '@lexamica/queues';
import { Http, Id, Logger } from '@lexamica/common';
import { Worker } from 'bullmq';
import { PollingJob, PollingQueue } from './polling.queue';
import { InventorySync } from './inventory.sync';
import { ResponsePayload } from './integration.types';

@singleton()
export class PollingWork implements ApplicationWorker, Disposable {
  private _worker!: Worker<PollingJob>;

  constructor(
    @inject(PollingQueue) private readonly _queue: PollingQueue,
    @inject(InventorySync) private readonly _sync: InventorySync,
    @inject(Http) private readonly _http: Http,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  register(): void {
    this._worker = this._queue.worker(async (data) => {
      const requestId = Id.generate();
      this._logger.info(
        `${requestId.value} - Starting pooling for orgnazitation ${data.id}`
      );
      const response = await this._http.get<ResponsePayload>(data.url);
      const payload = response.match({
        ok: (response) => response,
        err: (error) => {
          this._logger.error(`${requestId.value} - Error while pooling data`);
          this._logger.applicationError(requestId, error);
          throw error;
        },
      });

      const result = this._sync.create(
        data.mappings,
        payload,
        Id.from(data.id).unwrap(),
        requestId
      );

      if (result.isErr()) {
        throw result.unwrapErr();
      }
    });

    this._worker.resume();
  }

  public dispose(): void {
    this._worker.close();
  }
}
