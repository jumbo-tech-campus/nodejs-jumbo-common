import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoUpdate<T extends mongoose.Document> implements MongoQuery<T | null> {
  public readonly options: Partial<T>;
  public readonly document: any;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, document: any, model: mongoose.Model<T>) {
    this.options       = options;
    this.document      = document;
    this.model         = model;
  }

  public execute(): Promise<T | null> {
    return this.model.findOneAndUpdate(this.options, this.document).exec();
  }
}