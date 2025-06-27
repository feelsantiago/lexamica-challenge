import { ApplicationError, Id } from '@lexamica/common';
import { err, Result } from '@sapphire/result';
import z from 'zod/v4';
import { ApplicationErrors } from '../../application-errors';

export class DeleteQueryDto {
  public static readonly schema$ = z.object({
    id: Id.schema$,
    orgId: Id.schema$,
  });

  constructor(public readonly id: Id, public readonly orgId: Id) {}

  public static from(
    query: Record<string, unknown>
  ): Result<DeleteQueryDto, ApplicationError> {
    return Result.from(() => DeleteQueryDto.schema$.parse(query))
      .map(
        (dto) =>
          new DeleteQueryDto(
            Id.from(dto.id).unwrap(),
            Id.from(dto.orgId).unwrap()
          )
      )
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Missing OrgId and/or Id',
            ApplicationErrors.INVALID_DELETE_QUERY,
            {
              zod: error,
              data: query,
              error: z.treeifyError(error as z.ZodError),
            }
          )
        )
      );
  }
}
