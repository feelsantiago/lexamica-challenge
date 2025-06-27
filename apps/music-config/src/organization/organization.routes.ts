import { inject, singleton } from 'tsyringe';
import { ApplicationRoutes, Id, Logger, RouterBuilder } from '@lexamica/common';
import { Organization } from '@lexamica/models';
import { Authentication } from '../auth/authentication';
import { OrganizationController } from './organization.controller';
import { HttpStatusCode } from 'axios';
import { toOrganizationHttpError } from '../application-errors';
import { OrganizationDto } from './domain/organization.dto';

@singleton()
export class OrganizationRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(Authentication) private readonly _auth: Authentication,
    @inject(Logger) private readonly _logger: Logger,
    @inject(OrganizationController)
    private readonly _controller: OrganizationController
  ) {}

  public endpoint(): string {
    return '/organization';
  }

  public register(): RouterBuilder {
    this._rb.get('/:id', this._auth.handler(), (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._controller.find(id))
        .match({
          ok: (organization: Organization) =>
            res.status(HttpStatusCode.Ok).json(organization.toJSON()),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toOrganizationHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.post('/', this._auth.handler(), (req, res) => {
      OrganizationDto.from(req.body)
        .andThen((dto) => this._controller.create(dto, req.id))
        .match({
          ok: (organization: Organization) =>
            res.status(HttpStatusCode.Created).json(organization.toJSON()),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toOrganizationHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.delete('/:id', this._auth.handler(), (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._controller.delete(id, req.id))
        .match({
          ok: () => res.status(HttpStatusCode.NoContent).send(),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toOrganizationHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    return this._rb;
  }
}
