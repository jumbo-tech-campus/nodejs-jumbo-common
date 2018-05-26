import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';
import {asyncIt} from '../../helpers/JasmineHelper';
import {TransactionTimedoutHandler} from '../../../src/components/transactiontimedouthandler/TransactionTimedoutHandler';
import {HTTPRequestTransactionTimedoutHandler} from '../../../src/components/transactiontimedouthandler/HTTPRequestTransactionTimedoutHandler';
import * as Logger from 'bunyan';

describe('A HTTPRequestTimeoutHandler', () => {
  const httpRequestMock       = {} as HTTPRequest;
  const responseMock          = {} as HTTPRequestResponse;
  const timeoutHandlerMock    = {} as TransactionTimedoutHandler;
  const loggerMock            = {} as Logger;
  loggerMock.error            = () => true;
  const requestTimeoutHandler = new HTTPRequestTransactionTimedoutHandler(loggerMock, httpRequestMock, timeoutHandlerMock);

  beforeEach(() => {
    timeoutHandlerMock.timedOut = () => false;
    httpRequestMock.execute     = () => Promise.resolve(responseMock);
  });

  asyncIt('Should be able to execute a request when transaction is not yet timed out', async () => {
    const result = await requestTimeoutHandler.execute();

    expect(result).toEqual(responseMock);
  });

  asyncIt('Should throw an error when transaction is timed out', async () => {
    spyOn(loggerMock, 'error');
    timeoutHandlerMock.timedOut = () => true;

    try {
      await requestTimeoutHandler.execute();
    } catch (error) {
      expect(error.name).toEqual('TransactionTimedoutError');
      expect(error.message).toEqual('HTTP Request transaction timed out');
      expect(loggerMock.error).toHaveBeenCalled();

      return;
    }

    fail();
  });
});
