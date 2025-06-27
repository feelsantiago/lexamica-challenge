import validator from 'validator';
import { z } from 'zod/v4';
import { ApplicationError } from '@lexamica/common';
import { err, Result } from '@sapphire/result';
import { ApplicationErrors } from '../../application-errors';

export class InventoryDto {
  public static readonly schema$ = z.object({
    externalId: z.string().transform((value) => validator.escape(value)),
    name: z.string().transform((value) => validator.escape(value)),
    artist: z.string().transform((value) => validator.escape(value)),
    album: z.string().transform((value) => validator.escape(value)),
  });

  constructor(
    public readonly externalId: string,
    public readonly name: string,
    public readonly artist: string,
    public readonly album: string
  ) {}

  public static from(
    body: Record<string, unknown>
  ): Result<InventoryDto, ApplicationError> {
    return Result.from(() => InventoryDto.schema$.parse(body))
      .map(
        (data) =>
          new InventoryDto(data.externalId, data.name, data.artist, data.album)
      )
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Invalid request body',
            ApplicationErrors.INVALID_INVENTORY_DTO,
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
