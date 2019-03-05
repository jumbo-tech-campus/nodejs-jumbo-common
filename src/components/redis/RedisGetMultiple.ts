import {CacheQuery} from './CacheQuery';
import {RedisClient} from './RedisClient';

export class RedisGetMultiple<T> implements CacheQuery<Record<string, T>> {
  private readonly redis: RedisClient;
  private readonly keys: string[];

  public constructor(redis: RedisClient, keys: string[]) {
    this.redis = redis;
    this.keys  = keys;
  }

  public async execute(): Promise<any> {
    if (this.keys.length === 0) {
      return {};
    }

    const stringifiedArray: (string | null)[] = await this.redis.client.mget(...this.keys);

    return this.parseMultiGetResult(stringifiedArray);
  }

  private parseMultiGetResult(stringifiedArray: (string | null)[]): Record<string, any> {
    const documentsMap: Record<string, any> = {};

    this.keys.forEach((key, index) => {
      const document = stringifiedArray[index];

      if (!document) {
        return;
      }

      documentsMap[key] = JSON.parse(document);
    });

    return documentsMap;
  }
}