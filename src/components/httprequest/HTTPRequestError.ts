import {APIError} from '../helpers/APIError';

export class HTTPRequestError extends APIError {
  public constructor(message: string) {
    super(message, 500, 'SERVER_ERROR');
  }
}

export const isHTTPRequestError = (error: unknown): error is HTTPRequestError => error instanceof HTTPRequestError;