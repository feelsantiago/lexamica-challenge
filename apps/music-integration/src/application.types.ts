import { ApplicationWorker } from '@lexamica/queues';

export const ApplicationWorkers = Symbol('ApplicationWorkers');
export type ApplicationWorkers = ApplicationWorker[];
