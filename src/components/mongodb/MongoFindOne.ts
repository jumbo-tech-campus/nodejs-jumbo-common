import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';
import {MongoDocumentQuery} from './MongoDocumentQuery';

export class MongoFindOne<T extends mongoose.Document> implements MongoQuery<T | undefined> {
  public readonly options: Record<string, any>;
  private readonly model: mongoose.Model<T>;
  private readonly documentQuery: MongoDocumentQuery;

  public constructor(options: Record<string, any>, model: mongoose.Model<T>, documentQuery: MongoDocumentQuery) {
    this.options       = options;
    this.model         = model;
    this.documentQuery = documentQuery;
  }

  public async execute(): Promise<T | undefined> {
    const document = await this.documentQuery.execute(this.model.findOne(this.options));
    if (!document) {
      return;
    }

    return document;
  }
}