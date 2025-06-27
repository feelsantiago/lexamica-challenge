import { Routes } from '@lexamica/common';
import { WebhooksRoutes } from './webhooks.routes';
import { WebhooksController } from './webhooks.controller';

export const webhookProviders = [
  {
    token: Routes,
    useToken: WebhooksRoutes,
  },
  {
    token: WebhooksController,
    useClass: WebhooksController,
  },
];
