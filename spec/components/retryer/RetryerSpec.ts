import {StatsD} from 'hot-shots';
import {Retryable} from '../../../src/components/retryer/Retryable';
import {Retryer} from '../../../src/components/retryer/Retryer';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('A Retryer', () => {
  let tries: number;
  const retryableMock = {
    constructor: {
      name: 'test',
    },
    tags:        ['tags:one'],
  } as Retryable & Measurable<any>;
  const statsDMock    = {} as StatsD;

  beforeEach(() => {
    tries                           = 0;
    statsDMock.increment            = () => void 0;
    retryableMock.attempt           = async () => {
      tries = tries + 1;

      return Promise.resolve(tries === 3);
    };
    retryableMock.getLogInformation = () => ({});
  });

  it('Should not retry a succesfull attempt', async () => {
    spyOn(statsDMock, 'increment');

    retryableMock.attempt = async () => Promise.resolve(true);

    const retryer = new Retryer(statsDMock, retryableMock, 2, 1, 1, 1);

    await retryer.execute();

    expect(statsDMock.increment).not.toHaveBeenCalled();
  });

  it('Should be able to retry a failed attempt three times', async () => {
    spyOn(statsDMock, 'increment');
    spyOn(retryableMock, 'attempt').and.callThrough();

    const retryer = new Retryer(statsDMock, retryableMock, 5, 1, 1, 1);

    await retryer.execute();

    expect(retryableMock.attempt).toHaveBeenCalledTimes(3);
    expect(tries).toEqual(3);
    expect(statsDMock.increment).toHaveBeenCalledTimes(2);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(0)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:1']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(1)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:2']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(2)).toEqual([]);
  });

  it('Should be able to retry until max attempts', async () => {
    retryableMock.attempt = async () => {
      tries = tries + 1;

      return Promise.resolve(false);
    };
    spyOn(statsDMock, 'increment');
    spyOn(retryableMock, 'attempt').and.callThrough();

    const retryer = new Retryer(statsDMock, retryableMock, 5, 1, 1, 1);

    await retryer.execute();

    expect(retryableMock.attempt).toHaveBeenCalledTimes(5);
    expect(tries).toEqual(5);
    expect(statsDMock.increment).toHaveBeenCalledTimes(5);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(0)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:1']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(1)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:2']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(2)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:3']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(3)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:4']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(4)).toEqual([jasmine.any(String), jasmine.any(Number), ['tags:one', 'retryAttempt:5']]);
    expect((statsDMock.increment as jasmine.Spy).calls.argsFor(5)).toEqual([]);
  });
});
