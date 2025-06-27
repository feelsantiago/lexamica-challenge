import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthUser } from './domain/auth-user';
import { JwtPayload } from './domain/jwt-payload';
import { JwtSecret } from './auth.tokens';

@injectable()
export class Jwt {
  constructor(@inject(JwtSecret) private readonly _secret: JwtSecret) {}

  public sign(user: AuthUser): JwtPayload {
    const token = jwt.sign(user.toJSON(), this._secret, { expiresIn: '1h' });
    return {
      token,
      method: 'Bearer',
      expiresIn: '1h',
      email: user.email.value,
    };
  }

  public strategy(): Strategy {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this._secret,
    };

    return new Strategy(opts, (payload, done) => {
      const user = AuthUser.authenticate(payload);
      return user.match({
        ok: (value) => done(null, value),
        err: (error) => done(error, false),
      });
    });
  }
}
