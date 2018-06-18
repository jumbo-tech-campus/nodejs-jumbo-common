import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';

export class MongoQueryMeasurer<T> implements MongoQuery<T> {
  private readonly mongoQuery: MongoQuery<T> & Measurable<T>;
  private readonly measurer: AsyncMeasurer;

  public constructor(measurer: AsyncMeasurer, mongoQuery: MongoQuery<T> & Measurable<T>) {
    this.measurer   = measurer;
    this.mongoQuery = mongoQuery;
  }

  public execute(): Promise<T> {
    return this.measurer.measure(this.mongoQuery);
  }
}