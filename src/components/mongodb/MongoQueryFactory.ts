import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoFindOne} from './MongoFindOne';
import {MongoQueryTelemetry} from './MongoQueryTelemetry';
import {MongoFind} from './MongoFind';
import {MongoCreate} from './MongoCreate';
import {MongoUpdate} from './MongoUpdate';
import {MongoDocumentQuery, MongoDocumentQueryOptions} from './MongoDocumentQuery';
import {MongoDelete} from './MongoDelete';
import {MongoFindOrCreate} from './MongoFindOrCreate';
import {MongoUpdateMany} from './MongoUpdateMany';
import {MongoCount} from './MongoCount';
import {MongoMeasurable} from './MongoMeasurable';
import {MongoDeleteMany} from './MongoRemoveMultiple';
import {AsyncTelemetry} from '../telemetry/AsyncTelemetry';
import {MongoCreateMany} from './MongoCreateMany';

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly telemetry: AsyncTelemetry;

  public constructor(model: mongoose.Model<T>, telemetry: AsyncTelemetry) {
    this.model     = model;
    this.telemetry = telemetry;
  }

  public createFind(findOptions: Record<string, any>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T[]> {
    return this.createTelemetry(new MongoFind(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createFindOne(findOptions: Record<string, any>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoFindOne(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createCreate(createOptions: Record<string, any>): MongoQuery<T> {
    return this.createTelemetry(new MongoCreate(createOptions, this.model));
  }

  public createCreateMany(createOptions: Record<string, any>[]): MongoQuery<T[]> {
    return this.createTelemetry(new MongoCreateMany(createOptions, this.model));
  }

  public createUpdate(updateOptions: Record<string, any>, updateDocument: any): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoUpdate(updateOptions, updateDocument, this.model));
  }

  public createUpdateMany(updateOptions: Record<string, any>, updateDocument: Record<string, any>): MongoQuery<void> {
    return this.createTelemetry(new MongoUpdateMany(updateOptions, updateDocument, this.model));
  }

  public createDelete(removeOptions: Record<string, any>): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoDelete(removeOptions, this.model));
  }

  public createDeleteMany(removeOptions: any): MongoQuery<void> {
    return this.createTelemetry(new MongoDeleteMany(removeOptions, this.model));
  }

  public createCount(options: Record<string, any>): MongoQuery<number> {
    return this.createTelemetry(new MongoCount(options, this.model));
  }

  public createFindOrCreate(findOptions: Record<string, any>, createOptions?: Record<string, any>): MongoQuery<T> {
    let createQuery: MongoCreate<T>;
    if (createOptions) {
      createQuery = new MongoCreate(createOptions, this.model);
    } else {
      createQuery = new MongoCreate(findOptions, this.model);
    }

    return this.createTelemetry(new MongoFindOrCreate(
      new MongoFindOne(findOptions, this.model, new MongoDocumentQuery()),
      createQuery));
  }

  private createTelemetry<T>(query: MongoQuery<T>): MongoQuery<T> {
    return new MongoQueryTelemetry(this.telemetry, new MongoMeasurable(query));
  }
}