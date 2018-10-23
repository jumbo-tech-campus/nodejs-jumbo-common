import * as Logger from 'bunyan';
import * as mongoose from 'mongoose';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {Measurable} from '../statsd/Measurable';
import {MongoCount} from './MongoCount';
import {MongoCreate} from './MongoCreate';
import {MongoDocumentQuery, MongoDocumentQueryOptions} from './MongoDocumentQuery';
import {MongoFind} from './MongoFind';
import {MongoFindOne} from './MongoFindOne';
import {MongoFindOrCreate} from './MongoFindOrCreate';
import {MongoQuery} from './MongoQuery';
import {MongoQueryTelemetry} from './MongoQueryTelemetry';
import {MongoRemove} from './MongoRemove';
import {MongoUpdate} from './MongoUpdate';
import {MongoUpdateMany} from './MongoUpdateMany';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly measurer?: AsyncMeasurer;

  public constructor(model: mongoose.Model<T>, measurer?: AsyncMeasurer) {
    this.model    = model;
    this.measurer = measurer;
  }

  public createFind(logger: Logger, findOptions: Partial<T>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T[]> {
    return this.createTelemetry(logger, new MongoFind(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createFindOne(logger: Logger, findOptions: Partial<T>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T | null> {
    return this.createTelemetry(logger, new MongoFindOne(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createCreate(logger: Logger, createOptions: Partial<T>): MongoQuery<T> {
    return this.createTelemetry(logger, new MongoCreate(createOptions, this.model));
  }

  public createUpdate(logger: Logger, updateOptions: Partial<T>, updateDocument: Partial<T>): MongoQuery<T | null> {
    return this.createTelemetry(logger, new MongoUpdate(updateOptions, updateDocument, this.model));
  }

  public createUpdateMany(logger: Logger, updateOptions: Partial<T>, updateDocument: Partial<T>): MongoQuery<void> {
    return this.createTelemetry(logger, new MongoUpdateMany(updateOptions, updateDocument, this.model));
  }

  public createRemove(logger: Logger, removeOptions: Partial<T>): MongoQuery<void> {
    return this.createTelemetry(logger, new MongoRemove(removeOptions, this.model));
  }

  public createCount(logger: Logger, options: Partial<T>): MongoQuery<number> {
    return this.createTelemetry(logger, new MongoCount(options, this.model));
  }

  public createFindOrCreate(logger: Logger, findOptions: Partial<T>, createOptions?: Partial<T>): MongoQuery<T> {
    let createQuery: MongoCreate<T>;
    if (createOptions) {
      createQuery = new MongoCreate(createOptions, this.model);
    } else {
      createQuery = new MongoCreate(findOptions, this.model);
    }

    return this.createTelemetry(logger, new MongoFindOrCreate(
      new MongoFindOne(findOptions, this.model, new MongoDocumentQuery()),
      createQuery));
  }

  private createTelemetry<S>(logger: Logger, query: MongoQuery<S> & Measurable<S>): MongoQuery<S> {
    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, query);
    }

    return query;
  }
}