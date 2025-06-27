import { registry } from 'tsyringe';
import {
  applicationProviders,
  httpProviders,
  loggerProviders,
  routesProviders,
} from '@lexamica/common';
import { middlewareProviders } from './middleware/middleware.providers';
import { musicProviders } from './music/music.providers';
import { configProviders } from './config/config.providers';
import { syncProviders } from './sync/sync.providers';

@registry([
  ...applicationProviders,
  ...routesProviders,
  ...middlewareProviders,
  ...httpProviders,
  ...loggerProviders('music-faker'),
  ...musicProviders,
  ...configProviders,
  ...syncProviders,
])
export class ApplicationModule {}
