import { err, Result } from '@sapphire/result';
import { ApplicationError } from '@lexamica/common';
import { z } from 'zod/v4';
import { Config } from '../../database/config.model';
import { ApplicationErrors } from '../../application-errors';

export class ConfigDto {
  public static readonly schema$ = z.object({
    create: z.array(z.url()),
    remove: z.array(z.url()),
  });

  constructor(
    public readonly create: string[],
    public readonly remove: string[]
  ) {}

  public static from(
    plain: Record<string, unknown>
  ): Result<Config, ApplicationError> {
    return Result.from(() => ConfigDto.schema$.parse(plain))
      .map((dto) => new Config(dto.create, dto.remove))
      .mapErrInto(() =>
        err(
          ApplicationError.from(
            'Unable to parse config data',
            ApplicationErrors.INVALID_CONFIG
          )
        )
      );
  }
}
