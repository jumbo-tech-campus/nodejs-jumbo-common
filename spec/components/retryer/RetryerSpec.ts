import {asyncIt} from '../../helpers/JasmineHelper';
import {Retryable} from '../../../src/components/retryer/Retryable';
import {Retryer} from '../../../src/components/retryer/Retryer';
import {StatsD} from 'hot-shots';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('A Retryer', () => {
  let retries: number;
  const retryableMock = {
    constructor: {
      name: 'test',
    },
    tags:        ['tags:one'],
  } as Retryable & Measurable<any>;
  const statsDMock    = {} as StatsD;

  beforeEach(() => {
    retries = 0;
    statsDMock.increment            = () => void 0;
    retryableMock.attempt           = () => {
      retries++;

      return Promise.resolve(retries === 3);
    };
    retryableMock.getLogInformation = () => ({});
  });

  asyncIt('Should not retry a succesfull attempt', async () => {
    spyOn(statsDMock, 'increment');

    retryableMock.attempt = () => Promise.resolve(true);

    const retryer = new Retryer(statsDMock, retryableMock, 2, 1, 1, 1);

    await retryer.execute();

    expect(statsDMock.increment).not.toHaveBeenCalled();
  });

  asyncIt('Should be able to retry a failed attempt three times', async () => {
    spyOn(statsDMock, 'increment');

    const retryer = new Retryer(statsDMock, retryableMock, 5, 1, 1, 1);

    await retryer.execute();

    expect(retries).toEqual(3);
    expect(statsDMock.increment).toHaveBeenCalledTimes(2);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(0)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retry-attempt:1']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(1)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retry-attempt:2']]);
  });
});
