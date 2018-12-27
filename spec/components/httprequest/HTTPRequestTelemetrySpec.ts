import {HTTPRequest, HTTPRequestResponse} from '../../../src/components/httprequest/HTTPRequest';
import {HTTPRequestTelemetry} from '../../../src/components/httprequest/HTTPRequestTelemetry';
import {asyncIt} from '../../helpers/JasmineHelper';
import {HTTPRequestMeasurable} from '../../../src/components/httprequest/HTTPRequestMeasurable';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';

describe('A HTTPRequestTelemetry', () => {
  const request      = {} as HTTPRequest & HTTPRequestMeasurable;
  const responseMock = {} as HTTPRequestResponse;

  const asyncTelemetry = {} as AsyncTelemetry;

  beforeEach(() => {
    request.execute = () => Promise.resolve(responseMock);
  });

  asyncIt('Should be able to debug a HTTPRequest', async () => {
    asyncTelemetry.execute = () => Promise.resolve({} as any);
    const requestLogger    = new HTTPRequestTelemetry(request, asyncTelemetry);

    const response = await requestLogger.execute();

    expect(response).toEqual(responseMock);
  });

  asyncIt('Should be able to log an error', async () => {
    asyncTelemetry.execute = () => {
      throw new Error('ETIMEDOUT');
    };

    const requestLogger = new HTTPRequestTelemetry(request, asyncTelemetry);
    try {
      await requestLogger.execute();
    } catch (error) {
      return;
    }
    fail();
  });
});