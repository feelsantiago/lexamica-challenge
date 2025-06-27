import { inject, singleton } from 'tsyringe';
import { ApplicationRoutes, RouterBuilder } from '@lexamica/common';
import { ConfigController } from './config.controller';
import { HttpStatusCode } from 'axios';
import { ConfigDto } from './domain/config.dto';
import { toMusicHttpError } from '../application-errors';

@singleton()
export class ConfigRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(ConfigController) private readonly _controller: ConfigController
  ) {}

  public endpoint(): string {
    return '/config';
  }

  public register(): RouterBuilder {
    this._rb.get('/', (_, res) => {
      return res.status(HttpStatusCode.Ok).json(this._controller.fetch());
    });

    this._rb.put('/', (req, res) => {
      ConfigDto.from(req.body)
        .map((dto) => this._controller.update(dto))
        .match({
          ok: (model) => res.status(HttpStatusCode.Ok).json(model),
          err: (error) =>
            res.status(toMusicHttpError(error.info)).json(error.toJSON()),
        });
    });

    return this._rb;
  }
}
