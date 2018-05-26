import * as Logger from 'bunyan';
import {HTTPRequestDecorator} from '../httprequest/HTTPRequestDecorator';
import {TransactionTimedoutHandler} from './TransactionTimedoutHandler';
import {HTTPRequest, HTTPRequestResponse} from '../httprequest/HTTPRequest';
import {TransactionTimedoutError} from './TransactionTimedoutError';

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
