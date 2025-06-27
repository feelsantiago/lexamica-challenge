import {
  ApplicationError,
  AuthErros,
  MiddlewareFunction,
  toAuthHttpError,
} from '@lexamica/common';
import { RequestHandler } from 'express';
import { Option } from '@sapphire/result';
import { inject, injectable } from 'tsyringe';
import { Auth } from './auth';

@injectable()
export class Authentication implements MiddlewareFunction {
  constructor(@inject(Auth) private readonly _auth: Auth) {}

  public handler(): RequestHandler {
    return async (req, res, next) => {
      const token = Option.from(req.header('Authorization'));

      if (token.isNone()) {
        const error = ApplicationError.from(
          'No token provided',
          AuthErros.INVALID_TOKEN
        );

        res
          .status(toAuthHttpError(error.info))
          .send({ status: 'failure', message: error.message });
        return next(error);
      }

      const result = await this._auth.validate(token.unwrap());
      return result.match({
        ok: (user) => {
          req.auth = { user };
          next();
        },
        err: (error) => {
          res
            .status(toAuthHttpError(error.info))
            .send({ message: 'Unauthorized' });
          return next(error);
        },
      });
    };
  }
}
