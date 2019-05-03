import {CacheQuery} from './CacheQuery';
import {RedisClient} from './RedisClient';
import {CacheInsertOptions} from './CacheInsertOptions';

export class RedisInsert implements CacheQuery<void> {
  private readonly redis: RedisClient;
  private readonly key: string;
  private readonly value: any;
  private readonly options: CacheInsertOptions;

  public constructor(redis: RedisClient, key: string, value: any, options: CacheInsertOptions = {}) {
    this.redis = redis;
    this.key = key;
    this.value = value;
    this.options = options;
  }

  public async execute(): Promise<void> {
    let redisMulti = this.redis.client.multi();

    redisMulti = redisMulti.set(this.key, JSON.stringify(this.value));
    if (this.options.expiry) {
      redisMulti = redisMulti.expire(this.key, this.options.expiry);
    } else if (this.options.expireAt) {
      redisMulti = redisMulti.expireat(this.key, this.options.expireAt);
    }

    await redisMulti.exec();
  }
}