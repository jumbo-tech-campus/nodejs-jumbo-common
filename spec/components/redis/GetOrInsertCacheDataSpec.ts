import {CacheQuery} from '../../../src/components/redis/CacheQuery';
import {GetOrInsertCacheData} from '../../../src/components/redis/GetOrInsertCacheData';
import {CacheQueryFactory} from '../../../src/components/redis/CacheQueryFactory';
import {CacheableRequest} from '../../../src/components/redis/CacheableRequest';

describe('A GetOrInsertCacheData', () => {
  const cacheQueryFactoryMock = {} as CacheQueryFactory;
  const cacheable             = new GetOrInsertCacheData(cacheQueryFactoryMock, 3600);
  const cacheQueryMock        = {} as CacheQuery<any>;
  const cacheableRequestMock  = {} as CacheableRequest<any>;

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