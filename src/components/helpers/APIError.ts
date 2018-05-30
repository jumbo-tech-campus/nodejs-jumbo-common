export abstract class APIError extends Error {
  public readonly statusCode: number;
  public readonly uxAPIError?: string;

  protected constructor(message: string, statusCode: number, uxAPIError?: string) {
    super(message);

    this.statusCode = statusCode;
    this.uxAPIError = uxAPIError;
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