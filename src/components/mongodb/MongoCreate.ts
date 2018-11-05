import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoCreate<T extends mongoose.Document> implements MongoQuery<T> {
  public readonly options: Partial<T>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.model         = model;
  }

  public execute(): Promise<T> {
    return this.model.create(this.options);
  }
}