import { inject, singleton } from 'tsyringe';
import {
  ApplicationRoutes,
  AuthMiddleware,
  Logger,
  RouterBuilder,
  SignInDto,
} from '@lexamica/common';
import { HttpStatusCode } from 'axios';
import { AuthController } from './auth.controller';
import { toApplicationHttpError } from '../application-errors';

@singleton()
export class AuthRoutes implements ApplicationRoutes {
  public constructor(
    @inject(RouterBuilder) private readonly _rb: RouterBuilder,
    @inject(AuthController) private readonly _controller: AuthController,
    @inject(AuthMiddleware) private readonly _auth: AuthMiddleware,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public endpoint(): string {
    return '/auth';
  }

  public register(): RouterBuilder {
    this._rb.get('/validate', this._auth.handler(), (req, res) => {
      const id = req.id;
      const user = req.auth.user;
      return this._controller.validate(user).match({
        ok: () => res.status(HttpStatusCode.Ok).json(user),
        err: (error) => {
          this._logger.applicationError(id, error);
          return res
            .status(toApplicationHttpError(error.info))
            .json(error.toJSON());
        },
      });
    });

    this._rb.post('/sign-in', async (req, res) => {
      const id = req.id;
      const body = SignInDto.from(req.body);

      if (body.isErr()) {
        const error = body.unwrapErr();
        this._logger.applicationError(id, error);
        return res.status(HttpStatusCode.BadRequest).json(error.toJSON());
      }

      const auth = await body
        .inspect((dto) => this._logger.info(`${id} - ${dto.email.value}`))
        .map((dto) => this._controller.signIn(dto))
        .unwrap();

      return auth.match({
        ok: (result) => res.status(HttpStatusCode.Ok).json(result),
        err: (error) => {
          this._logger.applicationError(id, error);
          return res
            .status(toApplicationHttpError(error.info))
            .json(error.toJSON());
        },
      });
    });

    // this endpoint is here for text purposes
    this._rb.post('/sign-up', async (req, res) => {
      const id = req.id;
      const body = SignInDto.from(req.body);

      if (body.isErr()) {
        const error = body.unwrapErr();
        this._logger.applicationError(id, error);
        return res.status(HttpStatusCode.BadRequest).json(error.toJSON());
      }

      const user = await body
        .inspect((dto) => this._logger.info(`${id} - ${dto.email.value}`))
        .map((dto) => this._controller.signUp(dto))
        .unwrap();

      return user.match({
        ok: (result) => res.status(HttpStatusCode.Created).json(result),
        err: (error) => {
          this._logger.applicationError(id, error);
          return res
            .status(toApplicationHttpError(error.info))
            .json(error.toJSON());
        },
      });
    });

    return this._rb;
  }
}
