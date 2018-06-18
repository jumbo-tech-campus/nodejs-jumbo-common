import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryMeasurer} from './MongoQueryMeasurer';
import {MongoFind} from './MongoFind';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly measurer: AsyncMeasurer;

  public constructor(model: mongoose.Model<T>, measurer: AsyncMeasurer) {
    this.model    = model;
    this.measurer = measurer;
  }

  public createFind(findOptions: Partial<T>): MongoQuery<T[]> {
    return new MongoQueryMeasurer(this.measurer, new MongoFind(findOptions, this.model));
  }

  public createFindOne(findOptions: Partial<T>): MongoQuery<T | null> {
    return new MongoQueryMeasurer(this.measurer, new MongoFindOne(findOptions, this.model));
  }
}