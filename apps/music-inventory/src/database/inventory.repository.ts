import { singleton } from 'tsyringe';
import { ok, Option, Result } from '@sapphire/result';
import { ApplicationError, Id } from '@lexamica/common';
import { Inventory, PlainInventory } from '@lexamica/models';
import { ApplicationErrors } from '../application-errors';

@singleton()
export class InventoryRepository {
  private readonly _inventory: PlainInventory[] = [];

  public find(id: Id): Option<Inventory> {
    const exist = this._inventory.find(
      (inventory) => inventory.id === id.value
    );
    return Option.from(exist).map((data) => Inventory.from(data));
  }

  public findByOrganization(id: Id): Inventory[] {
    return this._inventory
      .filter((inventory) => inventory.organizationId === id.value)
      .map((data) => Inventory.from(data));
  }

  public findAll(): Inventory[] {
    return this._inventory.map((inventory) => Inventory.from(inventory));
  }

  public findByExternalId(externalId: string): Option<Inventory> {
    const exist = this._inventory.find(
      (inventory) => inventory.externalId === externalId
    );
    return Option.from(exist).map((data) => Inventory.from(data));
  }

  public create(inventory: Inventory): Result<Inventory, ApplicationError> {
    this._inventory.push(inventory.toJSON());
    return ok(inventory);
  }

  public remove(id: Id): Result<Inventory, ApplicationError> {
    const index = this._inventory.findIndex(
      (inventory) => inventory.id === id.value
    );
    const model = Option.from(this._inventory[index]);

    this._inventory.splice(index, 1);
    return model
      .okOr(
        ApplicationError.from(
          'Inventory not found',
          ApplicationErrors.INVENTORY_NOT_FOUND
        )
      )
      .map((inventory) => Inventory.from(inventory));
  }

  public removeByExternalId(id: Id): Result<void, ApplicationError> {
    this._inventory.splice(
      this._inventory.findIndex(
        (inventory) => inventory.externalId === id.value
      ),
      1
    );

    return ok();
  }
}
