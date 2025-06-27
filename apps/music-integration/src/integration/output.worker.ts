import { Disposable, inject, singleton } from 'tsyringe';
import { ApplicationWorker } from '@lexamica/queues';
import { ApplicationError, Http, Id, Logger } from '@lexamica/common';
import { Worker } from 'bullmq';
import { OutputJob, OutputQueue } from './output.queue';
import { err } from '@sapphire/result';
import { match } from 'ts-pattern';

@singleton()
export class OutputWorker implements ApplicationWorker, Disposable {
  private _worker!: Worker<OutputJob>;

  constructor(
    @inject(OutputQueue) private readonly _queue: OutputQueue,
    @inject(Http) private readonly _http: Http,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public register(): void {
    this._worker = this._queue.worker(async (data) => {
      this._logger.info(
        `${data.requestId} - Sending output for ${data.id} - url - ${data.weebhook.url}`
      );

      const result = await match(data.weebhook.method)
        .with('POST', () => this._http.post(data.weebhook.url, data.inventory))
        .with('DELETE', () =>
          this._http.delete(`${data.weebhook.url}?id=${data.id}`)
        )
        .otherwise(() => err(ApplicationError.from('Method not allowerd')));

      result.match({
        ok: () => this._logger.info(`${data.requestId} - Output sent`),
        err: (error) => {
          this._logger.applicationError(
            Id.from(data.requestId).unwrap(),
            error
          );
        },
      });
    });

    this._worker.resume();
  }

  public dispose(): void {
    this._worker.close();
  }
}
