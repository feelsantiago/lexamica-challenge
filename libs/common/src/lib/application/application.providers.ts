import express, { Express } from 'express';
import { instanceCachingFactory } from 'tsyringe';

export const App = Symbol('APP');
export type App = Express;

export const applicationProviders = [
  {
    token: App,
    useFactory: instanceCachingFactory<Express>(() => express()),
  },
];
