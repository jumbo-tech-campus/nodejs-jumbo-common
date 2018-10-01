import {Retryable} from '../../../src/components/retryer/Retryable';
import {RetryerFactory} from '../../../src/components/retryer/RetryerFactory';
import {Retryer} from '../../../src/components/retryer/Retryer';
import {StatsD} from 'hot-shots';
import {Measurable} from '../../../src/components/statsd/Measurable';

describe('A RetryerFactory', () => {
  const retryableMock = {} as Retryable & Measurable<any>;

  it('Can create a retryer', () => {
    const retryerFactory = new RetryerFactory({} as StatsD, 6, 1 , 1, 1);

    const retryer = retryerFactory.create(retryableMock);

    expect(retryer instanceof Retryer).toEqual(true);
  });
});
