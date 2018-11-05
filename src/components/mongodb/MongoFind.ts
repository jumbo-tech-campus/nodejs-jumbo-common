import * as mongoose from 'mongoose';
import {MongoDocumentQuery} from './MongoDocumentQuery';
import {MongoQuery} from './MongoQuery';

export class MongoFind<T extends mongoose.Document> implements MongoQuery<T[]> {
  public readonly options: Partial<T>;
  private readonly model: mongoose.Model<T>;
  private readonly documentQuery: MongoDocumentQuery;

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>, documentQuery: MongoDocumentQuery) {
    this.options       = findOptions;
    this.model         = model;
    this.documentQuery = documentQuery;
  }

  public execute(): Promise<T[]> {
    return this.documentQuery.execute(this.model.find(this.options));
  }
}