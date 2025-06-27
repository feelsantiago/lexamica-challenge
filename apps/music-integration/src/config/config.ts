import { Option } from '@sapphire/result';
import { singleton } from 'tsyringe';

@singleton()
export class Config {
  public organizationUrl(): string {
    return Option.from(process.env.ORGANIZATION_URL).unwrapOr(
      'http://no-url.found.com'
    );
  }
}
