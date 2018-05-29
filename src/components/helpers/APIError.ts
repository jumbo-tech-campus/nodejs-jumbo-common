export abstract class APIError extends Error {
  public readonly statusCode: number;

  protected constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.name       = this.constructor.name;

    Object.setPrototypeOf(this, APIError.prototype);
  }

  public toResponseBody(withStack: boolean): any {
    const body: any = {
      name:    this.name,
      message: this.message,
    };

    if (withStack) {
      body.stack = this.stack;
    }

    return body;
  }

  public toLogger(): any {
    return {
      name:    this.name,
      message: this.message,
    };
  }
}