import {APIError} from '../helpers/APIError';

export class TransactionTimedoutError extends APIError {
  public constructor(message: string) {
    super(message, 408);
  }
}