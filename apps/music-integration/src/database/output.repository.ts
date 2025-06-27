import { Id, PlainClass, Webhook } from '@lexamica/common';
import { injectable } from 'tsyringe';

@injectable()
export class OutputRepository {
  private _webhooks: (PlainClass<Webhook> & {
    organizationId: string;
  })[] = [];

  public add(organizationId: Id, webhook: Webhook): void {
    this._webhooks.push({ ...webhook, organizationId: organizationId.value });
  }

  public find(
    type: Pick<Webhook, 'type'>['type'],
    method: Pick<Webhook, 'method'>['method']
  ): Webhook[] {
    return this._webhooks
      .filter((webhook) => webhook.type === type && webhook.method === method)
      .map((webhook) => Webhook.from(webhook).unwrap());
  }

  public remove(organizationId: Id): void {
    this._webhooks = this._webhooks.filter(
      (webhook) => webhook.organizationId !== organizationId.value
    );
  }
}
