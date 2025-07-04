import { App, ApplicationRoutes, Logger, Routes } from '@lexamica/common';
import { inject, injectable, injectAll } from 'tsyringe';
import { Middleware } from './middleware/middleware';

@injectable()
export class Application {
  constructor(
    @inject(App) private readonly _app: App,
    @inject(Middleware) private readonly _midleware: Middleware,
    @injectAll(Routes) private readonly _routes: ApplicationRoutes[],
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public start(): void {
    this._midleware.head();

    for (const route of this._routes) {
      const endpoint = route.endpoint();
      const routes = route.register();
      this._app.use(endpoint, routes);
    }

    this._midleware.tail();

    this._app.listen(5000, () => {
      this._logger.info('[Music Faker Server] - Running on port 5000');
    });
  }
}
