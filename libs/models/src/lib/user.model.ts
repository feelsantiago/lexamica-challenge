import {
  ApplicationError,
  Email,
  HashPassword,
  Password,
} from '@lexamica/common';
import { Result } from '@sapphire/result';
import uuid from 'node-uuid';

export interface PlainUser {
  id: string;
  email: string;
  password: string;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly password: HashPassword
  ) {}

  public static from(user: PlainUser): Result<User, ApplicationError> {
    return Email.from(user.email).map(
      (email) => new User(user.id, email, new HashPassword(user.password))
    );
  }

  public static async create(
    email: Email,
    password: Password
  ): Promise<Result<User, ApplicationError>> {
    const id = uuid.v4();
    const result = await HashPassword.from(password);
    return result.map((value) => new User(id, email, value));
  }

  public static empty(password: string): User {
    return User.from({ id: '0', email: 'empty@email.com', password }).unwrap();
  }

  public plain(): PlainUser {
    return {
      id: this.id,
      email: this.email.value,
      password: this.password.value,
    };
  }
}
