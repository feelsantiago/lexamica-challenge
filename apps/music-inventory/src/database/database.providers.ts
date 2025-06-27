import { instanceCachingFactory } from 'tsyringe';
import { InventoryRepository } from './inventory.repository';

export const databaseProviders = [
  {
    token: InventoryRepository,
    useFactory: instanceCachingFactory<InventoryRepository>(
      () => new InventoryRepository()
    ),
  },
];
