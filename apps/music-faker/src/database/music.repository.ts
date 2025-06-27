import { ApplicationError, Id } from '@lexamica/common';
import { Option, Result } from '@sapphire/result';
import { Music, PlainMusic } from './music.model';
import { singleton } from 'tsyringe';
import { ApplicationErrors } from '../application-errors';

@singleton()
export class MusicRepository {
  private readonly _musics: PlainMusic[] = [];

  public create(music: Music): Music {
    this._musics.push(music.toJSON());
    return music;
  }

  public createAll(musics: Music[]): Music[] {
    musics.forEach((music) => this.create(music));
    return musics;
  }

  public findAll(): Music[] {
    return this._musics.map((music) => Music.from(music));
  }

  public findById(id: Id): Option<Music> {
    const music = this._musics.find((music) => music.id === id.value);
    return Option.from(music).map((music) => Music.from(music));
  }

  public delete(id: Id): Result<PlainMusic, ApplicationError> {
    const index = this._musics.findIndex((music) => music.id === id.value);
    const music = Option.from(this._musics[index]);

    this._musics.splice(
      this._musics.findIndex((music) => music.id === id.value),
      1
    );

    return music.okOr(
      ApplicationError.from(
        'Music not found',
        ApplicationErrors.MUSIC_NOT_FOUND,
        { id }
      )
    );
  }
}
