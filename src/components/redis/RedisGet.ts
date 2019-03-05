import {CacheQuery} from './CacheQuery';
import {RedisClient} from './RedisClient';

export class RedisGet implements CacheQuery<any> {
  private readonly redis: RedisClient;
  private readonly key: string;

  public constructor(redis: RedisClient, key: string) {
    this.redis = redis;
    this.key = key;
  }

  public async execute(): Promise<any> {
    const result = await this.redis.client.get(this.key);

    return result ? JSON.parse(result) : void 0;
  }
}