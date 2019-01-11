import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoCount<T extends mongoose.Document> implements MongoQuery<number> {
  public readonly options: Record<string, any>;
  private readonly model: mongoose.Model<T>;

  public constructor(findOptions: Record<string, any>, model: mongoose.Model<T>) {
    this.options       = findOptions;
    this.model         = model;
  }

  public execute(): Promise<number> {
    return this.model.countDocuments(this.options).exec();
  }
}