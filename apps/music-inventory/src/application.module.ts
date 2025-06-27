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
import { inventoryProviders } from './inventory/inventory.providers';
import { organizationProviders } from './organization/organization.providers';
import { configProviders } from './config/config.providers';
import { integrationProviders } from './integration/integration.providers';

@registry([
  ...applicationProviders,
  ...routesProviders,
  ...middlewareProviders,
  ...httpProviders,
  ...configProviders,
  ...loggerProviders('music-inventory'),
  ...integrationProviders,
  ...queueProviders({
    host: 'localhost',
    port: 6379,
  }),
  ...authProviders,
  ...healthProviders,
  ...inventoryProviders,
  ...organizationProviders,
])
export class ApplicationModule {}
