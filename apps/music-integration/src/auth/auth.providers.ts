import { Auth } from './auth';
import { Authentication } from './authentication';

export const authProviders = [
  {
    token: Auth,
    useClass: Auth,
  },
  {
    token: Authentication,
    useClass: Authentication,
  },
];
