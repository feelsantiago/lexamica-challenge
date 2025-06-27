import { singleton } from 'tsyringe';
import { Config, PlainConfig } from './config.model';

@singleton()
export class ConfigRepository {
  private _config: PlainConfig = {
    create: [],
    remove: [],
  };

  public fetch(): Config {
    return Config.from(this._config);
  }

  public update(config: Config): Config {
    this._config = config.toJSON();
    return config;
  }
}
