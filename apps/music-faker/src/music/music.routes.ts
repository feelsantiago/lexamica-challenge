import { ApplicationRoutes, Id, Logger, RouterBuilder } from '@lexamica/common';
import { inject, injectable } from 'tsyringe';
import { MusicGenerateDto } from './domain/music-generate-dto';
import { MusicController } from './music.controller';
import { HttpStatusCode } from 'axios';
import { toMusicHttpError } from '../application-errors';
import { Music } from '../database/music.model';
import { Queue } from 'bullmq';

@injectable()
export class MusicRoutes implements ApplicationRoutes {
  constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(MusicController) private readonly _musics: MusicController,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public endpoint(): string {
    return '/music';
  }

  public register(): RouterBuilder {
    this._rb.get('/test', (_, res) => {
      const queue = new Queue('my-queue');
      queue.add('job', { foo: 'bar' });

      res.status(200).send('ok');
    });

    this._rb.post('/generate', (req, res) => {
      MusicGenerateDto.create(req.body)
        .map((dto) => this._musics.generate(dto))
        .match({
          ok: (musics) => res.status(HttpStatusCode.Created).json(musics),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toMusicHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.get('/', (_, res) => {
      return res.status(HttpStatusCode.Ok).json(this._musics.findAll());
    });

    this._rb.get('/:id', (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._musics.find(id))
        .match({
          ok: (music: Music) => res.status(HttpStatusCode.Ok).json(music),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toMusicHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    this._rb.delete('/:id', (req, res) => {
      Id.from(req.params.id)
        .andThen((id) => this._musics.delete(id))
        .match({
          ok: () => res.sendStatus(HttpStatusCode.NoContent),
          err: (error) => {
            this._logger.applicationError(req.id, error);
            return res
              .status(toMusicHttpError(error.info))
              .json(error.toJSON());
          },
        });
    });

    return this._rb;
  }
}
