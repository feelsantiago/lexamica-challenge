import { inject, injectable } from 'tsyringe';
import { ConfigRepository } from '../database/config.repository';
import { Config } from '../database/config.model';
import { ConfigDto } from './domain/config.dto';

@injectable()
export class ConfigController {
  constructor(
    @inject(ConfigRepository) private readonly _repository: ConfigRepository
  ) {}

  public fetch(): Config {
    return this._repository.fetch();
  }

  public update(config: ConfigDto): Config {
    const model = Config.create(config);
    return this._repository.update(model);
  }
}
