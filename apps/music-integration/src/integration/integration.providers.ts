import { instanceCachingFactory } from 'tsyringe';
import { QueueConnection } from '@lexamica/queues';
import { Logger } from '@lexamica/common';
import { ApplicationWorkers } from '../application.types';
import { InventorySync } from './inventory.sync';
import { InventoryWorker } from './inventory.worker';
import { OrganizationWorker } from './organization.worker';
import { OutputQueue } from './output.queue';
import { OutputWorker } from './output.worker';
import { PollingQueue } from './polling.queue';
import { PollingWork } from './polling.worker';

export const integrationProviders = [
  {
    token: PollingQueue,
    useFactory: instanceCachingFactory<PollingQueue>(
      (c) => new PollingQueue(c.resolve(QueueConnection), c.resolve(Logger))
    ),
  },
  {
    token: ApplicationWorkers,
    useToken: PollingWork,
  },
  {
    token: ApplicationWorkers,
    useToken: InventoryWorker,
  },
  {
    token: ApplicationWorkers,
    useToken: OrganizationWorker,
  },
  {
    token: ApplicationWorkers,
    useToken: OutputWorker,
  },
  {
    token: OutputQueue,
    useFactory: instanceCachingFactory<OutputQueue>(
      (c) => new OutputQueue(c.resolve(QueueConnection))
    ),
  },
  {
    token: InventorySync,
    useClass: InventorySync,
  },
];
