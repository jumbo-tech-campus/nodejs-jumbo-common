import * as Logger from 'bunyan';
import {HTTPRequestDecorator} from '../httprequest/HTTPRequestDecorator';
import {TransactionTimedoutHandler} from './TransactionTimedoutHandler';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest/HTTPRequest';
import {TransactionTimedoutError} from './TransactionTimedoutError';

export class HTTPRequestTimedoutHandler extends HTTPRequestDecorator {
  private logger: Logger;
  private transactionTimeoutHandler: TransactionTimedoutHandler;

  public constructor(logger: Logger, request: HTTPRequest, timeoutHandler: TransactionTimedoutHandler) {
    super(request);

    this.logger                    = logger;
    this.transactionTimeoutHandler = timeoutHandler;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    if (this.transactionTimeoutHandler.timedOut(Date.now())) {
      this.logger.error({}, 'Transaction timed out');

      throw new TransactionTimedoutError('Transaction timed out');
    }

    return super.execute();
  }
}
