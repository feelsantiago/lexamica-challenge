import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApplicationModule } from './application.module';
import { Application } from './application';

container.register(ApplicationModule, ApplicationModule);
const app = container.resolve(Application);

app.start().catch(console.log);

process.on('SIGINT', () => {
  container.dispose();
});

process.on('SIGTERM', () => {
  container.dispose();
});
