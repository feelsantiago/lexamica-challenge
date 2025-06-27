import { IntegrationWorker } from './integration.worker';

export const integrationProviders = [
  {
    token: IntegrationWorker,
    useClass: IntegrationWorker,
  },
];
