import { middlewareProviders as middlewares } from '@lexamica/common';
import { Middleware } from './middleware';

export const middlewareProviders = [
  {
    token: Middleware,
    useClass: Middleware,
  },
  ...middlewares,
];
