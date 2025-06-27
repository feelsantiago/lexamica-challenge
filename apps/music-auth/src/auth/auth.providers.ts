import { Routes, JwtSecret } from '@lexamica/common';
import { AuthController } from './auth.controller';
import { AuthRoutes } from './auth.routes';
import { authProviders as auth } from '@lexamica/common';
import { instanceCachingFactory } from 'tsyringe';
import { Config } from '../config/config';

export const authProviders = [
  {
    token: Routes,
    useToken: AuthRoutes,
  },
  {
    token: AuthController,
    useClass: AuthController,
  },
  {
    token: JwtSecret,
    useFactory: instanceCachingFactory((container) =>
      container.resolve(Config).jwtSecret()
    ),
  },
  ...auth,
];
