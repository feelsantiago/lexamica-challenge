import { ApplicationRoutes, Id, Logger, RouterBuilder } from '@lexamica/common';
import { Inventory } from '@lexamica/models';
import { inject, singleton } from 'tsyringe';
import { HttpStatusCode } from 'axios';
import { InventoryController } from './inventory.controller';
import { Authentication } from '../auth/authentication';
import { toInventoryHttpError } from '../application-errors';
import { InventoryDto } from './domain/inventory.dto';
import { OrganizationMiddleware } from '../middleware/organization.middleware';

@singleton()
export class InventoryRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(Authentication) private readonly _auth: Authentication,
    @inject(OrganizationMiddleware)
    private readonly _organization: OrganizationMiddleware,
    @inject(Logger) private readonly _logger: Logger,
    @inject(InventoryController)
    private readonly _controller: InventoryController
  ) {}

  public endpoint(): string {
    return '/inventory';
  }

  public register(): RouterBuilder {
    this._rb.get('/organization/:id', this._auth.handler(), (req, res) => {
      Id.from(req.params.id)
        .map((id) => this._controller.findByOrganization(id))
        .match({
          ok: (inventories: Inventory[]) =>
            res
              .status(HttpStatusCode.Ok)
              .json(inventories.map((i) => i.toJSON())),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toInventoryHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.get('/', this._auth.handler(), (_, res) => {
      const inventory = this._controller.findAll();
      return res.status(HttpStatusCode.Ok).json(inventory);
    });

    this._rb.get('/:id', this._auth.handler(), (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._controller.find(id))
        .match({
          ok: (inventory: Inventory) =>
            res.status(HttpStatusCode.Ok).json(inventory.toJSON()),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toInventoryHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.post(
      '/',
      this._auth.handler(),
      this._organization.handler(),
      (req, res) => {
        InventoryDto.from(req.body)
          .andThen((dto) =>
            this._controller.create(req.organizationId, dto, req.id)
          )
          .match({
            ok: (inventory: Inventory) =>
              res.status(HttpStatusCode.Created).json(inventory.toJSON()),
            err: (error) => {
              this._logger.applicationError(req.id, error);
              return res
                .status(toInventoryHttpError(error.info))
                .json(error.toJSON());
            },
          });
      }
    );

    this._rb.delete('/:id', this._auth.handler(), (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._controller.delete(id, req.id))
        .match({
          ok: () => res.status(HttpStatusCode.NoContent).send(),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toInventoryHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    return this._rb;
  }
}
