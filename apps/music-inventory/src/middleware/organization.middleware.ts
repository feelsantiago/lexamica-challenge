import { ApplicationError, Id, MiddlewareFunction } from '@lexamica/common';
import { RequestHandler } from 'express';
import { inject, injectable } from 'tsyringe';
import { Option } from '@sapphire/result';
import { OrganizationApi } from '../organization/organization.api';
import { ApplicationErrors, toInventoryHttpError } from '../application-errors';

@injectable()
export class OrganizationMiddleware implements MiddlewareFunction {
  constructor(
    @inject(OrganizationApi) private readonly _api: OrganizationApi
  ) {}

  public handler(): RequestHandler {
    return async (req, res, next) => {
      const id = Option.from(req.header('x-organization-id'))
        .okOr(
          ApplicationError.from(
            'No organization id provided',
            ApplicationErrors.NO_ORGANIZATION_FOUND
          )
        )
        .andThen((id: string) => Id.from(id));

      if (id.isErr()) {
        const error = id.unwrapErr();
        res.status(toInventoryHttpError(error.info)).json(error.toJSON());
        return next(error);
      }

      const token = Option.from(req.header('Authorization')).unwrapOr(
        'no token'
      );

      const organization = await this._api.find(id.unwrap(), token, req.id);
      return organization.match({
        ok: (id) => {
          req.organizationId = id;
          return next();
        },
        err: (error) => {
          res.status(toInventoryHttpError(error.info)).json(error.toJSON());
          next(error);
        },
      });
    };
  }
}
