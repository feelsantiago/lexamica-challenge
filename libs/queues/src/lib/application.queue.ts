import { inject, injectable } from 'tsyringe';
import { OrganizationQueue } from './organization.queue';
import { InventoryQueue } from './inventory.queue';

@injectable()
export class ApplicationQueue {
  public get inventory() {
    return this._inventoryQueue;
  }

  public get organization() {
    return this._organizationQueue;
  }

  constructor(
    @inject(OrganizationQueue)
    private readonly _organizationQueue: OrganizationQueue,
    @inject(InventoryQueue) private readonly _inventoryQueue: InventoryQueue
  ) {}
}
