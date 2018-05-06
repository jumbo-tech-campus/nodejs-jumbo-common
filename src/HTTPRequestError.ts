export class HTTPRequestError extends Error {
  public constructor(message: string) {
    super(message);
  }
}