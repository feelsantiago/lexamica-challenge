import { Routes } from '@lexamica/common';
import { SyncRoutes } from './sync.routes';

export const syncProviders = [
  {
    token: Routes,
    useToken: SyncRoutes,
  },
];
