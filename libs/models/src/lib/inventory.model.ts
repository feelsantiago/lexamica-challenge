import { Id } from '@lexamica/common';

export interface PlainInventory {
  id: string;
  externalId: string;
  organizationId: string;
  name: string;
  artist: string;
  album: string;
}

export class Inventory {
  constructor(
    public id: Id,
    public organizationId: Id,
    public externalId: string,
    public name: string,
    public artist: string,
    public album: string
  ) {}

  public static from(data: PlainInventory): Inventory {
    return new Inventory(
      Id.from(data.id).unwrap(),
      Id.from(data.organizationId).unwrap(),
      data.externalId,
      data.name,
      data.artist,
      data.album
    );
  }

  public static create(
    organizationId: Id,
    data: Omit<PlainInventory, 'id'>
  ): Inventory {
    return new Inventory(
      Id.generate(),
      organizationId,
      data.externalId,
      data.name,
      data.artist,
      data.album
    );
  }

  public toJSON(): PlainInventory {
    return {
      id: this.id.value,
      organizationId: this.organizationId.value,
      externalId: this.externalId,
      name: this.name,
      artist: this.artist,
      album: this.album,
    };
  }
}
