import { instanceCachingFactory } from 'tsyringe';
import winston, { format, transports } from 'winston';
import { Logger } from './logger';
import { LoggerInstance } from './logger-instance';

export function loggerProviders(service: string) {
  return [
    {
      token: LoggerInstance,
      useFactory: instanceCachingFactory(() => {
        return winston.createLogger({
          level: 'info',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
            format.colorize(),
            format.errors({ stack: true })
          ),
          defaultMeta: { service: service },
          transports: [new transports.Console()],
        });
      }),
    },
    {
      token: Logger,
      useClass: Logger,
    },
  ];
}
