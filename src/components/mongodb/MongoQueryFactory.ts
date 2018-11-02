import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryTelemetry} from './MongoQueryTelemetry';
import {MongoFind} from './MongoFind';
import {AsyncMeasurer} from '../statsd/AsyncMeasurer';
import {MongoCreate} from './MongoCreate';
import * as Logger from 'bunyan';
import {MongoUpdate} from './MongoUpdate';
import {MongoDocumentQuery, MongoDocumentQueryOptions} from './MongoDocumentQuery';
import {MongoRemove} from './MongoRemove';
import {MongoFindOrCreate} from './MongoFindOrCreate';
import {MongoUpdateMany} from './MongoUpdateMany';
import {MongoCount} from './MongoCount';
import {MongoMeasurable} from './MongoMeasurable';

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

  private createTelemetry<T>(logger: Logger, query: MongoQuery<T>): MongoQuery<T> {
    if (this.measurer) {
      return new MongoQueryTelemetry(logger, this.measurer, new MongoMeasurable(query));
    }

    return query;
  }
}