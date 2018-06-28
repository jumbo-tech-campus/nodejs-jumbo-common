import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryTelemetry} from './MongoQueryTelemetry';
import {MongoFind} from './MongoFind';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {ModelPopulateOptions} from 'mongoose';
import {MongoCreate} from './MongoCreate';
import * as Logger from 'bunyan';
import {Measurable} from '../statsd/Measurable';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly measurer?: AsyncMeasurer;

  public constructor(model: mongoose.Model<T>, measurer?: AsyncMeasurer) {
    this.model    = model;
    this.measurer = measurer;
  }

  public createFind(logger: Logger, findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T[]> {
    return this.createTelemetry(logger, new MongoFind(findOptions, this.model, populate));
  }

  public createFindOne(logger: Logger, findOptions: Partial<T>, populate?: ModelPopulateOptions | ModelPopulateOptions[]): MongoQuery<T | null> {
    return this.createTelemetry(logger, new MongoFindOne(findOptions, this.model, populate));
  }

  public createCreate(logger: Logger, createOptions: Partial<T>): MongoQuery<T> {
    return this.createTelemetry(logger, new MongoCreate(createOptions, this.model));
  }

  private createTelemetry<T>(logger: Logger, query: MongoQuery<T> & Measurable<T>): MongoQuery<T> {
    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, query);
    }

    return query;
  }
}