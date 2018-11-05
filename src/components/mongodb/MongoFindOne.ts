import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoDocumentQuery} from './MongoDocumentQuery';

export class MongoFindOne<T extends mongoose.Document> implements MongoQuery<T | null> {
  public readonly options: Partial<T>;
  private readonly model: mongoose.Model<T>;
  private readonly documentQuery: MongoDocumentQuery;

  public constructor(options: Partial<T>, model: mongoose.Model<T>, documentQuery: MongoDocumentQuery) {
    this.options       = options;
    this.model         = model;
    this.documentQuery = documentQuery;
  }

  public execute(): Promise<T | null> {
    return this.documentQuery.execute(this.model.findOne(this.options));
  }
}