import { injectable } from 'tsyringe';

@injectable()
export class HealthController {
  public check(): string {
    return 'Configuration service running';
  }
}
