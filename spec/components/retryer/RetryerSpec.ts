import {asyncIt} from '../../helpers/JasmineHelper';
import {Retryable} from '../../../src/components/retryer/Retryable';
import {Retryer} from '../../../src/components/retryer/Retryer';
import * as Logger from 'bunyan';

describe('A Retryer', () => {
  let retries         = 0;
  const retryableMock = {} as Retryable;
  const loggerMock    = {} as Logger;

  beforeEach(() => {
    loggerMock.warn = () => true;
    retryableMock.attempt = () => {
      retries++;

      return Promise.resolve(retries === 3);
    };
    retryableMock.getLogInformation = () => ({});
  });

  asyncIt('Should not retry a succesfull attempt', async () => {
    spyOn(loggerMock, 'warn');

    retryableMock.attempt = () => Promise.resolve(true);

    const retryer = new Retryer(loggerMock, retryableMock, 2, 1, 1, 1);

    await retryer.execute();

    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  asyncIt('Should be able to retry a failed attempt', async () => {
    spyOn(loggerMock, 'warn');

    const retryer = new Retryer(loggerMock, retryableMock, 2, 1, 1, 1);

    await retryer.execute();

    expect(retries).toEqual(2);
    expect(loggerMock.warn).toHaveBeenCalled();
  });
});
