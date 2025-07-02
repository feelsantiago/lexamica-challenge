import { Option } from '@sapphire/result';
import { singleton } from 'tsyringe';

@singleton()
export class Config {
  public port(): number {
    return Option.from(process.env.PORT)
      .map((port) => parseInt(port))
      .unwrapOr(3003);
  }
}
