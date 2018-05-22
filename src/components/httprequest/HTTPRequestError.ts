import {APIError} from '../helpers/APIError';

export class HTTPRequestError extends APIError {
  public constructor(message: string) {
    super(message, 500);
  }
}