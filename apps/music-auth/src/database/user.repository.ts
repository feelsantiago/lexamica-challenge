import { singleton } from 'tsyringe';
import { ApplicationError, Email } from '@lexamica/common';
import { User, PlainUser } from '@lexamica/models';
import { err, ok, Option, Result } from '@sapphire/result';

@singleton()
export class UserRepository {
  private readonly _users: PlainUser[] = [];

  public create(user: User): Result<User, ApplicationError> {
    const exist = this.findByEmail(user.email);

    if (exist.isSome()) {
      return err(ApplicationError.from('User already exist'));
    }

    this._users.push(user.plain());
    return ok(user);
  }

  public find(id: string): Option<User> {
    const user = this._users.find((user) => user.id === id);
    return Option.from(user).map((data) => User.from(data).unwrap());
  }

  public findByEmail(email: Email): Option<User> {
    const user = this._users.find((user) => user.email === email.value);
    return Option.from(user).map((data) => User.from(data).unwrap());
  }
}
