import { registry } from 'tsyringe';
import {
  applicationProviders,
  httpProviders,
  loggerProviders,
  routesProviders,
} from '@lexamica/common';
import { queueProviders } from '@lexamica/queues';
import { middlewareProviders } from './middleware/middleware.providers';
import { healthProviders } from './health/health.providers';
import { authProviders } from './auth/auth.providers';
import { configProviders } from './config/config.providers';
import { integrationProviders } from './integration/integration.providers';
import { databaseProviders } from './database/database.providers';
import { webhookProviders } from './webhooks/webhooks.provider';

@registry([
  ...applicationProviders,
  ...routesProviders,
  ...middlewareProviders,
  ...httpProviders,
  ...configProviders,
  ...databaseProviders,
  ...loggerProviders('music-integration'),
  ...authProviders,
  ...queueProviders({ host: 'localhost', port: 6379 }),
  ...integrationProviders,
  ...healthProviders,
  ...webhookProviders,
])
export class ApplicationModule {}
