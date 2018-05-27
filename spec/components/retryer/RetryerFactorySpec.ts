import {Retryable} from '../../../src/components/retryer/Retryable';
import {RetryerFactory} from '../../../src/components/retryer/RetryerFactory';
import {Retryer} from '../../../src/components/retryer/Retryer';

describe('A RetryerFactory', () => {
  const retryableMock = {} as Retryable;

  it('Can create a retryer', () => {
    const retryerFactory = new RetryerFactory(6, 1 , 1, 1);

    const retryer = retryerFactory.create(retryableMock);

    expect(retryer instanceof Retryer).toEqual(true);
  });
});
