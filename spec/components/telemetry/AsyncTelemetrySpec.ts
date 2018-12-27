import * as Logger from 'bunyan';
import {asyncIt} from '../../helpers/JasmineHelper';
import {AsyncTelemetry} from '../../../src/components/telemetry/AsyncTelemetry';
import {AsyncMeasurer} from '../../../src/components/telemetry/AsyncMeasurer';
import {Measurable} from '../../../src/components/telemetry/Measurable';

describe('A HTTPRequestTelemetry', () => {
  const measureableMock = {} as Measurable<any>;
  const responseMock    = {} as any;
  const loggerMock      = {} as Logger;
  const measurerMock    = {} as AsyncMeasurer;
  loggerMock.debug      = () => true;
  loggerMock.error      = () => true;

  beforeEach(() => {
    measureableMock.execute = () => Promise.resolve(responseMock);
  });

  asyncIt('Should be able to debug a Measurable', async () => {
    spyOn(loggerMock, 'debug');
    measurerMock.measure = () => Promise.resolve({} as any);

    const asyncTelemetry = new AsyncTelemetry(loggerMock, measureableMock, measurerMock);

    const response = await asyncTelemetry.execute();

    expect(response).toEqual(responseMock);
  });

  asyncIt('Should be able to log an error', async () => {
    spyOn(loggerMock, 'error');

    measurerMock.measure = () => {
      throw new Error('ETIMEDOUT');
    };

    const requestLogger = new AsyncTelemetry(loggerMock, measureableMock, measurerMock);
    try {
      await requestLogger.execute();
    } catch (error) {
      expect(loggerMock.error).toHaveBeenCalledTimes(1);

      return;
    }
    fail();
  });
});