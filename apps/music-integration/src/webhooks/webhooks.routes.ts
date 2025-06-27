import { inject, singleton } from 'tsyringe';
import {
  ApplicationError,
  ApplicationRoutes,
  Id,
  Logger,
  RouterBuilder,
} from '@lexamica/common';
import { Option } from '@sapphire/result';
import {
  ApplicationErrors,
  toIntegrationHttpError,
} from '../application-errors';
import { WebhooksController } from './webhooks.controller';
import { HttpStatusCode } from 'axios';
import { DeleteQueryDto } from './domain/delete-query.dto';

@singleton()
export class WebhooksRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(WebhooksController)
    private readonly _controller: WebhooksController,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public endpoint(): string {
    return '/sync';
  }

  public register(): RouterBuilder {
    this._rb.post('/', (req, res) => {
      Option.from(req.query.orgId)
        .okOr(
          ApplicationError.from(
            'Missing OrgId',
            ApplicationErrors.NO_ORGANIZATION_FOUND
          )
        )
        .andThen((orgId) => Id.from(orgId))
        .andThen((orgId) => this._controller.create(orgId, req.body, req.id))
        .match({
          ok: () => res.status(HttpStatusCode.NoContent).send(),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toIntegrationHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.delete('/', (req, res) => {
      DeleteQueryDto.from(req.query)
        .andThen((dto) => this._controller.delete(dto.id, req.id))
        .match({
          ok: () => res.status(HttpStatusCode.NoContent).send(),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toIntegrationHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    return this._rb;
  }
}
