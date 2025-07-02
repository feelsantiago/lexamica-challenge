import { App, ApplicationRoutes, Logger, Routes } from '@lexamica/common';
import { inject, injectable, injectAll } from 'tsyringe';
import { Middleware } from './middleware/middleware';
import { IntegrationWorker } from './integration/integration.worker';
import { Config } from './config/config';

@injectable()
export class Application {
  constructor(
    @inject(App) private readonly _app: App,
    @inject(Middleware) private readonly _midleware: Middleware,
    @injectAll(Routes) private readonly _routes: ApplicationRoutes[],
    @inject(IntegrationWorker) private readonly _worker: IntegrationWorker,
    @inject(Logger) private readonly _logger: Logger,
    @inject(Config) private readonly _config: Config
  ) {}

  public start(): void {
    this._midleware.head();

    for (const route of this._routes) {
      const endpoint = route.endpoint();
      const routes = route.register();
      this._app.use(endpoint, routes);
    }

    this._midleware.tail();

    this._worker.register();

    this._app.listen(this._config.port(), () => {
      this._logger.info(
        `[Music Inventory Server] - Running on port ${this._config.port()}`
      );
    });
  }
}
