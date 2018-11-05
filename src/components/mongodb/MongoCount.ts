import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoCount<T extends mongoose.Document> implements MongoQuery<number> {
  public readonly options: Partial<T>;
  private readonly model: mongoose.Model<T>;

  public constructor(findOptions: Partial<T>, model: mongoose.Model<T>) {
    this.options       = findOptions;
    this.model         = model;
  }

  public execute(): Promise<number> {
    return this.model.countDocuments(this.options).exec();
  }
}