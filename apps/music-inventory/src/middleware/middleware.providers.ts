import { middlewareProviders as middlewares } from '@lexamica/common';
import { Middleware } from './middleware';
import { OrganizationMiddleware } from './organization.middleware';

export const middlewareProviders = [
  {
    token: Middleware,
    useClass: Middleware,
  },
  {
    token: OrganizationMiddleware,
    useClass: OrganizationMiddleware,
  },
  ...middlewares,
];
