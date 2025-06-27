import 'express';
import 'http';
import { AuthUser } from '../auth/types/auth-user';
import { Id } from './id';
import { ApplicationError } from './application-error';

declare global {
  namespace Express {
    interface Request {
      id: Id;
    }
  }
}

declare module 'http' {
  interface IncomingMessage {
    id: Id;
  }
}

declare global {
  namespace Express {
    interface Request {
      auth: {
        user: AuthUser;
      };
    }
  }
}
