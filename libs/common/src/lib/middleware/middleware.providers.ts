import { GlobalErrorHandlerMiddleware } from './domain/global-error-handler.middleware';
import { RequestIdMiddleware } from './domain/request-id.middleware';
import { RequestLoggerMiddleware } from './domain/request-logger.middleware';

export const middlewareProviders = [
  {
    token: RequestIdMiddleware,
    useClass: RequestIdMiddleware,
  },
  {
    token: RequestLoggerMiddleware,
    useClass: RequestLoggerMiddleware,
  },
  {
    token: GlobalErrorHandlerMiddleware,
    useClass: GlobalErrorHandlerMiddleware,
  },
];
