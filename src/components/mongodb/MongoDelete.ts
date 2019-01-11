import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoDelete<T extends mongoose.Document> implements MongoQuery<T | undefined> {
  public readonly options: Record<string, any>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Record<string, any>, model: mongoose.Model<T>) {
    this.options = options;
    this.model   = model;
  }

  public async execute(): Promise<T | undefined> {
    const document = await this.model.findOneAndDelete(this.options).exec();
    if (!document) {
      return;
    }

    return document;
  }
}