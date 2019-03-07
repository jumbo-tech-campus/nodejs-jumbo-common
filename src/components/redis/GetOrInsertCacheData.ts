import {CacheQueryFactory} from './CacheQueryFactory';

export class GetOrInsertCacheData {
  private cacheQueryFactory: CacheQueryFactory;
  private ttl: number;

  public constructor(cacheQueryFactory: CacheQueryFactory, ttl: number) {
    this.cacheQueryFactory = cacheQueryFactory;
    this.ttl               = ttl;
  }

  public async execute<T>(key: string, getDataToCache: () => Promise<T>): Promise<T> {
    let cachedValue: T = await this.cacheQueryFactory.createGet(key).execute();

    if (!cachedValue) {
      cachedValue = await getDataToCache();

      this.cacheQueryFactory.createInsert(key, cachedValue, {expiry: this.ttl}).execute();
    }

    return cachedValue;
  }
}
