import * as Logger from 'bunyan';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {Measurable} from '../statsd/Measurable';
import {MongoQuery} from './MongoQuery';

export class MongoQueryTelemetry<T> implements MongoQuery<T> {
  private readonly logger: Logger;
  private readonly mongoQuery: MongoQuery<T> & Measurable<T>;
  private readonly measurer: AsyncMeasurer;

  public constructor(logger: Logger, measurer: AsyncMeasurer, mongoQuery: MongoQuery<T> & Measurable<T>) {
    this.logger     = logger;
    this.measurer   = measurer;
    this.mongoQuery = mongoQuery;
  }

  public get options(): { [key: string]: unknown } {
    return this.mongoQuery.options;
  }

  public async execute(): Promise<T> {
    try {
      return await this.measurer.measure(this.mongoQuery);
    } catch (error) {
      this.logger.error({
        mongoQuery: this.mongoQuery.constructor.name,
        options:    this.mongoQuery.options,
        error:      error,
      }, 'Mongoquery Error');

      throw error;
    }
  }
}