import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryTelemetry} from './MongoQueryTelemetry';
import {MongoFind} from './MongoFind';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {ModelPopulateOptions} from 'mongoose';
import {MongoCreate} from './MongoCreate';
import * as Logger from 'bunyan';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly measurer?: AsyncMeasurer;

  public constructor(model: mongoose.Model<T>, measurer?: AsyncMeasurer) {
    this.model    = model;
    this.measurer = measurer;
  }

  public createFind(logger: Logger, findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T[]> {
    let query = new MongoFind(findOptions, this.model, populate);

    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, query);
    }

    return query;
  }

  public createFindOne(logger: Logger, findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T | null> {
    let query = new MongoFindOne(findOptions, this.model, populate);

    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, query);
    }

    return query;
  }

  public createCreate(logger: Logger, createOptions: Partial<T>): MongoQuery<T> {
    let query = new MongoCreate(createOptions, this.model);

    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, query);
    }

    return query;
  }
}