import { inject, injectable } from 'tsyringe';
import { faker } from '@faker-js/faker';
import { Result } from '@sapphire/result';
import { ApplicationError, Http, Id } from '@lexamica/common';
import { MusicGenerateDto } from './domain/music-generate-dto';
import { Music, PlainMusic } from '../database/music.model';
import { MusicRepository } from '../database/music.repository';
import { ApplicationErrors } from '../application-errors';
import { ConfigRepository } from '../database/config.repository';

@injectable()
export class MusicController {
  constructor(
    @inject(MusicRepository) private readonly _musics: MusicRepository,
    @inject(ConfigRepository) private readonly _config: ConfigRepository,
    @inject(Http) private readonly _http: Http
  ) {}

  public generate(dto: MusicGenerateDto): Music[] {
    const songs = Array.from({ length: dto.count }, () => ({
      name: faker.music.songName(),
      album: faker.music.album(),
      artist: faker.music.artist(),
    })).map((song) => Music.create(song));

    const musics = this._musics.createAll(songs);
    const config = this._config.fetch();

    for (const url of config.create) {
      for (const music of musics) {
        this._http.post(url, music);
      }
    }

    return musics;
  }

  public findAll(): Music[] {
    return this._musics.findAll();
  }

  public find(id: Id): Result<Music, ApplicationError> {
    const music = this._musics.findById(id);
    return music.okOr(
      ApplicationError.from(
        'Music not found',
        ApplicationErrors.MUSIC_NOT_FOUND,
        { id }
      )
    );
  }

  public delete(id: Id): Result<PlainMusic, ApplicationError> {
    const music = this._musics.delete(id);
    const config = this._config.fetch();

    if (music.isOk()) {
      for (const url of config.remove) {
        this._http.delete(`${url}&id=${id.value}`);
      }
    }

    return music;
  }
}
