import { AuthMiddleware } from './auth.middleware';
import { Jwt } from './jwt';

export const authProviders = [
  {
    token: Jwt,
    useClass: Jwt,
  },
  {
    token: AuthMiddleware,
    useClass: AuthMiddleware,
  },
];
