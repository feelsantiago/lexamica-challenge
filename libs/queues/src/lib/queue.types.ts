import { PlainInventory, PlainOrganizaton } from '@lexamica/models';

export interface QueueConnectionParams {
  host: string;
  port: number;
}

export interface ApplicationWorker {
  register(): void;
}

export const QueueConnection = Symbol('QueueConnection');
export type QueueConnection = QueueConnectionParams;

export interface AddQueueJob<T> {
  type: 'add';
  data: T;
  requestId: string;
}

export interface RemoveQueueJob {
  type: 'remove';
  id: string;
  requestId: string;
}

export type OrganizationQueueJob =
  | AddQueueJob<PlainOrganizaton>
  | RemoveQueueJob;

export type InventoryQueueJob =
  | AddQueueJob<PlainInventory>
  | (RemoveQueueJob & { inventory: PlainInventory });

export type IntegrationQueueJob = AddQueueJob<PlainInventory> | RemoveQueueJob;

export const QueueOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};
