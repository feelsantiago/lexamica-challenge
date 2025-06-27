import { Option } from '@sapphire/result';

export class ApplicationError extends Error {
  constructor(
    public readonly source: Error,
    public readonly info = '',
    public readonly metadata: Record<string, unknown> = {}
  ) {
    super(source.message);
    this.name = new.target.name;

    Option.from(source.stack).match({
      some: (stack) => {
        this.stack = stack;
      },
      none: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Error.captureStackTrace(this);
      },
    });
  }

  public static from(
    message: string,
    context = '',
    metadata: Record<string, unknown> = {}
  ): ApplicationError {
    return new ApplicationError(new Error(message), context, metadata);
  }

  public context(
    message: string,
    metadata: Record<string, unknown> = {}
  ): ApplicationError {
    return new ApplicationError(this.source, message, metadata);
  }

  public override toString(): string {
    return `Error Context: ${this.info} \nError Message: ${this.message}`;
  }

  public toJSON(): Record<string, unknown> {
    return {
      message: this.message,
    };
  }

  public print(): void {
    const css = 'background: red; padding: 3px ; color: white';
    console.log('%c[Error Context]:', css, this.info);
    console.log('%c[Error Message]:', css, this.message);
    console.log('%c[Error Metadata]:', css, this.metadata);
    console.error(this);
  }
}
