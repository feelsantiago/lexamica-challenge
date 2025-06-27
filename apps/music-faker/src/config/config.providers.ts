import { Routes } from '@lexamica/common';
import { ConfigController } from './config.controller';
import { ConfigRoutes } from './config.routes';

export const configProviders = [
  {
    token: ConfigController,
    useClass: ConfigController,
  },
  {
    token: Routes,
    useToken: ConfigRoutes,
  },
];
