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

  public execute(): Promise<void> {
    return this.redis.client
      .set(this.key, JSON.stringify(this.value))
      .then(() => {
        if (this.options.expiry) {
          this.redis.client.expire(this.key, this.options.expiry);
        }
      });
  }
}