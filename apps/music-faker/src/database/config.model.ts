export interface PlainConfig {
  create: string[];
  remove: string[];
}

export class Config {
  constructor(
    public readonly create: string[],
    public readonly remove: string[]
  ) {}

  public static from(plain: PlainConfig): Config {
    return new Config(plain.create, plain.remove);
  }

  public static create(data: PlainConfig): Config {
    return new Config(data.create, data.remove);
  }

  public toJSON(): PlainConfig {
    return {
      create: this.create,
      remove: this.remove,
    };
  }
}
