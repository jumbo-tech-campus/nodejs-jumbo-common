import {GetOrInsertCacheData} from '../../../src/components/redis/Cacheable';
import {RedisQueryFactory} from '../../../src/components/redis/RedisQueryFactory';
import {CacheQuery} from '../../../src/components/redis/CacheQuery';

describe('A GetOrInsertCacheData', () => {
  const redisQueryFactoryMock = {} as RedisQueryFactory;
  const cacheable = new GetOrInsertCacheData(redisQueryFactoryMock, 3600);
  const cacheQueryMock = {} as CacheQuery<any>;

  describe('Succesfully executes', () => {
    let result: unknown;

    beforeEach(async () => {
      redisQueryFactoryMock.createGet = () => cacheQueryMock;
      cacheQueryMock.execute          = () => Promise.resolve({});

      result = await cacheable.execute('key', async (): Promise<any> => ({}));
    });

    it('Returns the result', () => {
      expect(result).toEqual({});
    });
  });
});