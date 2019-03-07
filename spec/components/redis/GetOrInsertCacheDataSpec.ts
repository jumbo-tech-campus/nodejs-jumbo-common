import {CacheQuery} from '../../../src/components/redis/CacheQuery';
import {GetOrInsertCacheData} from '../../../src/components/redis/GetOrInsertCacheData';
import {CacheQueryFactory} from '../../../src/components/redis/CacheQueryFactory';
import {Cacheable} from '../../../src/components/redis/Cacheable';

describe('A GetOrInsertCacheData', () => {
  const cacheQueryFactoryMock = {} as CacheQueryFactory;
  const cacheable             = new GetOrInsertCacheData(cacheQueryFactoryMock, 3600);
  const cacheQueryMock        = {} as CacheQuery<any>;
  const cacheableRequestMock  = {} as Cacheable<any>;

  describe('Succesfully executes', () => {
    let result: unknown;

    beforeEach(async () => {
      cacheQueryFactoryMock.createGet = () => cacheQueryMock;
      cacheQueryMock.execute          = () => Promise.resolve({});

      result = await cacheable.execute(cacheableRequestMock);
    });

    it('Returns the result', () => {
      expect(result).toEqual({});
    });
  });
});