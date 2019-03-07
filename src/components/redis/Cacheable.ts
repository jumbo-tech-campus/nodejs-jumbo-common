import {RedisQueryFactory} from './RedisQueryFactory';

export class RedisGetOrInsertCacheData {
  private redisQueryFactory: RedisQueryFactory;
  private ttl: number;

  public constructor(redisQueryFactory: RedisQueryFactory, ttl: number) {
    this.redisQueryFactory = redisQueryFactory;
    this.ttl               = ttl;
  }

  public async execute<T>(key: string, getDataToCache: () => Promise<T>): Promise<T> {
    let cachedValue: T = await this.redisQueryFactory.createGet(key).execute();

    if (!cachedValue) {
      cachedValue = await getDataToCache();

      this.redisQueryFactory.createInsert(key, cachedValue, {expiry: this.ttl}).execute();
    }

    return cachedValue;
  }
}
