import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {Measurable} from '../statsd/Measurable';
import {objectToTags} from '../statsd/objectToTags';
import {MongoDocumentQuery} from './MongoDocumentQuery';

export class MongoFindOne<T extends mongoose.Document> implements Measurable<T | null>, MongoQuery<T | null> {
  public readonly options: Partial<T>;
  public readonly measurePrefix: string;
  private readonly model: mongoose.Model<T>;
  private readonly documentQuery: MongoDocumentQuery;

  public constructor(options: Partial<T>, model: mongoose.Model<T>, documentQuery: MongoDocumentQuery) {
    this.options       = options;
    this.measurePrefix = 'mongodb.findone.';
    this.model         = model;
    this.documentQuery = documentQuery;
  }

  public get tags(): string[] {
    return objectToTags(this.options);
  }

  public execute(): Promise<T | null> {
    return this.documentQuery.execute(this.model.findOne(this.options));
  }
}