import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const ApplicationErrors = {
  INVALID_GENERATOR_COUNT: 'INVALID_GENERATOR_COUNT',
  MUSIC_NOT_FOUND: 'MUSIC_NOT_FOUND',
  INVALID_CONFIG: 'INVALID_CONFIG',
};

export function toMusicHttpError(value: string): number {
  return match(value)
    .with(
      ApplicationErrors.INVALID_GENERATOR_COUNT,
      () => HttpStatusCode.BadRequest
    )
    .with(ApplicationErrors.INVALID_CONFIG, () => HttpStatusCode.BadRequest)
    .with(ApplicationErrors.MUSIC_NOT_FOUND, () => HttpStatusCode.NotFound)
    .otherwise(() => HttpStatusCode.InternalServerError);
}
