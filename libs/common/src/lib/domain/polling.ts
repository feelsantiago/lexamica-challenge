import z from 'zod/v4';
import { err, Result } from '@sapphire/result';
import { ApplicationError } from './application-error';
import { PlainClass } from './type-utils';

export type IntervalType = 'minute' | 'hour' | 'day';

export class Polling {
  public static readonly schema$ = z.object({
    endpoint: z.url(),
    type: z.enum(['minute', 'hour', 'day']),
    interval: z.number().min(1).max(24),
  });

  private constructor(
    public readonly endpoint: string,
    public readonly interval: number,
    public readonly type: IntervalType
  ) {}

  public static from(
    data: z.infer<typeof Polling.schema$>
  ): Result<Polling, ApplicationError> {
    return Result.from(() => Polling.schema$.parse(data))
      .map((value) => new Polling(value.endpoint, value.interval, value.type))
      .mapErrInto((error) =>
        err(
          ApplicationError.from('Invalid Pooling', 'Parsing Error', {
            zod: error,
            data,
            info: z.treeifyError(error as z.ZodError),
          })
        )
      );
  }

  public toJSON(): PlainClass<Polling> {
    return {
      endpoint: this.endpoint,
      interval: this.interval,
      type: this.type,
    };
  }

  public toCron(): string {
    switch (this.type) {
      case 'minute':
        return `*/${this.interval} * * * *`;
      case 'hour':
        return `0 */${this.interval} * * *`;
      case 'day':
        return `0 0 */${this.interval} * *`;
    }
  }
}
