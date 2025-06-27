import { ErrorRequestHandler } from 'express';
import { HttpStatusCode } from 'axios';
import { inject, injectable } from 'tsyringe';
import { Logger } from '../../logger/logger';
import { MiddlewareFunction } from '../types';

@injectable()
export class GlobalErrorHandlerMiddleware implements MiddlewareFunction {
  constructor(@inject(Logger) private readonly _logger: Logger) {}

  public handler(): ErrorRequestHandler {
    return (err, req, res, next) => {
      if (res.headersSent) {
        this._logger.applicationError(req.id, err);
        return next();
      }

      res.status(HttpStatusCode.InternalServerError).send(err);
      this._logger.error(req.id.value, err);
      next();
    };
  }
}
