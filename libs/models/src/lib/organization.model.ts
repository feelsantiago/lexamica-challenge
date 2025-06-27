import { Id, PlainClass, Polling, Webhook } from '@lexamica/common';
import { MapperSchema } from '@lexamica/mapper';

export interface PlainOrganizaton {
  id: string;
  mappings: MapperSchema;
  synchronization: 'one-way' | 'two-way';
  webhook: PlainClass<Webhook>[];
  polling: PlainClass<Polling>[];
  transforms: string[];
}

export class Organization {
  constructor(
    public readonly id: Id,
    public readonly mappings: MapperSchema,
    public readonly synchronization: 'one-way' | 'two-way',
    public readonly webhook: Webhook[],
    public readonly polling: Polling[],
    public readonly transforms: string[]
  ) {}

  public static create(plain: Omit<PlainOrganizaton, 'id'>): Organization {
    return new Organization(
      Id.generate(),
      plain.mappings,
      plain.synchronization,
      plain.webhook.map((webhook) => Webhook.from(webhook).unwrap()),
      plain.polling.map((polling) => Polling.from(polling).unwrap()),
      plain.transforms
    );
  }

  public static from(plain: PlainOrganizaton): Organization {
    return new Organization(
      Id.from(plain.id).unwrap(),
      plain.mappings,
      plain.synchronization,
      plain.webhook.map((webhook) => Webhook.from(webhook).unwrap()),
      plain.polling.map((polling) => Polling.from(polling).unwrap()),
      plain.transforms
    );
  }

  public toJSON(): PlainOrganizaton {
    return {
      id: this.id.value,
      mappings: this.mappings,
      synchronization: this.synchronization,
      webhook: this.webhook,
      polling: this.polling.map((polling) => polling.toJSON()),
      transforms: this.transforms,
    };
  }
}
