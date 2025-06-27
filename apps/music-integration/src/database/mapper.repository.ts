import { singleton } from 'tsyringe';
import { Id } from '@lexamica/common';
import { Option } from '@sapphire/result';
import { MapperSchema } from '@lexamica/mapper';

interface MapperModel {
  organizationId: string;
  mapper: MapperSchema;
}

@singleton()
export class MapperRepository {
  private _mappers: MapperModel[] = [];

  public find(organizationId: Id): Option<MapperSchema> {
    const mapper = this._mappers.find((mapper) => {
      return mapper.organizationId === organizationId.value;
    });

    return Option.from(mapper).map((mapper) => mapper.mapper);
  }

  public save(organizationId: Id, mapper: MapperSchema): void {
    this._mappers.push({ organizationId: organizationId.value, mapper });
  }

  public remove(organizationId: Id): void {
    this._mappers = this._mappers.filter(
      (mapper) => mapper.organizationId !== organizationId.value
    );
  }
}
