export abstract class APIError extends Error {
  public readonly statusCode: number;

  protected constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.name       = this.constructor.name;

    Object.setPrototypeOf(this, APIError.prototype);
  }
}