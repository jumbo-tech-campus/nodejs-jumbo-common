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

export class MongoQueryFactory<T extends mongoose.Document> {
  private readonly model: mongoose.Model<T>;
  private readonly telemetry: AsyncTelemetry;

  public constructor(model: mongoose.Model<T>, telemetry: AsyncTelemetry) {
    this.model     = model;
    this.telemetry = telemetry;
  }

  public createFind(findOptions: Partial<T>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T[]> {
    return this.createTelemetry(new MongoFind(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createFindOne(findOptions: Partial<T>, mongoQueryOptions?: MongoDocumentQueryOptions): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoFindOne(findOptions, this.model, new MongoDocumentQuery(mongoQueryOptions)));
  }

  public createCreate(createOptions: Partial<T>): MongoQuery<T> {
    return this.createTelemetry(new MongoCreate(createOptions, this.model));
  }

  public createUpdate(updateOptions: Partial<T>, updateDocument: any): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoUpdate(updateOptions, updateDocument, this.model));
  }

  public createUpdateMany(updateOptions: Partial<T>, updateDocument: Partial<T>): MongoQuery<void> {
    return this.createTelemetry(new MongoUpdateMany(updateOptions, updateDocument, this.model));
  }

  public createDelete(removeOptions: Partial<T>): MongoQuery<T | undefined> {
    return this.createTelemetry(new MongoDelete(removeOptions, this.model));
  }

  public createDeleteMany(removeOptions: any): MongoQuery<void> {
    return this.createTelemetry(new MongoDeleteMany(removeOptions, this.model));
  }

  public createCount(options: Partial<T>): MongoQuery<number> {
    return this.createTelemetry(new MongoCount(options, this.model));
  }

  public createFindOrCreate(findOptions: Partial<T>, createOptions?: Partial<T>): MongoQuery<T> {
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