import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryMeasurer} from './MongoQueryMeasurer';
import {MongoFind} from './MongoFind';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {ModelPopulateOptions} from 'mongoose';
import {MongoCreate} from './MongoCreate';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly measurer?: AsyncMeasurer;

  public constructor(model: mongoose.Model<T>, measurer?: AsyncMeasurer) {
    this.model    = model;
    this.measurer = measurer;
  }

  public createFind(findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T[]> {
    let query = new MongoFind(findOptions, this.model, populate);

    if (this.measurer) {
      return new MongoQueryMeasurer(this.measurer, query);
    }

    return query;
  }

  public createFindOne(findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T | null> {
    let query = new MongoFindOne(findOptions, this.model, populate);

    if (this.measurer) {
      return new MongoQueryMeasurer(this.measurer, query);
    }

    return query;
  }

  public createCreate(createOptions: Partial<T>): MongoQuery<T> {
    let query = new MongoCreate(createOptions, this.model);

    if (this.measurer) {
      return new MongoQueryMeasurer(this.measurer, query);
    }

    return query;
  }
}