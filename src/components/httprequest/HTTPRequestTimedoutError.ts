import {APIError} from '../APIError';

export class HTTPRequestTimedoutError extends APIError {
  public constructor(message: string) {
    super(message, 408, 'ETIMEDOUT');
  }
}