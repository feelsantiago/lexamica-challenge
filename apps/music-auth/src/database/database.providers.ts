import { instanceCachingFactory } from 'tsyringe';
import { UserRepository } from './user.repository';

export const databaseProviders = [
  {
    token: UserRepository,
    useFactory: instanceCachingFactory<UserRepository>(
      () => new UserRepository()
    ),
  },
];
