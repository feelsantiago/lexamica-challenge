import { Id } from '@lexamica/common';

export interface PlainMusic {
  id: string;
  name: string;
  album: string;
  artist: string;
}

export class Music {
  constructor(
    public id: Id,
    public readonly name: string,
    public readonly album: string,
    public readonly artist: string
  ) {}

  static from(plain: PlainMusic): Music {
    const id = Id.from(plain.id).unwrap();
    return new Music(id, plain.name, plain.album, plain.artist);
  }

  static create(data: Omit<PlainMusic, 'id'>): Music {
    return new Music(Id.generate(), data.name, data.album, data.artist);
  }

  public toJSON(): PlainMusic {
    return {
      id: this.id.value,
      name: this.name,
      album: this.album,
      artist: this.artist,
    };
  }
}
