import { RouterBuilder } from './routes.providers';

export interface ApplicationRoutes {
  endpoint(): string;
  register(): RouterBuilder;
}
