import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoRemoveMany<T extends mongoose.Document> implements MongoQuery<void> {
  public readonly options: any;
  private readonly model: mongoose.Model<T>;

  public constructor(options: any, model: mongoose.Model<T>) {
    this.options = options;
    this.model   = model;
  }

  public async execute(): Promise<void> {
    await this.model.deleteMany(this.options).exec();
  }
}