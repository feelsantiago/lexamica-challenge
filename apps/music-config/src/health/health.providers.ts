import { Routes } from '@lexamica/common';
import { HealthController } from './health.controller';
import { HealthRoutes } from './health.routes';

export const healthProviders = [
  {
    token: HealthController,
    useClass: HealthController,
  },
  {
    token: Routes,
    useToken: HealthRoutes,
  },
];
