import { inject, injectable } from 'tsyringe';
import { LoggerInstance } from './logger-instance';
import { ApplicationError } from '../domain/application-error';
import { Id } from '../domain/id';

@injectable()
export class Logger {
  constructor(
    @inject(LoggerInstance) private readonly _logger: LoggerInstance
  ) {}

  public log(message: string, ...meta: unknown[]): void {
    this._logger.log(message, meta);
  }

  public info(message: string, ...meta: unknown[]): void {
    this._logger.info(message, meta);
  }

  public war(message: string, ...meta: unknown[]): void {
    this._logger.warn(message, meta);
  }

  public error(message: string, ...meta: unknown[]): void {
    this._logger.error(message, meta);
  }

  public applicationError(id: Id, error: ApplicationError): void {
    this._logger.error({
      id: id.value,
      message: error.message,
      context: error.info,
      data: error.metadata,
      source: error.source,
    });
  }
}
