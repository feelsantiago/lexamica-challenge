import { RequestHandler } from 'express';
import { injectable } from 'tsyringe';
import { Option } from '@sapphire/result';
import { MiddlewareFunction } from '../types';
import { Id } from '../../domain/id';
import { HttpStatusCode } from 'axios';

@injectable()
export class RequestIdMiddleware implements MiddlewareFunction {
  public handler(): RequestHandler {
    return (req, res, next) => {
      const id = Option.from(req.header('x-request-id'));

      if (id.isNone()) {
        req.id = Id.generate();
        return next();
      }

      Id.from(id.unwrap()).match({
        ok: (value) => {
          req.id = value;
          next();
        },
        err: (error) => {
          res
            .status(HttpStatusCode.BadRequest)
            .send({ message: 'Invalid request id' });
          next(error);
        },
      });
    };
  }
}
