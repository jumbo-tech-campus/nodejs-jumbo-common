import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoDeleteMany<T extends mongoose.Document> implements MongoQuery<void> {
  public readonly options: Record<string, any>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Record<string, any>, model: mongoose.Model<T>) {
    this.options = options;
    this.model   = model;
  }

  public async execute(): Promise<void> {
    await this.model.deleteMany(this.options).exec();
  }
}