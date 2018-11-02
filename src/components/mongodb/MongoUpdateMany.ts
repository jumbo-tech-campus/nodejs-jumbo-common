import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoUpdateMany<T extends mongoose.Document> implements MongoQuery<void> {
  public readonly options: Partial<T>;
  public readonly document: Partial<T>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, document: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.document      = document;
    this.model         = model;
  }

  public async execute(): Promise<void> {
    await this.model.updateMany(this.options, this.document).exec();
  }
}