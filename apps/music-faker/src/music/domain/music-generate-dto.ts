import { err, Result } from '@sapphire/result';
import { z } from 'zod/v4';
import { ApplicationError } from '@lexamica/common';
import { ApplicationErrors } from '../../application-errors';

export class MusicGenerateDto {
  public static readonly schema$ = z.object({
    count: z.number().min(1).max(100),
  });

  private constructor(public readonly count: number) {}

  public static create(
    body: Record<string, unknown>
  ): Result<MusicGenerateDto, ApplicationError> {
    return Result.from(() => MusicGenerateDto.schema$.parse(body))
      .map((value) => new MusicGenerateDto(value.count))
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Invalid generator count, it should be a number between 1 - 100',
            ApplicationErrors.INVALID_GENERATOR_COUNT,
            {
              zod: error,
              data: body,
              info: z.treeifyError(error as z.ZodError),
            }
          )
        )
      );
  }
}
