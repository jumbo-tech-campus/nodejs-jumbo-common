import {HTTPRequest, HTTPRequestResponse} from '../src/HTTPRequest';
import * as Logger from 'bunyan';
import {HTTPRequestLogger} from '../src/HTTPRequestLogger';
import {HTTPRequestError} from '../src/HTTPRequestError';
import {asyncIt} from './helpers/JasmineHelper';

describe('A HTTPRequestLogger', () => {
  const request      = {} as HTTPRequest;
  const responseMock = {} as HTTPRequestResponse;
  const loggerMock   = {} as Logger;
  loggerMock.debug = () => true;
  loggerMock.error = () => true;

  beforeEach(() => {
    request.execute = () => Promise.resolve(responseMock);
  });

  asyncIt('Should be able to debug a HTTPRequest', async () => {
    spyOn(loggerMock, 'debug');

    const requestLogger = new HTTPRequestLogger(loggerMock, request);

    const response = await requestLogger.execute();

    expect(response).toEqual(responseMock);
    expect(loggerMock.debug).toHaveBeenCalledTimes(2);
  });

  asyncIt('Should be able to log an error', async () => {
    spyOn(loggerMock, 'error');

    request.execute     = () => {
      throw new HTTPRequestError('ETIMEDOUT');
    };
    const requestLogger = new HTTPRequestLogger(loggerMock, request);

    try {
      await requestLogger.execute();
    } catch (error) {
      expect(loggerMock.error).toHaveBeenCalledTimes(1);

      return;
    }

    fail();
  });
});