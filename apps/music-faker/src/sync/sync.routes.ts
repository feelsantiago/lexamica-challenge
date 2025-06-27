import { ApplicationRoutes, Logger, RouterBuilder } from '@lexamica/common';
import { HttpStatusCode } from 'axios';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SyncRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public endpoint(): string {
    return '/sync';
  }

  public register(): RouterBuilder {
    this._rb.post('/create', (req, res) => {
      this._logger.info('Receive sync for create music', req.body);
      return res.status(HttpStatusCode.Ok).json({ ok: true });
    });

    this._rb.delete('/delete', (_, res) => {
      this._logger.info('Receive sync for delete music');
      return res.status(HttpStatusCode.Ok).json({ ok: true });
    });

    return this._rb;
  }
}
