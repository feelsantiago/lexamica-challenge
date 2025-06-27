import { Result } from '@sapphire/result';
import { z } from 'zod/v4';
import { ApplicationError } from '@lexamica/common';
import { QueueConnection } from './queue.types';
import { ApplicationQueue } from './application.queue';
import { OrganizationQueue } from './organization.queue';
import { InventoryQueue } from './inventory.queue';
import { instanceCachingFactory } from 'tsyringe';

export function queueProviders(connection: QueueConnection) {
  const schema$ = z.object({
    host: z.url().or(z.literal('localhost')),
    port: z.number(),
  });

  const _connection = Result.from(() => schema$.parse(connection));
  return _connection.match({
    ok: (value) => [
      {
        token: QueueConnection,
        useValue: value,
      },
      {
        token: ApplicationQueue,
        useClass: ApplicationQueue,
      },
      {
        token: OrganizationQueue,
        useFactory: instanceCachingFactory<OrganizationQueue>(
          (c) => new OrganizationQueue(c.resolve(QueueConnection))
        ),
      },
      {
        token: InventoryQueue,
        useFactory: instanceCachingFactory<InventoryQueue>(
          (c) => new InventoryQueue(c.resolve(QueueConnection))
        ),
      },
    ],
    err: (error) => {
      throw ApplicationError.from(
        'Invalid connection for queue',
        'Queue Provider',
        {
          zod: error,
          connection,
        }
      );
    },
  });
}
