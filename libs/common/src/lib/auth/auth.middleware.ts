import { Option } from '@sapphire/result';
import { RequestHandler } from 'express';
import { inject, injectable } from 'tsyringe';
import passport from 'passport';
import { match, P } from 'ts-pattern';
import { Jwt } from './jwt';
import { MiddlewareFunction } from '../middleware/types';
import { AuthUser } from './domain/auth-user';
import { ApplicationError } from '../domain/application-error';
import { AuthErros, toAuthHttpError } from './auth-errors';

@injectable()
export class AuthMiddleware implements MiddlewareFunction {
  constructor(@inject(Jwt) private readonly _jwt: Jwt) {}

  public handler(): RequestHandler {
    passport.use(this._jwt.strategy());

    return async (req, res, next) => {
      return passport.authenticate(
        'jwt',
        { session: false },
        (error: Error, user: AuthUser | null | undefined) => {
          if (error) {
            return match(error)
              .with(P.instanceOf(ApplicationError), () => next(error))
              .otherwise(() =>
                next(
                  new ApplicationError(error, AuthErros.UNABLE_TO_DECODE_JWT)
                )
              );
          }

          Option.from(user || null).match({
            some: (value) => {
              req.auth = { user: value };
              next();
            },
            none: () => {
              const error = ApplicationError.from(
                'Unhauthorized',
                AuthErros.UNAUTHORIZED_USER
              );

              res
                .status(toAuthHttpError(error.info))
                .json({ status: 'failure', message: 'Unauthorized' });

              return next(error);
            },
          });
        }
      )(req, res, next);
    };
  }
}
