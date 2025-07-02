import { registry } from 'tsyringe';
import {
  applicationProviders,
  httpProviders,
  loggerProviders,
  routesProviders,
} from '@lexamica/common';
import { queueProviders } from '@lexamica/queues';
import { middlewareProviders } from './middleware/middleware.providers';
import { organizationProviders } from './organization/organization.providers';
import { healthProviders } from './health/health.providers';
import { authProviders } from './auth/auth.providers';
import { configProviders } from './config/config.providers';

@registry([
  ...applicationProviders,
  ...routesProviders,
  ...middlewareProviders,
  ...httpProviders,
  ...loggerProviders('music-config'),
  ...queueProviders({
    host: 'localhost',
    port: 6379,
  }),
  ...configProviders,
  ...authProviders,
  ...healthProviders,
  ...organizationProviders,
])
export class ApplicationModule {}
