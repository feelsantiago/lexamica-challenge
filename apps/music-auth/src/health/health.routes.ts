import { inject, singleton } from 'tsyringe';
import { HttpStatusCode } from 'axios';
import { HealthController } from './health.controller';
import { ApplicationRoutes, RouterBuilder } from '@lexamica/common';

@singleton()
export class HealthRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(HealthController) private readonly _controller: HealthController
  ) {}

  public endpoint(): string {
    return '/health-check';
  }

  public register(): RouterBuilder {
    this._rb.get('/', (_, res) => {
      const result = this._controller.check();
      return res.status(HttpStatusCode.Ok).send(result);
    });

    return this._rb;
  }
}
