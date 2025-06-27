import { registry } from 'tsyringe';
import {
  applicationProviders,
  loggerProviders,
  routesProviders,
} from '@lexamica/common';
import { middlewareProviders } from './middleware/middleware.providers';
import { healthProviders } from './health/health.providers';
import { authProviders } from './auth/auth.providers';
import { databaseProviders } from './database/database.providers';
import { configProviders } from './config/config.providers';

@registry([
  ...applicationProviders,
  ...routesProviders,
  ...middlewareProviders,
  ...loggerProviders('music-auth'),
  ...configProviders,
  ...databaseProviders,
  ...authProviders,
  ...healthProviders,
])
export class ApplicationModule {}
