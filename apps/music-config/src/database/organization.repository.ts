import { singleton } from 'tsyringe';
import { ok, Option, Result } from '@sapphire/result';
import { ApplicationError, Id } from '@lexamica/common';
import { Organization, PlainOrganizaton } from '@lexamica/models';

@singleton()
export class OrganizationRepository {
  private readonly _organizations: PlainOrganizaton[] = [];

  public find(id: Id): Option<Organization> {
    const exist = this._organizations.find(
      (organization) => organization.id === id.value
    );
    return Option.from(exist).map((data) => Organization.from(data));
  }

  public create(
    organization: Organization
  ): Result<Organization, ApplicationError> {
    this._organizations.push(organization.toJSON());
    return ok(organization);
  }

  public remove(id: Id): Result<void, ApplicationError> {
    this._organizations.splice(
      this._organizations.findIndex(
        (organization) => organization.id === id.value
      ),
      1
    );

    return ok();
  }
}
