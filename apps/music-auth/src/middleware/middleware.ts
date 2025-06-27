import { inject, injectable } from 'tsyringe';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {
  App,
  GlobalErrorHandlerMiddleware,
  RequestIdMiddleware,
  RequestLoggerMiddleware,
} from '@lexamica/common';

@injectable()
export class Middleware {
  constructor(
    @inject(App) private readonly _app: App,
    @inject(RequestIdMiddleware)
    private readonly _requestId: RequestIdMiddleware,
    @inject(RequestLoggerMiddleware)
    private readonly _requestLogger: RequestLoggerMiddleware,
    @inject(GlobalErrorHandlerMiddleware)
    private readonly _globalErrorHandler: GlobalErrorHandlerMiddleware
  ) {}

  public head(): void {
    this._app.use(helmet());
    this._app.use(bodyParser.json());
    this._app.use(this._requestId.handler());
    this._app.use(this._requestLogger.handler());
    this._app.use(this._globalErrorHandler.handler());
  }

  public tail(): void {
    this._app.use(this._globalErrorHandler.handler());
  }
}
