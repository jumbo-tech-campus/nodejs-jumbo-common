import {APIError} from '../APIError';

export class TransactionTimedoutError extends APIError {
  public constructor(message: string) {
    super(message, 408, 'ETIMEDOUT');
  }
}