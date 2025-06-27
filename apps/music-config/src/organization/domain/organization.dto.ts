import { MapperSchema } from '@lexamica/mapper';
import { ApplicationError, Polling, Webhook } from '@lexamica/common';
import { err, Result } from '@sapphire/result';
import validator from 'validator';
import { z } from 'zod/v4';
import { ApplicationErrors } from '../../application-errors';

export class OrganizationDto {
  public static readonly schema$ = z.object({
    // TODO: define mappings schema with recursive objects
    mappings: z.any(),
    synchronization: z.enum(['one-way', 'two-way']),
    webhook: z.array(Webhook.schema$),
    polling: z.array(Polling.schema$),
    transforms: z
      .array(z.string())
      .transform((value) => value.map((item) => validator.escape(item))),
  });

  private constructor(
    public readonly mappings: MapperSchema,
    public readonly synchronization: 'one-way' | 'two-way',
    public readonly webhook: Webhook[],
    public readonly polling: Polling[],
    public readonly transforms: string[]
  ) {}

  public static from(
    body: Record<string, unknown>
  ): Result<OrganizationDto, ApplicationError> {
    return Result.from<z.infer<typeof OrganizationDto.schema$>, Error>(() =>
      OrganizationDto.schema$.parse(body)
    )
      .map(
        (data) =>
          new OrganizationDto(
            data.mappings,
            data.synchronization,
            data.webhook.map((item) => Webhook.from(item).unwrap()),
            data.polling.map((item) => Polling.from(item).unwrap()),
            data.transforms
          )
      )
      .mapErrInto((error) =>
        err(
          ApplicationError.from(
            'Invalid request body',
            ApplicationErrors.INVALID_ORGANIZATION_DTO,
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
