import { ErrorRequestHandler, RequestHandler } from 'express';

export interface MiddlewareFunction {
  handler(): RequestHandler | ErrorRequestHandler;
}
