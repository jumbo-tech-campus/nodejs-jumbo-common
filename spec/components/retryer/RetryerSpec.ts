import {asyncIt} from '../../helpers/JasmineHelper';
import {Retryable} from '../../../src/components/retryer/Retryable';
import {Retryer} from '../../../src/components/retryer/Retryer';

describe('A Retryer', () => {
  let retries = 0;
  const retryableMock = {} as Retryable;

  beforeEach(() => {
    retryableMock.attempt = () => {
      retries++;

      return Promise.resolve(retries === 3);
    };
  });

  asyncIt('Should be able to retry a failed attempt', async () => {
    const retryer = new Retryer(retryableMock, 2, 1, 1, 1);

    await retryer.execute();

    expect(retries).toEqual(2);
  });
});
