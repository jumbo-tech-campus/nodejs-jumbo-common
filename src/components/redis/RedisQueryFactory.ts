import {CacheQueryFactory} from './CacheQueryFactory';
import {RedisClient} from './RedisClient';
import {CacheInsertOptions} from './CacheInsertOptions';
import {CacheQuery} from './CacheQuery';
import {RedisGet} from './RedisGet';
import {RedisGetMultiple} from './RedisGetMultiple';
import {RedisInsert} from './RedisInsert';
import {CacheQueryTelemetry} from './CacheQueryTelemetry';
import {MeasurableCacheQuery} from './MeasurableCacheQuery';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';

export class RedisQueryFactory implements CacheQueryFactory {
  private readonly redis: RedisClient;
  private readonly asyncTelemetry: AsyncTelemetry;
  private readonly defaultStatsDTags?: string[];

  public constructor(redis: RedisClient, asyncTelemetry: AsyncTelemetry, defaultStatsDTags?: string[]) {
    this.redis             = redis;
    this.asyncTelemetry    = asyncTelemetry;
    this.defaultStatsDTags = defaultStatsDTags;
  }

  public createGet(id: string): CacheQuery<any> {
    return this.createMeasuredQuery(new RedisGet(this.redis, id));
  }

  public createGetMultiple(ids: string[]): CacheQuery<Record<string, any>> {
    return this.createMeasuredQuery(new RedisGetMultiple(this.redis, ids));
  }

  public createInsert(id: string, document: any, options?: CacheInsertOptions): CacheQuery<void> {
    return this.createMeasuredQuery(new RedisInsert(this.redis, id, document, options));
  }

  private createMeasuredQuery<T>(query: CacheQuery<T>): CacheQuery<T> {
    return new CacheQueryTelemetry(new MeasurableCacheQuery(query), this.asyncTelemetry, this.defaultStatsDTags);
  }
}