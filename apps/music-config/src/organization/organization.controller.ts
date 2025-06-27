import { inject, injectable } from 'tsyringe';
import { ApplicationError, Id } from '@lexamica/common';
import { OrganizationQueue } from '@lexamica/queues';
import { Organization } from '@lexamica/models';
import { err, ok, Result } from '@sapphire/result';
import { OrganizationRepository } from '../database/organization.repository';
import { OrganizationDto } from './domain/organization.dto';
import { ApplicationErrors } from '../application-errors';

@injectable()
export class OrganizationController {
  constructor(
    @inject(OrganizationRepository)
    private readonly _repository: OrganizationRepository,
    @inject(OrganizationQueue) private readonly _queue: OrganizationQueue
  ) {}

  public create(
    organization: OrganizationDto,
    requestId: Id
  ): Result<Organization, ApplicationError> {
    const model = Organization.create(organization);
    return this._repository
      .create(model)
      .inspect((data) => this._queue.add(data, requestId));
  }

  public find(id: Id): Result<Organization, ApplicationError> {
    const model = this._repository.find(id);
    return model.match({
      some: (organization) => ok(organization),
      none: () =>
        err(
          ApplicationError.from(
            'Organization not found',
            ApplicationErrors.ORGANIZATION_NOT_FOUND,
            {
              id,
            }
          )
        ),
    });
  }

  public delete(id: Id, requestId: Id): Result<void, ApplicationError> {
    return this._repository
      .remove(id)
      .inspect(() => this._queue.remove(id, requestId));
  }
}
