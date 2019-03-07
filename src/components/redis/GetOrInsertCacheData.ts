import {CacheQueryFactory} from './CacheQueryFactory';
import {CacheableRequest} from './CacheableRequest';

export class GetOrInsertCacheData {
  private cacheQueryFactory: CacheQueryFactory;
  private ttl: number;

  public constructor(cacheQueryFactory: CacheQueryFactory, ttl: number) {
    this.cacheQueryFactory = cacheQueryFactory;
    this.ttl               = ttl;
  }

  public async execute<T>(key: string, cacheableRequest: CacheableRequest<T>): Promise<T> {
    let cachedValue: T = await this.cacheQueryFactory.createGet(key).execute();

    if (!cachedValue) {
      cachedValue = await cacheableRequest.execute();

      this.cacheQueryFactory.createInsert(key, cachedValue, {expiry: this.ttl})
        .execute()
        .catch((error) => ({}));
    }

    return cachedValue;
  }
}
