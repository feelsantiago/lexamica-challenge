import { Router } from 'express';

export const RouterBuilder = Symbol('RouterBuilder');
export type RouterBuilder = Router;

export const Routes = Symbol('Routes');

export const routesProviders = [
  {
    token: RouterBuilder,
    useFactory: () => Router(),
  },
];
