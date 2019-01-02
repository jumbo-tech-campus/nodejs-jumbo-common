import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';
import * as Logger from 'bunyan';
import {HTTPRequestTelemetry} from '../../../src/components/httprequest/HTTPRequestTelemetry';
import {HTTPRequestError} from '../../../src/components/httprequest/HTTPRequestError';
import {asyncIt} from '../../helpers/JasmineHelper';
import {AsyncMeasurer} from '../../../src/components/telemetry/AsyncMeasurer';
import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';

describe('A HTTPRequestTelemetry', () => {
  const request      = {} as HTTPRequest & HTTPRequestMeasurable;
  const responseMock = {} as HTTPRequestResponse;
  const loggerMock   = {} as Logger;
  const measurerMock = {} as AsyncMeasurer;
  loggerMock.debug   = () => true;
  loggerMock.error   = () => true;

  beforeEach(() => {
    request.execute = () => Promise.resolve(responseMock);
  });

  asyncIt('Should be able to debug a HTTPRequest', async () => {
    spyOn(loggerMock, 'debug');
    measurerMock.measure = () => Promise.resolve({} as any);

    const requestLogger = new HTTPRequestTelemetry(loggerMock, request, measurerMock);

    const response = await requestLogger.execute();

    expect(response).toEqual(responseMock);
    expect(loggerMock.debug).toHaveBeenCalledTimes(2);
  });

  asyncIt('Should be able to log an error', async () => {
    spyOn(loggerMock, 'error');

    measurerMock.measure = () => {
      throw new HTTPRequestError('ETIMEDOUT');
    };

    const requestLogger = new HTTPRequestTelemetry(loggerMock, request, measurerMock);
    try {
      await requestLogger.execute();
    } catch (error) {
      expect(loggerMock.error).toHaveBeenCalledTimes(1);

      return;
    }
    fail();
  });
});