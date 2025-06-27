import { Option } from '@sapphire/result';
import { singleton } from 'tsyringe';

@singleton()
export class Config {
  public jwtSecret(): string {
    return Option.from(process.env.JWT_SECRET).unwrapOr('No secret');
  }

  public password(): string {
    return Option.from(process.env.EMPTY_USER_PASSWORD_HASH).unwrapOr(
      'No hash password'
    );
  }
}
