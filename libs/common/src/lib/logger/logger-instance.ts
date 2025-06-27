import winston from 'winston';

export const LoggerInstance = Symbol('Logger');
export type LoggerInstance = winston.Logger;
