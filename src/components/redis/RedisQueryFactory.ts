import * as Logger from 'bunyan';
import {CacheQueryFactory} from './CacheQueryFactory';
import {AsyncMeasurer} from '../telemetry/AsyncMeasurer';
import {RedisClient} from './RedisClient';
import {CacheInsertOptions} from './CacheInsertOptions';
import {CacheQuery} from './CacheQuery';
import {RedisGet} from './RedisGet';
import {RedisGetMultiple} from './RedisGetMultiple';
import {RedisInsert} from './RedisInsert';
import {CacheQueryTelemetry} from './CacheQueryTelemetry';
import {MeasurableCacheQuery} from './MeasurableCacheQuery';

export class RedisQueryFactory implements CacheQueryFactory {
  private readonly redis: RedisClient;
  private readonly logger: Logger;
  private readonly measurer: AsyncMeasurer;
  private readonly defaultStatsDTags?: string[];

  public constructor(redis: RedisClient, logger: Logger, measurer: AsyncMeasurer, defaultStatsDTags?: string[]) {
    this.redis             = redis;
    this.logger            = logger;
    this.measurer          = measurer;
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
    return new CacheQueryTelemetry(this.logger, new MeasurableCacheQuery(query), this.measurer, this.defaultStatsDTags);
  }
}