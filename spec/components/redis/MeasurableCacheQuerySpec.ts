import {CacheQuery} from '../../../src/components/redis/CacheQuery';
import {MeasurableCacheQuery} from '../../../src/components/redis/MeasurableCacheQuery';

describe('A MeasureableCacheQuery', () => {
  const cacheQueryMock = {} as CacheQuery<any>;
  const measurableCacheQuery = new MeasurableCacheQuery(cacheQueryMock);

  describe('Succesfully', () => {
    let result: unknown;

    beforeEach(async () => {
      cacheQueryMock.execute = () => Promise.resolve({});

      result = await measurableCacheQuery.execute();
    });

    it('Returns the query result', () => {
      expect(result).toEqual({});
    });

    it('Contains the result:success tag', () => {
      expect(measurableCacheQuery.tags).toContain('result:success');
    });
  });

  describe('Unsuccesfully', () => {
    let error: unknown;
    const throwError = new Error('Error');

    beforeEach(async () => {
      cacheQueryMock.execute = () => Promise.reject(throwError);

      await measurableCacheQuery.execute().catch((e) => {
        error = e;
      });
    });

    it('Returns the query result', () => {
      expect(error).toBe(throwError);
    });

    it('Contains the result:success tag', () => {
      expect(measurableCacheQuery.tags).toContain('result:failed');
    });
  });
});