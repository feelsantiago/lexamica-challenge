import { Routes } from '@lexamica/common';
import { OrganizationController } from './organization.controller';
import { OrganizationRoutes } from './organization.routes';

export const organizationProviders = [
  {
    token: OrganizationController,
    useClass: OrganizationController,
  },
  {
    token: Routes,
    useToken: OrganizationRoutes,
  },
];
