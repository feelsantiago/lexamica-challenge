import { instanceCachingFactory } from 'tsyringe';
import { MapperRepository } from './mapper.repository';
import { OutputRepository } from './output.repository';

export const databaseProviders = [
  {
    token: MapperRepository,
    useFactory: instanceCachingFactory<MapperRepository>(
      () => new MapperRepository()
    ),
  },
  {
    token: OutputRepository,
    useFactory: instanceCachingFactory<OutputRepository>(
      () => new OutputRepository()
    ),
  },
];
