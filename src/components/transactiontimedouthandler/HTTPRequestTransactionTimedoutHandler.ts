import * as Logger from 'bunyan';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest/HTTPRequest';
import {HTTPRequestDecorator} from '../httprequest/HTTPRequestDecorator';
import {TransactionTimedoutError} from './TransactionTimedoutError';
import {TransactionTimedoutHandler} from './TransactionTimedoutHandler';

export class HTTPRequestTransactionTimedoutHandler extends HTTPRequestDecorator {
  private logger: Logger;
  private transactionTimedoutHandler: TransactionTimedoutHandler;

  public constructor(logger: Logger, request: HTTPRequest, transactionTimedoutHandler: TransactionTimedoutHandler) {
    super(request);

    this.logger                     = logger;
    this.transactionTimedoutHandler = transactionTimedoutHandler;
  }

  public async execute(): Promise<HTTPRequestResponse> {
    if (this.transactionTimedoutHandler.timedOut(Date.now())) {
      this.logger.error({}, 'HTTP Request transaction timed out');

      throw new TransactionTimedoutError('HTTP Request transaction timed out');
    }

    return super.execute();
  }
}
