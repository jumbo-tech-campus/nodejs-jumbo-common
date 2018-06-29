import * as mongoose from 'mongoose';
import {objectToTags} from '../statsd/objectToTags';
import {MongoDocumentQuery} from './MongoDocumentQuery';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';

export class MongoFind<T extends mongoose.Document> implements MongoQuery<T[]>, Measurable<T[]> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;
  private readonly documentQuery: MongoDocumentQuery;

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>, documentQuery: MongoDocumentQuery) {
    this.options       = findOptions;
    this.measurePrefix = 'mongodb.find.';
    this.model         = model;
    this.documentQuery = documentQuery;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<T[]> {
    return this.documentQuery.execute(this.model.find(this.options));
  }
}