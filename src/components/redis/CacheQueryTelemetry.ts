import * as Logger from 'bunyan';
import {CacheQuery} from './CacheQuery';
import {Measurable} from '../telemetry/Measurable';
import {AsyncMeasurer} from '../telemetry/AsyncMeasurer';

export class CacheQueryTelemetry<T> implements CacheQuery<T> {
  private readonly query: CacheQuery<T> & Measurable<T>;
  private readonly logger: Logger;
  private readonly measurer: AsyncMeasurer;
  private readonly defaultStatsDTags?: string[];

  public constructor(logger: Logger,
                     query: CacheQuery<T> & Measurable<T>,
                     measurer: AsyncMeasurer,
                     defaultStatsDTags?: string[]) {
    this.logger            = logger;
    this.measurer          = measurer;
    this.query             = query;
    this.defaultStatsDTags = defaultStatsDTags;
  }

  public async execute(): Promise<T> {
    try {
      return await this.measurer.measure(this.query, this.defaultStatsDTags);
    } catch (error) {
      this.logger.error({
        error:     error,
      }, 'Error while querying Cache');

      throw error;
    }
  }
}