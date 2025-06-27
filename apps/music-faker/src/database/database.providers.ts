import { instanceCachingFactory } from 'tsyringe';
import { ConfigRepository } from './config.repository';
import { MusicRepository } from './music.repository';

export const databaseProviders = [
  {
    token: MusicRepository,
    useFactory: instanceCachingFactory<MusicRepository>(
      () => new MusicRepository()
    ),
  },
  {
    token: ConfigRepository,
    useFactory: instanceCachingFactory<ConfigRepository>(
      () => new ConfigRepository()
    ),
  },
];
