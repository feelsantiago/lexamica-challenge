import { App, ApplicationRoutes, Logger, Routes } from '@lexamica/common';
import { inject, injectable, injectAll } from 'tsyringe';
import { Middleware } from './middleware/middleware';
import { ApplicationWorkers } from './application.types';
import { PollingQueue } from './integration/polling.queue';

@injectable()
export class Application {
  constructor(
    @inject(App) private readonly _app: App,
    @inject(Middleware) private readonly _midleware: Middleware,
    @injectAll(Routes) private readonly _routes: ApplicationRoutes[],
    @injectAll(ApplicationWorkers)
    private readonly _workers: ApplicationWorkers,
    @inject(PollingQueue) private readonly _polling: PollingQueue,
    @inject(Logger) private readonly _logger: Logger
  ) {}

  public async start(): Promise<void> {
    this._midleware.head();

    for (const route of this._routes) {
      const endpoint = route.endpoint();
      const routes = route.register();
      this._app.use(endpoint, routes);
    }

    this._midleware.tail();

    for (const worker of this._workers) {
      worker.register();
    }

    await this._polling.clear();

    this._app.listen(3003, () => {
      this._logger.info('[Music Integration Server] - Running on port 3003');
    });
  }
}
