import { OrganizationApi } from './organization.api';

export const organizationProviders = [
  {
    token: OrganizationApi,
    useClass: OrganizationApi,
  },
];
