import { instanceCachingFactory } from 'tsyringe';
import { OrganizationRepository } from './organization.repository';

export const databaseProviders = [
  {
    token: OrganizationRepository,
    useFactory: instanceCachingFactory<OrganizationRepository>(
      () => new OrganizationRepository()
    ),
  },
];
