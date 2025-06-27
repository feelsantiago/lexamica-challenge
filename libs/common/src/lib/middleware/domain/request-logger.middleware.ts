import { RequestHandler } from 'express';
import morgan from 'morgan';
import { MiddlewareFunction } from '../types';

export class RequestLoggerMiddleware implements MiddlewareFunction {
  public handler(): RequestHandler {
    morgan.token('request-id', (req) => req.id.value);

    return morgan(
      ':request-id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"\n'
    );
  }
}
