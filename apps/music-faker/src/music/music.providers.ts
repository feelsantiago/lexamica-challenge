import { Routes } from '@lexamica/common';
import { MusicRoutes } from './music.routes';
import { MusicController } from './music.controller';

export const musicProviders = [
  {
    token: MusicController,
    useClass: MusicController,
  },
  {
    token: Routes,
    useToken: MusicRoutes,
  },
];
