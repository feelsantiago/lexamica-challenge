import { Disposable, inject, injectable } from 'tsyringe';
import { Id, Logger, Webhook } from '@lexamica/common';
import {
  ApplicationWorker,
  OrganizationQueue,
  OrganizationQueueJob,
} from '@lexamica/queues';
import { PlainOrganizaton } from '@lexamica/models';
import { match } from 'ts-pattern';
import { Worker } from 'bullmq';
import { PollingQueue } from './polling.queue';
import { MapperRepository } from '../database/mapper.repository';
import { OutputRepository } from '../database/output.repository';

@injectable()
export class OrganizationWorker implements ApplicationWorker, Disposable {
  private _worker!: Worker<OrganizationQueueJob>;

  constructor(
    @inject(OrganizationQueue) private _queue: OrganizationQueue,
    @inject(PollingQueue) private _pooling: PollingQueue,
    @inject(MapperRepository) private _mappers: MapperRepository,
    @inject(OutputRepository) private _output: OutputRepository,
    @inject(Logger) private _logger: Logger
  ) {}

  public register(): void {
    this._worker = this._queue.worker(async (data) => {
      match(data)
        .with({ type: 'add' }, ({ data: organization, requestId }) =>
          this._add(organization, requestId)
        )
        .with({ type: 'remove' }, ({ id, requestId }) =>
          this._remove(id, requestId)
        );
    });

    this._worker.resume();
  }

  public dispose(): void {
    this._worker.close();
  }

  private _add(organization: PlainOrganizaton, requestId: string): void {
    this._logger.info(`${requestId} - Adding organization ${organization.id}`);
    this._pooling.add(organization);
    this._mappers.save(
      Id.from(organization.id).unwrap(),
      organization.mappings
    );

    if (organization.synchronization === 'two-way') {
      const webhoods = organization.webhook.filter(
        (webhook) => webhook.type === 'output'
      );
      for (const webhook of webhoods) {
        this._output.add(
          Id.from(organization.id).unwrap(),
          Webhook.from(webhook).unwrap()
        );
      }
    }
  }

  private _remove(id: string, requestId: string): void {
    const _id = Id.from(id).unwrap();
    this._logger.info(`${requestId} - Removing organization ${id}`);
    this._pooling.remove(_id);
    this._mappers.remove(_id);
    this._output.remove(_id);
  }
}
