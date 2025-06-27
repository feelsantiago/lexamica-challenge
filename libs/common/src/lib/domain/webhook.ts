import z from 'zod/v4';
import { err, Result } from '@sapphire/result';
import { PlainClass } from './type-utils';
import { ApplicationError } from './application-error';

export type WebhookType = 'input' | 'output';
export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class Webhook {
  public static readonly schema$ = z.object({
    url: z.url(),
    type: z.enum(['input', 'output']),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  });

  constructor(
    public readonly url: string,
    public readonly type: WebhookType,
    public readonly method: WebhookMethod
  ) {}

  public static from(
    data: z.infer<typeof Webhook.schema$>
  ): Result<Webhook, ApplicationError> {
    return Result.from(() => Webhook.schema$.parse(data))
      .map((value) => new Webhook(value.url, value.type, value.method))
      .mapErrInto((error) =>
        err(
          ApplicationError.from('Invalid Webhook', 'Parsing Error', {
            zod: error,
            data,
            info: z.treeifyError(error as z.ZodError),
          })
        )
      );
  }

  public toJSON(): PlainClass<Webhook> {
    return {
      url: this.url,
      type: this.type,
      method: this.method,
    };
  }
}
